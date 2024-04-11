const { Router } = require('express');
const { liquidacion, detalleCobros, detalleDocCobros, detalleGastos, } = require('../controller/liquidacion');

const router = Router();

router.post('/liq/', liquidacion);
router.post('/detcobros/', detalleCobros);
router.post('/doccobros/', detalleDocCobros);

module.exports = router;


