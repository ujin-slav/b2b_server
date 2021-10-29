const {Schema, model} = require('mongoose');

const Chat = new Schema({
    Room: {type: String},
    Author: {type: Schema.Types.ObjectId, ref: 'User'},
})

module.exports = model('Chat', Chat);