const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();

// Create ONE server (this is what Railway exposes)
const server = http.createServer(app);

// Attach WebSocket to it
const wss = new WebSocket.Server({ server });

let host = null;
let players = {};

// Confirm server start
const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});

// WebSocket logic
wss.on("connection", (ws) => {
  console.log("🔥 WebSocket CLIENT CONNECTED");

  //console.log("RAW MESSAGE:", msg.toString());
ws.on("message", (msg) => {
    console.log("RAW TYPE:", typeof msg);
    console.log("RAW BUFFER:", msg);
    console.log("STRING:", msg.toString());

    try {
        const parsed = JSON.parse(msg.toString());
        console.log("PARSED OK:", parsed);
    } catch (e) {
        console.log("❌ JSON FAIL");
    }
});
  // ws.on("message", (msg) => {
  //   let data;

  //   try {
  //     data = JSON.parse(msg);
  //   } catch {
  //     return;
  //   }

  //   switch (data.type) {

  //     case "HOST_CONNECT":
  //       host = ws;
  //       console.log("Host connected");
  //       break;

  //     case "JOIN":
  //       const id = "p" + Date.now();
  //       players[id] = ws;
  //       ws.playerId = id;

  //       console.log("Player joined:", id);

  //       if (host) {
  //         host.send(JSON.stringify({
  //           type: "PLAYER_JOINED",
  //           playerId: id,
  //           name: data.name
  //         }));
  //       }
  //       break;

  //     case "SUBMIT_DRAWING":
  //       console.log("Drawing received");

  //       if (host) {
  //         host.send(JSON.stringify({
  //           type: "DRAWING_SUBMITTED",
  //           playerId: ws.playerId,
  //           image: data.image
  //         }));
  //       }
  //       break;

  //     case "VOTE":
  //       console.log("Vote received");

  //       if (host) {
  //         host.send(JSON.stringify({
  //           type: "VOTE_SUBMITTED",
  //           playerId: ws.playerId,
  //           targetId: data.drawingId
  //         }));
  //       }
  //       break;

  //     case "START_DRAW":
  //       broadcast({ type: "STATE", state: "DRAW" });
  //       break;

  //     case "START_VOTE":
  //       broadcast({ type: "STATE", state: "VOTE" });
  //       break;
  //   }
  // });

  ws.on("close", () => {
    console.log("Client disconnected");

    if (ws === host) {
      host = null;
      players = {};
      console.log("Host disconnected, reset");
    }
  });
});

function broadcast(msg) {
  Object.values(players).forEach(p => {
    if (p.readyState === WebSocket.OPEN) {
      p.send(JSON.stringify(msg));
    }
  });
}
