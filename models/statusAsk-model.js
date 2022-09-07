const {Schema, model} = require('mongoose');

const StatusPriceAsk = new Schema({
    Bilsfiles:[],
    Paidfiles:[],
    Shipmentfiles:[],
    Receivedfiles:[],
    AskId:{type: Schema.Types.ObjectId, ref: 'Ask'},
    Status:{}
})

module.exports = model('StatusAsk', StatusAsk);