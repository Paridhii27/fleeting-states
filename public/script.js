const express = require("express");
const path = require("path");
const osc = require("osc");

// Create an Express app
const app = express();
app.use(express.static(path.join(__dirname, "public")));

const PORT = 3000;

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
  remoteAddress: "127.0.0.1", // Send OSC messages to TouchDesigner (localhost)
  remotePort: 57120, // Port TouchDesigner is listening on
});

// Open the UDP port
udpPort.open();

// Serve the HTML file
app.get("/", (req, res) => {
  console.log("hi");
  res.sendFile(path.join(__dirname, "index.html"));
});

// Utility function to send OSC messages
function sendOscMessage(address, args) {
  udpPort.send({
    address,
    args,
  });
}

// Add a gate to a qubit
app.get("/add-gate", (req, res) => {
  console.log("gate trying to get added");
  const qubit = parseInt(req.query.qubit, 10);
  const gate = req.query.gate;

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Adding quibit images for their initial state
document.getElementById("quibitOne").src = "./assets/images/quibit1.png";
document.getElementById("quibitTwo").src = "./assets/images/quibit2.png";
document.getElementById("quibitThree").src = "./assets/images/quibit3.png";

// Adding the three quantum gates
document.getElementById("hadamard").src = "./assets/images/hadamard2.png";
document.getElementById("rotation").src = "./assets/images/rotation2.png";
document.getElementById("cnot").src = "./assets/images/cnot2.png";

// Creating draggable gates for the quantum network
var dragItems = document.querySelectorAll(".dragElement");
var dropZoneSet = Array.from(document.querySelectorAll(".dropZone"));

let originalParent, originalIndex;
let gateSelected;

function drag(event) {
  // Storing the ID of the dragged gate
  event.dataTransfer.setData("text/plain", event.target.id);
}

// Adding event listeners to each draggable gate to identify which gate is dragged
dragItems.forEach((gate) => {
  gate.addEventListener("dragstart", (e) => {
    originalParent = gate.parentNode;
    originalIndex = Array.from(originalParent.children).indexOf(gate);
    e.dataTransfer.setData("text/plain", e.target.id);
    document.getElementById("draggedGate").innerHTML =
      e.dataTransfer.getData("text/plain");
    if (e.dataTransfer.getData("text/plain") == "hadamard") {
      gateSelected = "hadamard";
      document.getElementById("errorCheck").innerHTML = "Added Hadamard";
      toggleHadamard(1, "Hadamard", "/add-gate");
    } else if (e.dataTransfer.getData("text/plain") == "rotation") {
      gateSelected = "rotation";
      document.getElementById("errorCheck").innerHTML = "Added Rotation";
      toggleHadamard(2, "rotation", "/add-gate");
    } else if (e.dataTransfer.getData("text/plain") == "cnot") {
      gateSelected = "cnot";
      document.getElementById("errorCheck").innerHTML = "Added CNOT";
      toggleHadamard(3, "cnot", "/add-gate");
    }

    // if (e.dataTransfer.getData("text/plain") == "hadamard"){
    //   document.getElementById("gate-description").innerHTML = "Hadamard Gate creates superposition in a qubit by turning into an equal mix of 0 and 1, and 1 into a similar combination with a phase difference. This gives equal chances of measuring 0 or 1."
    // }else if (e.dataTransfer.getData("text/plain") == "rotation"){

    // }else if (e.dataTransfer.getData("text/plain") == "cnot"){

    // }
    gate.classList.add("beingDragged");
  });

  gate.addEventListener("dragend", () => {
    gate.classList.remove("beingDragged");
  });
});

// Add event listeners to each quibit where the gates can be applied
dropZoneSet.forEach((dropZone) => {
  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    document.getElementById("testing").innerHTML = e.target.id;
    // dropZone.classList.add("hoverOver");
    if (e.target.id == "quibitOne") {
      document.getElementById("quibitOne").src =
        "./assets/images/quibit1Hover.png";
    } else if (e.target.id == "quibitTwo") {
      document.getElementById("quibitTwo").src =
        "./assets/images/quibit2Hover.png";
    } else if (e.target.id == "quibitThree") {
      document.getElementById("quibitThree").src =
        "./assets/images/quibit3Hover.png";
    }
  });

  dropZone.addEventListener("dragleave", () => {
    // dropZone.classList.remove("hoverOver");
    document.getElementById("quibitOne").src = "./assets/images/quibit1.png";
    document.getElementById("quibitTwo").src = "./assets/images/quibit2.png";
    document.getElementById("quibitThree").src = "./assets/images/quibit3.png";
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("hoverOver");
    var draggedElementId = e.dataTransfer.getData("text/plain");
    var draggedElement = document.getElementById(draggedElementId);
    dropZone.appendChild(draggedElement);
    draggedElement.style.position = "relative";
    draggedElement.style.zIndex = "10";

    if (e.target.id == "quibitOne") {
      document.getElementById("quibitOne").src =
        "./assets/images/quibit1Hover.png";
      toggleHadamard(1, gateSelected, "/add-gate");
      if (gateSelected == "hadamard") {
        document.getElementById("quibitOne").src =
          "./assets/images/q1Hadamard.png";
      } else if (gateSelected == "rotation") {
        document.getElementById("quibitOne").src =
          "./assets/images/q1Rotation.png";
      } else if (gateSelected == "cnot") {
        document.getElementById("quibitOne").src = "./assets/images/q1cnot.png";
      }
    } else if (e.target.id == "quibitTwo") {
      document.getElementById("quibitTwo").src =
        "./assets/images/quibit2Hover.png";
      toggleHadamard(2, gateSelected, "/add-gate");
      if (gateSelected == "hadamard") {
        document.getElementById("quibitTwo").src =
          "./assets/images/q2Hadamard.png";
      } else if (gateSelected == "rotation") {
        document.getElementById("quibitTwo").src =
          "./assets/images/q2Rotation.png";
      } else if (gateSelected == "cnot") {
        document.getElementById("quibitTwo").src = "./assets/images/q2cnot.png";
      }
    } else if (e.target.id == "quibitThree") {
      document.getElementById("quibitThree").src =
        "./assets/images/quibit3Hover.png";
      toggleHadamard(3, gateSelected, "/add-gate");
      if (gateSelected == "hadamard") {
        document.getElementById("quibitThree").src =
          "./assets/images/q3Hadamard.png";
      } else if (gateSelected == "rotation") {
        document.getElementById("quibitThree").src =
          "./assets/images/q3Rotation.png";
      } else if (gateSelected == "cnot") {
        document.getElementById("quibitThree").src =
          "./assets/images/q3cnot.png";
      }
    }
  });
});

//Pressing measure button to bring up the pop ups
measureBtn.addEventListener("click", function () {
  measureScreen.classList.add("show");
});
closePopup.addEventListener("click", function () {
  measureScreen.classList.remove("show");
});
window.addEventListener("click", function (event) {
  if (event.target == measureScreen) {
    measureScreen.classList.remove("show");
  }
});

quantumRes.addEventListener("click", function () {
  resultScreen.classList.add("show");
});
closeRes.addEventListener("click", function () {
  resultScreen.classList.remove("show");
});
window.addEventListener("click", function (event) {
  if (event.target == resultScreen) {
    resultScreen.classList.remove("show");
  }
});

// Function to handle checkbox changes
function toggleHadamard(qubit, gate, isChecked) {
  const url = `${isChecked}?qubit=${qubit}&gate=${gate}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
    })
    .catch((error) => console.error("Error:", error));
}
function toggleCNOT(qubit1, qubit2, gate, isChecked) {
  const endpoint = isChecked ? "/add-cnot" : "/remove-cnot";
  const url = `${endpoint}?qubit1=${qubit1}&qubit2=${qubit2}&gate=${gate}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
    })
    .catch((error) => console.error("Error:", error));
}
