# Pair of employees who have worked together

This project was made with React.
This project was tested on node v18.11.0.

The data folder is not a part of the project, it is there for convenience.
The utility functions and all elements of the project are in App.js for your convenience.

## Task

Create an application that identifies the pair of employees who have worked
together on common projects for the longest period of time.

### Requirements

1. DateTo can be NULL, equivalent to today
2. The input data must be loaded to the program from a CSV file
3. Create an UI:
   The user picks up a file from the file system and, after selecting it, all common
   projects of the pair are displayed in datagrid with the following columns:
   Employee ID #1, Employee ID #2, Project ID, Days worked
4. More than one date format to be supported, extra points will be given if all date formats
   are supported

### Usage

1. Run npm start in console
2. Click **Choose File** to select a csv file, which imports and displays the raw data from the file
3. Click **Sort Table** to get and display the pair of employees who have worked
   together on common projects for the longest period of time
