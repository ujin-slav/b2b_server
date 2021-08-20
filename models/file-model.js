const {Schema, model} = require('mongoose');

const TokenSchema = new Schema({
    ask: {type: Schema.Types.ObjectId, ref: 'Ask'},
    path: {type: String, required: true},
})

module.exports = model('Token', TokenSchema);