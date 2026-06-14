const express=require("express");

const router=express.Router();

const sqlite3=require("sqlite3").verbose();

const bcrypt=require("bcrypt");

const {body,validationResult}=require("express-validator");

const db=new sqlite3.Database("database.db");

router.get("/",(req,res)=>{

res.redirect("/login");

});

router.get("/register",(req,res)=>{

res.render("register");

});

router.post("/register",

body("username").notEmpty(),

body("email").isEmail(),

body("password").isLength({min:6}),

async(req,res)=>{

const errors=validationResult(req);

if(!errors.isEmpty()){

return res.send("Validation Failed");

}

const {username,email,password}=req.body;

const hash=await bcrypt.hash(password,10);

db.run(

"INSERT INTO users(username,email,password) VALUES(?,?,?)",

[username,email,hash],

(err)=>{

if(err){

return res.send("User Already Exists");

}

res.redirect("/login");

}

);

});

router.get("/login",(req,res)=>{

res.render("login");

});

router.post("/login",(req,res)=>{

const {email,password}=req.body;

db.get(

"SELECT * FROM users WHERE email=?",

[email],

async(err,user)=>{

if(!user){

return res.send("Invalid Email");

}

const valid=await bcrypt.compare(password,user.password);

if(!valid){

return res.send("Wrong Password");

}

req.session.user=user;

res.redirect("/dashboard");

});

});

router.get("/dashboard",(req,res)=>{

if(!req.session.user){

return res.redirect("/login");

}

res.render("dashboard",{user:req.session.user});

});

router.get("/logout",(req,res)=>{

req.session.destroy();

res.redirect("/login");

});

module.exports=router;