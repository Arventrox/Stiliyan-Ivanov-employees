import { fireEvent, render, screen } from "@testing-library/react";
import Button from "../../components/Button";

test("Button renders correctly with the right handler and text", () => {
  const onClickHandler = jest.fn();
  const buttonText = "Test!";
  render(<Button onClick={onClickHandler}>{buttonText}</Button>);
  const button = screen.getByRole("button");

  expect(button).toBeTruthy();
  expect(button.innerHTML).toEqual(buttonText);
  fireEvent.click(button);
  expect(onClickHandler).toHaveBeenCalled();
});
