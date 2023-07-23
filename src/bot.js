const createCsvWriter = require('csv-writer').createObjectCsvWriter;

async function fetchData() {
  const url = "https://www.michelinman.com/modules/@dgad/dealer-locator-pages/search/10001"
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

// Now you can call the async function and handle the result accordingly
fetchData()
  .then((data) => {
    // console.log("Data fetched:", data);
    toCSV(data)
  })
  .catch((error) => {
    // Handle any errors that occurred during the fetch
    console.error("Error:", error);
  });



function toCSV(data) {
  if (!data || !data.dealerLocatorListState || !data.dealerLocatorListState.dealers) {
    // If the necessary data is not available, return an empty array or handle the error accordingly
    return [];
  }

  const dataArray = data.dealerLocatorListState.dealers

  const csvWriter = createCsvWriter({
    path: 'output.csv', // Change 'output.csv' to your desired output file path
  });

  const csvData = dataArray.map((item) => {
    return {
      distance: item.distance,
      title: item.title,
      streetAddress: item.address.streetAddress,
      postalCode: item.address.postalCode,
      addressState: item.address.addressState,
    };
  });

  csvWriter
      .writeRecords(csvData)
      .then(() => console.log('CSV file was written successfully'))
      .catch((err) => console.error('Error writing CSV file:', err));

}