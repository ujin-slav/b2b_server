const { Double } = require('mongodb');
const {Schema, model} = require('mongoose');

const Ask = new Schema({
    Client: {type: String},
    Name: {type: String},
    Status: {type: String},
    Price: {type: Schema.Types.Number},
    FIO: {type: String},
    Telefon: {type: String},
    DeliveryTime: {type: Schema.Types.Number},
    DeliveryAddress: {type: String},
    EndDateOffers: {type: Date},
    Comment: {type:String},
    TextAsk: {type: String},
    Region: {type: String},
    Files: []
})

module.exports = model('Ask', Ask);