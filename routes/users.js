const router = require('express').Router();
const User = require('../models/User');
const uploadCloud = require('../helpers/cloudinary');

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()) return next();
    return res.redirect('/login?next=/profile')
}

router.post('/profile', isLoggedIn, uploadCloud.single('foto'), (req, res, next)=>{
    if(!req.file) redirect('/profile');
    req.user.photoURL = req.file.url;
    User.findOneAndUpdate(req.user._id, req.user, {new:true})
    .then(user=>{
        res.redirect('/profile')
    })
    .catch(e=>next(e))
});

router.get('/profile', isLoggedIn, (req,res,next)=>{
    User.findById(req.user._id)
    .populate('tweets')
    .then(user=>{
        res.render('users/profile', user)
    })
    .catch(e=>next(e))
    
});

module.exports = router;