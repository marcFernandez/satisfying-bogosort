document.addEventListener("DOMContentLoaded", async () => {
  const numbersContainer = document.getElementById("numbersContainer");

  // TODO: think if making this come from an API makes sense for global sync
  let numbers = generateMockNumbers();
  let numberElements = [];

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
    const count = 5;
    const nums = [];
    for (let i = 0; i < count; i++) {
      nums.push(Math.floor(Math.random() * 100) + 1);
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

      await new Promise((resolve) => setTimeout(resolve, 300));

      if (i === 0) {
        currentElement.classList.add("green");
        console.debug(`Index ${i}: ${currentNumber} - First number, green.`);
      } else {
        if (currentNumber > previousNumber) {
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

  let sorted = false;
  while (!sorted) {
    numberElements.forEach((el) => {
      el.classList.remove("green", "red");
    })
    await updateNumbers();
    sorted = await startColoring();
    await new Promise((resolve) => setTimeout(resolve, 800));
  }
  while (true) {
    for (let i = 0; i < 4; i++) {
      numberElements.forEach((el) => {
        el.classList.remove("green");
      })
      await new Promise((resolve) => setTimeout(resolve, 300));
      numberElements.forEach((el) => {
        el.classList.add("green");
      })
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    numberElements.forEach((el) => {
      el.classList.remove("green", "red");
    })
    await startColoring();
    await new Promise((resolve) => setTimeout(resolve, 800));
    // TODO: do something funny when the bogo sort works
  }
});
