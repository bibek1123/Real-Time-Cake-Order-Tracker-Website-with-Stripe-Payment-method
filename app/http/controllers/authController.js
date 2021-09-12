const User = require('../../models/user')
const bcrypt = require('bcrypt') // bcrypt used for hash(encrypt) passaword
const passport = require('passport')

// Create Controller:- Controller always return object.
function authController() {
    const _getRedirectUrl =(req)=>{
        return req.user.role === 'admin'? '/admin/orders' : '/customer/orders'
    }
    return {
        login(req, res) {
            res.render('auth/login')
        },
        postLogin(req, res, next){

            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    req.flash('error', info.message)
                    return next(err)
                }
                if (!user) {
                    req.flash('error', info.message)
                    return res.redirect('/login')

                }
                req.logIn(user, (err) => {
                    if (err) {
                        req.flash('error', info.message)
                        return next(err)
                    }
                    return res.redirect(_getRedirectUrl(req))


                })
            })(req, res, next)
        },
        register(req, res) {
            res.render('auth/register')
        },
        async postRegister(req, res) {
            const { name, email, password, rememberme } = req.body
            // Validate request:-
            if (!name || !email || !password) {
                req.flash('error', 'All fields are required!')
                req.flash('name', name)
                req.flash('email', email)
                return res.redirect('/register')
            }

            // Check if email exists:-
            User.exists({ email: email }, (err, result) => {
                if (result) {
                    req.flash('error', 'Email already taken')
                    req.flash('name', name)
                    req.flash('email', email)
                    return res.redirect('/register')
                }
            })
            // Hash Password:-
            const hashedPassword = await bcrypt.hash(password, 10)
            // Create a user:-
            const user = new User({
                name,
                email,
                password: hashedPassword
            })

            user.save().then((user) => {
                //Login
                return res.redirect('/')
            }).catch(err => {
                req.flash('error', 'Something went wrong')
                return res.redirect('/register')
            })
            // console.log(req.body)
        },
        logout(req, res) {
            req.logout()
            return res.redirect('/login')
        }
    }

}

module.exports = authController