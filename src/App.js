import { useState } from "react";
import "./App.css";
import Papa from "papaparse";

/* 
1) DateTo can be NULL, equivalent to today

2) The input data must be loaded to the program from a CSV file

3) Create an UI:

The user picks up a file from the file system and, after selecting it, all common
projects of the pair are displayed in datagrid with the following columns:
Employee ID #1, Employee ID #2, Project ID, Days worked

4) The task solution needs to be uploaded in github.com, repository name must be in
format: {FirstName}-{LastName}-employees

Bonus points

1) More than one date format to be supported, extra points will be given if all date formats
are supported
*/

function App() {
  const [tableName, setTableName] = useState(null);
  const [isTableSorted, setIsTableSorted] = useState(false);

  const [columns, setColumns] = useState([]);
  const [values, setValues] = useState([]);
  const [data, setData] = useState();
  // const [parsedData, setParsedData] = useState([]);

  const fileHandler = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setTableName("Imported Table");
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const parsedData = result.data;
        const columnArr = parsedData.map((element) => Object.keys(element));
        const valuesArr = parsedData.map((element) => Object.values(element));

        setData(parsedData);
        setColumns(columnArr[0]);
        setValues(valuesArr);
      },
    });
  };
  const sortTableHandler = () => {
    setIsTableSorted(true);
    setTableName(
      "Sorted table by employees who have worked the longest on the same project "
    );

    // group by projects
    const newArr = [...data];

    const groupedArr = newArr.reduce((acc, curr) => {
      const key = curr.ProjectID;
      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(curr);

      return acc;
    }, []);
    // remove singles
    const filteredArrays = groupedArr.filter((arr) => arr.length > 1);

    //convert dates to DateTime

    const convertedDatesArr = filteredArrays.map((employees) => {
      employees.map((employee) => {
        employee.DateFrom !== "NULL" ? new Date(employee.DateFrom) : new Date();
        employee.DateTo !== "NULL" ? new Date(employee.DateTo) : new Date();
      });
      return employees;
    });

    // sort by start date
    // convertedDatesArr.sort((a, b) => a.DateFrom - b.DateFrom);

    const sortedArrByStartDate = convertedDatesArr.map((employees) => {
      employees.sort((a, b) => a.DateFrom - b.DateFrom);
      return employees;
    });
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
                {columns.map((column, index) => (
                  <th key={index}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {values.map((value, rowIndex) => (
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
                <th>Project ID </th>
                <th>Days worked</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        )}

        <div className="table-operations_container">
          {!isTableSorted && (
            <button onClick={sortTableHandler}>Sort Table</button>
          )}
          {isTableSorted && (
            <button onClick={showOriginalHandler}>Show original</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
