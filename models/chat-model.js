const {Schema, model} = require('mongoose');

const Chat = new Schema({
    Text: {type: String},
    To: {type: Schema.Types.ObjectId, ref: 'User'},
    Author: {type: Schema.Types.ObjectId, ref: 'User'},
    Date: {type: Date},
    File: {type: String},
})

module.exports = model('Chat', Chat);