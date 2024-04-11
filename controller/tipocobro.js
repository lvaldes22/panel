require("dotenv").config();
const conn = require("../services/db");

let Autorization = process.env.AUTORIZATION;

const listar_tipo_cobro_sql = 
"SELECT   " +
"      COD_COBRO " +
"     ,NOM_COBRO " +
"FROM  XXDCRN_PREVENTA_TIPO_COBRO_TBL";

const listarTipoCobro = async (req, res = response) => {
  
  let token = req.headers.authorization;
  let cod_ruta = req.headers.cod_ruta;

  if (Autorization != token) {
    res.json({
      ok: false,
      message: "Acceso No Autorizado.",
      token,
      Autorization,
      cod_ruta,
    });
  } else {
    try {

      conn.query(listar_tipo_cobro_sql, function (err, result) {
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
  listarTipoCobro,
};
