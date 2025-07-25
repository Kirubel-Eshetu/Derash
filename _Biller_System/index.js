import express from "express";
import session from 'express-session';
import bodyParser from "body-parser";
import axios from 'axios';

const app = express();
const port = 3001;
var authorize = false;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

function billUpload(req, res, next) {

    var userName = req.body["username"];
    var password = req.body["password"];

    if (userName === "Kirubelwinner@gmail.com" && password === "Biller#23") {
            authorize = true;
            next();
    }

    else {
        res.render("index.ejs", { credentialsError: "Invalid username or password." });
    }

}

app.use(session({
    secret: 'iknojx9uviygrsivhrc4qzcime765wzn20o9',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.get("/", (req, res) => {
    res.render("index.ejs");
});


app.post("/credentialssubmit", billUpload, (req, res) => {
    if (authorize) {
        res.render("billerpage.ejs");
    }
    else {
        res.redirect("/");
    }
});

const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiS0lSQUZJWCBURUNITk9MT0dJRVMiLCJzdWIiOiIyMTk2MzYiLCJwZXJtaXNzaW9ucyI6WyJCSUxMRVIiXSwiaXNzIjoiaHR0cHM6Ly9hcGkuZGVyYXNoLmdvdi5ldCIsImp0aSI6ImFmNDUzN2MwLTNhZWItMTFmMC05N2EwLTc1YjMzMTUzY2MyMSIsImlhdCI6MTc0ODM0NDQzOH0.HA7IuTArNO3IIbN3s7m9y2GMhNkMaKmJFgvkwNrZ7mU';
const apiSecret = 'aehv0vpk2dof3l85w778d7lvdtqxfvy3tu1l';

app.get("/getbill", async (req, res) => {
    const billIDInput = req.query["billId"];
    const apiUrl = `https://api.qa.derash.gov.et/biller/customer-bill-data?bill_id=${billIDInput}`;

    try {
        const response = await axios.get(apiUrl, {
            headers: {
                "api-key": apiKey,
                "api-secret": apiSecret,
            }
        });

        const billData = response.data;
        console.log(billData);
        res.render("billerpage.ejs", { billData: billData });
    } catch (error) {
        console.error(error);
        res.render("billerpage.ejs", { error: `There is no bill with bill ID of: ${billIDInput}` });
    }
});

app.post("/postbill", async (req, res) => {
    const billID = req.body["bill_id"];
    const billDesc = req.body["bill_desc"];
    const reason = req.body["reason"];
    const amountDue = req.body["amount_due"];
    const dueDate = req.body["due_date"];
    const partialPaymentAllowed = !!req.body["partial_pay_allowed"];
    const customerId = req.body["customer_id"];
    const name = req.body["name"];
    const mobile = req.body["mobile"];
    const email = req.body["email"];
    console.log(req.body);

    const apiURL = 'https://api.qa.derash.gov.et/biller/customer-bill-data';

    try {
        const response = await axios.post(apiURL, {
            bill_id: billID,
            bill_desc: billDesc,
            reason: reason,
            amount_due: amountDue,
            due_date: dueDate,
            partial_pay_allowed: partialPaymentAllowed,
            customer_id: customerId,
            name: name,
            mobile: mobile,
            email: email,
        }, {
            headers: {
                "api-key": apiKey,
                "api-secret": apiSecret,
                'Content-Type': 'application/json'
            }
        });

        console.log("Bill was created successfully");

        const confirmationCode = response.data.confirmation_code;

        res.render("billerpage.ejs", { billID, confirmationCode });

    } catch (errorUpload) {
        console.error("Error posting bill data:", errorUpload);
        if (errorUpload.response.data.statusCode === 409) {
            res.render("billerpage.ejs", { errorUpload: `There was an error uploading the bill because the bill id ${billID} already exists.` });
        }
        else if (errorUpload.response.data.statusCode === 400) {
            res.render("billerpage.ejs", { errorUpload: "There was an error uploading the bill because mobile number should be in 09XXXXXXXX or 07XXXXXXXX format." })
        }
        else {
            res.render("billerpage.ejs", { errorUpload: "There was an error uploading the bill." });
        }
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.render('billerpage.js');
        }
        res.render('index.ejs');
    });
});

app.listen(port, () => {
    console.log(`Server has started on port ${port}`);
});