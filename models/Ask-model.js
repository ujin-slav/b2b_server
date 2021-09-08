const { Double } = require('mongodb');
const {Schema, model} = require('mongoose');

const Ask = new Schema({
    Client: {type: String},
    Name: {type: String},
    Status: {type: String},
    Price: {type: Schema.Types.Number},
    FIO: {type: String},
    Telefon: {type: String},
    DeliveryTime: {type: String},
    DeliveryAddress: {type: String},
    TermsPayments: {type:String},
    EndDateOffers: {type: Date},
    Comment: {type:String},
    TextAsk: {type: String},
    Files: []
})

module.exports = model('Ask', Ask);