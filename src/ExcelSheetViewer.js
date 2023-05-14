import React, { useEffect, useState } from "react";
import axios from "axios";

const ExcelSheetViewer = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // SharePoint Excel sheet URL
        const excelSheetUrl = "https://zapcom-my.sharepoint.com/:x:/g/personal/sahil_asolkar_zapcg_com/EdOJzei5qZZEvQnrffbJHpQBKJgcuM7Ow1NrRXgzgaIeNw?e=TYlxfX";
        
        // Make GET request to fetch Excel sheet data
        const response = await axios.get(excelSheetUrl);
        
        // Extract the data from the response
        const excelData = response.data;

        // Set the data in state
        setData(excelData);
      } catch (error) {
        console.error("Error fetching Excel sheet data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Excel Sheet Viewer</h1>
      <table>
        <thead>
          <tr>
            <th>Column 1</th>
            <th>Column 2</th>
            {/* Add more columns as needed */}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.column1}</td>
              <td>{row.column2}</td>
              {/* Render more columns as needed */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExcelSheetViewer;