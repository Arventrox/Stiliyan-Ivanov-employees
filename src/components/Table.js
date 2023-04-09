import style from "./Table.module.css";

const Table = ({ columns, data, combinedDaysWorked }) => {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((value, rowIndex) => (
          <tr key={rowIndex}>
            {value.map((v, valueIndex) => (
              <td key={valueIndex}>{v}</td>
            ))}
          </tr>
        ))}

        {combinedDaysWorked && (
          <tr>
            <td className={style.tableData_result} colSpan={columns.length}>
              {combinedDaysWorked}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default Table;
