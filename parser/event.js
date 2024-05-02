const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    email:{
        type: String,
        unique: true,
        required:true
    },
    events:{
        type: String,
        default: ""
    }
})

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;