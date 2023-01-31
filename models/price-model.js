const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Price = new Schema({
    Code:{type: String},
    Name: {type: String},
    Price: {type: Number},
    Balance: {type: Number},
    Measure:{type: String},
    User:{type: Schema.Types.ObjectId, ref: 'User'},
    SpecOffer:{type: Schema.Types.ObjectId, ref: 'SpecOffer'},
    Date: {type: Date}
})

Price.plugin(mongoosePaginate);
Price.plugin(aggregatePaginate);
module.exports = model('Price', Price);