const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const OfferSchema = new Schema({
    Author: {type: Schema.Types.ObjectId, ref: 'User'},
    Price: {type: Schema.Types.Number},
    Text: {type: String},
    Ask: {type: Schema.Types.ObjectId, ref: 'Ask'},
    Files:[],
    Date: {type: Date},
})

OfferSchema.plugin(mongoosePaginate);

module.exports = model('Offer', OfferSchema);