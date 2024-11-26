// WolfJobs
// Copyright (c) 2024 Group 84: Gokul Prakash Ramesh, Haricharan Bharathi, Raghunandan Ganesh Mante
// This project is licensed under the MIT License.

// Governance Model:
// This project follows an open governance model, which includes a leadership team,
// contribution guidelines, a code of conduct, and a clear decision-making process.
// Contributions are welcome, and please see CONTRIBUTING.md for details.

import { render, screen } from "@testing-library/react";
import React from "react";
import NavBarItem from "../../../src/components/Header/NavBarItem";
import { MemoryRouter } from "react-router-dom";

describe("NavBarItem", () => {
  it("renders NavBarItem", () => {
    render(
      <MemoryRouter>
        <NavBarItem link={"/"} text="Home" />
      </MemoryRouter>
    );
    const headline = screen.getByText(/Home/i);
    expect(headline).toBeInTheDocument();
  });
});
