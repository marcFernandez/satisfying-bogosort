var totalAttempts = 0;
var reset = false;

var numCount = 10;
var speedValue = 1;
// TODO: think if making this come from an API makes sense for global sync
var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var numberElements = [];

document.addEventListener("DOMContentLoaded", async () => {
  const totalAttemptsEl = document.getElementById("totalAttempts");
  const resetButton = document.getElementById("resetButton");

  const numbersContainer = document.getElementById("numbersContainer");

  const numCountSlider = document.getElementById("numCountSlider");
  const numCountValueSpan = document.getElementById("numCountValue");

  const speedSlider = document.getElementById("speedSlider");
  const speedValueSpan = document.getElementById("speedValue");

  numCount = parseInt(numCountSlider.value, 10);
  numCountValueSpan.textContent = numCount;

  speedValue = parseInt(speedSlider.value, 10);
  speedValueSpan.textContent = speedValue;

  async function updateNumbers() {
    try {
      numbers = bogosort(numbers);
      displayNumbers(numbers);
    } catch (error) {
      numbersContainer.innerHTML = `<p style="color: red;">Error fetching numbers: ${error.message}</p>`;
      console.error("Error fetching numbers:", error);
    }
  }

  function generateMockNumbers() {
    // TODO: make this configurable with a slider
    const count = numCount;
    const nums = [];
    for (let i = 0; i < count; i++) {
      nums.push(Math.floor(Math.random() * Math.min(Math.max(numCount, 500), 10)) + 1);
    }
    console.debug("Generated Mock Numbers:", nums);
    return nums;
  }

  function bogosort(nums) {
    return nums.sort(() => Math.random() - 0.5);
  }

  function displayNumbers(nums) {
    if (nums.length === 0) {
      numbersContainer.innerHTML = "<p>No numbers to display.</p>";
      return;
    }

    numbersContainer.innerHTML = "";
    numberElements = [];

    nums.forEach((num, index) => {
      const span = document.createElement("span");
      span.classList.add("number-item");
      span.textContent = num;
      span.dataset.index = index;
      numbersContainer.appendChild(span);
      numberElements.push(span);
    });
  }

  async function startColoring() {
    if (numbers.length === 0 || numberElements.length === 0) {
      alert("Please generate numbers first!");
      return;
    }

    let previousNumber = null;
    let i = 0;

    for (; i < numbers.length; i++) {
      const currentNumber = numbers[i];
      const currentElement = numberElements[i];

      await new Promise((resolve) => setTimeout(resolve, 300 * (1 / speedValue)));

      if (i === 0) {
        currentElement.classList.add("green");
        console.debug(`Index ${i}: ${currentNumber} - First number, green.`);
      } else {
        if (currentNumber >= previousNumber) {
          currentElement.classList.add("green");
          console.debug(
            `Index ${i}: ${currentNumber} > ${previousNumber} - Green.`
          );
        } else {
          currentElement.classList.add("red");
          console.debug(
            `Index ${i}: ${currentNumber} <= ${previousNumber} - Red, stopping.`
          );
          break;
        }
      }
      previousNumber = currentNumber;
    }
    return i == numbers.length;
  }

  function updateTotalAttempts() {
    totalAttemptsEl.textContent = "Total attempts: " + totalAttempts;
  }


  numCountSlider.addEventListener("input", () => {
    numCount = parseInt(numCountSlider.value, 10);
    numCountValueSpan.textContent = numCount;
    totalAttempts = 0;
    updateTotalAttempts();
    numbers = generateMockNumbers();
  });

  speedSlider.addEventListener("input", () => {
    speedValue = parseInt(speedSlider.value, 10);
    speedValueSpan.textContent = speedValue;
  });

  resetButton.addEventListener("click", () => {
    reset = true;
  });

  while (true) {
    let sorted = false;
    while (!sorted && !reset) {
      totalAttempts++;
      updateTotalAttempts();
      numberElements.forEach((el) => {
        el.classList.remove("green", "red");
      })
      await updateNumbers();
      sorted = await startColoring();
      await new Promise((resolve) => setTimeout(resolve, 800 * (1 / speedValue)));
    }
    while (true && !reset) {
      for (let i = 0; i < 4; i++) {
        numberElements.forEach((el) => {
          el.classList.remove("green");
        })
        await new Promise((resolve) => setTimeout(resolve, 300 * (1 / speedValue)));
        numberElements.forEach((el) => {
          el.classList.add("green");
        })
        await new Promise((resolve) => setTimeout(resolve, 300 * (1 / speedValue)));
      }
      numberElements.forEach((el) => {
        el.classList.remove("green", "red");
      })
      await startColoring();
      await new Promise((resolve) => setTimeout(resolve, 800 * (1 / speedValue)));
      // TODO: do something funny when the bogo sort works
    }
    totalAttempts = 0;
    updateTotalAttempts();
    numbers = generateMockNumbers();
    displayNumbers(numbers);
    reset = false;
  }
});
