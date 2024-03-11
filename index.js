const hueSlider = document.getElementById("hueSlider");
const saturationSlider = document.getElementById("saturationSlider");
const lightnessSlider = document.getElementById("lightnessSlider");
const primaryField = document.getElementById("primary-color");
const squareContainer = document.getElementById("color-container");
const primaryColorInput = document.getElementById("primary-color");

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

function updateColor(color) {
  squareContainer.children[0].style.backgroundColor = color;
  squareContainer.children[3].style.backgroundColor = color;
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
updateSliderValues();

// Define the event listener function
function handleColorTypeChange() {
  var selectedValue = this.value;
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
