const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ReviewOrg = new Schema({
    Host: {type: Schema.Types.ObjectId, ref: 'ReviewOrg'},
    Author: {type: Schema.Types.ObjectId, ref: 'User'},
    Text: {type: String},
    Org: {type: Schema.Types.ObjectId, ref: 'User'},
    Date: {type: Date},
    Update:{type: Date}
})

ReviewOrg.plugin(mongoosePaginate);

module.exports = model('ReviewOrg', ReviewOrg);