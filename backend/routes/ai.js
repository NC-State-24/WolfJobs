const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const aiController = require("../controllers/ai_controller")

router.post('/generateQuestions', jsonParser, aiController.generateQuestions)
router.post('/fetchSuggestedPay', jsonParser, aiController.fetchSuggestedPay)

module.exports = router