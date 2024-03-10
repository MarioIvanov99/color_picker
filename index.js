const hueSlider = document.getElementById("hueSlider");
const saturationSlider = document.getElementById("saturationSlider");
const lightnessSlider = document.getElementById("lightnessSlider");
const primaryField = document.getElementById("primary-color");

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

function updateColor() {
  const hue = hueSlider.value;
  const saturation = saturationSlider.value;
  const lightness = lightnessSlider.value;
  const color = hslToHex(hue, saturation, lightness);

  hueSlider.style.background = `linear-gradient(to right, hsl(0, ${saturation}%, ${lightness}%), hsl(60, ${saturation}%, ${lightness}%), hsl(120, ${saturation}%, ${lightness}%), hsl(180, ${saturation}%, ${lightness}%), hsl(240, ${saturation}%, ${lightness}%), hsl(300, ${saturation}%, ${lightness}%), hsl(360, ${saturation}%, ${lightness}%))`;

  saturationSlider.style.background = `linear-gradient(to right, hsl(${hue}, 0%, ${lightness}%), hsl(${hue}, 100%, ${lightness}%))`;

  lightnessSlider.style.background = `linear-gradient(to right, hsl(${hue}, ${saturation}%, 0%), hsl(${hue}, ${saturation}%, 50%), hsl(${hue}, ${saturation}%, 100%))`;

  primaryField.value = hslToHex(hue, saturation, lightness);
}

hueSlider.addEventListener("input", updateColor);
saturationSlider.addEventListener("input", updateColor);
lightnessSlider.addEventListener("input", updateColor);

// Initial color update
updateColor();
