const router = require('express').Router();
const User = require('../models/User');
const uploadCloud = require('../helpers/cloudinary');

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()) return next();
    return res.redirect('/login?next=/profile')
}


router.post('/follow/:id', isLoggedIn, (req,res,next)=>{
    User.findByIdAndUpdate(req.params.id, {$push:{followers:req.user._id}}, {new:true})
    .then(user=>{
        return User.findByIdAndUpdate(req.user._id, {$push:{following:user._id}}, {new:true})
    })
    .then(loggedUser=>{
        req.user = loggedUser;
        res.redirect('/users/' + req.params.id)
    })
})

router.get('/users/:id', (req,res,next)=>{
    User.findById(req.params.id)
    .populate('tweets')
    .then(user=>{
        if(!user) res.redirect('/users');
        res.render('users/profile', user)
    })
    .catch(e=>next(e))
})

router.get('/users', (req,res, next)=>{
    res.render('users/search')
});

router.post('/users', (req,res, next)=>{
    User.find({username: {$regex:req.body.username, $options:'i'}})
    .then(users=>{
        res.render('users/search', {users});
    })
    .catch(e=>next(e))
});

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