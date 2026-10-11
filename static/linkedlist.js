// Linked list UI. The list itself lives in Python (my LinkedList class in Lab_3_linklist.py),
// and the buttons talk to it through the Flask routes in app.py.
var llView = document.getElementById("ll-view"), llMsg = document.getElementById("ll-msg");
var llVal = document.getElementById("ll-value"), llAfter = document.getElementById("ll-after");

// Ask the Python LinkedList to do an action. Resolves to { list: [...], message: "text", mark: index }
function callList(action, value, after){
  return fetch("/works/linkedlist/action", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: action, value: value, after: after })
  }).then(function(res){ return res.json(); });
}

function llRender(list, mark){
  llView.innerHTML = "";
  if (!list.length) { llView.textContent = "The list is empty. Insert a value to start."; return; }
  function box(text, cls, head, tail){
    var wrap = document.createElement("div"); wrap.className = "node-wrap";
    var tags = document.createElement("div"); tags.className = "tags";
    if (head) { var h = document.createElement("span"); h.className = "tag head"; h.textContent = "head"; tags.appendChild(h); }
    if (tail) { var t = document.createElement("span"); t.className = "tag tail"; t.textContent = "tail"; tags.appendChild(t); }
    var node = document.createElement("div"); node.className = "node" + cls; node.textContent = text;
    wrap.appendChild(tags); wrap.appendChild(node); llView.appendChild(wrap);
  }
  function arrow(){
    var a = document.createElement("span"); a.className = "arrow"; a.textContent = "\u2192";
    a.setAttribute("aria-hidden", "true"); llView.appendChild(a);
  }
  list.forEach(function(v, i){
    box(v, i === mark ? " flash" : "", i === 0, i === list.length - 1);
    arrow();
  });
  box("None", " none", false, false);
}

function llRun(action){
  var v = llVal.value.trim(), a = llAfter.value.trim();
  var needsValue = ["insert_at_beginning", "insert_at_end", "insert_after", "remove_at", "search"].indexOf(action) > -1;
  if (needsValue && !v) { llMsg.textContent = "Enter a value first."; llVal.focus(); return; }
  if (action === "insert_after" && !a) { llMsg.textContent = "Enter the value to insert after."; llAfter.focus(); return; }
  callList(action, v, a).then(function(r){
    if (r.error) { llMsg.textContent = r.error; return; }
    llRender(r.list, r.mark === null ? undefined : r.mark);
    llMsg.textContent = r.message;
    if (action.indexOf("insert") === 0) { llVal.value = ""; llVal.focus(); }
  }).catch(function(){
    llMsg.textContent = "Could not reach the server.";
  });
}

document.querySelectorAll("[data-ll]").forEach(function(btn){
  btn.addEventListener("click", function(){ llRun(btn.getAttribute("data-ll")); });
});
llVal.addEventListener("keydown", function(e){ if (e.key === "Enter") llRun("insert_at_end"); });

// Show the current list from Python when the page opens
fetch("/works/linkedlist/state")
  .then(function(res){ return res.json(); })
  .then(function(r){
    llRender(r.list);
    llMsg.textContent = "This list is stored in Python (your LinkedList class). Try the buttons.";
  })
  .catch(function(){ llMsg.textContent = "Could not reach the server."; });