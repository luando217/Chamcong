require("dotenv").config(); // Load biến môi trường từ file .env

const express = require("express");
const bodyParser = require("body-parser");
const { Client, GatewayIntentBits, Partials } = require("discord.js");

const app = express();
app.use(bodyParser.json());

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

if (!DISCORD_BOT_TOKEN) {
  console.error("❌ DISCORD_BOT_TOKEN không tồn tại trong .env!");
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
  partials: [Partials.Channel], // Cần thiết để gửi tin nhắn DM
});

client.once("ready", () => {
  console.log(`🤖 Bot đã đăng nhập thành công: ${client.user.tag}`);
});

client.login(DISCORD_BOT_TOKEN);

// Webhook endpoint để nhận dữ liệu từ AppSheet
app.post("/webhook", async (req, res) => {
  const data = req.body;
  console.log("📥 Webhook received:", data);

  const userId = data.discord_id;
  const username = data.USERNAME || "Chưa có tên";
  const gioden = data.Gioden || "Không rõ";
  const denlate = data.Denlate || "Không xác định";

  const messageText =
    `✅ Cám ơn bạn đã chấm công!\n\n` +
    `**Họ và Tên:** ${username}\n` +
    `**Đến lúc:** ${gioden}\n` +
    `--------------------------\n` +
    `📌 **Trạng thái đi trễ:** ${denlate}`;

  try {
    const user = await client.users.fetch(userId);
    await user.send(messageText);
    console.log(`✅ Đã gửi DM tới user ${user.tag} (${userId})`);
    res.status(200).send("Gửi tin nhắn thành công.");
  } catch (error) {
    console.error("❌ Lỗi khi gửi DM:", error);
    res.status(500).send(`Không thể gửi DM: ${error.message}`);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại cổng ${PORT}`);
});
