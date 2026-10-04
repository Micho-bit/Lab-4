// Circle area
var r = document.getElementById("radius"), cOut = document.getElementById("circle-out");
r.addEventListener("input", function(){
  var v = parseFloat(r.value);
  if (isNaN(v) || v < 0) { cOut.textContent = "Enter a radius of 0 or more."; return; }
  cOut.innerHTML = "Area: <strong>" + (Math.PI * v * v).toFixed(2) + "</strong>";
});
