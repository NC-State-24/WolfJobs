// WolfJobs
// Copyright (c) 2024 Group 84: Gokul Prakash Ramesh, Haricharan Bharathi, Raghunandan Ganesh Mante
// This project is licensed under the MIT License.

// Governance Model:
// This project follows an open governance model, which includes a leadership team,
// contribution guidelines, a code of conduct, and a clear decision-making process.
// Contributions are welcome, and please see CONTRIBUTING.md for details.

import { render } from "@testing-library/react";
import JobQuestionnaire from "../../../src/Pages/CreateJob/jobQuestionnaire";
import { MemoryRouter, Route, Routes } from "react-router-dom";

describe("JobQuestionnaire", () => {
  it("renders JobQuestionnaire with state", () => {
    const initialState = {
      description: "Test job description",
      requiredSkills: ["Skill 1", "Skill 2"],
    };

    render(
      <MemoryRouter initialEntries={[{ pathname: "/create-job", state: initialState }]}>
        <Routes>
          <Route path="/create-job" element={<JobQuestionnaire />} />
        </Routes>
      </MemoryRouter>
    );
  });
});