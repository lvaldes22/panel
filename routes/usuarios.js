const { Router } = require('express');
const { buscarUsuario} = require('../controller/usuarios');

const router = Router();

router.post('/auth/', buscarUsuario);

module.exports = router;


