const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');

const Price = new Schema({
    Code:{type: String},
    Name: {type: String},
    Price: {type: Number},
    Balance: {type: Number},
    Measure:{type: String},
    User:{type: Schema.Types.ObjectId, ref: 'User'},
    SpecOffer:{type: Schema.Types.ObjectId, ref: 'SpecOffer'},
    Date: {type: Date}
})

Price.plugin(mongoosePaginate);
//Price.plugin(mongoose_fuzzy_searching, { fields: ['Name'] });

module.exports = model('Price', Price);