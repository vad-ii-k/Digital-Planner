(function () {
  const lightSwitch = document.getElementById('lights-toggle');

  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');
  document.body.classList.add('is-loaded');

  const sr = window.sr = ScrollReveal();
  function revealAnimations() {
    sr.reveal('.feature', {
      duration: 700,
      distance: '10%',
      easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      origin: 'right',
      viewFactor: 0.1,
    });
  }

  if (document.body.classList.contains('has-animations')) {
    revealAnimations();
  }

  function handleColorSchemeChange(e) {
    lightSwitch.checked = !e.matches;
    checkLights();
  }

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    lightSwitch.checked = false;
    checkLights();
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleColorSchemeChange);

  function checkLights() {
    const labelText = lightSwitch.parentNode.querySelector('.label-text');
    const downloadButton = document.getElementById('download-button');
    const isLightsOn = lightSwitch.checked;

    document.body.classList.toggle('lights-off', !isLightsOn);
    labelText.innerHTML = isLightsOn ? 'dark' : 'light';
    downloadButton.href = `https://github.com/vad-ii-k/PDF-planner/raw/master/planners/planner-2023-${isLightsOn ? 'light' : 'dark'}.pdf`;
    downloadButton.innerHTML = `Download ${isLightsOn ? 'light' : 'dark'}`;
  }

  if (lightSwitch) {
    checkLights();
    lightSwitch.addEventListener('change', checkLights);
  }
}());
