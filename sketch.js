// Variable initialization
const ppi = 96; // pixels per inch
// const width_mm = 210; // width in millimeters (multiple of 96ppi = 96*8*24,4/96)
// const height_mm = 297; // height in millimeters

// let w = mm2px(width_mm, ppi);
// let h = mm2px(height_mm, ppi);

let w, h; // width and height of canvas

let strokeW_mm = 0.1 // stroke weigth in mm
let sw = mm2px(strokeW_mm, ppi);

const nshapes = 500; // number of beziers and array of beziers
let shapes;

let xCenter, yCenter; // center of the canvas
let radius; // radius to contain shapes
// let stepRays = 0.0005;
// let rayLength = 100;

let reducePI = Math.PI / 200; // stripe some delta from a complete PI
let deltAngle = (Math.PI - reducePI) / nshapes;

// Perlin noise initialization
// const nSeed = 5;
const dNoise = 0.05;

// Bezier control point variables
let deltX = 0.0;
let deltY = 0.0;
let amplitudeX;
let amplitudeY;

let draw; // SVG canvas

let selectSingularity = false; // has the Singularity been identified ?
let isSingularity = false; // is the current Shape the Singularity ?

let click = function () {
  let svg = draw.svg();
  let blob = new Blob([svg], { type: "image/svg+xml" });

  let dl = document.createElement("a");
  dl.download = "SVGLights-" + getTimeStamp() + ".svg";
  dl.href = URL.createObjectURL(blob);
  dl.dataset.downloadurl = ["image/svg+xml", dl.download, dl.href].join(':');
  dl.style.display = "none";
  document.body.appendChild(dl);

  dl.click();

  document.body.removeChild(dl);
}

init();

window.addEventListener('resize', windowResized);

function windowResized() {
  let elements = document.body.getElementsByTagName("svg");
  document.body.removeChild(elements[0]);
  selectSingularity = false;
  isSingularity = false;
  init();
}

function init() {
  shapes = [];
  noise.seed(Math.random());

  w = h = Math.min(document.body.clientWidth, document.body.clientHeight);
  radius = w * 0.9 / 2; // 90% of canvas
  xCenter = yCenter = w/2; // center of canvas

  amplitudeX = radius * 4 * noise.perlin2(Math.random(), Math.random());
  amplitudeY = radius * 2 * noise.perlin2(Math.random(), Math.random());
  console.log("amplitudes: ", amplitudeX, amplitudeY);

  draw = SVG().addTo('body').size(w, h);

  let groups = [draw.group().addClass('singularity'), draw.group().addClass('other')]; // groups to handle Singularity and the rest

  for (let sh = 1; sh < nshapes; sh++) {

    deltX = noise.perlin2(dNoise * sh, 0.1);
    deltY = noise.perlin2(0.1, dNoise * sh);
    // console.log("deltXY: ", deltX, deltY);

    let shape = new ShapeBezier(isSingularity, deltAngle * sh, deltX, deltY);
    shapes.push(ShapeBezier);
    shape.draw(draw, groups);
    isSingularity = false;
    // angleDirection = Math.angleRadians(cX, cY, w/2 + offsetCenter(w/2), h/2+offsetCenter(h/2));
  }

  let rect = draw.rect(w, h).stroke({ color: '#000000' }).back();
  draw.on('click', click);
}

// function calculateStartPoint() {
//   let startEdge = Math.round(fxrand() * 3.5); // 0 North, 1 East, 2 South, 3 West
//   // console.log(startEdge);

//   xStartPoint = fxrand() * w;
//   yStartPoint = fxrand() * h;

//   switch (startEdge) {
//     case 0:
//       yStartPoint = 0;
//       break;
//     case 1:
//       xStartPoint = w;
//       break;
//     case 2:
//       yStartPoint = h;
//       break;
//     default:
//       xStartPoint = 0;
//   }

//   angleDirection = Math.angleRadians(xStartPoint, yStartPoint, w/2 + offsetCenter(w/2), h/2+offsetCenter(h/2));

//   // console.log(xStartPoint, yStartPoint, angleDirection);
// }

// function getRandomAngle() { // intelligence à ajouter ici
//   return Math.map((fxrand() * Math.PI / 2), 0, Math.PI/2, -Math.PI/4, Math.PI/4);
// }

// function offsetCenter(val) {
//   let valb = val * 0.20;
//   return Math.map(fxrand() * valb, 0, valb, -valb/2, valb/2); // offset by -10%/+10% of val
// }

/* group.front(); // beating hexagone on top of the rest
window.$fxhashFeatures['Singularity'] = getBeating();
console.log("Color: "+window.$fxhashFeatures.Palette);
console.log("StrokeWeight: "+window.$fxhashFeatures.StrokeWeight);
console.log("Transform: "+window.$fxhashFeatures.Transform);
console.log("Singularity: "+window.$fxhashFeatures.Singularity); */