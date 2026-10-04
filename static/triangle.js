// Triangle area
var b = document.getElementById("base"), h = document.getElementById("height"), tOut = document.getElementById("tri-out");
function tri(){
  var bv = parseFloat(b.value), hv = parseFloat(h.value);
  if (isNaN(bv) || isNaN(hv) || bv < 0 || hv < 0) { tOut.textContent = "Enter a base and a height of 0 or more."; return; }
  tOut.innerHTML = "Area: <strong>" + (0.5 * bv * hv).toFixed(2) + "</strong>";
}
b.addEventListener("input", tri); h.addEventListener("input", tri);
