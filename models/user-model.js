const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},
    resetLink: {type: String},
    name:{type: String},
    nameOrg: {type: String},
    INN: {type: String},
    adressOrg: {type: String}
})

module.exports = model('User', UserSchema);