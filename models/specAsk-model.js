const { Double } = require('mongodb');
const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const SpecAsk = new Schema({
    Author: {type: Schema.Types.ObjectId, ref: 'User'},
    Name:{type:String},
    Email:{type:String},
    Telefon:{type:String},
    City:{type:String},
    FIZ:{type:Boolean},
    Comment:{type:String},
    Amount:{type:String},
    Date:{type: Date},
    Receiver:{type: Schema.Types.ObjectId, ref: 'User'},
    SpecOffer: {type: Schema.Types.ObjectId, ref: 'SpecOffer'}
})

SpecAsk.plugin(mongoosePaginate);

module.exports = model('SpecAsk', SpecAsk);