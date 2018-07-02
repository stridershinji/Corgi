const container = document.getElementById('imageContainer');
const pic = document.getElementById('pic');
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
const zoomResetBtn = document.getElementById('zoomReset');
const zoomCounterStart = 1;
const zoomScaleConstant = 1.2;
const pictureBaseHeight = 250;
const pictureBaseWidth = 250;
const rootUrl = 'http://placecorgi.com/';
const urlExpression = `http:\/\/placecorgi.com\/([0-9]+)\/([0-9]+)(?=[^\/]*$)`;
const picScaleExpression = `^scale\((.*)\)$`;

let isDragging = false;
let lastX = 0;
let lastY = 0;
let zoomCounter = 1;

function dragStart(e) {
  [lastX, lastY] = [e.clientX - pic.offsetLeft, e.clientY - pic.offsetTop];
  isDragging = true;
}

function move(e) {
  if (!isDragging) { return }
  pic.style.left = `${e.clientX - lastX}px`;
  pic.style.top = `${e.clientY - lastY}px`;
  [lastX, lastY] = [e.clientX - pic.offsetLeft, e.clientY - pic.offsetTop];
}

function getPicUrlMatch() {
  const picUrl = pic.src;
  return picUrl.match(urlExpression);
}

function zoomIn() {

  const picMatch = getPicUrlMatch();

  zoomCounter++;

  if (zoomCounter > 3) {
    zoomReset();
    return;
  }

  pic.classList.add('zoomIn');

  const imageWidth = parseInt(picMatch[1]) * zoomScaleConstant;
  const imageHeight = parseInt(picMatch[2]) * zoomScaleConstant;

  pic.addEventListener('transitionend', () => {
    pic.width = imageWidth;
    pic.height = imageHeight;
    pic.src = `${rootUrl}${imageWidth}/${imageHeight}`;
    pic.classList.remove('zoomIn');
  });

  console.log(`Zoom In ${zoomCounter}`);
}

function zoomOut() {
  const picMatch = getPicUrlMatch();

  zoomCounter--;

  if (zoomCounter <= 1) {
    zoomReset();
    return;
  }

  pic.classList.add('zoomOut');
  const imageWidth = parseInt(picMatch[1]) / zoomScaleConstant;
  const imageHeight = parseInt(picMatch[2]) / zoomScaleConstant;

  pic.addEventListener('transitionend', () => {
    pic.width = imageWidth;
    pic.height = imageHeight;
    pic.src = `${rootUrl}${imageWidth}/${imageHeight}`;
    pic.classList.remove('zoomOut');
  });

  console.log(`Zoom Out ${zoomCounter}`);
}

function zoomReset() {
  pic.removeAttribute('width');
  pic.removeAttribute('height');
  pic.src = `${rootUrl}${pictureBaseWidth}/${pictureBaseHeight}`;
  pic.style.removeProperty('top');
  pic.style.removeProperty('left');
  zoomCounter = zoomCounterStart;
  console.log(`Zoom Reset ${zoomCounter}`);
}

container.addEventListener('mousedown', dragStart);
container.addEventListener('mousemove', move);
container.addEventListener('mouseup', () => isDragging = false);
container.addEventListener('mouseout', () => isDragging = false);

zoomInBtn.addEventListener('click', zoomIn);
zoomOutBtn.addEventListener('click', zoomOut);
zoomResetBtn.addEventListener('click', zoomReset);