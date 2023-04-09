const FileInput = ({ fileHandler }) => {
  return (
    <div className="input-container">
      <input
        type="file"
        name="file"
        accept=".csv"
        onChange={fileHandler}
        className="input-file"
      />
    </div>
  );
};

export default FileInput;
