// toLowerCase
var lowIn = document.getElementById("lower-in"), lowOut = document.getElementById("lower-out");
lowIn.addEventListener("input", function(){
  lowOut.textContent = lowIn.value ? lowIn.value.toLowerCase() : "Your text in lowercase appears here.";
});
