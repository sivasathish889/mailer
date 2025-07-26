const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const nodemailer = require("nodemailer");
const PORT = process.env.PORT || 4000;

app.use(express.static("public"));
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
app.use(bodyParser.json());

app.get("/send-mail", async (req, res) => {
  try {
    const data = req.body;
    if (data.to && data.subject && data.text) {
      const emailRegEx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (emailRegEx.test(data.to)) {
        const transport = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
        });
        const mailOptions = {
          from: process.env.MAIL_USER,
          to: data.to,
          subject: data.subject,
          html: data.text,
        };
        transport.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
        return res.status(200).json({ message: "Email sent successfully" });
      } else {
        res.status(400).json({ message: "Email is not valid" });
      }
    } else {
      res.status(400).json({ message: "All fields are required" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
