import React from 'react';
import { read, utils } from 'xlsx';

const ExcelToJsonConverter = () => {
  const formatDate = (dateString) => {
    // Check if the date string is valid
    const isValidDate = !isNaN(Date.parse(dateString));

    if (isValidDate) {
      // Parse the date string into a Date object
      const date = new Date(dateString);

      // Format the date to the desired format (e.g., 'YYYY-MM-DD')
      const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

      return formattedDate;
    }

    return '';
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = utils.sheet_to_json(worksheet, {
        raw: false, // Include formatted values instead of raw values
        defval: '', // Treat empty cells as empty strings
        dateNF: 'yyyy-mm-dd', // Specify the expected date format
        cellDates: true, // Parse date cells as Dates
      });

      // Format the date values in the JSON data
      const formattedData = jsonData.map((item) => ({
        ...item,
        'Date of submission': formatDate(item['Date of submission']),
      }));

      // Replace NaN values in "Date Of Submission" with the new formatted values
      const finalData = formattedData.map((item) => ({
        ...item,
        'Date of submission': item['Date of submission'] || item['Date Of Submission'],
      }));

      // Convert the JSON data to a string
      const jsonString = JSON.stringify(finalData);

      // Make a POST request to Firebase Realtime Database
      fetch('https://emailduplicatio-hr-project-default-rtdb.firebaseio.com/data.json', {
        method: 'POST',
        body: jsonString,
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (response.ok) {
            console.log('Data posted to Firebase successfully');
          } else {
            throw new Error('Error posting data to Firebase');
          }
        })
        .catch((error) => {
          console.error('Error posting data to Firebase:', error);
        });
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <input type="file" accept=".xlsx" onChange={handleFileUpload} />
    </div>
  );
};

export default ExcelToJsonConverter;