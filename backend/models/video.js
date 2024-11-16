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