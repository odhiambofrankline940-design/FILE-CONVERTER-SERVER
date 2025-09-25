import express from "express";
import multer from "multer";
import { exec } from "child_process";
import fs from "fs";

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/api/convert", upload.single("file"), (req, res) => {
  const file = req.file;
  const target = req.body.target;

  if (!file) return res.status(400).send("No file uploaded");

  const inputPath = file.path;
  const outputPath = `${file.path}.${target}`;

  let command;

  if (["mp3", "mp4", "wav", "avi"].includes(target)) {
    command = `ffmpeg -i ${inputPath} ${outputPath}`;
  } else if (["pdf", "docx", "odt"].includes(target)) {
    command = `libreoffice --headless --convert-to ${target} --outdir uploads ${inputPath}`;
  } else {
    return res.status(400).send("Unsupported target format");
  }

  exec(command, (err) => {
    if (err) return res.status(500).send("Conversion failed: " + err);

    res.download(outputPath, (err) => {
      fs.unlinkSync(inputPath);
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
