const {Schema, model} = require('mongoose');

const UnreadInvitedPriceFiz = new Schema({
    PriceAsk: {type: Schema.Types.ObjectId, ref: 'PriceAsk'},
    To: {type: Schema.Types.ObjectId, ref: 'User'},
})

module.exports = model('UnreadInvitedPriceFiz', UnreadInvitedPriceFiz);