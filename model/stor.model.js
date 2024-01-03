import mongoose from "mongoose";

let schema = new mongoose.Schema({
    suraNum: {
        type: Number,
        default:0
    },
    ayaNum: {
        type: Number,
        default: 0
    }
})

export let DataSchema = new mongoose.model("stor", schema)