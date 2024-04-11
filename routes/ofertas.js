const { Router } = require('express');
const { listarOfertas } = require('../controller/ofertas');

const router = Router();

router.post('/listar/', listarOfertas);

module.exports = router;


