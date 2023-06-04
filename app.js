const express = require("express");
const request = require("request");
const bodyparser = require("body-parser");
const path = require('path');
const https = require('https');
const bodyParser = require("body-parser");

const app = express();
app.use(express.urlencoded({extended: true})); 
app.use(express.json());
app.use(express.static("public"));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '\signup.html'));
});

app.post('/', function(req,res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const Email = req.body.email;
    const data = {
      members: [
        {
            email_address: Email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }
      ]
    };
    
    
    const jsonData = JSON.stringify(data);
    const url = "https://us12.api.mailchimp.com/3.0/lists/#ADD KEY";
    const options = {
        method: "POST",
        auth: "karunesh1:#API KEY"
    }

    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        });          
    });
    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req,res){
    res.redirect("/");
})

app.listen(3000, function(){ 
    console.log("server started on port 3000");
});
