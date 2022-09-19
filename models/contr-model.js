const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


const ContrSchema = new Schema({
    User: {type: Schema.Types.ObjectId, ref: 'User'},
    Contragent:{type: Schema.Types.ObjectId, ref: 'User'},
    Name: {type: String},
    Email: {type: String},
})

ContrSchema.plugin(mongoosePaginate);
module.exports = model('Contr', ContrSchema);