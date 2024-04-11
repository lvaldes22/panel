const { Router } = require('express');
const { insertarOrdenes } = require('../controller/ordenes');

const router = Router();

router.post('/registrar/', insertarOrdenes);

module.exports = router;


