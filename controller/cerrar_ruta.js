require("dotenv").config();
const conn = require("../services/db");
var moment = require("moment");
let Autorization = process.env.AUTORIZATION;

var insert_com_sql = "INSERT INTO XXDCRN_PREVENTA_CTRL_TBL (RUTA, ID_COMUNICACION, FECHA, FLAG_CTRL) VALUES ?";

const verificar_com_sql =
  "SELECT * FROM XXDCRN_PREVENTA_CTRL_TBL WHERE IFNULL(FLAG_CTRL, 'N')  = 'Y' AND RUTA = ? AND ID_COMUNICACION = ?";


const cerrar = async (req, res = response) => {


  let token = req.headers.authorization;
  let cod_ruta = req.headers.cod_ruta;
  let id_comunicacion = req.headers.id_comunicacion;
  let fecha = moment().format("YYYY-MM-DD");

  if (Autorization != token) {
    res.json({
      ok: false,
      message: "Acceso No Autorizado.",
    });
  } else {
    try {

      conn.query(verificar_com_sql, [cod_ruta, id_comunicacion], function (err, result) {
        if (err) throw err;
        console.log(result);


        if (result.length == 0) {

          res.json({
            ok: false,
            message: "La ruta ya fue cerrada para comunicaciones.",
            cod_ruta,
          });

        } else {

          const params = [[cod_ruta, id_comunicacion, fecha, 'Y']];

          conn.query(insert_com_sql, [params], function (err, result) {
            if (err) throw err;
            res.json({
              ok: true,
              message: "Ruta Cerrada.",
              cod_ruta,
            });
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
  cerrar,
};