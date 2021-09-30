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
    Comment: {type:String},
    Text: {type: String},
    Category: [],
    Region: [],
    Files: [],
    Date: {type: Date},
})

Ask.plugin(mongoosePaginate);

module.exports = model('Ask', Ask);