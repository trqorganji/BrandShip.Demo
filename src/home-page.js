const track = document.querySelector('.home-logo-track');
if (track) {
  const copy = track.firstElementChild.cloneNode(true);
  copy.setAttribute('aria-hidden', 'true');
  track.append(copy);
  const button = document.querySelector('.home-logo-pause');
  button.addEventListener('click', () => {
    const paused = document.querySelector('.home-trust').classList.toggle('is-paused');
    button.setAttribute('aria-pressed', String(paused));
    button.textContent = paused ? 'Resume logos' : 'Pause logos';
  });
}
