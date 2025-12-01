require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");

const { selectionTemplate, rejectionTemplate } = require("./emailTemplates");

const app = express();
app.use(express.json());
app.use(cors());

// I am Serving frontend here
app.use(express.static(path.join(__dirname, "public")));
const port = process.env.PORT || 5000;

// this I am using to replace the placeholders mentioned in emailTemplates file
function fillTemplate(template, name, position) {
  return template
    .replace("[Candidate Name]", name)
    .replace("[Position]", position);
}
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.post("/preview", (req, res) => {
  const { status, name, position } = req.body;
  const template =
    status === "selected" ? selectionTemplate : rejectionTemplate;
  res.json({ preview: fillTemplate(template, name, position) });
});

app.post("/send-email", async (req, res) => {
  const { status, name, email, position } = req.body;
  const template =
    status === "selected" ? selectionTemplate : rejectionTemplate;
  const finalEmail = fillTemplate(template, name, position);

  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sabamoin419@gmail.com",
        pass: process.env.MAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: "HR Team sabamoin419@gmail.com>",
      to: email,
      subject:
        status === "selected" ? "Selection Confirmation" : "Application Update",
      text: finalEmail,
    });

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

app.listen(port, () => console.log(`Server running on ${port}`));
