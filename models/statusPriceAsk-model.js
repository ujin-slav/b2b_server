const {Schema, model} = require('mongoose');

const StatusPriceAsk = new Schema({
    Bilsfiles:[],
    Paidfiles:[],
    Shipmentfiles:[],
    Receivedfiles:[],
    PriceAskId:{type: Schema.Types.ObjectId, ref: 'PriceAsk'},
    Status:{}
})

module.exports = model('StatusPriceAsk', StatusPriceAsk);