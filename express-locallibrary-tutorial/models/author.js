//Load mongoose
var mongoose = require('mongoose');

//Load moment for formatting
var moment = require('moment');

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

//Returns the author's lifespan with formatted dates
AuthorSchema
.virtual('lifespan_formatted')
.get(function() {
    return (moment(this.date_of_birth).format('MMMM Do, YYYY').toString() 
    + ' - ' + moment(this.date_of_death).format('MMMM Do, YYYY').toString());
});

//Seperate formatted dates for birth and death
AuthorSchema
.virtual('date_of_birth_yyyy_mm_dd')
.get(function () {
  return moment(this.date_of_birth).format('YYYY-MM-DD');
});

AuthorSchema
.virtual('date_of_death_yyyy_mm_dd')
.get(function () {
  return moment(this.date_of_death).format('YYYY-MM-DD');
});

//Returns an url to access a unique instance of the model
AuthorSchema
.virtual('url')
.get(function() {
    return '/catalog/author/' + this._id;
});

module.exports = mongoose.model('Author', AuthorSchema);