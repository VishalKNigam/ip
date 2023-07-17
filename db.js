const mongoose = require("mongoose");
const connection = mongoose.connect("mongodb+srv://vishalnigam1407:vishal1995@cluster0.tynh4fa.mongodb.net/ipApp?retryWrites=true&w=majority")
module.exports = {connection}