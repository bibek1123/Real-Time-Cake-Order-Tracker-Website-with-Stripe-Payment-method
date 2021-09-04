const mongoose =require('mongoose')
const Schema = mongoose.Schema

const menuSchema = new Schema({
    name:  {type:String, require:true},
    image: {type:String, require:true},
    price: {type:Number, require:true},
    size:  {type:String, require:true}
})

module.exports = mongoose.model('Menu', menuSchema) // define  Model and export it


