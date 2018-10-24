//Load mongoose
var mongoose = require('mongoose');

//Define a new schema
var Schema = mongoose.Schema;

//Define the new schema as the AuthorSchema, and define the fields for the schema
//Type: format of data for the field
//Required: field must contain data to be saved
//Max: maximum length of data in the field
var AuthorSchema = new Schema(
    {
        first_name: {type: String, required: true, max: 100},
        family_name: {type: String, required: true, max: 100},
        date_of_birth: {type: Date},
        date_of_death: {type: Date},
    }
)