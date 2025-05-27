document.getElementById('generate-btn').addEventListener('click', async () => {
  const prompt = document.getElementById('prompt').value.trim();
  const generatedCodeElem = document.getElementById('result');
  generatedCodeElem.textContent = 'Generating...';

  if (!prompt) {
    generatedCodeElem.textContent = 'Please enter a prompt.';
    return;
  }

  try {
    const response = await fetch('http://localhost:8080/api/generate-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      const errorData = await response.json();
      generatedCodeElem.textContent = `Error: ${errorData.error || 'Unknown error'}`;
      return;
    }

    const data = await response.json();
    generatedCodeElem.textContent = data.generatedCode || 'No code generated.';
  } catch (error) {
    generatedCodeElem.textContent = `Error: ${error.message}`;
  }
});
