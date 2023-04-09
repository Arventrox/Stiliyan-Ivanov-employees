import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import FileInput from "../../components/FileInput";

test("FileInput rendered correctly", async () => {
  const file = new File(["test"], "test.csv");
  const fileHandler = jest.fn();
  render(<FileInput fileHandler={fileHandler} />);
  const input = screen.getByLabelText("file-input");
  // eslint-disable-next-line testing-library/no-wait-for-side-effects
  await waitFor(() => fireEvent.change(input, { target: { files: [file] } }));

  expect(input).toBeTruthy();
  expect(input.files).toHaveLength(1);
  expect(input.files[0]).toEqual(file);
  expect(fileHandler).toHaveBeenCalled();
});
