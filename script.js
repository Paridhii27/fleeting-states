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
  });
});

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
  const endpoint = isChecked ? "/add-gate" : "/remove-gate";
  const url = `${endpoint}?qubit=${qubit}&gate=${gate}`;

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
