//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');

const app = express();



app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

 mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');

const itemschema=new mongoose.Schema({
    data:String
});

const Item=new mongoose.model('Item',itemschema);
const listschema=new mongoose.Schema({name:String,items:[itemschema]});
const List=new mongoose.model("List",listschema);


const item1=new Item({
  data:"reqitem"
});
const item2=new Item({
  data:"reqitem"
});
const item3=new Item({
  data:"reqitem"
});

 const itemsarray=[item1,item2,item3];

app.get("/",async function(req, res) {

const day = date.getDate();
const itemlist= await Item.find();

  res.render("list.ejs", {listTitle: day, newListItems: itemlist});

});
app.get("/:customroute",async (req,res)=>{
    const customroute=req.params.customroute;
    const result=await List.findOne({name:customroute}).exec();
    if(result===null)
    {const newitem=new List({name:customroute,items:itemsarray});
      newitem.save();
      res.redirect("/"+customroute);}
    else 
     { 
        res.render("list.ejs",{listTitle:result.name,newListItems:result.items});
     }
})

app.post("/", async function(req, res){

   const reqitem = req.body.newItem;

    const newitem=new Item({
        data:reqitem
    })

     await newitem.save();
    
    res.redirect("/");
  
});

app.post("/delete",(req,res)=>{
  const id=req.body.checkclick;
 
  Item.findByIdAndRemove(id).exec();
  res.redirect("/");
})

// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

// app.get("/about", function(req, res){
//   res.render("about");
// });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
