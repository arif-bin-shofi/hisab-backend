import dotenv from "dotenv";
import app from "./app.js";
import os from "os";
import { connectDB } from "./config/db.js";

dotenv.config();

connectDB();

const PORT = process.env.PORT || 5000;



// 🔹 Get Local IP Function
const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  
  for (let name of Object.keys(interfaces)) {
    for (let net of interfaces[name]) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  
  return "localhost";
};

app.listen(PORT, () => {
  const localIP = getLocalIP();

  console.log("=================================");
  console.log(`🚀 Server Running on:`);
  console.log(`👉 Local:   http://localhost:${PORT}`);
  console.log(`👉 Network: http://${localIP}:${PORT}`);
  console.log("=================================");
});