const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const SentMail = new Schema({
    To: [],
    SpecOffer: {type: Schema.Types.ObjectId, ref: 'SpecOffer'},
    Ask: {type: Schema.Types.ObjectId, ref: 'Ask'},
    Limit: {type: Number},
    CurrentPage: {type: Number},
    Error: {type: String},
})

SentMail.plugin(mongoosePaginate);

module.exports = model('SentMail', SentMail);