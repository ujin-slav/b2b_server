const {Schema, model} = require('mongoose');

const UnreadInvited = new Schema({
    Ask: {type: Schema.Types.ObjectId, ref: 'Ask'},
    To: {type: Schema.Types.ObjectId, ref: 'User'},
    From: {type: Schema.Types.ObjectId, ref: 'User'} 
})

module.exports = model('UnreadInvited', UnreadInvited);