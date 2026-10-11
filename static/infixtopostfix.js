// Infix to postfix. The conversion (and every step) comes from the Python code in app.py.
var ixIn = document.getElementById("infix-in"), ixOut = document.getElementById("infix-out");
var ixBtn = document.getElementById("infix-btn"), ixVis = document.getElementById("ix-vis");
var ixInputEl = document.getElementById("ix-input"), ixStackEl = document.getElementById("ix-stack");
var ixOutputEl = document.getElementById("ix-output"), ixMsg = document.getElementById("ix-msg");
var ixFirst = document.getElementById("ix-first"), ixPrev = document.getElementById("ix-prev");
var ixNext = document.getElementById("ix-next"), ixLast = document.getElementById("ix-last");

var ixSteps = [], ixChars = [], ixCur = 0;

// One box with optional head/tail style tags above it
function ixNode(parent, text, flash, tags, extraCls){
  var wrap = document.createElement("div"); wrap.className = "node-wrap";
  var tg = document.createElement("div"); tg.className = "tags";
  tags.forEach(function(t){
    var s = document.createElement("span"); s.className = "tag " + t.cls; s.textContent = t.text; tg.appendChild(s);
  });
  var n = document.createElement("div");
  n.className = "node" + (flash ? " flash" : "") + (extraCls || "");
  n.textContent = text;
  wrap.appendChild(tg); wrap.appendChild(n); parent.appendChild(wrap);
}

function ixArrow(parent){
  var a = document.createElement("span"); a.className = "arrow"; a.textContent = "\u2192";
  a.setAttribute("aria-hidden", "true"); parent.appendChild(a);
}

function ixShow(i){
  ixCur = i;
  var s = ixSteps[i], prev = i > 0 ? ixSteps[i - 1] : null;

  // Input: highlight the character being read
  ixInputEl.innerHTML = "";
  ixChars.forEach(function(c, k){ ixNode(ixInputEl, c, k === s.pos, []); });

  // Stack: bottom ... top
  ixStackEl.innerHTML = "";
  if (!s.stack.length) { ixStackEl.textContent = "The stack is empty."; }
  s.stack.forEach(function(c, k){
    var tags = [];
    if (k === s.stack.length - 1) tags.push({ text: "top", cls: "head" });
    if (k === 0) tags.push({ text: "bottom", cls: "tail" });
    var pushed = prev && s.stack.length > prev.stack.length && k === s.stack.length - 1;
    ixNode(ixStackEl, c, pushed, tags);
  });

  // Output: shown like the linked list (head ... tail -> None)
  ixOutputEl.innerHTML = "";
  if (!s.output.length) { ixOutputEl.textContent = "The output is empty."; }
  else {
    s.output.forEach(function(c, k){
      var tags = [];
      if (k === 0) tags.push({ text: "head", cls: "head" });
      if (k === s.output.length - 1) tags.push({ text: "tail", cls: "tail" });
      var added = prev && s.output.length > prev.output.length && k === s.output.length - 1;
      ixNode(ixOutputEl, c, added, tags);
      ixArrow(ixOutputEl);
    });
    ixNode(ixOutputEl, "None", false, [], " none");
  }

  ixMsg.textContent = "Step " + i + " of " + (ixSteps.length - 1) + ": " + s.action;

  var atStart = i === 0, atEnd = i === ixSteps.length - 1;
  ixFirst.disabled = ixPrev.disabled = atStart;
  ixNext.disabled = ixLast.disabled = atEnd;
}

function ixConvert(){
  var text = ixIn.value.trim();
  if (!text) { ixOut.textContent = "Enter an infix expression first."; ixVis.hidden = true; ixIn.focus(); return; }

  fetch("/works/infix-to-postfix/convert", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ infix: text })
  })
  .then(function(res){ return res.json(); })
  .then(function(data){
    if (data.error) { ixOut.textContent = data.error; ixVis.hidden = true; return; }
    ixOut.innerHTML = "";
    var s = document.createElement("strong");
    s.textContent = data.postfix;
    ixOut.appendChild(document.createTextNode("Postfix: "));
    ixOut.appendChild(s);

    ixSteps = data.steps;
    ixChars = text.replace(/\s+/g, "").split("");
    ixVis.hidden = false;
    ixShow(0);
  })
  .catch(function(){
    ixOut.textContent = "Could not reach the server.";
    ixVis.hidden = true;
  });
}

ixBtn.addEventListener("click", ixConvert);
ixIn.addEventListener("keydown", function(e){ if (e.key === "Enter") ixConvert(); });
ixFirst.addEventListener("click", function(){ ixShow(0); });
ixPrev.addEventListener("click", function(){ if (ixCur > 0) ixShow(ixCur - 1); });
ixNext.addEventListener("click", function(){ if (ixCur < ixSteps.length - 1) ixShow(ixCur + 1); });
ixLast.addEventListener("click", function(){ ixShow(ixSteps.length - 1); });