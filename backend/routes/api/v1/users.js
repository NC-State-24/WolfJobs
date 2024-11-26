// WolfJobs
// Copyright (c) 2024 Group 84: Gokul Prakash Ramesh, Haricharan Bharathi, Raghunandan Ganesh Mante
// This project is licensed under the MIT License.

// Governance Model:
// This project follows an open governance model, which includes a leadership team,
// contribution guidelines, a code of conduct, and a clear decision-making process.
// Contributions are welcome, and please see CONTRIBUTING.md for details.

const express = require("express");

const router = express.Router();

const usersApi = require("../../../controllers/api/v1/users_api");

const bodyParser = require("body-parser");

const jsonParser = bodyParser.json();

router.post("/create-session", usersApi.createSession);
router.post("/signup", usersApi.signUp);
router.post("/edit", jsonParser, usersApi.editProfile);
router.post("/editJob",jsonParser,usersApi.editJob);
router.get("/getprofile/:id", usersApi.getProfile);
router.get("/search/:name", usersApi.searchUser);
router.post("/createhistory", usersApi.createHistory);
// router.get('/gethistory/:userId',usersApi.getHistory);
router.get("/gethistory", usersApi.getHistory);
router.post("/createjob", jsonParser, usersApi.createJob);
router.get("/", usersApi.index);
router.get("/fetchapplications", usersApi.fetchApplication);
router.post("/acceptapplication", usersApi.acceptApplication);
router.post("/modifyApplication", jsonParser, usersApi.modifyApplication);
router.post("/generateOTP", usersApi.generateOtp);
router.post("/verifyOTP", usersApi.verifyOtp);
router.post("/rejectapplication", usersApi.rejectApplication);
router.post("/closejob", jsonParser, usersApi.closeJob);
router.post("/createapplication", jsonParser, usersApi.createApplication);
router.get("/appointment/slots", usersApi.getAvailableSlots);
router.post("/appointment/slots", jsonParser, usersApi.createSlot);
router.post("/appointment/bookslots", jsonParser, usersApi.bookAppointment);
router.get("/appointment/appointments/:id", usersApi.getAppointmentsByApplicant);
router.put("/appointment/appointments/:id", usersApi.updateAppointmentStatus);
router.get("/appointment/manager/:id", usersApi.getManagerSlots);


module.exports = router;
