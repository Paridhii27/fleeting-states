const express = require('express');
const path = require('path');
const osc = require('osc');

// Create an Express app
const app = express();
const PORT = 3000;

// Gate storage for each qubit
const gates = {
    1: [],
    2: [],
    3: []
};

// Set up OSC communication
const udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0", // Listen on all network interfaces
    localPort: 57121,        // Local port for incoming OSC messages
    remoteAddress: "127.0.0.1", // Send OSC messages to TouchDesigner (localhost)
    remotePort: 57120        // Port TouchDesigner is listening on
});

// Open the UDP port
udpPort.open();

// Serve fleetingstates.html when the root URL is accessed
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'fleetingstates.html'));
});

// Utility function to send OSC messages
function sendOscMessage(address, args) {
    udpPort.send({
        address,
        args
    });
}

// Add a gate to a qubit
app.get('/add-gate', (req, res) => {
    const qubit = req.query.qubit;
    const gate = req.query.gate;

    if (gates[qubit]) {
        if (!gates[qubit].includes(gate)) {
            gates[qubit].push(gate);

            // Send an OSC message for the added gate
            sendOscMessage(`/qubit/${qubit}/add`, [gate]);

            res.json({ message: `Gate ${gate} added to Qubit ${qubit}` });
        } else {
            res.status(400).json({ message: `Gate ${gate} already exists for Qubit ${qubit}` });
        }
    } else {
        res.status(400).json({ message: "Invalid Qubit" });
    }
});

// Remove a gate from a qubit
app.get('/remove-gate', (req, res) => {
    const qubit = req.query.qubit;
    const gate = req.query.gate;

    if (gates[qubit]) {
        const index = gates[qubit].indexOf(gate);
        if (index !== -1) {
            gates[qubit].splice(index, 1); // Remove the gate

            // Send an OSC message for the removed gate
            sendOscMessage(`/qubit/${qubit}/remove`, [gate]);

            res.json({ message: `Gate ${gate} removed from Qubit ${qubit}` });
        } else {
            res.status(400).json({ message: `Gate ${gate} does not exist for Qubit ${qubit}` });
        }
    } else {
        res.status(400).json({ message: "Invalid Qubit" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
