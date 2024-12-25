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
    const firstDownloadButton = document.getElementById('download-button-1');
    // const secondDownloadButton = document.getElementById('download-button-2');
    const isLightsOn = lightSwitch.checked;

    document.body.classList.toggle('lights-off', !isLightsOn);
    labelText.innerHTML = isLightsOn ? 'dark' : 'light';
    const theme = isLightsOn ? 'light' : 'dark';

    let year = 2025;
    firstDownloadButton.href = `https://github.com/vad-ii-k/PDF-planner/raw/master/planners/planner-${year}-${theme}.pdf`;
    firstDownloadButton.innerHTML = `Download ${theme}`;

    // year = 2025
    // secondDownloadButton.href = `https://github.com/vad-ii-k/PDF-planner/raw/master/planners/planner-${year}-${theme}.pdf`;
    // secondDownloadButton.innerHTML = `${theme} ${year}`;
  }

  if (lightSwitch) {
    checkLights();
    lightSwitch.addEventListener('change', checkLights);
  }
}());
