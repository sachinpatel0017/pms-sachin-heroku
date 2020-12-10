  
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pms',{useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology:true,});
var conn =mongoose.Collection;
var passcatSchema =new mongoose.Schema({
    passord_category: {type:String, 
        required: true,
    },

    date:{
        type: Date, 
        default: Date.now }
});

var passCateModel = mongoose.model('password_categories', passcatSchema);
module.exports=passCateModel;