const { Double } = require('mongodb');
const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const SpecOffer = new Schema({
    Author: {type: Schema.Types.ObjectId, ref: 'User'},
    Name: {type: String},
    Price:{type:Number},
    NameOrg: {type: String},
    Inn: {type: String},
    Contact:{type: String},
    Telefon: {type: String},
    MaxDate: {type: Schema.Types.Number},
    EndDateOffers: {type: Date},
    Text: {type: String},
    Category: [],
    Region: [],
    Files: [],
    Date: {type: Date},
})

SpecOffer.plugin(mongoosePaginate);

module.exports = model('SpecOffer', SpecOffer);