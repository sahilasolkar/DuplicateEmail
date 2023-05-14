import "./App.css";
import Paper from "@mui/material/Paper";
import { Typography, TextField } from "@mui/material";
import { useRef } from "react";
import ExcelToJsonConverter from "./ExcelToJsonConverter";
import SearchNames from "./SearchNames";

function App() {
  const nameRef = useRef();
  const ageRef = useRef();

  return (
    <div className="App">
      {/* to add files */}
      <ExcelToJsonConverter></ExcelToJsonConverter>

      {/* to search emails */}
      <SearchNames></SearchNames>
    </div>
  );
}

export default App;
