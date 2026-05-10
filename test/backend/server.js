require('dns').setDefaultResultOrder('ipv4first');
require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const multer = require("multer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// Gmail transporter (you can later switch to Mailgun)
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

// Send bulk emails (dashboard API)
app.post("/send-bulk", upload.single("image"), async (req, res) => {
  const { emails, subject, message } = req.body;

  const emailList = emails.split(",").map(e => e.trim());

  let results = [];

  for (let email of emailList) {
    try {
      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        html: `
          <h2>${subject}</h2>
          <p>${message}</p>
        `,
        attachments: req.file
          ? [
              {
                filename: req.file.originalname,
                content: req.file.buffer
              }
            ]
          : []
      });

      results.push({
        email,
        status: "sent",
        messageId: info.messageId
      });

    } catch (err) {
      results.push({
        email,
        status: "failed",
        error: err.message
      });
    }
  }

  res.json({
    success: true,
    results
  });
});

// app.listen(3000, () =>
//   console.log("Email Dashboard running on port 3000")
// );

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
