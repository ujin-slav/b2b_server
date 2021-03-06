const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const UserSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},
    resetLink: {type: String},
    name:{type: String},
    nameOrg: {type: String},
    telefon:{type: String},
    inn: {type: String},
    adressOrg: {type: String},
    category: [],
    region: [],
    fiz:{type:Boolean},
    notiInvited:{type:Boolean},
    notiMessage:{type:Boolean},
    notiQuest:{type:Boolean},
})

UserSchema.plugin(mongoosePaginate);
module.exports = model('User', UserSchema);