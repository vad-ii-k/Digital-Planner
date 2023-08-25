(function () {
  const doc = document
  const rootEl = doc.documentElement
  const body = doc.body
  const lightSwitch = doc.getElementById('lights-toggle')
  /* global ScrollReveal */
  const sr = window.sr = ScrollReveal()

  rootEl.classList.remove('no-js')
  rootEl.classList.add('js')

  window.addEventListener('load', function () {
    body.classList.add('is-loaded')
  })

  // Reveal animations
  function revealAnimations () {
    sr.reveal('.feature', {
      duration: 700,
      distance: '10%',
      easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      origin: 'right',
      viewFactor: 0.1
    })
  }

  if (body.classList.contains('has-animations')) {
    window.addEventListener('load', revealAnimations)
  }

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    lightSwitch.checked = false;
    checkLights();
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    lightSwitch.checked = !e.matches;
    checkLights();
  });

  // Light switcher
  if (lightSwitch) {
    window.addEventListener('load', checkLights)
    lightSwitch.addEventListener('change', checkLights)
  }

  function checkLights () {
    let labelText = lightSwitch.parentNode.querySelector('.label-text')
    let downloadButton = doc.getElementById('download-button')
    if (lightSwitch.checked) {
      body.classList.remove('lights-off')
      if (labelText) {
        labelText.innerHTML = 'dark'
      }
      if (downloadButton) {
        downloadButton.href = 'https://github.com/vad-ii-k/PDF-planner/raw/master/planners/planner-2023-light.pdf'
        downloadButton.innerHTML = 'Download light'
      }
    } else {
      body.classList.add('lights-off')
      if (labelText) {
        labelText.innerHTML = 'light'
      }
      if (downloadButton) {
        downloadButton.href = 'https://github.com/vad-ii-k/PDF-planner/raw/master/planners/planner-2023-dark.pdf'
        downloadButton.innerHTML = 'Download dark'
      }
    }
  }
}())
