const { Router } = require('express');
const { insertarOrdenes } = require('../controller/ordenes_an');

const router = Router();

router.post('/registrar/', insertarOrdenes);

module.exports = router;


