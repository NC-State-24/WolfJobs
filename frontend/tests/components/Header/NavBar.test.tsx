// WolfJobs
// Copyright (c) 2024 Group 84: Gokul Prakash Ramesh, Haricharan Bharathi, Raghunandan Ganesh Mante
// This project is licensed under the MIT License.

// Governance Model:
// This project follows an open governance model, which includes a leadership team,
// contribution guidelines, a code of conduct, and a clear decision-making process.
// Contributions are welcome, and please see CONTRIBUTING.md for details.

import { render, screen } from "@testing-library/react";
import React from "react";
import NavBar from "../../../src/components/Header/NavBar";
import { MemoryRouter } from "react-router";

describe("NavBar", () => {
  it("renders NavBar", () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );
    // const headline = screen.getByText(/Hello/i);
    // expect(headline).toBeInTheDocument();
  });
});
