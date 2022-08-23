const {Schema, model} = require('mongoose');

const StatusPriceAsk = new Schema({
    Bilsfiles:[],
    Paidfiles:[],
    Shipmentfiles:[],
    Receivedfiles:[],
    PriceAskId:{type: String},
    Status:{}
})

module.exports = model('StatusPriceAsk', StatusPriceAsk);