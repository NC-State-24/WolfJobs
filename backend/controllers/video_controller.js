// controllers/video_controller.js
const Video = require('../models/video');
const User = require('../models/user');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const fsnp= require('fs');
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const dir = './uploads/';
//     fs.mkdirSync(dir, { recursive: true });
//     cb(null, dir);
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });

// // Create upload middleware
// const upload = multer({ 
//   storage: storage,
//   fileFilter: function (req, file, cb) {
//     if (file.mimetype.startsWith('video/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Not a video file!'), false);
//     }
//   },
//   limits: {
//     fileSize: 100 * 1024 * 1024 // 100 MB limit
//   }
// });

// // Video upload handler
// exports.uploadVideo = async (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No file uploaded.');
//   }
//   // First look for a video with the same applicantId
//   const existingVideo = await Video.findOne({
//     applicantId: req.body.id
//   });
//   if (existingVideo) {
//     // Delete the existing video
//     await existingVideo.remove();
//   }
//   // Find the user and add the video
//   let user = await User.findOne({ _id: req.body.id });
//   if (!user) {
//     return res.status(404).send({ error: 'User not found' });
//   }

//   try {
//     const video = new Video({
//       applicantId: user._id,
//       videoTitle: req.file.originalname,
//       contentType: req.file.mimetype,
//       fileSize: req.file.size,
//     });
//     await video.save();
//     user.videoId = video._id;
//     user.videoTitle = video.videoTitle;
//     await user.save();

//     res.status(201).send({ message: 'Video uploaded successfully' });
//   } catch (error) {
//     res.status(400).send({ error: error.message });
//   }
// };

// exports.getVideo = async (req, res) => {
//   try {
//     const video = await Video.findOne({ applicantId: req.params.id });
//     if (!video) {
//       return res.status(404).send({ error: 'Video not found' });
//     }
//     res.set('Content-Type', video.contentType);
//     res.set('Content-Disposition', `inline; filename=${video.videoTitle}`);
//     res.send(video.videoData);
//   } catch (error) {
//     res.status(400).send({ error: error.message });
//   }
// };


// // Make sure to export the multer upload as well
// exports.upload = upload;

const storage = multer.diskStorage({
     destination: function (req, file, cb) {
       const dir = './uploads/';
       fs.mkdir(dir, { recursive: true });
       cb(null, dir);
     },
     filename: function (req, file, cb) {
       cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
     }
   });
  

// Create upload middleware
const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    console.log("reached middleware");
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      console.log("reached else");
      cb(new Error('Not a video file!'), false);
    }
  },
  limits: {
    fileSize: 100 * 1024 * 1024 // 100 MB limit
  }
});

// Video upload handler
exports.uploadVideo = async (req, res) => {
  if (!req.file) {
    console.log("No file uploaded");
    return res.status(400).send('No file uploaded.');
  }
  
  try {
    // Find the user
    let user = await User.findOne({ _id: req.body.id });
    if (!user) {
      console.log("No user Found");
      return res.status(404).send({ error: 'User not found' });
    }

    // Check for existing video
    const existingVideo = await Video.findOne({ applicantId: req.body.id });
    if (existingVideo) {
      console.log("deleted existing file");
      // Delete the existing video file
      await fs.unlink(existingVideo.filePath);
      // Delete the existing video document
      await existingVideo.remove();
    }

    // Create new video document
    const video = new Video({
      applicantId: user._id,
      videoTitle: req.file.originalname,
      contentType: req.file.mimetype,
      filePath: req.file.path // Store the file path
    });
    console.log("saving file");
    await video.save();

    // Update user
    user.videoId = video._id;
    user.videoTitle = video.videoTitle;
    console.log("saving user");
    await user.save();

    res.status(201).send({ message: 'Video uploaded successfully' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.getVideo = async (req, res) => {
  try {
    const video = await Video.findOne({ applicantId: req.params.id });
    if (!video) {
      console.log("Video Not Found");
      return res.status(404).send({ error: 'Video not found' });
    }
    
    // Stream the video file
    
    const filePath = video.filePath;
    try {
      await fs.access(filePath); // Check if file exists
    } catch (error) {
      console.log("Video file not found");
      return res.status(404).send({ error: 'Video file not found' });
    }

    const stat = await fs.stat(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      console.log("in range");
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;
      const chunksize = (end-start)+1;
      console.log("in range 2");
      const file = fsnp.createReadStream(filePath, {start, end});
      console.log("in range 3");
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': video.contentType,
      };
      res.writeHead(206, head);
      console.log("in range 4");
      file.pipe(res);
      console.log("in range 5");
    } else {
      console.log("in else 6");
      const head = {
        'Content-Length': fileSize,
        'Content-Type': video.contentType,
      };
      console.log("in  7");
      res.writeHead(200, head);
      console.log("in  8");
      fsnp.createReadStream(filePath).pipe(res);
      console.log("in  9");
    }
  } catch (error) {
    console.error(error)
    res.status(400).send({ error: error.message });
  }
};

// Make sure to export the multer upload as well
exports.upload = upload;


exports.ping = (req, res) => {
  res.send({ message: 'Video Controller Pong' });
};