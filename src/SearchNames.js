import React, { useEffect, useState, useRef } from "react";
import { Paper, Typography, TextField, Box } from "@mui/material";
import classes from "./SearchNames.module.css";
import { firebase, db } from "./firebase"; // Import the firebase and db objects

const SearchNames = () => {
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [excelData, setExcelData] = useState(null);
  const [viewOtherInput, setViewOtherInput] = useState(false);
  const emailPrimaryRef = useRef();
  const emailRef = useRef();
  const nameRef = useRef();
  const numRef = useRef();
  const dateRef = useRef();
  const skillRef = useRef();

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    await fetch(
      "https://emailduplicatio-hr-project-default-rtdb.firebaseio.com/data/-NVPA-EiEbiv5q9ja_lO.json"
    )
      .then((response) => response.json())
      .then((data) => {
        // `data` variable will contain the fetched data
        console.log(data);
        console.log(emailPrimaryRef.current.value);
        // Perform further processing or display the data as needed

        let dataArray = [];
        if (data) {
          if (Array.isArray(data)) {
            dataArray = data;
          } else if (typeof data === "object") {
            dataArray = Object.values(data);
          } else {
            console.log("Invalid data format:", data);
          }
        }

        const isDuplicate = dataArray.some(
          (data) => data["Email Address"] === emailPrimaryRef.current.value
        );
        setIsDuplicate(isDuplicate);
        if (isDuplicate) {
          alert("Duplicate Email");
        } else {
          alert("Email is unique");
          setViewOtherInput(true);
        }
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
      });
  };

  const onNewEntryHandler = async (event) => {
    event.preventDefault();

    const data = {
      "Contact Number": numRef.current.value,
      "Email Address": emailRef.current.value,
      Name: nameRef.current.value,
      Skill: skillRef.current.value,
      "Date of submission": dateRef.current.value,
    };

    // await fetch("https://emailduplicatio-hr-project-default-rtdb.firebaseio.com/data/-NV4T46caVgmGgTccBiA.json", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(data),
    //   });
    //   alert("Email added successfully!");

    // Generate a unique ID using Firebase push() method
    const newEntryRef = firebase
      .database()
      .ref()
      .child("data/-NVPA-EiEbiv5q9ja_lO")
      .push();

    // Add the new email with the generated ID to the database
    await newEntryRef.set(data);
    //change as per your data sahil
    alert("Email added successfully!");
    numRef.current.value = "";
    emailRef.current.value = "";
    nameRef.current.value = "";
    skillRef.current.value = "";
    dateRef.current.value = "";
    setIsDuplicate(false);
    setViewOtherInput(false);
  };

  const exportToCSV = async () => {
    // Fetch the data from the Realtime Database
    const response = await fetch(
      "https://emailduplicatio-hr-project-default-rtdb.firebaseio.com/data/-NVPA-EiEbiv5q9ja_lO.json"
    );
    const data = await response.json();

    // Convert the data to a CSV string
    const csvData = convertToCSV(data);

    // Create a Blob with the CSV data
    const blob = new Blob([csvData], { type: "text/csv" });

    // Generate a temporary download link
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = "database.csv";

    // Trigger the download
    downloadLink.click();
  };

  const convertToCSV = (data) => {
    let dataArray = [];
    if (data) {
      if (Array.isArray(data)) {
        dataArray = data;
      } else if (typeof data === "object") {
        dataArray = Object.values(data);
      } else {
        console.log("Invalid data format:", data);
      }
    }

    // Get the column headers
    const headers = Object.keys(dataArray[0]);

    // Generate the CSV rows
    const rows = dataArray.map((item) => {
      const rowValues = headers.map((header) => {
        let value = item[header];

        // Check if the value is a Date object
        if (value instanceof Date) {
          // Format the date as desired (e.g., YYYY-MM-DD)
          const year = value.getFullYear();
          const month = String(value.getMonth() + 1).padStart(2, "0");
          const day = String(value.getDate()).padStart(2, "0");
          value = `${year}-${month}-${day}`;
        }

        // Check if the value is null or undefined
        if (value === null || value === undefined) {
          value = ""; // Replace null or undefined with an empty string
        }

        return value;
      });

      return rowValues.join(",");
    });

    // Combine the headers and rows
    const csvContent = [headers.join(","), ...rows].join("\n");

    return csvContent;
  };

  // date
  const handleDateChange = (event) => {
    const dateValue = event.target.value;
    const [year, month, day] = dateValue.split('-');
    const formattedDate = `${year.slice(2)}-${month}-${day}`;
    // Use the formattedDate as needed
  };

  return (
    <>
      <Paper
        elevation={6}
        sx={{
          width: "50%",
          height: "250px",
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
        }}>
        <button onClick={exportToCSV}>export</button>
        <Typography
          variant="h5"
          sx={{
            backgroundColor: "white",
            marginTop: "2rem",
          }}>
          Search Email
        </Typography>

        <div>
          <input
            placeholder="Email"
            className={classes.input}
            type="email"
            ref={emailPrimaryRef}
          />
        </div>

        {viewOtherInput && (
          <div>
            <h3>Add New Entry</h3>

            <input
              required
              name="phonenumber"
              ref={numRef}
              placeholder="Phone number"
              type="number"
            />
            <input
      required
      ref={dateRef}
      name="dateOfSubmission"
      placeholder="Date of submission"
      type="text" // Use text type instead of date
      pattern="\d{2}-\d{2}-\d{2}" // Set a pattern to enforce the format
      title="Enter a date in the format YY-MM-DD" // Display a custom error message
      onChange={handleDateChange}
    />
            <input
              required
              ref={emailRef}
              name="emailAdress"
              value={emailPrimaryRef.current.value}
              placeholder="Email Adress"
              type="email"
            />
            <input
              required
              ref={nameRef}
              name="name"
              placeholder="Name"
              type="text"
            />
            <input
              required
              ref={skillRef}
              name="skill"
              placeholder="Skill"
              type="text"
            />

            <button onClick={onNewEntryHandler}>Add</button>
          </div>
        )}

        <div>
          <button onClick={onSubmitHandler}>Search</button>
        </div>
      </Paper>
    </>
  );
};

export default SearchNames;
