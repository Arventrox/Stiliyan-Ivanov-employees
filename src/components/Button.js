const Button = ({ onClick, children }) => {
  return (
    <div className="table-operations_container">
      <button onClick={onClick}>{children}</button>
    </div>
  );
};

export default Button;
