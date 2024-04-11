const { Router } = require('express');
const { insertarInventario } = require('../controller/inventario');

const router = Router();

router.post('/registrar/', insertarInventario);

module.exports = router;


