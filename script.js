// Keep each scroll value between 0 and 1.
function limitProgress(value) {
  return Math.max(0, Math.min(1, value));
}

// Change the pictures as the visitor scrolls past these sections.
function updatePreparation() {
  const prepareTop = document.getElementById('prepare').getBoundingClientRect().top;
  const crackTop = document.getElementById('crack').getBoundingClientRect().top;
  const startPoint = window.innerHeight * 0.3;
  const cutProgress = limitProgress((startPoint - prepareTop) / 300);
  const crackProgress = limitProgress((startPoint - crackTop) / 300);
  document.getElementById('prep-whole').style.opacity = 1 - cutProgress;
  document.getElementById('prep-cut').style.opacity = cutProgress;
  document.getElementById('egg-whole').style.opacity = 1 - crackProgress;
  document.getElementById('egg-cracked').style.opacity = crackProgress;
  document.getElementById('prepare-status').textContent = cutProgress > 0.95 ? 'NICELY CUT.' : 'SCROLL TO CUT ↓';
  document.getElementById('crack-status').textContent = crackProgress > 0.95 ? 'CRACKED.' : 'SCROLL TO CRACK ↓';
}
// The heat goes from low to high, then settles at medium while scrolling.
function updateHeat() {
  const section = document.getElementById('heat');
  const scrollDistance = section.offsetHeight - window.innerHeight;
  const progress = limitProgress(-section.getBoundingClientRect().top / scrollDistance);
  const flame = document.getElementById('fire');
  const title = document.getElementById('heat-title');
  const status = document.getElementById('heat-status');
  const instruction = document.getElementById('heat-instruction');
  let flameSize;

  if (progress < 0.45) {
    flameSize = 0.55 + (progress / 0.45) * 0.8;
  } else if (progress < 0.7) {
    flameSize = 1.35 - ((progress - 0.45) / 0.25) * 0.5;
  } else {
    flameSize = 0.85;
  }

  flame.style.transform = 'scale(' + flameSize + ')';
  flame.style.opacity = 0.7 + progress * 0.3;

  let activeStep;
  if (progress < 0.25) {
    title.textContent = 'Low heat.';
    status.textContent = 'TOO COLD';
    status.style.color = '#f1eee7';
    instruction.textContent = 'SCROLL TO ADJUST ↓';
    flame.alt = 'Low flame';
    activeStep = 'heat-low';
  } else if (progress < 0.7) {
    title.textContent = 'High heat.';
    status.textContent = 'TOO HOT';
    status.style.color = '#ef452e';
    instruction.textContent = 'SCROLL TO ADJUST ↓';
    flame.alt = 'High flame';
    activeStep = 'heat-high';
  } else {
    title.textContent = 'Medium heat.';
    status.textContent = 'JUST RIGHT';
    status.style.color = '#efbc40';
    instruction.textContent = 'SCROLL TO CONTINUE ↓';
    flame.alt = 'Medium flame';
    activeStep = 'heat-medium';
  }

  ['heat-low', 'heat-high', 'heat-medium'].forEach(function (id) {
    document.getElementById(id).classList.toggle('active', id === activeStep);
  });
}

// The longer sections use extra page height for their scroll animation.
function updateStir() {
  const section = document.getElementById('stir');
  const distance = section.offsetHeight - window.innerHeight - 100;
  const progress = limitProgress((-section.getBoundingClientRect().top - 100) / distance);
  const tomatoFade = Math.min(1, progress * 2);
  const finishFade = limitProgress((progress - 0.5) * 2);
  document.getElementById('stir-eggs').style.opacity = 1 - finishFade;
  document.getElementById('stir-eggs').style.transform = 'translateX(' + tomatoFade * -17 + '%) scale(' + (1 - tomatoFade * 0.25) + ')';
  document.getElementById('stir-tomatoes').style.opacity = tomatoFade * (1 - finishFade);
  document.getElementById('stir-tomatoes').style.transform = 'translateX(21%) scale(.55)';
  document.getElementById('stir-finished').style.opacity = finishFade;
  const title = document.getElementById('stir-title');
  const detail = document.getElementById('stir-detail');

  if (progress >= 0.8) {
    title.textContent = 'TOMATO + EGG';
    detail.textContent = 'Fold the eggs into the tomatoes. Season and stir for 30 seconds.';
  } else if (progress >= 0.35) {
    title.textContent = 'EGGS + TOMATO';
    detail.textContent = 'Add the remaining oil. Cook the tomatoes for 3–5 minutes until juicy.';
  } else {
    title.textContent = 'EGGS';
    detail.textContent = 'Gently scramble until just set. Lift the eggs out.';
  }
  document.getElementById('stir-progress').style.width = progress * 100 + '%';
}

function revealSections() {
  ['ingredients', 'finish'].forEach(function (id) {
    const section = document.getElementById(id);
    const fullViewTop = Math.min(0, window.innerHeight - section.offsetHeight);
    section.classList.toggle('revealed', section.getBoundingClientRect().top < fullViewTop - 80);
  });
}
function updateOnScroll() {
  updatePreparation();
  updateHeat();
  updateStir();
  revealSections();
}

window.addEventListener('scroll', updateOnScroll, { passive: true });
window.addEventListener('resize', updateOnScroll);
updateOnScroll();
