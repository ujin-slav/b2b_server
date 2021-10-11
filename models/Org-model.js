const { Double } = require('mongodb');
const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const Org = new Schema({
    NameOrg: {type: String},
    INN: {type: String},
    KPP: {type: String},
    Address: {type: String},
    Surname: {type: String},
    Name: {type: String},
    Patron: {type: String},
    Category: {type: String},
    Telefon: {type: String},
    email:{type: String},
    Debt: {type: String},
    Price: {type: String},
    OKPO: {type: String},
    Site: {type: String} 
  },)

  Org.plugin(mongoosePaginate); 

module.exports = model('Org', Org);