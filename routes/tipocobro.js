const { Router } = require('express');
const { listarTipoCobro } = require('../controller/tipocobro');

const router = Router();

router.post('/listar/', listarTipoCobro);

module.exports = router;


