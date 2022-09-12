const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const LentStatus = new Schema({
    PriceAsk: {type: Schema.Types.ObjectId, ref: 'PriceAsk'},
    Ask: {type: Schema.Types.ObjectId, ref: 'Ask'},
    Author:{type: Schema.Types.ObjectId, ref: 'User'},
    Winner:{type: Schema.Types.ObjectId, ref: 'User'},
    PrevStatus:{},
    Date: {type: Date},
})

LentStatus.plugin(mongoosePaginate);

module.exports = model('LentStatus', LentStatus);