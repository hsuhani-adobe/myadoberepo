// Dynamic slideshow that uses your button & slide class names.
// - Replaces authored ">>" and "<<" rows with real buttons (or falls back to first/last row)
// - Pairs each <picture> with the next non-picture row as its content
// - Shows only the first slide initially
// - Right button shows next slide, left button shows previous slide

function isControlRow(row) {
  const t = (row.textContent || '').trim();
  return t === '>>' || t === '<<';
}
function hasPicture(row) {
  return !!row.querySelector('picture');
}

export default function decorate(block) {
  // 1) Snapshot authored rows (Franklin leaves them as <div> rows)
  const rows = Array.from(block.children);

  // 2) Find/control rows for buttons if present
  let nextRowIdx = rows.findIndex(isControlRow);             // typically ">>"
  let prevRowIdx = rows.slice().reverse().findIndex(isControlRow);
  if (prevRowIdx !== -1) prevRowIdx = rows.length - 1 - prevRowIdx; // from end to actual index

  // Fallbacks: if not author-provided, use first/last rows as placeholders
  if (nextRowIdx === -1) nextRowIdx = 0;
  if (prevRowIdx === -1) prevRowIdx = rows.length - 1;

  // 3) Build slides by pairing each <picture> with the *next* non-picture row (caption)
  //    and ignoring control-only rows.
  const slides = [];
  const used = new Set();

  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    if (used.has(i)) continue;
    if (!hasPicture(row)) continue;             // only start at a picture row
    if (i === nextRowIdx || i === prevRowIdx) continue;

    const pictureRow = row;
    used.add(i);

    // find the nearest following non-picture, non-control row as caption
    let captionRow = null;
    for (let j = i + 1; j < rows.length; j += 1) {
      if (used.has(j)) continue;
      if (hasPicture(rows[j])) break;           // next picture reached => stop
      if (isControlRow(rows[j])) { used.add(j); continue; } // skip control rows
      captionRow = rows[j];
      used.add(j);
      break;
    }

    // Create a slide element with image + content BELOW it
    const slide = document.createElement('div');
    slide.classList.add('slide');

    const media = document.createElement('div');
    media.classList.add('slide-media');
    const pic = pictureRow.querySelector('picture');
    if (pic) media.appendChild(pic);            // move <picture> (keeps responsive sources)

    const content = document.createElement('div');
    content.classList.add('slide-text');
    if (captionRow) {
      while (captionRow.firstChild) content.appendChild(captionRow.firstChild);
    }

    slide.append(media, content);
    slides.push(slide);
  }

  // If nothing detected, bail
  if (!slides.length) return;

  // 4) Clear the block and rebuild: buttons + track(slides)
  block.innerHTML = '';

  // Create the two buttons (your classes)
  const nextbtn = document.createElement('button');
  nextbtn.classList.add('btn', 'btn-next');
  nextbtn.type = 'button';
  nextbtn.textContent = '>>';

  const prevbtn = document.createElement('button');
  prevbtn.classList.add('btn', 'btn-prev');
  prevbtn.type = 'button';
  prevbtn.textContent = '<<';

  // Track wrapper (so we can use translateX)
  const wrapper = document.createElement('div');
  wrapper.classList.add('carousel-wrapper');

  const track = document.createElement('div');
  track.classList.add('slides'); // matches your querySelectorAll(".slide") pattern below

  slides.forEach((s, idx) => {
    // accessibility
    s.setAttribute('role', 'group');
    s.setAttribute('aria-roledescription', 'slide');
    s.setAttribute('aria-label', `Slide ${idx + 1} of ${slides.length}`);
    track.appendChild(s);
  });

  // Assemble: prev button | slides | next button (buttons visually sit on sides via CSS)
  wrapper.append(prevbtn, track, nextbtn);
  block.append(wrapper);

  // 5) Position slides side-by-side; only first is visible initially
  const allSlides = track.querySelectorAll('.slide');
  allSlides.forEach((slide, indx) => {
    slide.style.transform = `translateX(${indx * 100}%)`;
  });

  // 6) Navigation
  let cur = 0;
  const max = allSlides.length - 1;

  function update() {
    // Keep each slide positioned relative to the current index
    allSlides.forEach((slide, indx) => {
      slide.style.transform = `translateX(${(indx - cur) * 100}%)`;
    });
    // Optional: disable buttons on edges (non-looping)
    prevbtn.disabled = cur === 0;
    nextbtn.disabled = cur === max;
  }

  nextbtn.addEventListener('click', () => {
    if (cur < max) { cur += 1; update(); }
  });

  prevbtn.addEventListener('click', () => {
    if (cur > 0) { cur -= 1; update(); }
  });

  // Keyboard support (optional)
  wrapper.tabIndex = 0;
  wrapper.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); nextbtn.click(); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); prevbtn.click(); }
  });

  // First render
  update();

  // Keep alignment on resize (optional but nice)
  let resizeTO;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTO);
    resizeTO = setTimeout(update, 120);
  });
}
