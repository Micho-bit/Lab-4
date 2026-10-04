// toUpperCase
var upIn = document.getElementById("upper-in"), upOut = document.getElementById("upper-out");
upIn.addEventListener("input", function(){
  upOut.textContent = upIn.value ? upIn.value.toUpperCase() : "Your text in capitals appears here.";
});
