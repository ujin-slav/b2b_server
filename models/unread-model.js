const {Schema, model} = require('mongoose');

const Unread = new Schema({
    Message: {type: Schema.Types.ObjectId, ref: 'Chat'},
    To: {type: Schema.Types.ObjectId, ref: 'User'},
    From: {type: Schema.Types.ObjectId, ref: 'User'} 
})

module.exports = model('Unread', Unread);