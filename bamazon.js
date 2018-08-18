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
  var index = parseInt(input.product) - 1
  var quantity = parseInt(input.quantity)
  var query = connection.query("SELECT * FROM bamazon.products",
    function(err,resp) {
    if (err) throw (err)
    //Check values
    console.log("ID: "+index)
    console.log("Product: " + resp[index].product)
    console.log("Quantity Purchased: " + quantity)
    var price = parseInt(resp[index].price)
    console.log("Price: " + price)
      //Check if stock is there
      if (quantity > resp[index].stock) {
        console.log(newLine)
        console.log("Sorry! Insufficient Stock!")
      } else
      console.log(newLine)
      console.log("Thank you! Successful Sale!")
        var newStock = resp[index].stock - quantity
        connection.query("UPDATE bamazon.products SET ? WHERE ?",
        [{
            stock: newStock
         },{
            id: index
        }],
        function(err, resp) {
        if (err) throw (err)
        console.log(newLine)
        console.log("Updated Stock: " + newStock + " left")
        console.log(newLine)
        console.log("Transaction Receipt")
        console.log("Total cost: $" + (quantity * price))
        connection.end()
      })

    })
  })
}
