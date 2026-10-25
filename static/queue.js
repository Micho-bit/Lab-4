// Queue UI. The queue itself lives in Python (my Queue class in my_queue.py),
// and the buttons talk to it through the Flask routes in app.py.
var qView = document.getElementById("q-view"), qMsg = document.getElementById("q-msg");
var qVal = document.getElementById("q-value");

function callQueue(action, value){
  return fetch("/works/queue/action", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: action, value: value })
  }).then(function(res){ return res.json(); });
}

function qRender(list, mark){
  qView.innerHTML = "";
  if (!list.length) { qView.textContent = "The queue is empty. Enqueue a value to start."; return; }
  function box(text, cls, front, rear){
    var wrap = document.createElement("div"); wrap.className = "node-wrap";
    var tags = document.createElement("div"); tags.className = "tags";
    if (front) { var f = document.createElement("span"); f.className = "tag head"; f.textContent = "front"; tags.appendChild(f); }
    if (rear) { var r = document.createElement("span"); r.className = "tag tail"; r.textContent = "rear"; tags.appendChild(r); }
    var node = document.createElement("div"); node.className = "node" + cls; node.textContent = text;
    wrap.appendChild(tags); wrap.appendChild(node); qView.appendChild(wrap);
  }
  function arrow(){
    var a = document.createElement("span"); a.className = "arrow"; a.textContent = "\u2192";
    a.setAttribute("aria-hidden", "true"); qView.appendChild(a);
  }
  list.forEach(function(v, i){
    box(v, i === mark ? " flash" : "", i === 0, i === list.length - 1);
    if (i < list.length - 1) arrow();
  });
}

function qRun(action){
  var v = qVal.value.trim();
  if (action === "enqueue" && !v) { qMsg.textContent = "Enter a value first."; qVal.focus(); return; }
  callQueue(action, v).then(function(r){
    if (r.error) { qMsg.textContent = r.error; return; }
    qRender(r.list, r.mark === null ? undefined : r.mark);
    qMsg.textContent = r.message;
    if (action === "enqueue") { qVal.value = ""; qVal.focus(); }
  }).catch(function(){
    qMsg.textContent = "Could not reach the server.";
  });
}

document.querySelectorAll("[data-q]").forEach(function(btn){
  btn.addEventListener("click", function(){ qRun(btn.getAttribute("data-q")); });
});
qVal.addEventListener("keydown", function(e){ if (e.key === "Enter") qRun("enqueue"); });

fetch("/works/queue/state")
  .then(function(res){ return res.json(); })
  .then(function(r){ qRender(r.list); })
  .catch(function(){ qMsg.textContent = "Could not reach the server."; });
