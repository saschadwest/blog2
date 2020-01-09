var express = require("express"),
	app		= express(),
	bodyParser = require("body-parser"),
	colors		= require("colors"),
	mongoose	=require("mongoose"),
	methodOverride = require("method-override");


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));

//Configure Mongoose
mongoose.connect("mongodb://localhost:27017/blog47", { useNewUrlParser: true,useUnifiedTopology: true });


//SCHEMA
var blogSchema = new mongoose.Schema({
	Fname:String,
	Lname:String,
	image:{type:String, default:"https://images.unsplash.com/photo-1548623826-a1aa0a4d8a5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"},
	content:String,
	food:String,
	created:{type:Date, default:Date.now}
})

//MODEL
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
// 	title:"hohoffffff",
// })

app.get("/",function(req,res){
	res.redirect("/blogs");
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

app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/");
		}else{
			res.render("show",{blog:foundBlog});
		}
	})
})


// edit
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,editBlog){
		if(err){
			res.redirect("show");
		}else{
			res.render("edit",{blog:editBlog});
		}
	});
});
		
// we neeed something to take the date and update the data to the new form
//converter
app.put("/blogs/:id",function(req,res){
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updateBlog){
		if(err){
			res.redirect("index");
		}else{
			res.redirect("/blogs/"+req.params.id);
		}
	})
})

app.put("/blogs/:id",function(req,res){
	//this find id and data from form and updates and saves into db in new form Blog.findByIdAndUpdate(id,newData,callback) Remembe r this changes everything in db for paramID
	Blog.findByIdAndUpdate(req.params.id, req.body.blog,function(err,updatedBlog){
		req.body.blog.body = req.sanitize(req.body.blog.body);
		if(err){
			res.redirect("index");
		}else{
			res.redirect("/blogs/"+req.params.id);
		}
	})
});
		
app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/");
		}else{
			res.redirect("/blogs");
		}
	})
});

app.listen(3000,function(){
	console.log("Time to get creative".america);
});