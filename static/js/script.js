const priceInput = document.getElementById("price");

// Ensure that the initial value is in the correct format
priceInput.value = priceInput.valueAsNumber.toFixed(2);

// Handler that ensures the value is in the correct format when modified
priceInput.addEventListener("input", function (event) {
  event.target.value = event.target.valueAsNumber.toFixed(2);
});