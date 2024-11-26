// WolfJobs
// Copyright (c) 2024 Group 84: Gokul Prakash Ramesh, Haricharan Bharathi, Raghunandan Ganesh Mante
// This project is licensed under the MIT License.

// Governance Model:
// This project follows an open governance model, which includes a leadership team,
// contribution guidelines, a code of conduct, and a clear decision-making process.
// Contributions are welcome, and please see CONTRIBUTING.md for details.

const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const aiController = require("../controllers/ai_controller")

router.post('/generateQuestions', jsonParser, aiController.generateQuestions)
router.post('/fetchSuggestedPay', jsonParser, aiController.fetchSuggestedPay)

module.exports = router