const {Schema, model} = require('mongoose');

const UnreadSpecAsk = new Schema({
    SpecOffer: {type: Schema.Types.ObjectId, ref: 'SpecOffer'},
    To: {type: Schema.Types.ObjectId, ref: 'User'},
})

module.exports = model('UnreadSpecAsk', UnreadSpecAsk);