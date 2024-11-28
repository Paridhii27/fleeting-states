const express = require("express");
const path = require("path");
const osc = require("osc");
const cors = require("cors");

// Create an Express app
const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

// Gate storage for each qubit
const gates = {
  1: [],
  2: [],
  3: [],
};

// Set up OSC communication
const udpPort = new osc.UDPPort({
  localAddress: "0.0.0.0", // Listen on all network interfaces
  localPort: 57121, // Local port for incoming OSC messages
  remoteAddress: "172.20.10.6", // Send OSC messages to TouchDesigner (localhost)
  remotePort: 57120, // Port TouchDesigner is listening on
});

// Open the UDP port
udpPort.open();

// Serve the HTML file
app.get("/", (req, res) => {
  console.log("hi");
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use((req, res) => {
  res.status(404).send("Not Found"); // 404 handler
});

// Utility function to send OSC messages
function sendOscMessage(address, args) {
  udpPort.send({
    address,
    args,
  });
}

app.get("/", (req, res) => {
  console.log("Server started successfully!");
  res.send("Hello, world!");
});

// Add a gate to a qubit
app.get(["/add-gate", "/add-gate/"], (req, res) => {
  console.log("gate trying to get added");
  console.log("Incoming request:", req.query);
  const qubit = parseInt(req.query.qubit, 10);
  const gate = req.query.gate;

  if (!qubit || !gate) {
    res.status(400).json({ message: "Qubit or gate missing" });
  }

  if (gates[qubit]) {
    if (!gates[qubit].includes(gate)) {
      gates[qubit].push(gate);

      // Send an OSC message for the added gate
      sendOscMessage(`/qubit/${qubit}/add`, [gate, "Qubit" + qubit, 1]);

      res.json({ message: `Gate ${gate} added to Qubit ${qubit}` });
    } else {
      res
        .status(400)
        .json({ message: `Gate ${gate} already exists for Qubit ${qubit}` });
    }
  } else {
    res.status(400).json({ message: "Invalid Qubit" });
  }
});

// Remove a gate from a qubit
app.get("/remove-gate", (req, res) => {
  const qubit = parseInt(req.query.qubit, 10);
  const gate = req.query.gate;

  if (gates[qubit]) {
    const index = gates[qubit].indexOf(gate);
    if (index !== -1) {
      gates[qubit].splice(index, 1); // Remove the gate

      // Send an OSC message for the removed gate
      sendOscMessage(`/qubit/${qubit}/remove`, [gate, "Qubit" + qubit, 0]);

      res.json({ message: `Gate ${gate} removed from Qubit ${qubit}` });
    } else {
      res
        .status(400)
        .json({ message: `Gate ${gate} does not exist for Qubit ${qubit}` });
    }
  } else {
    res.status(400).json({ message: "Invalid Qubit" });
  }
});

app.get("/add-cnot", (req, res) => {
  const qubit1 = parseInt(req.query.qubit1, 10);
  const qubit2 = parseInt(req.query.qubit2, 10);
  const gate = req.query.gate;

  // Ensure the qubits are valid
  if (gates[qubit1] && gates[qubit2]) {
    // Push the gate to both qubits' gate lists
    gates[qubit1].push(gate);
    gates[qubit2].push(gate);

    // Send a single OSC message for the pair
    sendOscMessage("/add-cnot", [
      gate,
      `Qubit${qubit1}`,
      `Qubit${qubit2}`,
      1.0,
    ]);

    res.json({
      message: `Gate ${gate} added to Qubits ${qubit1} and ${qubit2}`,
    });
  } else {
    res.status(400).json({ message: "Invalid Qubits" });
  }
});

app.get("/remove-cnot", (req, res) => {
  const qubit1 = parseInt(req.query.qubit1, 10);
  const qubit2 = parseInt(req.query.qubit2, 10);
  const gate = req.query.gate;

  // Ensure the qubits are valid
  if (gates[qubit1] && gates[qubit2]) {
    // Remove the gate from both qubits' gate lists
    gates[qubit1] = gates[qubit1].filter(
      (existingGate) => existingGate !== gate
    );
    gates[qubit2] = gates[qubit2].filter(
      (existingGate) => existingGate !== gate
    );

    // Send a single OSC message for the removal
    sendOscMessage("/remove-cnot", [
      gate,
      `Qubit${qubit1}`,
      `Qubit${qubit2}`,
      0.0,
    ]);

    res.json({
      message: `Gate ${gate} removed from Qubits ${qubit1} and ${qubit2}`,
    });
  } else {
    res.status(400).json({ message: "Invalid Qubits" });
  }
});

app.get("/health", (req, res) => res.send("Server is healthy!"));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
