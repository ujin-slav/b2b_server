const {Schema, model} = require('mongoose');

const Question = new Schema({
    Host: {type: Schema.Types.ObjectId, ref: 'Question'},
    Destination : {type: Schema.Types.ObjectId, ref: 'User'},
    Author: {type: Schema.Types.ObjectId, ref: 'User'},
    Text: {type: String},
    Ask: {type: Schema.Types.ObjectId, ref: 'Ask'},
})

module.exports = model('Question', Question);