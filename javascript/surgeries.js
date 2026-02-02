document.addEventListener("DOMContentLoaded", function () {

  const bookConsultation = document.getElementById('bookConsultation');
  if (bookConsultation) {
    bookConsultation.onclick = () => window.location.href = 'appointment.html';
  }

  const exploreSurgeries = document.getElementById('exploreSurgeries');
  if (exploreSurgeries) {
    exploreSurgeries.onclick = () =>
      document.getElementById('surgery-section')
        ?.scrollIntoView({ behavior: 'smooth' });
  }

  const talkSurgeon = document.getElementById('talkSurgeon');
  if (talkSurgeon) {
    talkSurgeon.onclick = () =>
      alert('Consult a surgeon feature coming soon!');
  }

  const costEstimate = document.getElementById('costEstimate');
  if (costEstimate) {
    costEstimate.onclick = () =>
      window.location.href = 'cost-estimate.html';
  }

  const cta = document.getElementById('stickyCta');
  const ctaClose = document.getElementById('ctaClose');

  if (cta && ctaClose) {
    ctaClose.addEventListener('click', () => {
      cta.style.display = 'none';
    });
  }

});

