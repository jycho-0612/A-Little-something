// =====================================================
//  PETAL NOTES - script.js
//  1) draws the flower bouquets (SVG)
//  2) moves between the screens
// =====================================================


// ---------- PART 1: DRAWING FLOWERS ----------

// A petal shape that ends in a point
function pointed(r, w) {
  return "M0 0 C " + w + " " + (-r * 0.3) + " " + w + " " + (-r * 0.8) + " 0 " + (-r) +
         " C " + (-w) + " " + (-r * 0.8) + " " + (-w) + " " + (-r * 0.3) + " 0 0 Z";
}

// A petal shape with a round top
function rounded(r, w) {
  return "M0 0 C " + w + " " + (-r * 0.1) + " " + (w * 1.2) + " " + (-r) + " 0 " + (-r) +
         " C " + (-w * 1.2) + " " + (-r) + " " + (-w) + " " + (-r * 0.1) + " 0 0 Z";
}

// Draws a ring of petals turned around the center
function ring(count, shape, fill, rotation, stroke) {
  let out = "";
  for (let i = 0; i < count; i++) {
    const angle = rotation + (360 / count) * i;
    out += '<path d="' + shape + '" fill="' + fill + '" stroke="' + stroke +
           '" stroke-width="0.6" transform="rotate(' + angle + ')"/>';
  }
  return out;
}

// Each flower type draws itself around (0,0). "c" is its list of colors.
const HEADS = {
  rose(c) {
    return ring(6, rounded(30, 18), c[0], 0, c[3]) +
           ring(5, rounded(22, 14), c[1], 20, c[3]) +
           ring(4, rounded(14, 10), c[2], 45, c[3]) +
           '<circle r="4" fill="' + c[3] + '"/>';
  },
  peony(c) {
    return ring(9, rounded(30, 16), c[0], 0, c[2]) +
           ring(8, rounded(25, 14), c[1], 20, c[2]) +
           ring(7, rounded(19, 12), c[3], 10, c[2]) +
           ring(6, rounded(12, 8), c[1], 30, c[2]) +
           '<circle r="3" fill="#f4d56b"/>';
  },
  sunshine(c) {
    return ring(16, pointed(30, 6), c[0], 0, c[3]) +
           ring(16, pointed(22, 5), c[1], 11, c[3]) +
           '<circle r="9" fill="' + c[2] + '"/><circle r="5" fill="' + c[3] + '"/>';
  },
  daisy(c) {
    return ring(12, pointed(28, 6), c[0], 0, c[1]) +
           '<circle r="6" fill="' + c[2] + '"/>';
  },
  tulip(c) {
    return '<path d="M-18 20 C-26 -2 -22 -22 -14 -30 L-6 -16 L0 -32 L6 -16 L14 -30 C22 -22 26 -2 18 20 C8 28 -8 28 -18 20 Z" fill="' + c[0] + '" stroke="' + c[2] + '" stroke-width="0.8"/>' +
           '<path d="M0 -32 C-10 -14 -10 8 0 24 C10 8 10 -14 0 -32 Z" fill="' + c[1] + '" stroke="' + c[2] + '" stroke-width="0.6"/>';
  },
  lily(c) {
    let out = ring(6, pointed(32, 11), c[0], 0, c[1]) +
              ring(6, pointed(26, 9), c[1], 30, c[2]);
    // little stamens in the middle
    for (let i = 0; i < 5; i++) {
      const a = (i * 72 * Math.PI) / 180;
      const x = (14 * Math.sin(a)).toFixed(1);
      const y = (-14 * Math.cos(a)).toFixed(1);
      out += '<line x1="0" y1="0" x2="' + x + '" y2="' + y + '" stroke="' + c[2] + '" stroke-width="1"/>' +
             '<circle cx="' + x + '" cy="' + y + '" r="2" fill="#8a4b2a"/>';
    }
    return out;
  },
  lotus(c) {
    return ring(8, pointed(30, 9), c[0], 0, c[2]) +
           ring(8, pointed(22, 8), c[1], 22, c[2]) +
           ring(6, pointed(14, 6), c[2], 10, c[2]) +
           '<circle r="4" fill="' + c[3] + '"/>';
  },
  hydrangea(c) {
    let out = "";
    // little flowers placed in a spiral (golden angle)
    for (let i = 0; i < 22; i++) {
      const a = (i * 137.5 * Math.PI) / 180;
      const d = 30 * Math.sqrt(i / 22);
      const x = (d * Math.cos(a)).toFixed(1);
      const y = (d * Math.sin(a)).toFixed(1);
      out += '<g transform="translate(' + x + ' ' + y + ')">' +
             ring(4, rounded(8, 5), c[i % 3], 45, "#ffffff") +
             '<circle r="1.4" fill="#f7f0c8"/></g>';
    }
    return out;
  },
  meadow(c) {
    const spots = [[0, -8], [-14, 6], [14, 4], [-6, 18], [8, -22], [-20, -14], [20, -12]];
    let out = "";
    for (let i = 0; i < spots.length; i++) {
      out += '<g transform="translate(' + spots[i][0] + ' ' + spots[i][1] + ')">' +
             ring(5, rounded(9, 5), c[i % 3], 0, "#ffffff") +
             '<circle r="1.8" fill="#f2c94c"/></g>';
    }
    return out;
  }
};

// Where the 4 flowers go inside a bouquet (drawn back to front)
const LAYOUT = [
  { x: 58,  y: 108, s: 0.85 },
  { x: 142, y: 108, s: 0.85 },
  { x: 100, y: 120, s: 0.7 },
  { x: 100, y: 80,  s: 1.15 }
];

// The 8 bouquets
const BOUQUETS = [
  { id: "rose", name: "Rose", bg: "#f6e1e3", ribbon: "#9a5a5a",
    flowers: [["rose", ["#d9476e", "#e8688a", "#f08aa5", "#a52d4e"]],
              ["rose", ["#e8688a", "#f08aa5", "#f7b3c4", "#b83258"]],
              ["rose", ["#cf3f66", "#e0607f", "#ee8aa2", "#a52d4e"]],
              ["rose", ["#d9476e", "#e8688a", "#f08aa5", "#a52d4e"]]] },
  { id: "sunshine", name: "Sunshine", bg: "#f8f1d0", ribbon: "#a07a3a",
    flowers: [["daisy", ["#ffffff", "#e9e3cf", "#f3c53a"]],
              ["daisy", ["#ffffff", "#e9e3cf", "#f3c53a"]],
              ["sunshine", ["#f7c52b", "#fbd95e", "#8a5a1c", "#c98a1b"]],
              ["sunshine", ["#f7c52b", "#fbd95e", "#8a5a1c", "#c98a1b"]]] },
  { id: "meadow", name: "Meadow", bg: "#e9efe3", ribbon: "#4d6b57",
    flowers: [["meadow", ["#8fb0e8", "#ffffff", "#b9a6e0"]],
              ["meadow", ["#ffffff", "#b9a6e0", "#8fb0e8"]],
              ["meadow", ["#b9a6e0", "#8fb0e8", "#ffffff"]],
              ["meadow", ["#8fb0e8", "#ffffff", "#c9d8f5"]]] },
  { id: "tulip", name: "Tulip", bg: "#f9e4e0", ribbon: "#a8605a",
    flowers: [["tulip", ["#f4a6b4", "#f7bfc9", "#d9788c"]],
              ["tulip", ["#f7b59a", "#fbcdb8", "#d98a6a"]],
              ["tulip", ["#f4a6b4", "#f7bfc9", "#d9788c"]],
              ["tulip", ["#f08aa5", "#f7b3c4", "#c9607b"]]] },
  { id: "peony", name: "Peony", bg: "#f1e8d2", ribbon: "#a0605a",
    flowers: [["peony", ["#f3a1b6", "#f7b9c8", "#e07b97", "#fbd2dc"]],
              ["peony", ["#f7b9c8", "#fbd2dc", "#e98aa3", "#f3a1b6"]],
              ["peony", ["#f3a1b6", "#f7b9c8", "#e07b97", "#fbd2dc"]],
              ["peony", ["#ee8aa6", "#f5aec0", "#d9708d", "#fbd2dc"]]] },
  { id: "hydrangea", name: "Hydrangea", bg: "#e4eaf3", ribbon: "#5d6b88",
    flowers: [["hydrangea", ["#6f93d6", "#8fb0e8", "#4f74c0"]],
              ["hydrangea", ["#8fb0e8", "#a9c3f0", "#6f93d6"]],
              ["hydrangea", ["#4f74c0", "#6f93d6", "#8fb0e8"]],
              ["hydrangea", ["#6f93d6", "#8fb0e8", "#b9a6e0"]]] },
  { id: "lily", name: "Lily", bg: "#f6e1e3", ribbon: "#7a6a70",
    flowers: [["lily", ["#fbe3ea", "#f2a7bb", "#d6577d"]],
              ["lily", ["#fbe3ea", "#f2a7bb", "#d6577d"]],
              ["lily", ["#fdf0f3", "#f5b8c8", "#d6577d"]],
              ["lily", ["#fbe3ea", "#f2a7bb", "#d6577d"]]] },
  { id: "lotus", name: "Lotus", bg: "#f1ecd0", ribbon: "#a58a52",
    flowers: [["lotus", ["#f9d3df", "#fbe6ec", "#f1b0c4", "#f6d96b"]],
              ["lotus", ["#fbe6ec", "#f9d3df", "#f1b0c4", "#f6d96b"]],
              ["lotus", ["#f9d3df", "#fbe6ec", "#f1b0c4", "#f6d96b"]],
              ["lotus", ["#f7c3d3", "#fbe6ec", "#ee9db6", "#f6d96b"]]] }
];

// Builds the whole bouquet picture (leaves, stems, paper, flowers, bow)
function bouquetSVG(b) {
  const green = "#6f9a6a";
  let svg = '<svg viewBox="0 0 200 270" xmlns="http://www.w3.org/2000/svg">';

  // leaves
  svg += '<ellipse cx="40" cy="112" rx="24" ry="9" fill="' + green + '" transform="rotate(-35 40 112)"/>';
  svg += '<ellipse cx="160" cy="112" rx="24" ry="9" fill="' + green + '" transform="rotate(35 160 112)"/>';
  svg += '<ellipse cx="78" cy="70" rx="20" ry="7" fill="#82ad7b" transform="rotate(-60 78 70)"/>';
  svg += '<ellipse cx="124" cy="70" rx="20" ry="7" fill="#82ad7b" transform="rotate(60 124 70)"/>';

  // stems
  svg += '<g stroke="#5d8a5a" stroke-width="3" fill="none">' +
         '<path d="M100 170 Q80 130 58 108"/><path d="M100 170 Q120 130 142 108"/>' +
         '<path d="M100 170 L100 120"/><path d="M100 170 L100 80"/></g>';

  // paper cone
  svg += '<path d="M38 126 L162 126 L100 264 Z" fill="#b9b09b"/>';
  svg += '<path d="M38 126 L100 264 L100 150 Z" fill="#8f8672" opacity="0.35"/>';
  svg += '<path d="M38 126 Q100 152 162 126" fill="none" stroke="#d8d0bd" stroke-width="3"/>';

  // the 4 flowers
  for (let i = 0; i < LAYOUT.length; i++) {
    const spot = LAYOUT[i];
    const flower = b.flowers[i];
    svg += '<g transform="translate(' + spot.x + ' ' + spot.y + ') scale(' + spot.s + ')">' +
           HEADS[flower[0]](flower[1]) + '</g>';
  }

  // ribbon bow
  svg += '<path d="M100 192 C78 172 60 184 64 200 C68 214 90 204 100 194 Z" fill="' + b.ribbon + '"/>';
  svg += '<path d="M100 192 C122 172 140 184 136 200 C132 214 110 204 100 194 Z" fill="' + b.ribbon + '"/>';
  svg += '<path d="M97 196 L84 230 L94 224 L100 202 Z" fill="' + b.ribbon + '" opacity="0.85"/>';
  svg += '<path d="M103 196 L116 230 L106 224 L100 202 Z" fill="' + b.ribbon + '" opacity="0.85"/>';
  svg += '<circle cx="100" cy="195" r="7" fill="' + b.ribbon + '"/>';

  svg += "</svg>";
  return svg;
}

function findBouquet(id) {
  for (let i = 0; i < BOUQUETS.length; i++) {
    if (BOUQUETS[i].id === id) return BOUQUETS[i];
  }
  return BOUQUETS[0];
}


// ---------- PART 2: SCREENS ----------

let selectedId = "rose";   // the bouquet the person picked

function showScreen(name) {
  const screens = document.querySelectorAll(".screen");
  for (let i = 0; i < screens.length; i++) {
    screens[i].classList.remove("active");
  }
  document.getElementById("screen-" + name).classList.add("active");
  window.scrollTo(0, 0);
}

// Home picture
document.getElementById("hero").innerHTML = bouquetSVG(findBouquet("peony"));

// Pick screen: make one card for each bouquet
const grid = document.getElementById("grid");
for (let i = 0; i < BOUQUETS.length; i++) {
  const b = BOUQUETS[i];
  const card = document.createElement("div");
  card.className = "flower-card";
  card.style.backgroundColor = b.bg;
  card.innerHTML = bouquetSVG(b) + "<span>" + b.name + "</span>";
  card.addEventListener("click", function () {
    selectedId = b.id;
    const all = document.querySelectorAll(".flower-card");
    for (let j = 0; j < all.length; j++) all[j].classList.remove("selected");
    card.classList.add("selected");
  });
  if (b.id === selectedId) card.classList.add("selected");
  grid.appendChild(card);
}

document.getElementById("btn-start").addEventListener("click", function () { showScreen("pick"); });
document.getElementById("btn-to-write").addEventListener("click", function () { showScreen("write"); });
document.getElementById("btn-back-pick").addEventListener("click", function () { showScreen("pick"); });


// Makes the letter box grow so the whole message is always visible
const msgBox = document.getElementById("input-msg");
function autoGrow() {
  msgBox.style.height = "auto";
  msgBox.style.height = msgBox.scrollHeight + "px";
}
msgBox.addEventListener("input", autoGrow);
// the letter screen is hidden at first, so grow it when we arrive
document.getElementById("btn-to-write").addEventListener("click", autoGrow);