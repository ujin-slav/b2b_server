const {Schema, model} = require('mongoose');

const UnreadAnswerOrg = new Schema({
    Message: {type: Schema.Types.ObjectId, ref: 'ReviewOrg'},
    To: {type: Schema.Types.ObjectId, ref: 'User'} 
})

module.exports = model('UnreadAnswerOrg', UnreadAnswerOrg);