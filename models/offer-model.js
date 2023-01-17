const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");


const OfferSchema = new Schema({
    Author: {type: Schema.Types.ObjectId, ref: 'User'},
    Price: {type: Schema.Types.Number},
    Text: {type: String},
    Ask: {type: Schema.Types.ObjectId, ref: 'Ask'},
    AuthorAsk: {type: Schema.Types.ObjectId, ref: 'User'},
    Files:[],
    Date: {type: Date},
})

OfferSchema.plugin(mongoosePaginate);
OfferSchema.plugin(aggregatePaginate);
module.exports = model('Offer', OfferSchema);