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

//Display Author create form on GET.
exports.author_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create GET');
};

//Handle Author create on POST.
exports.author_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create POST');
};

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