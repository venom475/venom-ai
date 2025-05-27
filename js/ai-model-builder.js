document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('model-builder-form');
  const trainingStatusDiv = document.getElementById('training-status');

  let currentModelId = null;
  let statusInterval = null;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const modelName = formData.get('model-name');
    const modelType = formData.get('model-type');
    const epochs = formData.get('epochs');
    const learningRate = formData.get('learning-rate');
    // For simplicity, ignoring file upload handling here

    if (!modelName || !modelType) {
      alert('Please fill in required fields.');
      return;
    }

    try {
      // Create model
      const createResponse = await fetch('/api/models/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelName, modelType, epochs, learningRate }),
      });
      const createData = await createResponse.json();
      if (!createResponse.ok) {
        alert(createData.error || 'Failed to create model');
        return;
      }
      currentModelId = createData.model.id;
      trainingStatusDiv.textContent = 'Model created. Starting training...';

      // Start training
      const trainResponse = await fetch(`/api/models/train/${currentModelId}`, {
        method: 'POST',
      });
      const trainData = await trainResponse.json();
      if (!trainResponse.ok) {
        alert(trainData.error || 'Failed to start training');
        return;
      }

      // Poll training status every 2 seconds
      statusInterval = setInterval(async () => {
        const statusResponse = await fetch(`/api/models/status/${currentModelId}`);
        const statusData = await statusResponse.json();
        if (statusResponse.ok) {
          trainingStatusDiv.textContent = `Training Status: ${statusData.status}`;
          if (statusData.status === 'Training completed') {
            clearInterval(statusInterval);
          }
        } else {
          trainingStatusDiv.textContent = 'Error fetching training status';
          clearInterval(statusInterval);
        }
      }, 2000);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });
});
