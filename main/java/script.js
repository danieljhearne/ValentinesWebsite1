const yesBtn = document.getElementById("yesBtn");
const noBtn  = document.getElementById("noBtn");
const status = document.getElementById("status");
const reset  = document.getElementById("reset");

let noCount = 0;

const noPhrases = [
  "Bro, really?",
  "Twice??",
  "Just say yes lol",
  "...",
  "3 Years in and you are saying no??",
];

// --- PINBOARD DATA (edit these!) ---
// Put your images in a folder like /images/ and reference them here.
// week is ISO week number (1-53) OR you can just use date and we’ll compute it later if you want.
const pinEntries = [
  { date: "2024-02-08", title: "Founding of the NQ date", caption: "bunny tattoo looking fire", img: "main/images/firstNQ.jpg" },
  { date: "2025-02-14", title: "Valentine Ramen", caption: "Swag", img: "main/images/SickRamen.jpg" },
  { date: "2024-12-14", title: "Timbark Lovers", caption: "I cant even tell if you are actually drinking", img: "main/images/timbarklianna.jpg" },
  { date: "2024-12-14", title: "Timbark Lovers", caption: "Autistic eye contact", img: "main/images/timbarkdan.jpg" },
];

// ISO week number
function getISOWeek(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
}

function fmtDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function renderPinboard() {
  const pinboard = document.getElementById("pinboard");
  const board = document.getElementById("board");
  const pinSub = document.getElementById("pinSub");

  const now = new Date();
  const thisWeek = getISOWeek(now);

  pinSub.textContent = `Watch this space. Be here Feb 14th!!`;

  // Filter entries that match this week number
  const entriesThisWeek = pinEntries.filter(e => getISOWeek(new Date(e.date + "T00:00:00")) === thisWeek);

  board.innerHTML = "";

  const list = entriesThisWeek.length ? entriesThisWeek : pinEntries; // fallback: show all if none match

  list.forEach((e) => {
    const rot = (Math.random() * 6 - 3).toFixed(2);

    const el = document.createElement("article");
    el.className = "pin";
    el.style.setProperty("--r", `${rot}deg`);

    el.innerHTML = `
      <img src="${e.img}" alt="${e.title}">
      <h3>${e.title} • ${fmtDate(e.date)}</h3>
      <p>${e.caption}</p>
    `;

    board.appendChild(el);
  });

  pinboard.classList.add("show");
  pinboard.setAttribute("aria-hidden", "false");
}


function setStatus(html) {
  status.innerHTML = html;
}

/* Confetti (robust fallback if animate isn't supported) */
function confettiBurst() {
  const colors = ["#ff4fa3", "#ff9fcd", "#ffd1e6", "#ffffff", "#c93a7d"];

  const waves = 10;          // how many bursts
  const piecesPerWave = 35; // how much confetti per burst
  const waveDelay = 500;    // ms between bursts

  for (let w = 0; w < waves; w++) {
    setTimeout(() => {
      for (let i = 0; i < piecesPerWave; i++) {
        const piece = document.createElement("span");

        piece.style.position = "fixed";
        piece.style.left = Math.random() * 100 + "vw";
        piece.style.top = "-16px";
        piece.style.width = (5 + Math.random() * 6) + "px";
        piece.style.height = (8 + Math.random() * 14) + "px";
        piece.style.background = colors[(Math.random() * colors.length) | 0];
        piece.style.opacity = "0.95";
        piece.style.borderRadius = "2px";
        piece.style.zIndex = "9999";
        piece.style.pointerEvents = "none";

        const rot1 = Math.random() * 360;
        const rot2 = Math.random() * 360;
        const drift = (Math.random() - 0.5) * 40;
        const duration = 4200 + Math.random() * 2200; // ✨ longer fall

        document.body.appendChild(piece);

        piece.animate(
          [
            { transform: `translate(0,0) rotate(${rot1}deg)`, top: "-16px", offset: 0 },
            { transform: `translate(${drift}vw, 110vh) rotate(${rot2}deg)`, top: "110vh", offset: 1 }
          ],
          {
            duration,
            easing: "cubic-bezier(.15,.7,.2,1)",
            fill: "forwards"
          }
        );

        setTimeout(() => piece.remove(), duration + 200);
      }
    }, w * waveDelay);
  }
}

function lockInYes() {
  // add a class so CSS can hide the buttons/status
  const card = yesBtn.closest(".card");
  if (card) card.classList.add("accepted");

  yesBtn.disabled = true;
  noBtn.disabled = true;

  setStatus(`💕💕💕<br>Watch this space!!`);
  confettiBurst();

  // show pinboard after a tiny beat
  setTimeout(() => {
    renderPinboard();
  }, 400);
}


/* True teleport within the card (stays inside) */
function teleportNoButton() {
  const card = noBtn.closest(".card");
  if (!card) return;

  // Make sure card can position children
  // (your CSS already has .card { position: relative; } but this doesn't hurt)
  card.style.position = "relative";

  const cardRect = card.getBoundingClientRect();
  const btnRect  = noBtn.getBoundingClientRect();

  // padding so it never touches edges/tape
  const padding = 18;

  // Compute max top-left positions inside the card
  const maxX = Math.max(padding, cardRect.width  - btnRect.width  - padding);
  const maxY = Math.max(padding, cardRect.height - btnRect.height - padding);

  // Random position
  const x = Math.floor(padding + Math.random() * (maxX - padding));
  const y = Math.floor(padding + Math.random() * (maxY - padding));

  // Switch to absolute positioning for real teleport
  // (only affects No button)
  noBtn.style.position = "absolute";
  noBtn.style.left = `${x}px`;
  noBtn.style.top  = `${y}px`;
}

function handleNo() {
  noCount++;

  // scale values
  const yesScale = Math.min(1 + noCount * 0.12, 2.1);
  const noScale  = Math.max(1 - noCount * 0.08, 0.55);

  // apply via CSS variables (your button CSS should use these)
  yesBtn.style.setProperty("--s", yesScale.toFixed(2));
  noBtn.style.setProperty("--s",  noScale.toFixed(2));

  // true teleport
  teleportNoButton();

  const phrase = noPhrases[(noCount - 1) % noPhrases.length];
  setStatus(phrase);

  if (noCount >= 8) {
    lockInYes();
  }
}

function resetAll() {
  noCount = 0;
  yesBtn.disabled = false;
  noBtn.disabled = false;

  // reset scaling vars
  yesBtn.style.setProperty("--s", "1");
  noBtn.style.setProperty("--s", "1");

  // put No button back into normal flow
  noBtn.style.position = "";
  noBtn.style.left = "";
  noBtn.style.top = "";

   const card = yesBtn.closest(".card");
   if (card) card.classList.remove("accepted");

   const pinboard = document.getElementById("pinboard");
   const board = document.getElementById("board");
   if (pinboard) {
     pinboard.classList.remove("show");
     pinboard.setAttribute("aria-hidden", "true");
   }
   if (board) board.innerHTML = "";


  setStatus("");
}

yesBtn.addEventListener("click", lockInYes);
noBtn.addEventListener("click", handleNo);

reset.addEventListener("click", (e) => {
  e.preventDefault();
  resetAll();
});

resetAll();
