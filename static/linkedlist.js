// Linked list UI
var llView = document.getElementById("ll-view"), llMsg = document.getElementById("ll-msg");
var llVal = document.getElementById("ll-value"), llAfter = document.getElementById("ll-after");
var llData = ["10", "20", "30"];

// Stand-in for your Python LinkedList so the design works on its own.
// Replace the body with a fetch() to your Flask route. Either way, return
// (or resolve to) an object like: { list: ["10","20"], message: "text", mark: indexToHighlight }
function callList(action, value, after){
  var i = llData.indexOf(value), msg = "", mark;
  if (action === "insert_at_beginning") { llData.unshift(value); msg = "Inserted " + value + " at the beginning."; mark = 0; }
  else if (action === "insert_at_end") { llData.push(value); msg = "Inserted " + value + " at the end."; mark = llData.length - 1; }
  else if (action === "insert_after") {
    var j = llData.indexOf(after);
    if (j < 0) { msg = "No node holds " + after + ". The list is unchanged."; }
    else { llData.splice(j + 1, 0, value); msg = "Inserted " + value + " after " + after + "."; mark = j + 1; }
  }
  else if (action === "remove_beginning") { msg = llData.length ? "Removed " + llData.shift() + " from the beginning." : "The list is empty."; }
  else if (action === "remove_at_end") { msg = llData.length ? "Removed " + llData.pop() + " from the end." : "The list is empty."; }
  else if (action === "remove_at") {
    if (i < 0) { msg = value + " is not in the list. The list is unchanged."; }
    else { llData.splice(i, 1); msg = "Removed " + value + "."; }
  }
  else if (action === "search") {
    if (i < 0) { msg = value + " is not in the list."; } else { msg = "Found " + value + " in the list."; mark = i; }
  }
  return { list: llData.slice(), message: msg, mark: mark };
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
  Promise.resolve(callList(action, v, a)).then(function(r){
    llRender(r.list, r.mark);
    llMsg.textContent = r.message;
    if (action.indexOf("insert") === 0) { llVal.value = ""; llVal.focus(); }
  });
}

document.querySelectorAll("[data-ll]").forEach(function(btn){
  btn.addEventListener("click", function(){ llRun(btn.getAttribute("data-ll")); });
});
llVal.addEventListener("keydown", function(e){ if (e.key === "Enter") llRun("insert_at_end"); });
llRender(llData);
