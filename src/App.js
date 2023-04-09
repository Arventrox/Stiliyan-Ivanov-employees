import { useState } from "react";
import "./App.css";
import Papa from "papaparse";
import Button from "./components/Button";
import Table from "./components/Table";
import FileInput from "./components/FileInput";
import {
  getObjectValues,
  getDaysWorked,
  getLongestPairProjects,
  summarizePairsWorkData,
} from "./utils/tableFunctions";

const App = () => {
  const [tableName, setTableName] = useState(null);
  const [isTableSorted, setIsTableSorted] = useState(false);
  const [rawData, setRawData] = useState([]);
  const [rawColumns, setRawColumns] = useState([]);
  const [rawValues, setRawValues] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [combinedDaysWorked, setCombinedDaysWorked] = useState();
  const tableColumns = [
    "Employee ID #1",
    "Employee ID #2",
    "Project ID",
    "Days worked",
  ];

  //Function parses and stores the CSV data
  const fileHandler = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (!file) return;
    setTableName("Imported Table");
    setIsTableSorted(false);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const parsedData = result.data;
        const columnArr = parsedData.map((element) => Object.keys(element));
        const valuesArr = parsedData.map((element) => Object.values(element));

        setRawData(parsedData);
        setRawColumns(columnArr[0]);
        setRawValues(valuesArr);
      },
    });
  };

  const sortTableHandler = () => {
    const data = [...rawData];
    if (!data) return;

    setIsTableSorted(true);
    setTableName(
      "Sorted table by the pair of employees who have worked together on common projects for the longest period of time"
    );

    const pairsArr = getDaysWorked(data);

    if (pairsArr.length === 0) {
      setCombinedDaysWorked(
        "There are no employees who have overlapping days of work on the same project"
      );
      setTableData([]);
      return;
    }

    const summarizedData = summarizePairsWorkData(pairsArr);
    const longestPairWorkedTogether = summarizedData[0];
    const longestPairProjects = getLongestPairProjects(
      pairsArr,
      longestPairWorkedTogether
    );
    const tableDataResult = getObjectValues(longestPairProjects);

    setCombinedDaysWorked(
      `This pair has worked together the longest on common projects for ${longestPairWorkedTogether.DaysWorked} days`
    );
    setTableData(tableDataResult);
  };

  const showOriginalHandler = () => {
    setIsTableSorted(false);
    setTableName("Imported Table");
  };

  return (
    <div className="App">
      <FileInput fileHandler={fileHandler} />

      <div className="table-container">
        <h1>{tableName}</h1>

        {!isTableSorted ? (
          <Table columns={rawColumns} data={rawValues} />
        ) : (
          <Table
            columns={tableColumns}
            data={tableData}
            combinedDaysWorked={combinedDaysWorked}
          />
        )}

        {!isTableSorted && tableName ? (
          <Button onClick={sortTableHandler}>Sort Table</Button>
        ) : (
          <Button onClick={showOriginalHandler}>Show original</Button>
        )}
      </div>
    </div>
  );
};

export default App;
