const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const Question = new Schema({
    Host: {type: Schema.Types.ObjectId, ref: 'Question'},
    Destination : {type: Schema.Types.ObjectId, ref: 'User'},
    Author: {type: Schema.Types.ObjectId, ref: 'User'},
    Text: {type: String},
    Ask: {type: Schema.Types.ObjectId, ref: 'Ask'},
})

Question.plugin(mongoosePaginate);

module.exports = model('Question', Question);