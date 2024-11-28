// const Hadamard = {
//   name: "Hadamard",
//   description: "",
// };

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
        document.getElementById("status").innerHTML = "Success!";
        document.getElementById("gate-description").innerHTML =
          "Adding a <b>Hadamard</b> to a qubit is like arriving at a crossroads where you can go left or right. Normally, if you're following GPS, you'd take one clear path: left or right. But a Hadamard gate throws you into superposition, where you prepare to take both paths at once — left and right. It’s like you’re mentally planning to explore both routes to see where they lead, but you haven’t committed yet. When you eventually measure your decision (like checking your destination on the map), you'll find yourself on just one of the roads — either left or right.";
      } else if (gateSelected == "rotation") {
        document.getElementById("quibitOne").src =
          "./assets/images/q1Rotation.png";
        document.getElementById("status").innerHTML = "Success!";
        document.getElementById("gate-description").innerHTML =
          "A rotation gate";
      } else if (gateSelected == "cnot") {
        document.getElementById("quibitOne").src = "./assets/images/q1cnot.png";
        document.getElementById("status").innerHTML = "Success!";
        document.getElementById("gate-description").innerHTML =
          "The CNOT is like driving with a friend whose route depends on yours. If you go left, they stick to their plan. But if you go right, they flip their choice — left becomes right, and right becomes left. This creates entanglement, where the two of you are connected so that knowing one’s direction instantly tells you the other’s. Even if you’re far apart, your paths are always linked.";
      }
    } else if (e.target.id == "quibitTwo") {
      document.getElementById("quibitTwo").src =
        "./assets/images/quibit2Hover.png";
      toggleHadamard(2, gateSelected, "/add-gate");
      if (gateSelected == "hadamard") {
        document.getElementById("quibitTwo").src =
          "./assets/images/q2Hadamard.png";
        document.getElementById("status").innerHTML = "Success!";
        document.getElementById("gate-description").innerHTML =
          "Adding a Hadamard to a qubit is like arriving at a crossroads where you can go left or right. Normally, if you're following GPS, you'd take one clear path: left or right. But a Hadamard gate throws you into superposition, where you prepare to take both paths at once — left and right. It’s like you’re mentally planning to explore both routes to see where they lead, but you haven’t committed yet. When you eventually measure your decision (like checking your destination on the map), you'll find yourself on just one of the roads — either left or right.";
      } else if (gateSelected == "rotation") {
        document.getElementById("quibitTwo").src =
          "./assets/images/q2Rotation.png";
      } else if (gateSelected == "cnot") {
        document.getElementById("quibitTwo").src = "./assets/images/q2cnot.png";
        document.getElementById("status").innerHTML = "Success!";
        document.getElementById("gate-description").innerHTML =
          "The CNOT is like driving with a friend whose route depends on yours. If you go left, they stick to their plan. But if you go right, they flip their choice — left becomes right, and right becomes left. This creates entanglement, where the two of you are connected so that knowing one’s direction instantly tells you the other’s. Even if you’re far apart, your paths are always linked.";
      }
    } else if (e.target.id == "quibitThree") {
      document.getElementById("quibitThree").src =
        "./assets/images/quibit3Hover.png";
      toggleHadamard(3, gateSelected, "/add-gate");
      if (gateSelected == "hadamard") {
        document.getElementById("quibitThree").src =
          "./assets/images/q3Hadamard.png";
        document.getElementById("status").innerHTML = "Success!";
        document.getElementById("gate-description").innerHTML =
          "Adding a Hadamard to a qubit is like arriving at a crossroads where you can go left or right. Normally, if you're following GPS, you'd take one clear path: left or right. But a Hadamard gate throws you into superposition, where you prepare to take both paths at once — left and right. It’s like you’re mentally planning to explore both routes to see where they lead, but you haven’t committed yet. When you eventually measure your decision (like checking your destination on the map), you'll find yourself on just one of the roads — either left or right.";
      } else if (gateSelected == "rotation") {
        document.getElementById("quibitThree").src =
          "./assets/images/q3Rotation.png";
        document.getElementById("status").innerHTML = "Success!";
      } else if (gateSelected == "cnot") {
        document.getElementById("quibitThree").src =
          "./assets/images/q3cnot.png";
        document.getElementById("status").innerHTML = "Success!";
        document.getElementById("gate-description").innerHTML =
          "The CNOT is like driving with a friend whose route depends on yours. If you go left, they stick to their plan. But if you go right, they flip their choice — left becomes right, and right becomes left. This creates entanglement, where the two of you are connected so that knowing one’s direction instantly tells you the other’s. Even if you’re far apart, your paths are always linked.";
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
function toggleHadamard(qubit, gate, route = "/add-gate") {
  const url = `https://measured-values-interface.onrender.com${route}?qubit=${qubit}&gate=${gate}`;
  // const url = `https://measured-values-interface.onrender.com${isChecked}?qubit=${qubit}&gate=${gate}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          console.error("Error Response Text:", text);
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        });
      }
      return response.json();
    })
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
