const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Sample data to write to CSV (replace this with your data)
const data = [
  { name: 'John', age: 30, email: 'john@example.com' },
  { name: 'Jane', age: 25, email: 'jane@example.com' },
  { name: 'Bob', age: 40, email: 'bob@example.com' }
];

// Create a CSV writer
const csvWriter = createCsvWriter({
  path: 'output.csv', // Replace with the desired file path and name
  header: [
    { id: 'name', title: 'Name' },
    { id: 'age', title: 'Age' },
    { id: 'email', title: 'Email' }
  ]
});

// Write the data to the CSV file
csvWriter.writeRecords(data)
  .then(() => {
    console.log('CSV file was written successfully.');
  })
  .catch(error => {
    console.error('Error writing CSV file:', error);
  });
