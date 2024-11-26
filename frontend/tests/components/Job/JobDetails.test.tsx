// WolfJobs
// Copyright (c) 2024 Group 84: Gokul Prakash Ramesh, Haricharan Bharathi, Raghunandan Ganesh Mante
// This project is licensed under the MIT License.

// Governance Model:
// This project follows an open governance model, which includes a leadership team,
// contribution guidelines, a code of conduct, and a clear decision-making process.
// Contributions are welcome, and please see CONTRIBUTING.md for details.

import { render, screen } from "@testing-library/react";
import React from "react";
import JobDetails from "../../../src/components/Job/JobDetails";
import { MemoryRouter } from "react-router";

describe("JobDetails", () => {
  it("renders JobDetails", () => {
    render(
      <MemoryRouter>
        <JobDetails
          jobData={{
            type: "part-time",
            _id: 1,
            managerid: 1,
            name: "Developer",
            status: "open",
            location: "Raleigh",
            pay: "100",
            description: "Developer",
            question1: "Work experience?",
            question2: "CGPA?",
            question3: "Age?",
            question4: "Skills?",
          }}
        />
      </MemoryRouter>
    );
    // const headline = screen.getByText(/Hello/i);
    // expect(headline).toBeInTheDocument();
  });
});
