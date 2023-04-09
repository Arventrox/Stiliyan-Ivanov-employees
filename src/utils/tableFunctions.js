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

    if (!group[ProjectID].some((el) => el.EmpID === arr.EmpID))
      group[ProjectID].push(arr);

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
          const overlappingDays = getOverlappingDaysInIntervals(
            {
              start: employee1.DateFrom,
              end: employee1.DateTo,
            },
            {
              start: employee2.DateFrom,
              end: employee2.DateTo,
            }
          );

          if (overlappingDays > 0)
            pairsArr.push({
              Emp1: employee2.EmpID,
              Emp2: employee1.EmpID,
              ProjID: project,
              DaysWorked: overlappingDays,
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

export {
  getObjectValues,
  getDaysWorked,
  getLongestPairProjects,
  summarizePairsWorkData,
};
