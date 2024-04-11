const { Router } = require('express');
const { listarClientes } = require('../controller/clientes');

const router = Router();

router.post('/listar/', listarClientes);

module.exports = router;


