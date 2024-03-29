const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const UserSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    isActivated: {type: Boolean, default: false},
    isAdmin: {type: Boolean, default: false},
    activationLink: {type: String},
    resetLink: {type: String},
    name:{type: String},
    nameOrg: {type: String},
    description:{type: String},
    telefon:{type: String},
    site:{type: String},
    inn: {type: String},
    adressOrg: {type: String},
    category: [],
    region: [],
    fiz:{type:Boolean},
    logo:{type:Object},
    notiInvited:{type:Boolean},
    notiMessage:{type:Boolean},
    notiAsk:{type:Boolean},
    banned:{type:Boolean},
    bannedTo:{type: Date},
    bannedReason:{type: String},
    registrationDate:{type: Date},
    getAskFromFiz:{type:Boolean},
})

UserSchema.plugin(mongoosePaginate);
module.exports = model('User', UserSchema);