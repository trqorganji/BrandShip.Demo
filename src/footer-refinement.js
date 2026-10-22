import './footer-refinement.css';

// Use the same footer signature on Home and every internal page.
const footer = document.querySelector('footer');
if (footer) {
  footer.classList.add('refined-footer');
  const signature = footer.querySelector('.footer-top p');
  if (signature) signature.innerHTML = 'Building <em class="footer-iconic">Iconic</em><br>Saudi Brands';
}
