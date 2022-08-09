const { Double } = require('mongodb');
const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const LastVisit = new Schema({
    User: {type: Schema.Types.ObjectId, ref: 'User'},
    Date: {type: Date},
})

module.exports = model('LastVisit', LastVisit);