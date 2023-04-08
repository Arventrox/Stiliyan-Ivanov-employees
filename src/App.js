import { useState } from "react";
import "./App.css";
import Papa from "papaparse";
import { getOverlappingDaysInIntervals } from "date-fns";

//  Function returns array of object values
const getObjectValues = (input) =>
  input.map((element) => Object.values(element));

// Function formats the dates to Date datatype
const formatDates = (input) => {
  for (const employee of input) {
    employee.DateFrom = new Date(employee.DateFrom);
    employee.DateTo =
      employee.DateTo !== "NULL" ? new Date(employee.DateTo) : new Date();
  }

  return input;
};

// Function returns groups of employees by their common projects
const groupByProjectId = (input) => {
  const arr = input.reduce((group, arr) => {
    const { ProjectID } = arr;

    group[ProjectID] = group[ProjectID] ?? [];

    // Removes duplicates if any before pushing
    if (!group[ProjectID].some((el) => el.EmpID === arr.EmpID)) {
      group[ProjectID].push(arr);
    }

    return group;
  }, {});

  return arr;
};

// Function returns all the pairs of employees who have worked together on a common project and calculates the overlapping workdays
const getDaysWorked = (input) => {
  const arr = groupByProjectId(formatDates(input));
  const pairsArr = [];

  for (const project in arr) {
    if (arr[project].length < 2) {
      delete arr[project];
    } else {
      for (const [index, employee1] of arr[project].entries()) {
        for (const [index2, employee2] of arr[project].entries()) {
          if (index === index2 || index < index2) continue;

          //Gets the number of days that overlap
          const days = getOverlappingDaysInIntervals(
            {
              start: employee1.DateFrom,
              end: employee1.DateTo,
            },
            {
              start: employee2.DateFrom,
              end: employee2.DateTo,
            }
          );

          if (days > 0)
            pairsArr.push({
              Emp1: employee2.EmpID,
              Emp2: employee1.EmpID,
              ProjID: project,
              DaysWorked: days,
            });
        }
      }
    }
  }

  return pairsArr;
};

// Function returns the combinations of pairs who have worked together for the longest time and sorts them by most days
const summarizePairsWorkData = (input) => {
  let arr = [];

  for (const [index, pair] of input.entries()) {
    let days = 0;
    let projects = [];
    arr[index] = {};

    for (const [_, pair2] of input.entries()) {
      if (pair.Emp1 === pair2.Emp1 && pair.Emp2 === pair2.Emp2) {
        projects.push(pair2.ProjID);
        days += pair2.DaysWorked;

        arr[index] = {
          Emp1: pair.Emp1,
          Emp2: pair.Emp2,
          Projects: projects,
          DaysWorked: days,
        };
      }
    }
  }

  const unique = arr.filter(
    (obj, index) =>
      arr.findIndex(
        (item) => item.Emp1 === obj.Emp1 && item.Emp2 === obj.Emp2
      ) === index
  );
  unique.sort((a, b) => b.DaysWorked - a.DaysWorked);

  return unique;
};

// Function returns the common projects and the workdays of the pair that has worked together for the longest
const getLongestPairProjects = (input, longestPair) => {
  const arr = input
    .filter(
      (data) => data.Emp1 === longestPair.Emp1 && data.Emp2 === longestPair.Emp2
    )
    .sort((a, b) => b.DaysWorked - a.DaysWorked);

  return arr;
};

const App = () => {
  const [tableName, setTableName] = useState(null);
  const [isTableSorted, setIsTableSorted] = useState(false);

  const [rawData, setRawData] = useState([]);
  const [rawColumns, setRawColumns] = useState([]);
  const [rawValues, setRawValues] = useState([]);

  const [tableData, setTableData] = useState([]);
  const [combinedDaysWorked, setCombinedDaysWorked] = useState(null);

  const fileHandler = (event) => {
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
      `This pair has worked together for  ${longestPairWorkedTogether.DaysWorked} days`
    );
    setTableData([...tableDataResult]);
  };

  const showOriginalHandler = () => {
    setIsTableSorted(false);
    setTableName("Imported Table");
  };
  return (
    <div className="App">
      <div className="input-container">
        <input
          type="file"
          name="file"
          accept=".csv"
          onChange={fileHandler}
          className="input-file"
        />
      </div>
      <div className="table-container">
        <h1>{tableName}</h1>
        {!isTableSorted ? (
          <table>
            <thead>
              <tr>
                {rawColumns.map((column, index) => (
                  <th key={index}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rawValues.map((value, rowIndex) => (
                <tr key={rowIndex}>
                  {value.map((v, valueIndex) => (
                    <td key={valueIndex}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Employee ID #1</th>
                <th>Employee ID #2</th>
                <th>Project ID</th>
                <th>Days worked</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((value, rowIndex) => (
                <tr key={rowIndex}>
                  {value.map((v, valueIndex) => (
                    <td key={valueIndex}>{v}</td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="tableData-result" colSpan="4">
                  {combinedDaysWorked}
                </td>
              </tr>
            </tbody>
          </table>
        )}

        <div className="table-operations_container">
          {!isTableSorted && tableName && (
            <button onClick={sortTableHandler}>Sort Table</button>
          )}
          {isTableSorted && (
            <button onClick={showOriginalHandler}>Show original</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
