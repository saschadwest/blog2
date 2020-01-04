var express = require("express"),
	app		= express(),
	bodyParser = require("body-parser"),
	colors		= require("colors"),
	mongoose	=require("mongoose")


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

//Configure Mongoose
mongoose.connect("mongodb://localhost:27017/blog47", { useNewUrlParser: true,useUnifiedTopology: true });


//SCHEMA
var blogSchema = new mongoose.Schema({
	Fname:String,
	Lname:String,
	image:{type:String, default:"https://images.unsplash.com/photo-1548623826-a1aa0a4d8a5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"},
	content:String,
	favFood:String,
	created:{type:Date, default:Date.now}
})

//MODEL
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
// 	title:"hohoffffff",
// })

app.get("/",function(req,res){
	res.redirect("/blog");
})

app.get("/blogs",function(req,res){
	// add images from DB to page
	Blog.find({},function(err,blogs){
		if(err){
			console.log(err);
		}else{
			res.render("index",{blogs:blogs})
		}
	})
});

app.get("/blogs/new",function(req,res){
	// create form
	res.render("new");
})

app.post("/blogs",function(req,res){
	//Creat Blog based on input from from
	// SAVE TO DB + RDRCT to /blog to add
	Blog.create(req.body.blog,function(err,newBlog){
		if(err){
			console.log(err);
		}else{
			res.redirect("/blogs");
		}
	})
})


app.listen(3000,function(){
	console.log("Time to get creative".america);
});