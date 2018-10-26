//Load the validation modules
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

//Load the module containing the AuthorSchema
var Author = require('../models/author');

//Load the module to perform async operations
var async = require('async');

//Load the module containing the BookSchema
var Book = require('../models/book');

// Display list of all Authors.
exports.author_list = function(req, res, next) {

    //Finds all Author objects and sorts them via the family_name field
    //If successful, a list of authors is passed to the callback
    //Data is rendered into the author_list view
    Author.find()
      .sort([['family_name', 'ascending']])
      .exec(function (err, list_authors) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('author_list', { title: 'Author List', author_list: list_authors });
      });
  
  };

// Display detail page for a specific Author.
exports.author_detail = function(req, res, next) {

    //Perform async operations in parallel, ie. at the same time
    async.parallel({
        //Find the author object
        //Uses the id located in the request-object to find the author
        author: function(callback) {
            Author.findById(req.params.id)
              .exec(callback)
        },
        //Finds all the book objects that have the associated author id
        //Only gets the fields 'title' and 'summary'
        authors_books: function(callback) {
          Book.find({ 'author': req.params.id },'title summary')
          .exec(callback)
        },
    }, 
    //After the parallel operations have finished
    //this function is called
    function(err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.author==null) { // No results.
            var err = new Error('Author not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        //Renders the author_detail view
        //Passes the data gathered in the async-operations into the view
        res.render('author_detail', { title: 'Author Detail', author: results.author, author_books: results.authors_books } );
    });

};

// Display Author create form on GET.
// Uses author_form view
exports.author_create_get = function(req, res, next) {       
    res.render('author_form', { title: 'Create Author'});
};

// Handle Author create on POST.
exports.author_create_post = [

    //Validate fields.
    //isLength() checks that the string length is withing the accepted range
    //trim() ensures that whitespace is not accepted in the form
    //isAlphanumeric() checks that the string contaisn only letters and numbers
    //withMessage() specifies the error message to display if an error occurs
    //optional() allows to validate optional fields if they have been entered
    //checkFalsy; true, means that an empty string or null will be considered empty
    //isISO8601() checks that the date is compliant
    body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('family_name').isLength({ min: 1 }).trim().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601(),
    body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601(),

    // Sanitize fields.
    // escape() removes characters that may be used in scripting attacks
    // toDate() casts the values to the respective types in JS
    sanitizeBody('first_name').trim().escape(),
    sanitizeBody('family_name').trim().escape(),
    sanitizeBody('date_of_birth').toDate(),
    sanitizeBody('date_of_death').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        //Possible errors are stores into the errors-array
        //If it is empty there are no errors
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('author_form', { title: 'Create Author', author: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Create an Author object with escaped and trimmed data.
            var author = new Author(
                {
                    first_name: req.body.first_name,
                    family_name: req.body.family_name,
                    date_of_birth: req.body.date_of_birth,
                    date_of_death: req.body.date_of_death
                });
            author.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new author record.
                res.redirect(author.url);
            });
        }
    }
];

//Display Author delete form on GET.
exports.author_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete GET');
};

//Handle Author delete on POST.
exports.author_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete POST');
};

//Display Author update form on GET.
exports.author_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

//Handle Author update on POST.
exports.author_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
};