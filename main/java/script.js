const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const statusEl = document.getElementById("status");
const reset = document.getElementById("reset");

const messages = [
  "are you sure? 🥺",
  "what if i ask nicely...",
  "i’ll make you a playlist.",
  "this is getting awkward.",
  "the no button is shy.",
  "okay it literally ran away."
];

let noCount = 0;

function popHearts(count = 20){
  const hearts = ["♡","♥","💗","💖","💘","✨"];
  for(let i = 0; i < count; i++){
    const h = document.createElement("div");
    h.textContent = hearts[Math.floor(Math.random()*hearts.length)];
    h.className = "heart";
    h.style.position = "fixed";
    h.style.left = Math.random() * window.innerWidth + "px";
    h.style.top = window.innerHeight - 40 + "px";
    h.style.fontSize = 18 + Math.random()*18 + "px";
    h.style.pointerEvents = "none";
    h.style.animation = "floatUp 1.8s ease forwards";
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 1800);
  }
}

yesBtn.addEventListener("click", () => {
  statusEl.textContent = "YAY!! 💘 happy valentine’s day!!";
  popHearts(30);
});

noBtn.addEventListener("mouseenter", () => {
  const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
  const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);
  noBtn.style.position = "fixed";
  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";

  statusEl.textContent = messages[Math.min(noCount, messages.length - 1)];
  noCount++;
});

reset.addEventListener("click", (e) => {
  e.preventDefault();
  noCount = 0;
  statusEl.textContent = "";
  noBtn.style.position = "relative";
  noBtn.style.left = "auto";
  noBtn.style.top = "auto";
});