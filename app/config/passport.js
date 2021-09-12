
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcrypt')

function init(passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        //Login:
        //Check if email exists
        const user = await User.findOne({ email: email })
        if (!user) {
            return done(null, false, { message: 'No User with this Email ID' })
        }

        bcrypt.compare(password, user.password).then(match => {
            if (match) {
                return done(null, user, { message: 'Logged in succesfully!' })
            }
            return done(null, false, { message: 'Wrong Username or Password' })
        }).catch(err => {
            return done(null, false, { message: 'Something went Wrong' })
        })

    }))
    passport.serializeUser((user, done) => {
        done(null, user._id) //we can use here email or userid or anything we want i.e. benifit of Passport labrary. 

    })
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)

        })

    })

}



module.exports = init