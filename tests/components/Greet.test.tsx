import { render, screen } from "@testing-library/react";
import Greet from "../../src/components/Greet";
import "@testing-library/jest-dom/vitest";

describe("Greet", () => {
	it("should render Hello with the name when name is provided", () => {
		render(<Greet name="Hammad" />);
		const heading = screen.getByRole("heading");
		expect(heading).toBeInTheDocument();
		expect(heading).toHaveTextContent(/Hammad/i);
	});

	it("should render Login button when name is not provided", () => {
		render(<Greet name="" />);
		const button = screen.getByRole("button");
		expect(button).toBeInTheDocument();
	});
});
