// to ensure users doesn't get to the dashboard unless they are logged in
module.exports  = {
    ensureAuthenticated: function (req, res, next) {
        if(req.isAuthenticated()) {
            return next()
        } else {
            req.flash('error_msg', 'Please log in to view resources')
            res.redirect('/users/login')
        }
    }
}