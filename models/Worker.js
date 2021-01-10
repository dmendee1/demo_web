const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WorkerSchema = new Schema({
    lastname: {type: String, required: true},
    firstname: {type: String, required: true},
    username : {type: String, required: true},
    password: {type: String, required: true},
    created: {type: Date, default: Date.now}
});

module.exports = Worker = mongoose.model('workers', WorkerSchema);