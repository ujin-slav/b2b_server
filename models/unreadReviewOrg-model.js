const {Schema, model} = require('mongoose');

const UnreadReviewOrg = new Schema({
    Message: {type: Schema.Types.ObjectId, ref: 'ReviewOrg'},
    From: {type: Schema.Types.ObjectId, ref: 'User'} 
})

module.exports = model('UnreadReviewOrg', UnreadReviewOrg);