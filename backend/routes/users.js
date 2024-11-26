const express = require('express');

const router = express.Router();

const passport = require('passport');

const usersController = require('../controllers/users_controller');
const videoController = require('../controllers/video_controller');
const shiftsController = require('../controllers/shifts_controller');

// import the resume controller
const resumeController = require('../controllers/resume_controller'); 

router.get('/profile',passport.checkAuthentication, usersController.profile);

router.get('/sign-up', usersController.signUp);

router.get('/sign-in', usersController.signIn);

router.post('/create',usersController.create);



//Use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'},
) ,usersController.createSession)

// Add the resume upload route
router.post('/uploadResume', 
    resumeController.upload.single('resume'), // Multer middleware for file upload
    resumeController.uploadResume // The controller function to handle the resume upload
);



router.get('/applicantresume/:id', resumeController.getResume);

// Video routes
router.post('/uploadVideo',
    videoController.upload.single('video'), // Multer middleware for video upload
    videoController.uploadVideo // The controller function to handle the video upload
);

router.get('/getVideo/:id', videoController.getVideo);

router.get('/sign-out', usersController.destroySession);

router.get('/ping', resumeController.ping);

const multer = require('multer');
const upload = multer();


// Route for checking in
router.post('/checkin', upload.none(),shiftsController.checkIn);

// Route for checking out
router.post('/checkout', upload.none(), shiftsController.checkOut);
router.get('/active/:id', shiftsController.getActiveShift);
router.get('/myshifts/:id',shiftsController.getApplicantShifts);
router.get('/allshifts',shiftsController.getAllShifts);



module.exports = router;
