  // Welcome screen: click anywhere (or press Enter/Space) to begin
  var splash = document.getElementById("splash"), pageParts = document.querySelectorAll("header,main");
  function setInert(on){ pageParts.forEach(function(el){ el.inert = on; }); }
  setInert(true);
  splash.focus();
  var onKey = function(e){
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); enter(); }
  };
  var enter = function(){
    splash.classList.add("leaving");
    setInert(false);
    document.removeEventListener("keydown", onKey);
  };
  splash.addEventListener("click", enter);
  document.addEventListener("keydown", onKey);
