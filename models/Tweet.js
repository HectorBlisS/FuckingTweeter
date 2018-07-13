const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tweetSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    text:{
        type: String,
        required:true
    }
},{
    timestamps:{
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});


module.exports = mongoose.model('Tweet', tweetSchema);