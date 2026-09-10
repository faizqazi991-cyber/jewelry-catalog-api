const express = require('express');
const validate = require('../middleware/validate');
const { requireAdmin } = require('../middleware/auth');
const { productBody, productUpdate, idParam, listQuery } = require('../validators/product');
const controller = require('../controllers/products');

const router = express.Router();
router.get('/', validate(listQuery, 'query'), controller.list);
router.get('/:id', validate(idParam, 'params'), controller.getById);
router.post('/', requireAdmin, validate(productBody), controller.create);
router.put('/:id', requireAdmin, validate(idParam, 'params'), validate(productUpdate), controller.update);
router.delete('/:id', requireAdmin, validate(idParam, 'params'), controller.remove);
module.exports = router;
