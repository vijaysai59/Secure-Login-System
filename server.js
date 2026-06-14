const express=require("express");
const session=require("express-session");

const app=express();

app.set("view engine","ejs");

app.use(express.urlencoded({extended:true}));

app.use(express.static("public"));

app.use(session({

secret:"securelogin",

resave:false,

saveUninitialized:false

}));

const authRoutes=require("./routes/auth");

app.use("/",authRoutes);

app.listen(3000,()=>{

console.log("Server Running");

});