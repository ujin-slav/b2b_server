const { Double } = require('mongodb');
const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const PriceAsk = new Schema({
    Author: {type: Schema.Types.ObjectId, ref: 'User'},
    To: {type: Schema.Types.ObjectId, ref: 'User'},
    Table:[],
    Comment: {type:String},
    Date: {type: Date},
})

PriceAsk.plugin(mongoosePaginate);

module.exports = model('PriceAsk', PriceAsk);