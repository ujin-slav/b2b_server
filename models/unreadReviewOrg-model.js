const {Schema, model} = require('mongoose');

const UnreadReviewOrg = new Schema({
    Message: {type: Schema.Types.ObjectId, ref: 'ReviewOrg'},
    To: {type: Schema.Types.ObjectId, ref: 'User'} 
})

module.exports = model('UnreadReviewOrg', UnreadReviewOrg);