const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const ContactsSchema = new Schema({
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    contact : {type: Schema.Types.ObjectId, ref: 'User'}
})

ContactsSchema.plugin(mongoosePaginate);
ContactsSchema.plugin(aggregatePaginate);
module.exports = model('Contacts', ContactsSchema);