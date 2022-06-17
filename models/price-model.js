const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const Price = new Schema({
    Code:{type: String},
    Name: {type: String},
    Price: {type: Number},
    Balance: {type: Number},
    Measure:{type: String},
    User:{type: Schema.Types.ObjectId, ref: 'User'},
    Date: {type: Date}
})

Price.plugin(mongoosePaginate);

module.exports = model('Price', Price);