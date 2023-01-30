const {Schema, model} = require('mongoose');

const UnreadIWinner = new Schema({
    Ask: {type: Schema.Types.ObjectId, ref: 'Ask'},
    To: {type: Schema.Types.ObjectId, ref: 'User'},
})

module.exports = model('UnreadIWinner', UnreadIWinner);