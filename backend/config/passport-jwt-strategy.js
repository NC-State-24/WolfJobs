// WolfJobs
// Copyright (c) 2024 Group 84: Gokul Prakash Ramesh, Haricharan Bharathi, Raghunandan Ganesh Mante
// This project is licensed under the MIT License.

// Governance Model:
// This project follows an open governance model, which includes a leadership team,
// contribution guidelines, a code of conduct, and a clear decision-making process.
// Contributions are welcome, and please see CONTRIBUTING.md for details.

const passport = require('passport');

const JWTStrategy = require('passport-jwt').Strategy;

const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');


let opts = {
    jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'wolfjobs'
}


passport.use(new JWTStrategy(opts, function(jwtPayload, done){

    User.findById(jwtPayload._id, function(err, user){
        if (err){
            console.log('Error in finding user from JWT');
            return
        }

        if (user){
            return done(null,user)
        }else{
            return done(null,false)
        }
    })

}))


module.exports = passport;

