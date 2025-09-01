import { render, screen } from "@testing-library/react";
import UserAccount from "../../src/components/UserAccount";
import { User } from "../../src/entities";

describe("UserAccount Component", () => {
	it("should render heading and user name", () => {
		const user: User = { id: 1, name: "Alice", isAdmin: false };
		render(<UserAccount user={user} />);
		expect(screen.getByText(user.name)).toBeInTheDocument();
	});

	it("should render Edit button for admin users", () => {
		const user: User = { id: 1, name: "Alice", isAdmin: true };
		render(<UserAccount user={user} />);

		const button = screen.getByRole("button", { name: /Edit/i });
		expect(button).toBeInTheDocument();
		expect(button).toHaveTextContent("Edit");
	});

	it("should not render Edit button for non-admin users", () => {
		const user: User = { id: 1, name: "Alice", isAdmin: false };
		render(<UserAccount user={user} />);

		const button = screen.queryByRole("button");
		expect(button).not.toBeInTheDocument();
	});
});
