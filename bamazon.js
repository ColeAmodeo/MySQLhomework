var mysql  = require("mysql");
var inquirer = require("inquirer");
var newLine = "\n +++++++++++++++++++++ \n"


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "elocaroze36",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  logStock();
  
});


function logStock() {
  var query = connection.query("SELECT * FROM bamazon.products",
  function(err,resp) {
         if (err) throw (err)
         for (i = 0; i < resp.length; i++) {
           console.log(newLine)
           console.log('ID: ' + resp[i].id)
           console.log('Product: ' + resp[i].product)
           console.log('Price: ' + resp[i].price + " $CAD")
         }
         startApp()
  })
}

function startApp() {
  inquirer.prompt([
    {type: "input",
    name: "product",
    message: "Using the afforementioned IDs, which product would you like to purchase?"},
    {type: "input",
    name: "quantity",
    message: "How much of the product would you like to purchase?"
  }
]).then(function(input){
  var index = input.product - 1
  var quantity = input.quantity
  var query = connection.query("SELECT * FROM bamazon.products",
  function(err,resp) {
         if (err) throw (err)
         if (quantity > resp[index].quantity) {
           console.log(newLine)
           console.log("Sorry! Insufficient Stock!")
         }
  })


})
}
