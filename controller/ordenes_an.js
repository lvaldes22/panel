require("dotenv").config();
const conn = require("../services/db");
const fs = require("fs");
var moment = require("moment");
var v_batch = '';
var v_fecha = '';

let Autorization = process.env.AUTORIZATION;

const verificar_comunicacion_sql =
  "SELECT * FROM XXDCRN_PREVENTA_CTRL_TBL WHERE IFNULL(FLAG_CTRL, 'N')  = 'Y' AND RUTA = ? AND ID_COMUNICACION = ?";

const insert_ord_sql =
  "INSERT INTO XXDCRN_PREVENTA_AORDENES_TBL " +
  "                                      (SUCURSAL " +
  "                                      ,RUTA " +
  "                                      ,NO_ORDEN " +
  "                                      ,TIPO_ORDEN " +
  "                                      ,COD_CLIENTE " +
  "                                      ,FECHA_PEDIDO " +
  "                                      ,FECHA_ENTREGA " +
  "                                      ,COD_RAZON_DEV " +
  "                                      ,COMENTARIOS " +
  "                                      ,ORDEN_COMPRA " +
  "                                      ,COD_VENDEDOR " +
  "                                      ,NO_LINEA " +
  "                                      ,JUEGO_ENVIO " +
  "                                      ,COD_ARTICULO " +
  "                                      ,CANTIDAD " +
  "                                      ,UDM " +
  "                                      ,PRECIO_BRUTO " +
  "                                      ,PRECIO_NETO " +
  "                                      ,NO_OFERTA " +
  "                                      ,TAX " +
  "                                      ,MONTO_TAX " +
  "                                      ,FLAG_PRC " +
  "                                      ,CREATED_BY " +
  "                                      ,LAST_UPDATED_BY " +
  "                                      ,CREATION_DATE " +
  "                                      ,LAST_UPDATE_DATE ) " +
  "                                 VALUES ? ";


let V_SUCURSAL = "";
let V_RUTA = "";
let V_NO_ORDEN = "";
let V_TIPO_ORDEN = "";
let V_COD_CLIENTE = "";
let V_FECHA_PEDIDO = "";
let V_FECHA_ENTREGA = "";
let V_COD_RAZON_DEV = "";
let V_COMENTARIOS = "";
let V_ORDEN_COMPRA = "";
let V_COD_VENDEDOR = "";
let V_NO_LINEA = 0;
let V_JUEGO_ENVIO = 0;
let V_COD_ARTICULO = "";
let V_CANTIDAD = 0;
let V_UDM = "";
let V_PRECIO_BRUTO = 0;
let V_PRECIO_NETO = 0;
let V_NO_OFERTA = "";
let V_TAX = 0;
let V_MONTO_TAX = 0;


const insertarOrdenes = async (req, res = response) => {

  let token = req.headers.authorization;
  let cod_ruta = req.headers.cod_ruta;
  let id_comunicacion = req.headers.id_comunicacion;
  v_batch = moment().format("YYYYMMDDHHmmss");
  v_fecha = moment().format("YYYY-MM-DD");

  let { ordenes } = req.body;
  let count = ordenes.length;

  //fs.writeFileSync("C:/log_preventa/PAordenes_" + id_comunicacion + "_" + cod_ruta + "_" + v_batch + ".json", JSON.stringify(ordenes));

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

            const params = [];

            ordenes.forEach(async function (Value, index, arr) {

              V_SUCURSAL = Value.SUCURSAL;
              V_RUTA = Value.RUTA;
              V_NO_ORDEN = Value.NO_ORDEN;
              V_TIPO_ORDEN = Value.TIPO_ORDEN;
              V_COD_CLIENTE = Value.COD_CLIENTE;
              V_FECHA_PEDIDO = Value.FECHA_PEDIDO;
              V_FECHA_ENTREGA = Value.FECHA_ENTREGA;
              V_COD_RAZON_DEV = Value.COD_RAZON_DEV;
              V_COMENTARIOS = Value.COMENTARIOS;
              V_ORDEN_COMPRA = Value.ORDEN_COMPRA;
              V_COD_VENDEDOR = Value.COD_VENDEDOR;
              V_NO_LINEA = Value.NO_LINEA;
              V_JUEGO_ENVIO = Value.JUEGO_ENVIO;
              V_COD_ARTICULO = Value.COD_ARTICULO;
              V_CANTIDAD = Value.CANTIDAD;
              V_UDM = Value.UDM;
              V_PRECIO_BRUTO = Value.PRECIO_BRUTO;
              V_PRECIO_NETO = Value.PRECIO_NETO;
              V_NO_OFERTA = Value.NO_OFERTA;
              V_TAX = Value.TAX;
              V_MONTO_TAX = Value.MONTO_TAX;

              const datos = [
                V_SUCURSAL,
                V_RUTA,
                V_NO_ORDEN,
                V_TIPO_ORDEN,
                V_COD_CLIENTE,
                V_FECHA_PEDIDO,
                V_FECHA_ENTREGA,
                V_COD_RAZON_DEV,
                V_COMENTARIOS,
                V_ORDEN_COMPRA,
                V_COD_VENDEDOR,
                V_NO_LINEA,
                V_JUEGO_ENVIO,
                V_COD_ARTICULO,
                V_CANTIDAD,
                V_UDM,
                V_PRECIO_BRUTO,
                V_PRECIO_NETO,
                V_NO_OFERTA,
                V_TAX,
                V_MONTO_TAX,
                'N',
                -3,
                -3,
                v_fecha,
                v_fecha];

              params.push(datos);

            });

            console.log(params);

            conn.query(insert_ord_sql, [params], function (err, result) {
              if (err) throw err;

              res.json({
                ok: true,
                message: "Datos Procesados.",
                registros: count,
                cod_ruta,
              });

            });

          }
        } else {
          res.json({
            ok: false,
            message: "La ruta ya fue cerrada para comunicaciones.",
            registros: count,
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
  insertarOrdenes,
};