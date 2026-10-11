import './footer-refinement.css';

// Keep Home's composition unchanged; unify the internal-page footer signature.
if (!document.body.classList.contains('home-page')) {
  const footer = document.querySelector('footer');
  if (footer) {
    footer.classList.add('refined-footer');
    const signature = footer.querySelector('.footer-top p');
    if (signature) signature.innerHTML = 'Building <em class="footer-iconic">Iconic</em><br>Saudi Brands';
  }
}
