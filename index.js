// console.log("HIHIHI")
const express = require("express");
const app = express();//like object creation
const cors = require('cors');
var countVar = 10;
app.use(cors());
// app.use(function (req, res, next) {
//     if (req.headers['x-forwarded-proto'] === 'https') {
//       res.redirect('http://' + req.hostname + req.url);
//     } else {
//       next();
//     }
//   });

app.get("/", function (req, res) {
    var date1 = new Date();
    date = date1.getDate();
    res.send("Welcome to My WEB " + date);
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

setInterval(function () {
    countVar++;

    const Vonage = require('@vonage/server-sdk')
    const vonage = new Vonage({
    apiKey: "47a1e973",
    apiSecret: "R5O7b9a8PCcsCQQB"
    })

    const from = "Vonage APIs"
    const to = "917440502909"
    const text = 'Vaccines are available now'

    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var request = new Array(5);
    var count = -1;
    var date = new Date();
    year = date.getFullYear();
    month = date.getMonth();
    date = date.getDate();
    var ddmmyy = `${date}-${month + 1}-${year}`

    for (let i = 0; i < 5; i++) {
        request[i] = new XMLHttpRequest();
        request[i].open("GET", `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=481001&date=${date+i}-5-2021`, true);

        request[i].onload = function () {
            // console.log(request[i])
            try {
                var data = JSON.parse(request[i].responseText);
                data.sessions.forEach(element => {
                    console.log("Tyring..")
                    checkAndSend(element)
                });
            } catch (err) {
                // console.log(err)
            }
        }
        request[i].send();
    }


    function checkAndSend(element) {
        if (element.min_age_limit == 18) {
            if (element.available_capacity > 5) {
                // console.log(element)
                vonage.message.sendSms(from, to, text, (err, responseData) => {
                    if (err) {
                        console.log(err);
                    } else {
                        if (responseData.messages[0]['status'] === "0") {
                            console.log("Message sent successfully.");
                        } else {
                            console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
                        }
                    }
                })
            }
        }
    }


}, 15000);//wait 2 seconds