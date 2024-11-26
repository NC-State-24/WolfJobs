// WolfJobs
// Copyright (c) 2024 Group 84: Gokul Prakash Ramesh, Haricharan Bharathi, Raghunandan Ganesh Mante
// This project is licensed under the MIT License.

// Governance Model:
// This project follows an open governance model, which includes a leadership team,
// contribution guidelines, a code of conduct, and a clear decision-making process.
// Contributions are welcome, and please see CONTRIBUTING.md for details.

const express = require('express');

const router = express.Router();

const homeController = require('../controllers/home_controller')

router.get('/', homeController.home);
router.use('/users',require('./users'));
router.use('/message', require('./message'));
router.use('/api',require('./api'));
router.use('/ai', require('./ai'));

module.exports = router;

