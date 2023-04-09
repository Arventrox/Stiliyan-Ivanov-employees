import {
  getObjectValues,
  getDaysWorked,
  getLongestPairProjects,
  summarizePairsWorkData,
} from "../utils/tableFunctions";

test("getObjectValues returns an array of object values", () => {
  const input = [
    { a: 1, b: 2 },
    { a: 3, b: 4 },
  ];

  const output = getObjectValues(input);
  expect(output).toEqual([
    [1, 2],
    [3, 4],
  ]);
});

test("getDaysWorked returns all the pairs of employees who have worked together on a common project and calculates the overlapping workdays", () => {
  const getDaysWorkedInput = [
    {
      EmpID: "143",
      ProjectID: "12",
      DateFrom: "2013-11-01T00:00:00.000Z",
      DateTo: "2014-01-05T00:00:00.000Z",
    },
    {
      EmpID: "218",
      ProjectID: "10",
      DateFrom: "2012-06-04T21:00:00.000Z",
      DateTo: "2023-04-09T14:21:15.721Z",
    },
    {
      EmpID: "143",
      ProjectID: "10",
      DateFrom: "2009-01-01T00:00:00.000Z",
      DateTo: "2011-04-27T00:00:00.000Z",
    },
    {
      EmpID: "147",
      ProjectID: "10",
      DateFrom: "2013-11-01T00:00:00.000Z",
      DateTo: "2014-01-05T00:00:00.000Z",
    },
  ];
  const getDaysWorkedReturn = [
    { Emp1: "218", Emp2: "147", ProjID: "10", DaysWorked: 65 },
  ];

  expect(getDaysWorked(getDaysWorkedInput)).toEqual(getDaysWorkedReturn);
});

test("summarizePairsWorkData returns the combinations of pairs who have worked together for the longest time and sorts them by most days", () => {
  const summarizePairsWorkDataInput = [
    { Emp1: "218", Emp2: "147", ProjID: "10", DaysWorked: 65 },
  ];
  const summarizePairsWorkDataReturn = [
    { Emp1: "218", Emp2: "147", Projects: ["10"], DaysWorked: 65 },
  ];

  expect(summarizePairsWorkData(summarizePairsWorkDataInput)).toEqual(
    summarizePairsWorkDataReturn
  );
});

test("getLongestPairProjects returns the common projects and the workdays of the pair that has worked together for the longest", () => {
  const getLongestPairProjectsInput = [
    { Emp1: "218", Emp2: "147", ProjID: "10", DaysWorked: 65 },
  ];

  const getLongestPairProjectsInput2 = {
    Emp1: "218",
    Emp2: "147",
    Projects: ["10"],
    DaysWorked: 65,
  };

  const getLongestPairProjectsReturn = [
    { Emp1: "218", Emp2: "147", ProjID: "10", DaysWorked: 65 },
  ];

  expect(
    getLongestPairProjects(
      getLongestPairProjectsInput,
      getLongestPairProjectsInput2
    )
  ).toStrictEqual(getLongestPairProjectsReturn);
});
