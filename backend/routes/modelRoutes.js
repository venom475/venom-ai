const express = require('express');
const router = express.Router();

// Placeholder for AI model data storage (in-memory for demo)
let models = [];
let trainingStatus = {};

// Create a new AI model
router.post('/create', (req, res) => {
  const { modelName, modelType, epochs, learningRate } = req.body;
  if (!modelName || !modelType) {
    return res.status(400).json({ error: 'Model name and type are required' });
  }
  const newModel = {
    id: models.length + 1,
    modelName,
    modelType,
    epochs,
    learningRate,
    status: 'created',
  };
  models.push(newModel);
  trainingStatus[newModel.id] = 'Not started';
  res.status(201).json({ message: 'Model created', model: newModel });
});

// Start training a model (simulated)
router.post('/train/:id', (req, res) => {
  const modelId = parseInt(req.params.id);
  const model = models.find(m => m.id === modelId);
  if (!model) {
    return res.status(404).json({ error: 'Model not found' });
  }
  trainingStatus[modelId] = 'Training in progress';
  // Simulate training delay
  setTimeout(() => {
    trainingStatus[modelId] = 'Training completed';
  }, 5000);
  res.json({ message: 'Training started', modelId });
});

// Get training status
router.get('/status/:id', (req, res) => {
  const modelId = parseInt(req.params.id);
  const status = trainingStatus[modelId];
  if (!status) {
    return res.status(404).json({ error: 'Model not found or no status available' });
  }
  res.json({ modelId, status });
});

module.exports = router;
