// const Hadamard = {
//   name: "Hadamard",
//   description: "",
// };

// dropZoneSet.forEach((dropZone) => {
//   const gateDrag = dropZone.querySelector(".dragElement");
//   dropZone.addEventListener("dragover", (e) => {
//     e.preventDefault();
//     dropZone.classList.add("hoverOver");
//     if (gateDrag) {
//       imageElement.src = "./assets/images/quibit2Hover.png"; // New image path
//     }
//     // dropZone.style.backgroundImage = "url('./assets/images/quibit2Hover.png')";
//   });

//   dropZone.addEventListener("drop", (e) => {
//     e.preventDefault();
//     dropZone.classList.remove("hoverOver");

//     // Append the dragged item to the drop zone and ensure visibility
//     dropZone.appendChild(dragItem);
//     dragItem.style.position = "relative"; // Ensure proper positioning
//     dragItem.style.zIndex = "10"; // Make it appear on top
//   });
// });

// dragItem.addEventListener("dragstart", (e) => {
//   // Clone the dragged element and append it to the original parent
//   originalParent = dragItem.parentNode;
//   originalIndex = Array.from(originalParent.children).indexOf(dragItem);
//   let clone = dragItem.cloneNode(true);
//   clone.classList.remove("beingDragged"); // Ensure the cloned element doesn't have the dragged class
//   originalParent.insertBefore(clone, originalParent.children[originalIndex]);
//   dragItem.parentNode.appendChild(clone);

//   // Reattach event listeners to the clone
//   addDragListeners(clone);
// });

// dragItem.addEventListener("drag", () => {
//   dragItem.classList.add("beingDragged");
// });

// dragItem.addEventListener("dragend", () => {
//   dragItem.classList.remove("beingDragged");
// });

// // When a gate is dragged and dropped on a quibit, attaching the drag element to another one of the same gate to add to another quibit.
// dragItem.addEventListener("dragstart", (e) => {
//   originalParent = dragItem.parentNode;
//   originalIndex = Array.from(originalParent.children).indexOf(dragItem);

//   // Optionally clone the dragged item if needed
//   let clone = dragItem.cloneNode(true);
//   clone.classList.remove("beingDragged");
//   originalParent.insertBefore(clone, originalParent.children[originalIndex]);

//   dragItem.style.opacity = "0.5"; // Visual feedback
// });

// dragItem.addEventListener("drag", () => {
//   dragItem.classList.add("beingDragged");
// });

// dragItem.addEventListener("dragend", () => {
//   dragItem.style.opacity = "1"; // Reset visual feedback
//   dragItem.classList.remove("beingDragged");
// });

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
let audioFile;

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
    // document.getElementById("draggedGate").innerHTML =
    //   e.dataTransfer.getData("text/plain");
    if (e.dataTransfer.getData("text/plain") == "hadamard") {
      gateSelected = "hadamard";
      // document.getElementById("errorCheck").innerHTML = "Added Hadamard";
      toggleHadamard(1, "Hadamard", "/add-gate");
    } else if (e.dataTransfer.getData("text/plain") == "rotation") {
      gateSelected = "rotation";
      // document.getElementById("errorCheck").innerHTML = "Added Rotation";
      toggleHadamard(2, "rotation", "/add-gate");
    } else if (e.dataTransfer.getData("text/plain") == "cnot") {
      gateSelected = "cnot";
      // document.getElementById("errorCheck").innerHTML = "Added CNOT";
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
    // document.getElementById("testing").innerHTML = e.target.id;
    // dropZone.classList.add("hoverOver");
    if (e.target.id == "quibitOne") {
      document.getElementById("quibitOne").src =
        "./assets/images/quibit1Hover.png";
      // audioFile = "./assets/sounds/q1Hover.wav";
    } else if (e.target.id == "quibitTwo") {
      document.getElementById("quibitTwo").src =
        "./assets/images/quibit2Hover.png";
    } else if (e.target.id == "quibitThree") {
      document.getElementById("quibitThree").src =
        "./assets/images/quibit3Hover.png";
    }
    const hoverAudio = new Audio(audioFile);
    hoverAudio.play();
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
      // First Quibit
      document.getElementById("quibitOne").src =
        "./assets/images/quibit1Hover.png";
      if (gateSelected == "hadamard") {
        toggleHadamard(1, gateSelected, "/add-gate");
        audioFile = "./assets/sounds/q1Hadamard.wav";
        document.getElementById("quibitOne").src =
          "./assets/images/q1Hadamard.png";
        document.getElementById("rotation-inst").style.display = "none";
        document.getElementById("rotation-img").style.display = "none";
        document.getElementById("status").innerHTML = "Success!";
        document.getElementById("gate-description").innerHTML =
          "Adding a <b>Hadamard</b> to a qubit is like arriving at a crossroads where you can go left or right. Normally, if you're following GPS, you'd take one clear path: left or right. But a Hadamard gate throws you into superposition, where you prepare to take both paths at once — left and right.";
        document.getElementById("gate-description-two").innerHTML =
          "It’s like you’re mentally planning to explore both routes to see where they lead, but you haven’t committed yet. When you eventually measure your decision (like checking your destination on the map), you'll find yourself on just one of the roads — either left or right.";
        document.getElementById("gate-added-diagram").src =
          "./assets/images/hadamardDiagram.png";
      } else if (gateSelected == "rotation") {
        toggleRotation(1, gateSelected, "/add-rotation");
        audioFile = "./assets/sounds/q1Ry.wav";
        document.getElementById("quibitOne").src =
          "./assets/images/q1Rotation.png";
        document.getElementById("rotation-inst").style.display = "block";
        document.getElementById("rotation-img").style.display = "block";
        document.getElementById("rotation-inst").innerHTML =
          "Change the Rotation Angle";
        document.getElementById("rotation-img").src =
          "./assets/images/rotationSphere.png";
        // const buttonContainer = document.getElementById("rotation-button");
        // const leftButton = document.createElement("button");
        // leftButton.className = "w3-button";
        // leftButton.innerHTML = "&laquo;";
        // const rightButton = document.createElement("button");
        // rightButton.className = "w3-button";
        // rightButton.innerHTML = "&raquo;";

        // buttonContainer.appendChild(leftButton);
        // buttonContainer.appendChild(rightButton);

        document.getElementById("status").innerHTML = "Success!";
        document.getElementById("gate-description").innerHTML =
          "The Bloch sphere is like a globe showing all possible directions you can travel. The North Pole is left, and the South Pole is right. A rotation is like turning your steering wheel, letting you adjust your path to explore a mix of both directions.";
        document.getElementById("gate-description-two").innerHTML =
          "When you “measure”, it’s like arriving at a destination — either fully left or fully right, even if your journey was a blend of both.";
        document.getElementById("gate-added-diagram").src =
          "./assets/images/ryDiagram.png";
      } else if (gateSelected == "cnot") {
        toggleCNOT(1, 2, gateSelected, "/add-cnot");
        audioFile = "./assets/sounds/q1Cnot.wav";
        document.getElementById("quibitOne").src = "./assets/images/q1cnot.png";
        document.getElementById("rotation-inst").style.display = "none";
        document.getElementById("rotation-img").style.display = "none";
        // document.getElementById("rotation-button").style.display = "none";
        document.getElementById("status").innerHTML = "Success!";
        document.getElementById("gate-description").innerHTML =
          "The CNOT gate is like driving with a friend whose route depends on yours. If you go left, they stick to their plan. But if you go right, they flip their choice — left becomes right, and right becomes left.";
        document.getElementById("gate-description-two").innerHTML =
          "This creates entanglement, where the two of you are connected so that knowing one’s direction instantly tells you the other’s. Even if you’re far apart, your paths are always linked.";
        document.getElementById("gate-added-diagram").src =
          "./assets/images/cnotDiagram.png";
      }
    }

    // Second Quibit
    else if (e.target.id == "quibitTwo") {
      document.getElementById("quibitTwo").src =
        "./assets/images/quibit2Hover.png";
      if (gateSelected == "hadamard") {
        toggleHadamard(2, gateSelected, "/add-gate");
        audioFile = "./assets/sounds/q2Hadamard.wav";
        document.getElementById("quibitTwo").src =
          "./assets/images/q2Hadamard.png";
        document.getElementById("rotation-inst").style.display = "none";
        document.getElementById("rotation-img").style.display = "none";
        // document.getElementById("rotation-button").style.display = "none";
        document.getElementById("status").innerHTML = "Success!";
        document.getElementById("gate-description").innerHTML =
          "Adding a <b>Hadamard</b> to a qubit is like arriving at a crossroads where you can go left or right. Normally, if you're following GPS, you'd take one clear path: left or right. But a Hadamard gate throws you into superposition, where you prepare to take both paths at once — left and right.";
        document.getElementById("gate-description-two").innerHTML =
          "It’s like you’re mentally planning to explore both routes to see where they lead, but you haven’t committed yet. When you eventually measure your decision (like checking your destination on the map), you'll find yourself on just one of the roads — either left or right.";
        document.getElementById("gate-added-diagram").src =
          "./assets/images/hadamardDiagram.png";
      } else if (gateSelected == "rotation") {
        toggleRotation(2, gateSelected, "/add-rotation");
        audioFile = "./assets/sounds/q2Ry.wav";
        document.getElementById("quibitTwo").src =
          "./assets/images/q2Rotation.png";
        document.getElementById("rotation-inst").style.display = "block";
        document.getElementById("rotation-img").style.display = "block";
        document.getElementById("rotation-inst").innerHTML =
          "Click left or right";
        document.getElementById("rotation-img").src =
          "./assets/images/rotationSphere.png";
        document.getElementById("status").innerHTML = "Success!";
        document.getElementById("gate-description").innerHTML =
          "The Bloch sphere is like a globe showing all possible directions you can travel. The North Pole is left, and the South Pole is right. A rotation is like turning your steering wheel, letting you adjust your path to explore a mix of both directions.";
        document.getElementById("gate-description-two").innerHTML =
          "When you “measure”, it’s like arriving at a destination — either fully left or fully right, even if your journey was a blend of both.";
        document.getElementById("gate-added-diagram").src =
          "./assets/images/ryDiagram.png";
      } else if (gateSelected == "cnot") {
        toggleCNOT(2, 3, gateSelected, "/add-cnot");
        audioFile = "./assets/sounds/q2Cnot.wav";
        document.getElementById("quibitTwo").src = "./assets/images/q2cnot.png";
        document.getElementById("rotation-inst").style.display = "none";
        document.getElementById("rotation-img").style.display = "none";
        // document.getElementById("rotation-button").style.display = "none";
        document.getElementById("status").innerHTML = "Success!";
        document.getElementById("gate-description").innerHTML =
          "The CNOT gate is like driving with a friend whose route depends on yours. If you go left, they stick to their plan. But if you go right, they flip their choice — left becomes right, and right becomes left.";
        document.getElementById("gate-description-two").innerHTML =
          "This creates entanglement, where the two of you are connected so that knowing one’s direction instantly tells you the other’s. Even if you’re far apart, your paths are always linked.";
        document.getElementById("gate-added-diagram").src =
          "./assets/images/cnotDiagram.png";
      }
    }
    // Third Quibit
    else if (e.target.id == "quibitThree") {
      document.getElementById("quibitThree").src =
        "./assets/images/quibit3Hover.png";

      if (gateSelected == "hadamard") {
        toggleHadamard(3, gateSelected, "/add-rotation");
        audioFile = "./assets/sounds/q3Hadamard.wav";
        document.getElementById("quibitThree").src =
          "./assets/images/q3Hadamard.png";
        document.getElementById("rotation-inst").style.display = "none";
        document.getElementById("rotation-img").style.display = "none";
        // document.getElementById("rotation-button").style.display = "none";
        document.getElementById("status").innerHTML = "Success!";
        document.getElementById("gate-description").innerHTML =
          "Adding a <b>Hadamard</b> to a qubit is like arriving at a crossroads where you can go left or right. Normally, if you're following GPS, you'd take one clear path: left or right. But a Hadamard gate throws you into superposition, where you prepare to take both paths at once — left and right.";
        document.getElementById("gate-description-two").innerHTML =
          "It’s like you’re mentally planning to explore both routes to see where they lead, but you haven’t committed yet. When you eventually measure your decision (like checking your destination on the map), you'll find yourself on just one of the roads — either left or right.";
        document.getElementById("gate-added-diagram").src =
          "./assets/images/hadamardDiagram.png";
      } else if (gateSelected == "rotation") {
        toggleRotation(3, gateSelected, "/add-gate");
        audioFile = "./assets/sounds/q3Ry.wav";
        document.getElementById("quibitThree").src =
          "./assets/images/q3Rotation.png";
        document.getElementById("rotation-inst").style.display = "block";
        document.getElementById("rotation-img").style.display = "block";
        document.getElementById("rotation-inst").innerHTML =
          "Click left or right";
        document.getElementById("rotation-img").src =
          "./assets/images/rotationSphere.png";
        document.getElementById("status").innerHTML = "Success!";
        document.getElementById("gate-description").innerHTML =
          "The Bloch sphere is like a globe showing all possible directions you can travel. The North Pole is left, and the South Pole is right. A rotation is like turning your steering wheel, letting you adjust your path to explore a mix of both directions.";
        document.getElementById("gate-description-two").innerHTML =
          "When you “measure”, it’s like arriving at a destination — either fully left or fully right, even if your journey was a blend of both.";
        document.getElementById("gate-added-diagram").src =
          "./assets/images/ryDiagram.png";
      } else if (gateSelected == "cnot") {
        toggleCNOT(3, 1, gateSelected, "/add-cnot");
        audioFile = "./assets/sounds/q3Cnot.wav";
        document.getElementById("quibitThree").src =
          "./assets/images/q3cnot.png";
        document.getElementById("rotation-inst").style.display = "none";
        document.getElementById("rotation-img").style.display = "none";
        // document.getElementById("rotation-button").style.display = "none";
        document.getElementById("status").innerHTML = "Success!";
        document.getElementById("gate-description").innerHTML =
          "The CNOT gate is like driving with a friend whose route depends on yours. If you go left, they stick to their plan. But if you go right, they flip their choice — left becomes right, and right becomes left.";
        document.getElementById("gate-description-two").innerHTML =
          "This creates entanglement, where the two of you are connected so that knowing one’s direction instantly tells you the other’s. Even if you’re far apart, your paths are always linked.";
      }
    }
    const audio = new Audio(audioFile);
    audio.play();
    audio.volume = 0.7;
  });
});

//Pressing measure button to bring up the pop ups
measureBtn.addEventListener("click", function () {
  const audioFiles = [
    "./assets/sounds/measure1.wav",
    "./assets/sounds/measure2.wav",
    "./assets/sounds/measure3.wav",
    "./assets/sounds/measure4.wav",
    "./assets/sounds/measure5.wav",
  ];
  const audioIndex = Math.floor(Math.random() * audioFiles.length);
  audioFile = "./assets/sounds/measure1.wav";
  const audioBtn = new Audio(audioFiles[audioIndex]);
  audioBtn.play();
  measureScreen.classList.add("show");
  if (gateSelected == "hadamard") {
    document.getElementById("gate-added-diagram").src =
      "./assets/images/hadamardDiagram.png";
    document.getElementById("operation").innerHTML = "Operation";
  } else if (gateSelected == "rotation") {
    document.getElementById("gate-added-diagram").src =
      "./assets/images/ryDiagram.png";
  } else if (gateSelected == "cnot") {
    document.getElementById("gate-added-diagram").src =
      "./assets/images/cnotDiagram.png";
  }
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

// Rotation angle changes through buttons
function up(max) {
  document.getElementById("rotationVal").value =
    parseInt(document.getElementById("rotationVal").value) + 45;
  if (document.getElementById("rotationVal").value >= parseInt(max)) {
    document.getElementById("rotationVal").value = max;
  }
}
function down(min) {
  document.getElementById("rotationVal").value =
    parseInt(document.getElementById("rotationVal").value) - 45;
  if (document.getElementById("rotationVal").value <= parseInt(min)) {
    document.getElementById("rotationVal").value = min;
  }
}

function toggleHadamard(qubit, gate, isChecked) {
  const url = `https://measured-values-interface.onrender.com${isChecked}?qubit=${qubit}&gate=${gate}`;
  // const url = `http://localhost:3000${isChecked}?qubit=${qubit}&gate=${gate}`;
  // const url = `https://measured-values-interface.onrender.com${isChecked}?qubit=${qubit}&gate=${gate}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
    })
    .catch((error) => console.error("Error:", error));
}

function toggleRotation(qubit, gate, isChecked) {
  const url = `https://measured-values-interface.onrender.com${isChecked}?qubit=${qubit}&gate=${gate}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
    })
    .catch((error) => console.error("Error:", error));
}

function toggleCNOT(qubit1, qubit2, gate, isChecked) {
  console.log("cnot added in");
  const endpoint = isChecked ? "/add-cnot" : "/remove-cnot";
  const url = `${endpoint}?qubit1=${qubit1}&qubit2=${qubit2}&gate=${gate}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
    })
    .catch((error) => console.error("Error:", error));
}
