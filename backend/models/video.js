// WolfJobs
// Copyright (c) 2024 Group 84: Gokul Prakash Ramesh, Haricharan Bharathi, Raghunandan Ganesh Mante
// This project is licensed under the MIT License.

// Governance Model:
// This project follows an open governance model, which includes a leadership team,
// contribution guidelines, a code of conduct, and a clear decision-making process.
// Contributions are welcome, and please see CONTRIBUTING.md for details.

const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' 
  },
  videoTitle: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    required: true,
    enum: ['video/mp4', 'video/webm', 'video/ogg'] // Common video formats
  },
  filePath:{
    type:String,
    required: true
  }
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;