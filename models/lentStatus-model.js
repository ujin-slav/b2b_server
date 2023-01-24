const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const LentStatus = new Schema({
    PriceAsk: {type: Schema.Types.ObjectId, ref: 'PriceAsk'},
    Ask: {type: Schema.Types.ObjectId, ref: 'Ask'},
    Author:{type: Schema.Types.ObjectId, ref: 'User'},
    Winner:{type: Schema.Types.ObjectId, ref: 'User'},
    PrevStatus:{},
    Date: {type: Date},
})

LentStatus.plugin(mongoosePaginate);
LentStatus.plugin(aggregatePaginate);
module.exports = model('LentStatus', LentStatus);