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
);

//Virtual fields. These are not stored on the database.

//Returns authors full name
AuthorSchema
.virtual('name')
.get(function() {
    return this.family_name + ', ' + this.first_name;
});

//Returns author's lifespan, AKA age at death
AuthorSchema
.virtual('lifespan')
.get(function() {
    return (this.date_of_death.getYear() - this.date_of_birth.getYear()).toString();
});

//Returns an url to access a unique instance of the model
AuthorSchema
.virtual('url')
.get(function() {
    return '/catalog/author/' + this._id;
});

module.exports = mongoose.model('Author', AuthorSchema);