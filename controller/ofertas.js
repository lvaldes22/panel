require("dotenv").config();
const conn = require("../services/db");
let Autorization = process.env.AUTORIZATION;

const listar_ofertas_sql =
"SELECT  " + 
"COD_LINEA  " +  
"COD_SUBLINEA    " + 
",COD_PRODUCTO   " + 
",COD_OFERTA   " + 
",NUM_REGISTRO   " + 
",FECHA_FINAL   " + 
",VAL_PORCENTAJE  " + 
",VAL_PRECIO  " + 
",CANT_BON_MISMO   " + 
",CANT_BON_OTRO   " + 
",CANT_INI_OFERTA   " + 
",CANT_FIN_OFERTA   " + 
",CANT_FACTOR   " + 
",COD_PROD_REGALIA   " + 
",TIP_OFERTA_CLIENTE   " + 
",NULL CAMPOAD1  " + 
",COD_TIPO_CLIENTE   " + 
",COD_ZONA_CLIENTE   " + 
",COD_CLIENTE  " + 
",COD_RUTA   " + 
",COD_CIA   " + 
",FECHA_INICIAL  " + 
",COD_PRODUCTO_REF   " + 
",COD_DIVISION  " + 
",NULL CAMPOAD2  " + 
",NULL CAMPOAD3  " + 
"FROM  XXDCRN_PREVENTA_OFERTAS_TBL " + 
 "WHERE COD_RUTA = ? ";

const listarOfertas = async (req, res = response) => {
  
  let token = req.headers.authorization;
  let cod_ruta = req.headers.cod_ruta;

  if (Autorization != token) {
    res.json({
      ok: false,
      message: "Acceso No Autorizado.",
    });
  } else {
    try {

      conn.query(listar_ofertas_sql, [cod_ruta], function (err, result) {
        if (err) throw err;
        console.log(result);

        if (result.length == 0) {
          res.json({
            ok: false,
            message: "No existen datos.",
          });
        } else {
          const data = result;

          res.json({
            ok: true,
            data,
            message: "datos existentes.",
          });
        }

      });

    } catch (err) {
      res.status(500).json({
        ok: false,
        err: err,
        msg: "Error inesperado",
      });
    }
  }
};

module.exports = {
  listarOfertas,
};
