const { spawn } = require("child_process");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const mic = require("mic");
const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
const apps = express();
apps.use(cors());
apps.use(bodyParser.json());
const say = require("say");

const { Readable } = require("stream");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);
ffmpeg.setFfmpegPath(ffmpegPath);

async function getGPTReply(data) {
  const reply = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: data }],
  });
  return {
    que: data,
    ans: reply.data.choices[0].message.content,
  };
}
apps.post("/ring", async (req, res) => {
  const { que, ans } = await getGPTReply(req.body.key);
  res.json({ que, ans });
});

apps.listen(3000, () => {
  console.log("Server Started");
});
