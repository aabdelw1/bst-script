const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');

const zipcode = "10001";

async function fetchData(zipcode, page) {
  const url = `https://www.michelinman.com/modules/@dgad/dealer-locator-pages/search/${zipcode}?page=${page}`
  const headers = {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "apostrophe-locale": "en-us",
    "content-type": "application/json",
    "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "cookie": "b2c-experience.csrf=csrf-fallback; b2c-experience.sid=s%3ABy3NcrJQPYa7SN4GiLZYpqTzqfgTtXmu.WlvH15EvL2%2BZXQX%2FCN3XAY6tIS7hCZMTvDPWYCxhlfI; __utmzz=utmcsr=(direct)|utmcmd=(none)|utmccn=(not set); __utmzzses=1; _gcl_au=1.1.140181520.1690145830; gtm-session-start=1690145830422; _ga=GA1.2.318750593.1690145831; _gid=GA1.2.362297823.1690145831; _cs_c=1; _fbp=fb.1.1690145830957.421912279; BCSessionID=8b4b4f52-388f-47cf-bf75-ffd80dc1c0e9; _cs_cvars=%7B%7D; _dc_gtm_UA-88914555-2=1; kameleoonVisitorCode=_js_tmwcgthblbac1rlo; DBI_SessionID=f63cc6ff-5918-42aa-b465-0ae1a39ed374; last_visit_bc=1690146117309; mf_81a3360f-93ed-45a6-af72-5a818fc94dff=|.-1242023625.1690146117350|1690145830707||0|||0|0|60.02184; _cs_id=9d816420-0602-a5a2-f1d6-2ee242bf238e.1690145830.1.1690146117.1690145830.1665496518.1724309830952; _cs_s=13.0.0.1690147917483; _ga_H122CSCZDD=GS1.1.1690145830.1.1.1690146121.5.0.0",
    "Referer": "https://www.michelinman.com/auto/dealer-locator/36830",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  };

  const options = {
    method: "GET",
    headers: headers,
    body: null,
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

async function fetchPagesData(zipcode, totalPages) {
  const dataForAllPages = [];

  try {
    for (let page = 1; page <= totalPages; page++) {
      const data = await fetchData(zipcode, page);
      for (const dealer of data.dealerLocatorListState.dealers) {
        dataForAllPages.push(dealer);
      }
    }

    return dataForAllPages;
  } catch (error) {
    console.error("Error fetching data for the pages:", error);
    throw error;
  }
}

(async () => {
  // Fetch the initial data for the first page
  const initialData = await fetchData(zipcode, 1);
  const totalPages = initialData.dealerLocatorListState.pages.total;

  // Fetch data for the specified number of pages
  fetchPagesData(zipcode, totalPages)
    .then((dataForAllPages) => {
      toCSV(dataForAllPages);
    })
    .catch((error) => {
      // Handle errors if necessary
    });
})();



function toCSV(data) {
  if (!data) {
    // If the necessary data is not available, return an empty array or handle the error accordingly
    return [];
  }

  const filename = 'output.csv';
  const fileExists = fs.existsSync(filename);
  const csvWriter = createCsvWriter({
    path: filename,
    header: [
      { id: 'distance', title: 'Distance' },
      { id: 'title', title: 'Title' },
      { id: 'streetAddress', title: 'Street Address' },
      { id: 'addressLocality', title: 'City'},
      { id: 'postalCode', title: 'Postal Code' },
      { id: 'addressState', title: 'Address State' },
    ],
    append: fileExists
  });

  const csvData = data.map((item) => {
    return {
      distance: item.distance.toFixed(2),
      title:  capitalizeFirstLetters(item.title),
      streetAddress: capitalizeFirstLetters(item.address.streetAddress),
      addressLocality: capitalizeFirstLetters(item.address.addressLocality),
      postalCode: item.address.postalCode,
      addressState: item.address.addressState,
    };
  });

  csvWriter
      .writeRecords(csvData)
      .then(() => console.log('CSV file was written successfully'))
      .catch((err) => console.error('Error writing CSV file:', err));
}

function capitalizeFirstLetters(inputString) {
  const words = inputString.toLowerCase().split(' ');
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }

  return words.join(' ');
}