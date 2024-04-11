require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use( cors() );
app.use( express.json() )
app.use('/mobile/cerrar', require('./routes/cerrar_ruta'));
app.use('/mobile/clientes', require('./routes/clientes'));
app.use('/mobile/inventario', require('./routes/inventario'));
app.use('/mobile/liquidacion', require('./routes/liquidacion'));
app.use('/mobile/ofertas', require('./routes/ofertas'));
app.use('/mobile/ordenes', require('./routes/ordenes'));
app.use('/mobile/aordenes', require('./routes/ordenes_an'));
app.use('/mobile/productos', require('./routes/productos'));
app.use('/mobile/user', require('./routes/usuarios'));
app.use('/mobile/tipocobro', require('./routes/tipocobro'));
app.listen(process.env.PORTBK, ()=>{
    console.log("Server corriendo en puerto",process.env.PORTBK)
})