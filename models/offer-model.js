const {Schema, model} = require('mongoose');

const OfferSchema = new Schema({
    Author: {type: Schema.Types.ObjectId, ref: 'User'},
    Price: {type: Schema.Types.Number},
    Text: {type: String},
    Ask: {type: Schema.Types.ObjectId, ref: 'Ask'},
    Files:[]
})

module.exports = model('Offer', OfferSchema);