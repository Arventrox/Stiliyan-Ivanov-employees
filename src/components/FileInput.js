const FileInput = ({ fileHandler }) => {
  return (
    <div className="input-container">
      <input
        type="file"
        aria-label="file-input"
        name="file"
        accept=".csv"
        onChange={fileHandler}
        className="input-file"
      />
    </div>
  );
};

export default FileInput;
