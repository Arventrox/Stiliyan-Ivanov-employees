import style from "./Button.module.css";

const Button = ({ onClick, children }) => {
  return (
    <div className={style.table_button__container}>
      <button onClick={onClick}>{children}</button>
    </div>
  );
};

export default Button;
