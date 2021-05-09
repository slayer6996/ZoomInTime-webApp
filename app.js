const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost:27017/meetingsDB", {useNewUrlParser:true, useUnifiedTopology:true})

const app = express()

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

const meetingsSchema = new mongoose.Schema({
    meetingName: String,
    date: String,
    time: String,
    link: String
})

const Meeting = new mongoose.model("Meeting", meetingsSchema)

app.get("/", function(req,res){
    Meeting.find({}, function(err,meetings){
        if(!err){
            res.render("home", {meetingInfo:meetings})
        }else{
            console.log(err)
        }
    })
})

app.post("/", function(req,res){
    const meetingInfo = new Meeting({
        meetingName:req.body.meetingName,
        date:req.body.date,
        time:req.body.time,
        link:req.body.link
    })
    meetingInfo.save()
    console.log(req.body)
    res.redirect("/")
})

app.post("/delete", function(req,res){
    const meetingID = req.body.delete
    Meeting.deleteOne({_id:meetingID}, function(err){
        if(!err){
            console.log("successfully deleted the meeting")
            res.redirect("/")
        }else{
            console.log(err)
        }
    })
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function(){
    console.log("server running")
})