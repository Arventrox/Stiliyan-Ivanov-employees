import style from "./FileInput.module.css";

const FileInput = ({ fileHandler }) => {
  return (
    <div className={style.input_container}>
      <input
        type="file"
        aria-label="file-input"
        name="file"
        id="file"
        accept=".csv"
        onChange={fileHandler}
      />
      <label htmlFor="file">IMPORT CSV</label>
    </div>
  );
};

export default FileInput;
