const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const GisSchema = new Schema({
    Name: {type: String},
    Category: {type: String},
    Subcategory: {type: String},
    City: {type: String},
    Address: {type: String},
    Postcode: {type: String},
    Email: {type: String},
    Telefon: {type: String},
    Faks: {type: String},
    Site: {type: String},
})
GisSchema.plugin(mongoosePaginate);
module.exports = model('Gis', GisSchema);