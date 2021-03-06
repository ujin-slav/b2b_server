const { Double } = require('mongodb');
const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

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
})

PriceAsk.plugin(mongoosePaginate);

module.exports = model('PriceAsk', PriceAsk);