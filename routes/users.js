const router = require('express').Router();
const User = require('../models/User');
const uploadCloud = require('../helpers/cloudinary');
const Tweet = require('../models/Tweet');

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()) return next();
    return res.redirect('/login?next=/profile')
}

router.post('/follow/:id', isLoggedIn, (req,res,next)=>{
    //check
    const elId = req.user.following.find(id=>id == req.params.id);
    console.log('elId ', elId)
    if(elId) {
        req.user.following = req.user.following.filter(id=> id != req.params.id);
        return req.user.save()
        .then(user=>{
            return res.send(user);
            
        })
        .catch(e=>next(e))
    }
    //agregamos
    req.user.following.push(req.params.id);
    req.user.save()
    .then(user=>{
       console.log('esto no')
        return res.send(user)
    })
    .catch(e=>next(e))
});

// router.post('/follow/:id', isLoggedIn, (req,res,next)=>{
//    //si ya esta en la lista la quitamos
//     const elId = req.user.following.find(i=>i==req.params.id);
//     console.log(req.user)
//     if(elId){
//         req.user.following = req.user.following.filter(i=> i != req.params.id)
//         req.user.save();
//         User.findByIdAndUpdate(req.params.id, {$pull:{followers:req.user._id}}, {new:true})
//         .then(user=>{
//             res.redirect('/users/' + req.params.id)
//         })
//         .catch(e=>next(e))
//     }else{
//         console.log("nel")
//         req.user.following.push(req.params.id);
//         req.user.save()
//         req.user = req.user;
//         User.findByIdAndUpdate(req.params.id, {$push:{followers:req.user._id}}, {new:true})
//         .then(user=>{
//             res.redirect('/users/' + req.params.id)
//         })
//         .catch(e=>res.send(e))
//     }
// })

router.get('/users/:id', (req,res,next)=>{
    User.findById(req.params.id)
    .populate('tweets')
    .populate('followers')
    .then(user=>{
        if(!user) res.redirect('/users');
        console.log(user.followers)
        //checo si lo sigues
        const elId = req.user.following.find(i=>i == user._id.toString())
        const text = elId ? "Following" : "Follow";
        user.text = text;
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
    //tweets de los que sigues
    Tweet.find({user:{$in:req.user.following}}).sort('-created_at').populate('user')
    .then(tweets=>{
        req.user.text = "Kiubo?"
        req.user.tweets = tweets;
        return User.find({following:req.user._id})
    })
    .then(followers=>{
        req.user.followers = followers;
        return res.send(req.user);
        res.render('users/profile', req.user);
    })
    .catch(e=>next(e))
    
});

module.exports = router;