const express = require('express');
const router = express.Router();
const presController = require('../controllers/prescription.controller');
const auth = require('../middleware/auth');

router.post('/', auth, presController.createPrescription);
router.get('/', auth, presController.getPrescriptions);
router.get('/:id', auth, presController.getPrescription);
router.put('/:id', auth, presController.updatePrescription);
router.delete('/:id', auth, presController.deletePrescription);

module.exports = router;