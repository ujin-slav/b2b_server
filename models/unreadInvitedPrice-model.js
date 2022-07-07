const {Schema, model} = require('mongoose');

const UnreadInvitedPrice = new Schema({
    PriceAsk: {type: Schema.Types.ObjectId, ref: 'PriceAsk'},
    To: {type: Schema.Types.ObjectId, ref: 'User'},
})

module.exports = model('UnreadInvitedPrice', UnreadInvitedPrice);