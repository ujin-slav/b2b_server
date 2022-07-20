const { Double } = require('mongodb');
const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const SpecAsk = new Schema({
    Name:{type:String},
    Email:{type:String},
    Telefon:{type:String},
    City:{type:String},
    Comment:{type:String},
    Amount:{type:String},
    Receiver:{type: Schema.Types.ObjectId, ref: 'User'},
    SpecOffer: {type: Schema.Types.ObjectId, ref: 'SpecOffer'}
})

SpecAsk.plugin(mongoosePaginate);

module.exports = model('SpecAsk', SpecAsk);