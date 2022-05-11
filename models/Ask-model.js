const { Double } = require('mongodb');
const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const Ask = new Schema({
    Author: {type: Schema.Types.ObjectId, ref: 'User'},
    Name: {type: String},
    MaxPrice: {type: Schema.Types.Number},
    Telefon: {type: String},
    MaxDate: {type: Schema.Types.Number},
    EndDateOffers: {type: Date},
    Text: {type: String},
    Category: [],
    Region: [],
    Files: [],
    Private: {type: Boolean},
    Send: {type: Boolean},
    Hiden: {type: Boolean},
    Party:{type: String},
    Comment: {type:String},
    Date: {type: Date},
})

Ask.plugin(mongoosePaginate);

module.exports = model('Ask', Ask);