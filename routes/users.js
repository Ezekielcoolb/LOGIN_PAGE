const express = require ('express')
const router = express.Router()
// to encrypt the pass word bring in bcrypt
const bcrypt = require('bcryptjs')
const passport = require('passport')

// User Model
const User = require('../models/User')

// Login page
router.get('/login', (req, res) => res.render('login'))

// Register Page
router.get('/register', (req, res) => res.render('register'))


//  Reegister handle

router.post('/register', (req, res) => {

    const {name, email, password, password2} = req.body

    let errors = []

    // Check required fields
    if(!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields'})
    }

    // Check passwords match 
    if(password !== password2) {
        errors.push({ msg: 'Password do not match'})
    }

    // Check password length
    if(password.length < 6) {
        errors.push({ msg: 'Password should be at least six characters'})
    }

    if(errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        // Validation pass
        User.findOne({ email: email})
        .then(user => {
            if(user) {
                // User exist
                errors.push({ msg: 'Email is already registered'})
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                })
            } else {
            //  if no user we need to create another user
            const newUser = new User({
                name, 
                email,
                password
            })  
            // Hash password wit bcrypt
            bcrypt.genSalt(10, (err, salt) => 
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err
                    // set password to hashed
                    newUser.password = hash
                    //  save user
                    newUser.save()
                        .then(user => {
                            req.flash('success_msg', 'You are now reqistered and can now log in')
                            res.redirect('/users/login')
                        })
                        .catch(err => console.log(err))
            }))
            // console.log(newUser)
            // res.send('hello')
            }
        })
    }
    // console.log(req.body)
    // res.send('hello')
})

// Login handle (to authenticate login)

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})


//  Logout  Handle
router.get('/logout', (req, res) => {
    req.logout(
        req.flash('success_msg', 'You are logged out'),
        res.redirect('/users/login')
    )
    
})
module.exports = router