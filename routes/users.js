const router = require('express').Router();
const User = require('../models/User');

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()) return next();
    return res.redirect('/login?next=/profile')
}

router.get('/profile', isLoggedIn, (req,res,next)=>{
    User.findById(req.user._id)
    .populate('tweets')
    .then(user=>{
        res.render('users/profile', user)
    })
    .catch(e=>next(e))
    
});

module.exports = router;