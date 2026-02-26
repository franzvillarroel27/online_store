const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/categoriesController');

router.get('/', ctrl.getCategories);
router.get('/:id', ctrl.getCategoryById);

module.exports = router;
