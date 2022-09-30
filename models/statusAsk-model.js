const {Schema, model} = require('mongoose');

const StatusPriceAsk = new Schema({
    CrContract:[],
    SiContract:[],
    Paidfiles:[],
    Shipmentfiles:[],
    Receivedfiles:[],
    AskId:{type: Schema.Types.ObjectId, ref: 'Ask'},
    Status:{}
})

module.exports = model('StatusAsk', StatusPriceAsk);