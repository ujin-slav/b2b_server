const {Schema, model} = require('mongoose');

const ContrSchema = new Schema({
    User: {type: Schema.Types.ObjectId, ref: 'User'},
    Name: {type: String},
    Email: {type: String},
})

module.exports = model('Contr', ContrSchema);