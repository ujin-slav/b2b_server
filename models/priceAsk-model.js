const { Double } = require('mongodb');
const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const PriceAsk = new Schema({
    Author: {type: Schema.Types.ObjectId, ref: 'User'},
    To: {type: Schema.Types.ObjectId, ref: 'User'},
    Table:[],
    Sum:{type:Number},
    Comment: {type:String},
    Sent:{type:Boolean},
    Date: {type: Date},
    FIZ:{type:Boolean},
    NameFiz: {type:String},
    EmailFiz: {type:String},
    TelefonFiz: {type:String},
    Status:{}
})

PriceAsk.plugin(mongoosePaginate);
PriceAsk.plugin(aggregatePaginate);
module.exports = model('PriceAsk', PriceAsk);