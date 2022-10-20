const {Schema, model} = require('mongoose');

const UnreadStatusAsk = new Schema({
    PriceAskId:{type: Schema.Types.ObjectId, ref: 'PriceAsk'},
    AskId:{type: Schema.Types.ObjectId, ref: 'Ask'},
    To: {type: Schema.Types.ObjectId, ref: 'User'},
})

module.exports = model('UnreadStatusAsk', UnreadStatusAsk);