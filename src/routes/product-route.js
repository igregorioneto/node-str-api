'use strict'
const express = require('express');
const router = express.Router();
const controller = require('../controllers/product-controller');
const authService = require('../services/auth-service');

router.get('/', controller.get);
router.getBySlug('/:slug', controller.getBySlug);
router.getById('/admin/:id', controller.getById);
router.getByTag('/tags/:tag', controller.getByTag);
router.post('/', authService.isAdmin, controller.post);
router.put('/:id', authService.isAdmin, controller.put);
router.delete('/:id', authService.isAdmin, controller.deleted);

module.exports = router;