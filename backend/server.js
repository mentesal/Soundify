const express = require("express");
const axios = require("axios");
const multer = require("multer");
const cors = require("cors");
const crypto = require("crypto");
const fs = require("fs");

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

const accessKey = "YOUR_ACCESS_KEY";
const accessSecret = "YOUR_ACCESS_SECRET";
const host = "identify-eu-west-1.acrcloud.com"; // depends on region

app.post("/recognize", upload.single("audio"), async (req, res) => {
    try {
        const timestamp = Math.floor(Date.now() / 1000);
        const stringToSign = `POST\n/v1/identify\n${accessKey}\naudio\n1\n${timestamp}`;
        const signature = crypto
            .createHmac("sha1", accessSecret)
            .update(stringToSign)
            .digest("base64");

        const formData = new FormData();
        formData.append("access_key", accessKey);
        formData.append("sample_bytes", fs.readFileSync(req.file.path));
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);
        formData.append("data_type", "audio");
        formData.append("signature_version", "1");

        const response = await axios.post(
            `https://${host}/v1/identify`,
            formData,
            { headers: formData.getHeaders() }
        );

        fs.unlinkSync(req.file.path);

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Recognition failed" });
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

