const leftDoors = document.querySelectorAll<HTMLDivElement>(".left_door");
const rightDoors = document.querySelectorAll<HTMLDivElement>(".right_door");
const lift = document.getElementById("lift") as HTMLElement;
const floorButtons =
  document.querySelectorAll<HTMLButtonElement>(".floor__buttons");

let currentFloor = 0;
let isMoving = false;
let liftQueue: number[] = [];

function addToQueue(floor: number): void {
  if (!liftQueue.includes(floor) && floor !== currentFloor) {
    liftQueue.push(floor);
    if (!isMoving) {
      processQueue();
    }
  }
}

function processQueue(): void {
  if (liftQueue.length === 0) {
    isMoving = false;
    return;
  }

  isMoving = true;
  const targetFloor = liftQueue[0];
  moveLift(targetFloor);
}

function moveLift(targetFloor: number): void {
  const direction = targetFloor > currentFloor ? 1 : -1;
  const nextFloor = currentFloor + direction;

  let topDimension = nextFloor * 110;
  if (nextFloor === 0) {
    topDimension = 10;
  }

  lift.style.transition = `top 2s ease-in-out`;
  lift.style.top = `${topDimension}%`;

  setTimeout(() => {
    currentFloor = nextFloor;
    if (currentFloor === targetFloor) {
      openDoors();
      setTimeout(() => {
        closeDoors();
        setTimeout(() => {
          liftQueue.shift();
          processQueue();
        }, 2500);
      }, 2500);
    } else {
      checkIntermediateStops(targetFloor);
    }
  }, 2000);
}

function checkIntermediateStops(targetFloor: number): void {
  if (liftQueue.includes(currentFloor)) {
    openDoors();
    setTimeout(() => {
      closeDoors();
      setTimeout(() => {
        liftQueue = liftQueue.filter((floor) => floor !== currentFloor);
        moveLift(targetFloor);
      }, 2500);
    }, 2500);
  } else {
    moveLift(targetFloor);
  }
}

function openDoors(): void {
  leftDoors.forEach((left_door) => {
    left_door.classList.add("left_door_open");
  });
  rightDoors.forEach((right_door) => {
    right_door.classList.add("right_door_open");
  });
}

function closeDoors(): void {
  leftDoors.forEach((left_door) => {
    left_door.classList.remove("left_door_open");
  });
  rightDoors.forEach((right_door) => {
    right_door.classList.remove("right_door_open");
  });
}

floorButtons.forEach((floorButton) => {
  const floor = parseInt(floorButton.dataset.floor || "0", 10);
  floorButton.childNodes.forEach((button) => {
    if (button instanceof HTMLElement) {
      button.addEventListener("click", () => {
        addToQueue(floor);
      });
    }
  });
});
