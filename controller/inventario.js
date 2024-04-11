require("dotenv").config();
var moment = require("moment");
const conn = require("../services/db");

let Autorization = process.env.AUTORIZATION;

const verificar_comunicacion_sql =
  "SELECT * FROM XXDCRN_PREVENTA_CTRL_TBL WHERE IFNULL(FLAG_CTRL, 'N')  = 'Y' AND RUTA = ? AND ID_COMUNICACION = ?";

const insert_inv_sql = "INSERT INTO XXDCRN_PREVENTA_INV_FINAL_TBL (FECHA " +
  ",RUTA " +
  ",COD_PRODUCTO " +
  ",CANTIDAD " +
  ",UDM " +
  ",FLAG_PRC " +
  ",BATCH_PRC " +
  ") VALUES ? ";

let V_COD_PRODUCTO = "";
let V_CANTIDAD = "";
let V_UDM = "";

const insertarInventario = async (req, res = response) => {

  let token = req.headers.authorization;
  let cod_ruta = req.headers.cod_ruta;
  let fecha = req.headers.fecha;
  let id_comunicacion = req.headers.id_comunicacion;

  var v_batch = moment().format("YYYYMMDDHHmmss");

  let { inventario } = req.body;
  let count = inventario.length;

  console.log(inventario);

  if (Autorization != token) {
    res.json({
      ok: false,
      message: "Acceso No Autorizado.",
    });
  } else {
    try {

      conn.query(verificar_comunicacion_sql, [cod_ruta, id_comunicacion], function (err, result) {
        if (err) throw err;

        if (result.length == 0) {
          if (count == 0) {

            res.json({
              ok: true,
              message: "No existen datos para procesar.",
              registros: count,
              cod_ruta,
            });

          } else {

            params = [];

            inventario.forEach(async function (Value, index, arr) {

              V_COD_PRODUCTO = Value.COD_PRODUCTO;
              V_CANTIDAD = Value.CANTIDAD;
              V_UDM = Value.UDM;

              const datos = [
                fecha,
                cod_ruta,
                V_COD_PRODUCTO,
                V_CANTIDAD,
                V_UDM,
                'N',
                v_batch
              ];

              params.push(datos);

            });
            console.log(params);

            conn.query(insert_inv_sql, [params], function (err, result) {
              if (err) throw err;

              res.json({
                ok: true,
                message: "Datos Procesados.",
                cod_ruta,
              });

            });

          }
        } else {
          res.json({
            ok: false,
            message: "La ruta ya fue cerrada para comunicaciones.",
            cod_ruta,
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
  insertarInventario,
};