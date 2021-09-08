'use strict'
const express = require('express');
const router = express.Router();
const controller = require('../controllers/product-controller');

router.get('/', controller.get);
router.getBySlug('/:slug', controller.getBySlug);
router.getById('/admin/:id', controller.getById);
router.getByTag('/tags/:tag', controller.getByTag);
router.post('/', controller.post);
router.put('/:id', controller.put);
router.delete('/:id', controller.deleted);

module.exports = router;