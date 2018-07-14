const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    active: {
        type: Boolean,
        default: false
    },
    username: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required:true
    },
    photoURL: {
        type: String,
        default: 'http://botornot.co/blog/wp-content/uploads/2015/04/fakefollowers2-554x255.png'
    },
    cover: {
        type: String,
        default: 'https://techcrunch.com/wp-content/uploads/2018/07/fake-twitter-accounts.png?w=730&crop=1'
    },
    followers:[
        {
            type: Schema.Types.ObjectId,
            ref: "User",
            childPath: "following"
        }
    ],
    following: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    tweets:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Tweet'
        }
    ]
},{
    timestamps:{
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

userSchema.plugin(passportLocalMongoose, {usernameField:'email'});

module.exports = mongoose.model('User', userSchema);