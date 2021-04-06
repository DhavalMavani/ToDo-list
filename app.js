//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();

mongoose.connect("mongodb+srv://taylor-swift:qwert67890@cluster0.tt9yc.mongodb.net/ToDo_list", { useUnifiedTopology: true, useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const itemsSchema = new mongoose.Schema({
  name: String,
});

const List = mongoose.model("List",itemsSchema);

const item1 = new List({
  name: "Taylor"
});

const item2 = new List({
  name: "Betty"
});

const item3 = new List({
  name: "Dorthea"
});

const tay = [item1, item2, item3];


app.set('view engine', 'ejs');

var today=new Date();
app.get("/", function(req, res) {

  List.find({/* condition*/},function(err,data){
    if (err) {
      console.log(err);
    }
    else if (data.length === 0) {
        List.insertMany(tay ,function(err){
          if(err){
            console.log(err);
          }
          else{
            console.log("Sucessfully saved all the data");
          }
        });
        res.redirect("/");
    }
    else {
      res.render("list", {listTitle: today.toLocaleDateString("en-US",{day:"numeric",month:"short",year:"numeric"}), newListItems: data});
      //console.log(data);
      //mongoose.connection.close();
    }
  });
});

app.post("/", function(req, res){

  const task = req.body.newItem;

  const item = new List({
    name: task
  });

  item.save();
  res.redirect("/");

});

app.post("/delete", function(req, res){

  const q=req.body.deleted_item;

  List.deleteOne({_id:q},function(err){
  if (err) {
    console.log(err);
  }
  else {
    console.log("Seccessfully deleted");
  }
});

  res.redirect("/")

});



app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);

app.listen(port, function() {
  console.log("Server started successfuly");
});
