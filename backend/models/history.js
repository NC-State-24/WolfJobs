// WolfJobs
// Copyright (c) 2024 Group 84: Gokul Prakash Ramesh, Haricharan Bharathi, Raghunandan Ganesh Mante
// This project is licensed under the MIT License.

// Governance Model:
// This project follows an open governance model, which includes a leadership team,
// contribution guidelines, a code of conduct, and a clear decision-making process.
// Contributions are welcome, and please see CONTRIBUTING.md for details.

const mongoose = require('mongoose');


const historySchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    caloriesgain: {
        type: Number, 
        default:0
    },
    caloriesburn:{
        type:Number,
        default:0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

  
});


const History = mongoose.model('History', historySchema);

module.exports = History;