const webSocket = require("ws");
const wss = new webSocket.Server({ port: 8080 });

// Broadcast to all users
wss.broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === webSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.send("Welcome to the WebSocket server!");

  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
    // Broadcast the message to all connected clients
    wss.broadcast(message);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("WebSocket server running on ws://localhost:8080");
