import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders login link when unauthenticated", () => {
  render(<App />);
  // We should land on /login via redirect when not signed in.
  expect(screen.getByText(/sign in/i)).toBeInTheDocument();
});
