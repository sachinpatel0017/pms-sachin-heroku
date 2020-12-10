const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const { schema } = require('./user');
mongoose.connect('mongodb://localhost/pms',{useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology:true,});
var conn =mongoose.Collection;
var passSchema =new mongoose.Schema({
    password_category: {type:String, 
        required: true,
        },
        project_name: {type:String, 
            required: true,
           },
        password_detail: {type:String, 
            required: true,
           },
    date:{
        type: Date, 
        default: Date.now }
});
passSchema.plugin(mongoosePaginate);
var passModel = mongoose.model('password_details', passSchema);
module.exports=passModel;
