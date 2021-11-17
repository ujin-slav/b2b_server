const {Schema, model} = require('mongoose');

const UnreadQuest = new Schema({
    Message: {type: Schema.Types.ObjectId, ref: 'Question'},
    To: {type: Schema.Types.ObjectId, ref: 'User'},
    From: {type: Schema.Types.ObjectId, ref: 'User'} 
})

module.exports = model('UnreadQuest', UnreadQuest);