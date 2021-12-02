const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const Chat = new Schema({
    Text: {type: String},
    To: {type: Schema.Types.ObjectId, ref: 'User'},
    Author: {type: Schema.Types.ObjectId, ref: 'User'},
    Date: {type: Date},
    File: {type: String},
})

Chat.plugin(mongoosePaginate);

module.exports = model('Chat', Chat);