var express = require('express');
var router = express.Router();
var session = require('express-session');
var mysql = require('mysql');
var connection_details = require("../modules/connection_details");
var path = require('path');

//Made by Ruby.
//to get upload Product page.
// Create a MySQL connection pool
var connection = mysql.createPool({
  host: connection_details.host,
  user: connection_details.user,
  password: connection_details.password,
  database: connection_details.database
});

// Handle GET request to '/uploadProduct'
router.get('/', function(req, res, next) {
  // Check if the user is logged in
  if (!req.session.loggedIn) {
    return res.redirect("/login?error=Please login to view page!");
  }

  var userName = req.session.username;
  var message = req.query.message;
  var error = req.query.error;
  var loggedIn = req.session.loggedIn;
  var customerID = req.session.userID;

  // Execute database queries
  connection.query("SELECT * from products WHERE customerID = ?", [customerID], function(err, products) {
      // Render the page with fetched data
      res.render('uploadProduct', {
        title: 'uploadProduct',
        userName: userName,
        error: error,
        message: message,
        loggedIn: loggedIn,
        products: products
      });
    });
  });

  //changes by Conn
router.post('/upload', async function(req, res, next){
  var customerID = req.session.userID;
  var productName = req.body.productName;
  var price = parseFloat(req.body.price);

  //From my testing when the box is ticked the console log will say box?: on meaning it has been ticked.
  //So I made it check to see if it has been set to true or false.
  //https://stackoverflow.com/questions/9185937/form-submit-checkbox-sets-value-to-on-rather-than-true
  var hasBox = req.body.hasBox;
  console.log("Box?: "+hasBox);

  if(hasBox === 'on'){
    hasBox = true;
  }
  else{
    hasBox = false;
  }

  if(price <= 0){
    var errorMessage = "Price must be a positive value!";
    var encodedError = encodeURIComponent(errorMessage);
    return res.redirect("/uploadProduct?error=" + encodedError);
  }
  else if(productName.includes("<") || productName.includes(">") || productName.includes("!") || productName.includes("$") || productName.includes("{") || productName.includes("}")){
    var errorMessage = "Invalid product name!";
    var encodedError = encodeURIComponent(errorMessage);
    return res.redirect("/uploadProduct?error=" + encodedError);
  }
  else{
    connection.query("INSERT INTO products(productName, price, customerID, hasBox) VALUES ((?),(?),(?),(?));", [productName, price, customerID, hasBox]);
    var message = "Product uploaded!";
    var encodedMessage = encodeURIComponent(message);
    return res.redirect("/uploadProduct?message=" + encodedMessage);
  }
});

module.exports = router;
