const hueSlider = document.getElementById("hueSlider");
const saturationSlider = document.getElementById("saturationSlider");
const lightnessSlider = document.getElementById("lightnessSlider");
const primaryField = document.getElementById("primary-color");
const squareContainer = document.getElementById("color-container");
const primaryColorInput = document.getElementById("primary-color");
const copyButtons = document.querySelectorAll(".copy-button");
let selectedValue = document.getElementById("color-type").value;

//chrome.runtime.connect({ name: "popup" });

function hslToHex(h, s, l) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Function to retrieve data from local storage
function retrieveFromLocalStorage() {
  // Retrieve the value associated with the key "primaryColor"
  const primaryColor = localStorage.getItem("primary");
  const selectedColor = localStorage.getItem("type");

  // Check if the value exists
  if (primaryColor !== null) {
    primaryColorInput.value = primaryColor;
    selectedValue = selectedColor;
    setSliderValues(primaryColor);
    updateColor(primaryColor);

    // Set the value of the color-type element
    document.getElementById("color-type").value = selectedValue;

    // Trigger the change event manually
    handleColorTypeChange.call(document.getElementById("color-type"));
  } else {
    updateSliderValues();
  }
}

retrieveFromLocalStorage();

function updateColor(color) {
  if (primaryColorInput.style.borderColor === "red") {
    primaryColorInput.style.borderColor = "";
  }

  localStorage.setItem("primary", color);

  squareContainer.children[0].style.backgroundColor = color;

  switch (selectedValue) {
    case "complementary":
      updateComplementary(color);
      break;
    case "split-complementary":
      updateSplitComplementary(color);
      break;
    case "analogous":
      updateAnalogous(color);
      break;
    case "triadic":
      updateTriadic(color);
      break;
    case "tetradic":
      updateTetradic(color);
      break;
    case "monochromatic":
      updateMonochromatic(color);
      break;
  }
}

function updateComplementary(color) {
  let { h, s, l } = hexToHSL(color);

  h = h + 180;
  if (h > 360) {
    h = h - 360;
  }

  updatedColor = hslToHex(h, s, l);

  squareContainer.children[1].style.backgroundColor = updatedColor;
  squareContainer.children[2].style.backgroundColor = updatedColor;
  squareContainer.children[3].style.backgroundColor = color;
  document.getElementById("secondary-color-code-1").value = updatedColor;
}

function updateSplitComplementary(color) {
  let { h, s, l } = hexToHSL(color);

  h = h + 180;
  if (h > 360) {
    h = h - 360;
  }

  updatedColor1 = hslToHex(h + 30, s, l);
  updatedColor2 = hslToHex(h - 30, s, l);

  squareContainer.children[1].style.backgroundColor = updatedColor1;
  squareContainer.children[2].style.backgroundColor = updatedColor2;
  squareContainer.children[3].style.backgroundColor = color;
  document.getElementById("secondary-color-code-1").value = updatedColor1;
  document.getElementById("secondary-color-code-2").value = updatedColor2;
}

function updateAnalogous(color) {
  let { h, s, l } = hexToHSL(color);

  updatedColor1 = hslToHex(h + 45, s, l);
  updatedColor2 = hslToHex(h - 45, s, l);

  squareContainer.children[1].style.backgroundColor = updatedColor1;
  squareContainer.children[2].style.backgroundColor = updatedColor2;
  squareContainer.children[3].style.backgroundColor = color;
  document.getElementById("secondary-color-code-1").value = updatedColor1;
  document.getElementById("secondary-color-code-2").value = updatedColor2;
}

function updateTriadic(color) {
  let { h, s, l } = hexToHSL(color);

  updatedColor1 = hslToHex(h + 120, s, l);
  updatedColor2 = hslToHex(h + 240, s, l);

  squareContainer.children[1].style.backgroundColor = updatedColor1;
  squareContainer.children[2].style.backgroundColor = updatedColor2;
  squareContainer.children[3].style.backgroundColor = color;
  document.getElementById("secondary-color-code-1").value = updatedColor1;
  document.getElementById("secondary-color-code-2").value = updatedColor2;
}

function updateTetradic(color) {
  let { h, s, l } = hexToHSL(color);

  let h2 = h + 180;
  if (h2 > 360) {
    h2 = h2 - 360;
  }

  updatedColor1 = hslToHex(h + 90 > 360 ? h + 90 - 360 : h + 90, s, l);
  updatedColor2 = hslToHex(h2 + 90 > 360 ? h2 + 90 - 360 : h2 + 90, s, l);
  updatedColor3 = hslToHex(h2, s, l);

  squareContainer.children[1].style.backgroundColor = updatedColor1;
  squareContainer.children[2].style.backgroundColor = updatedColor2;
  squareContainer.children[3].style.backgroundColor = updatedColor3;
  document.getElementById("secondary-color-code-1").value = updatedColor1;
  document.getElementById("secondary-color-code-2").value = updatedColor2;
  document.getElementById("secondary-color-code-3").value = updatedColor3;
}

function updateMonochromatic(color) {
  let { h, s, l } = hexToHSL(color);
  let sign = 1;

  updatedColor1 = hslToHex(h, s, l + 10 > 100 ? l - 10 : l + 10);
  updatedColor2 = hslToHex(h, s, l + 20 > 100 ? l - 20 : l + 20);
  updatedColor3 = hslToHex(h, s, l + 30 > 100 ? l - 30 : l + 30);

  squareContainer.children[1].style.backgroundColor = updatedColor1;
  squareContainer.children[2].style.backgroundColor = updatedColor2;
  squareContainer.children[3].style.backgroundColor = updatedColor3;
  document.getElementById("secondary-color-code-1").value = updatedColor1;
  document.getElementById("secondary-color-code-2").value = updatedColor2;
  document.getElementById("secondary-color-code-3").value = updatedColor3;
}

function updateSliderValues() {
  const hue = hueSlider.value;
  const saturation = saturationSlider.value;
  const lightness = lightnessSlider.value;
  const color = hslToHex(hue, saturation, lightness);

  hueSlider.style.background = `linear-gradient(to right, hsl(0, ${saturation}%, ${lightness}%), hsl(60, ${saturation}%, ${lightness}%), hsl(120, ${saturation}%, ${lightness}%), hsl(180, ${saturation}%, ${lightness}%), hsl(240, ${saturation}%, ${lightness}%), hsl(300, ${saturation}%, ${lightness}%), hsl(360, ${saturation}%, ${lightness}%))`;

  saturationSlider.style.background = `linear-gradient(to right, hsl(${hue}, 0%, ${lightness}%), hsl(${hue}, 100%, ${lightness}%))`;

  lightnessSlider.style.background = `linear-gradient(to right, hsl(${hue}, ${saturation}%, 0%), hsl(${hue}, ${saturation}%, 50%), hsl(${hue}, ${saturation}%, 100%))`;

  primaryField.value = hslToHex(hue, saturation, lightness);

  updateColor(color);
}

hueSlider.addEventListener("input", updateSliderValues);
saturationSlider.addEventListener("input", updateSliderValues);
lightnessSlider.addEventListener("input", updateSliderValues);

// Initial color update
//updateSliderValues();

// Define the event listener function
function handleColorTypeChange() {
  selectedValue = this.value;
  localStorage.setItem("type", selectedValue);
  if (selectedValue === "complementary") {
    document.getElementById("secondary-color-2").style.visibility = "hidden";
    document.getElementById("secondary-color-3").style.visibility = "hidden";
  } else if (
    ["split-complementary", "analogous", "triadic"].includes(selectedValue)
  ) {
    document.getElementById("secondary-color-2").style.visibility = "visible";
    document.getElementById("secondary-color-3").style.visibility = "hidden";
  } else {
    document.getElementById("secondary-color-2").style.visibility = "visible";
    document.getElementById("secondary-color-3").style.visibility = "visible";
  }

  updateColor(primaryColorInput.value);
}

// Add event listener to the color-type select element
document
  .getElementById("color-type")
  .addEventListener("change", handleColorTypeChange);

// Manually trigger the event handler when the program runs initially
handleColorTypeChange.call(document.getElementById("color-type"));

function hexToHSL(hex) {
  // Remove the leading "#" if present
  hex = hex.replace(/^#/, "");

  // Convert hex to RGB
  var r = parseInt(hex.substring(0, 2), 16) / 255;
  var g = parseInt(hex.substring(2, 4), 16) / 255;
  var b = parseInt(hex.substring(4, 6), 16) / 255;

  // Find min and max values of RGB
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);

  // Calculate lightness
  var lightness = ((max + min) / 2) * 100;

  // If min and max are equal, the color is grayscale and saturation is 0
  if (max === min) {
    return { h: 0, s: 0, l: lightness };
  }

  // Calculate saturation
  var d = max - min;
  var saturation =
    lightness > 50 ? (d / (2 - max - min)) * 100 : (d / (max + min)) * 100;

  // Calculate hue
  var hue;
  switch (max) {
    case r:
      hue = (((g - b) / d + (g < b ? 6 : 0)) / 6) * 360;
      break;
    case g:
      hue = (((b - r) / d + 2) / 6) * 360;
      break;
    case b:
      hue = (((r - g) / d + 4) / 6) * 360;
      break;
  }

  return { h: hue, s: saturation, l: lightness };
}

function setSliderValues(color) {
  const hslColor = hexToHSL(color);
  hueSlider.value = hslColor.h;
  saturationSlider.value = hslColor.s;
  lightnessSlider.value = hslColor.l;

  updateSliderValues();
}

// Function to check if a string is a valid hex color code
function isValidHexColor(color) {
  return /^#[0-9A-F]{6}$/i.test(color);
}

// Function to add red border to the input field if the value is not a valid hex color code
function validatePrimaryColor() {
  var primaryColorValue = primaryColorInput.value;

  if (!isValidHexColor(primaryColorValue)) {
    primaryColorInput.style.borderColor = "red";
  } else {
    primaryColorInput.style.borderColor = ""; // Reset border color if valid
    updateColor(primaryColorInput.value);
    setSliderValues(primaryColorInput.value);
  }
}

// Add event listener to validate primary color input on input change
document
  .getElementById("primary-color")
  .addEventListener("input", validatePrimaryColor);

// Iterate over each copy button
copyButtons.forEach(function (button) {
  // Add click event listener to each copy button
  button.addEventListener("click", function () {
    // Find the input field associated with this button
    var inputId = this.parentElement.querySelector("input").id;
    var inputElement = document.getElementById(inputId);

    // Select the text in the input field
    inputElement.select();
    inputElement.setSelectionRange(0, 99999); // For mobile devices

    // Copy the selected text to the clipboard
    navigator.clipboard.writeText(inputElement.value);

    // Remove the selection
    window.getSelection().removeAllRanges();
  });
});
