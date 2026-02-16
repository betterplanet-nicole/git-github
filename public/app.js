const leadForm = document.querySelector('#leadForm');
const formStatus = document.querySelector('#formStatus');
const awsResponse = document.querySelector('#awsResponse');

document.querySelector('#year').textContent = new Date().getFullYear();

async function loadAwsArchitecture() {
  try {
    const response = await fetch('/api/aws-solution');
    const payload = await response.json();
    awsResponse.textContent = JSON.stringify(payload, null, 2);
  } catch (error) {
    awsResponse.textContent = 'Could not load AWS recommendation.';
  }
}

leadForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  formStatus.textContent = 'Submitting...';

  const data = Object.fromEntries(new FormData(leadForm).entries());

  try {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const payload = await response.json();

    if (!response.ok) {
      formStatus.textContent = `Error: ${payload.error}`;
      return;
    }

    formStatus.textContent = `Success! Lead #${payload.leadId} submitted. We will contact you shortly.`;
    leadForm.reset();
  } catch (error) {
    formStatus.textContent = 'Unexpected error submitting your form.';
  }
});

loadAwsArchitecture();
