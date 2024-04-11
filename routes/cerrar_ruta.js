const { Router } = require('express');
const { cerrar } = require('../controller/cerrar_ruta');

const router = Router();

router.post('/cerrar_ruta/', cerrar);

module.exports = router;


