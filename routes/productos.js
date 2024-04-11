const { Router } = require('express');
const { listarProductos } = require('../controller/productos');

const router = Router();

router.post('/listar/', listarProductos);

module.exports = router;


