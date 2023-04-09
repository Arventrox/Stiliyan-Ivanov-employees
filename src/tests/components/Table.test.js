import { render, screen } from "@testing-library/react";
import Table from "../../components/Table";

test("Table renders correctly with the right data", () => {
  const columns = ["EmpID", "ProjectID", "DateFrom", "DateTo"];
  const data = [
    ["143", "12", "2013-11-01", "2014-01-05"],
    ["218", "10", "06-05-2012", "NULL"],
    ["143", "10", "2009-01-01", "2011-04-27"],
    ["147", "10", "2013-11-01", "2014-01-05"],
  ];
  render(<Table data={data} columns={columns} />);

  const cell = screen.getByRole("cell", {
    name: /218/i,
  });
  //   console.log(cell);
  expect(cell).toBeTruthy();
  expect(cell.innerHTML).toEqual("218");
});
