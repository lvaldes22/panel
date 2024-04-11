require("dotenv").config();
const conn = require("../services/db");
const fs = require("fs");
var moment = require("moment");
var v_batch = '';
var v_fecha = '';

let Autorization = process.env.AUTORIZATION;


const verificar_comunicacion_sql =
  "SELECT * FROM XXDCRN_PREVENTA_CTRL_TBL WHERE IFNULL(FLAG_CTRL, 'N')  = 'Y' AND RUTA = ? AND ID_COMUNICACION = ?";

const insert_liq_sql =
  "INSERT INTO XXDCRN_PREVENTA_LIQ_TBL " +
  "                                      (HEADER_ID " +
  "                                      ,TOTAL_CREDITO " +
  "                                      ,TOTAL_ENTREGAR " +
  "                                      ,TOTAL_COBRADO " +
  "                                      ,TOTAL_GASTOS " +
  "                                      ,DIFERENCIA " +
  "                                      ,FLAG_SEL " +
  "                                      ,FLAG_PROCESS " +
  "                                      ,CREATED_BY " +
  "                                      ,LAST_UPDATED_BY " +
  "                                      ,CREATION_DATE " +
  "                                      ,LAST_UPDATE_DATE " +
  ") VALUES ? ";

const insert_cob_sql =
  "INSERT INTO XXDCRN_PREVENTA_DETCOBRO_TBL " +
  "                                      (HEADER_ID " +
  "                                      ,COD_COBRO " +
  "                                      ,NOM_COBRO " +
  "                                      ,MONTO " +
  "                                      ,FLAG_SEL " +
  "                                      ,FLAG_PROCESS " +
  "                                      ,CREATED_BY " +
  "                                      ,LAST_UPDATED_BY " +
  "                                      ,CREATION_DATE " +
  "                                      ,LAST_UPDATE_DATE " +
  ") VALUES ? ";

const insert_doccob_sql =
  "INSERT INTO XXDCRN_PREVENTA_DOCCOBRO_TBL " +
  "                                      (HEADER_ID " +
  "                                      ,COD_DOC_COBRO " +
  "                                      ,NOM_DOC_COBRO " +
  "                                      ,NUMERO_DOC " +
  "                                      ,MONTO " +
  "                                      ,FLAG_SEL " +
  "                                      ,FLAG_PROCESS " +
  "                                      ,CREATED_BY " +
  "                                      ,LAST_UPDATED_BY " +
  "                                      ,CREATION_DATE " +
  "                                      ,LAST_UPDATE_DATE " +
  ") VALUES ? ";



let V_HEADER_ID = 0;
let V_TOTAL_CREDITO = 0;
let V_TOTAL_ENTREGAR = 0;
let V_TOTAL_COBRADO = 0;
let V_TOTAL_GASTOS = 0;
let V_DIFERENCIA = 0;

let V_COD_COBRO = "";
let V_NOM_COBRO = "";
let V_MONTO = 0;

let V_COD_DOC_COBRO = "";
let V_NOM_DOC_COBRO = "";
let V_NUMERO_DOC = "";

const liquidacion = async (req, res = response) => {

  let token = req.headers.authorization;
  let cod_ruta = req.headers.cod_ruta;
  let id_comunicacion = req.headers.id_comunicacion;
  v_batch = moment().format("YYYYMMDDHHmmss");
  v_fecha = moment().format("YYYY-MM-DD");

  let { liquidacion } = req.body;
  let count = liquidacion.length;

  //fs.writeFileSync("C:/log_preventa/PLiquidacion_" + id_comunicacion + "_" + cod_ruta + "_" + v_batch + ".json", JSON.stringify(liquidacion));

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

            liquidacion.forEach(async function (Value, index, arr) {

              V_HEADER_ID = Value.HEADER_ID;
              V_TOTAL_CREDITO = Value.TOTAL_CREDITO;
              V_TOTAL_ENTREGAR = Value.TOTAL_ENTREGAR;
              V_TOTAL_COBRADO = Value.TOTAL_COBRADO;
              V_TOTAL_GASTOS = Value.TOTAL_GASTOS;
              V_DIFERENCIA = Value.DIFERENCIA;


              const datos = [
                V_HEADER_ID,
                V_TOTAL_CREDITO,
                V_TOTAL_ENTREGAR,
                V_TOTAL_COBRADO,
                V_TOTAL_GASTOS,
                V_DIFERENCIA,
                'N',
                'N',
                -3,
                -3,
                v_fecha,
                v_fecha];

              params.push(datos);

            });

            console.log(params);

            conn.query(insert_liq_sql, [params], function (err, result) {
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

const detalleCobros = async (req, res = response) => {

  let token = req.headers.authorization;
  let cod_ruta = req.headers.cod_ruta;
  let id_comunicacion = req.headers.id_comunicacion;
  v_batch = moment().format("YYYYMMDDHHmmss");
  v_fecha = moment().format("YYYY-MM-DD");

  let { detallecobros } = req.body;
  let count = detallecobros.length;

  //fs.writeFileSync("C:/log_preventa/Pdetallecobros_" + id_comunicacion + "_" + cod_ruta + "_" + v_batch + ".json", JSON.stringify(detallecobros));

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

            detallecobros.forEach(async function (Value, index, arr) {

              V_HEADER_ID = Value.HEADER_ID;
              V_COD_COBRO = Value.COD_COBRO;
              V_NOM_COBRO = Value.NOM_COBRO;
              V_MONTO = Value.MONTO;

              const datos = [
                V_HEADER_ID,
                V_COD_COBRO,
                V_NOM_COBRO,
                V_MONTO,
                'N',
                'N',
                -3,
                -3,
                v_fecha,
                v_fecha];

              params.push(datos);

            });

            console.log(params);

            conn.query(insert_cob_sql, [params], function (err, result) {
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

const detalleDocCobros = async (req, res = response) => {

  let token = req.headers.authorization;
  let cod_ruta = req.headers.cod_ruta;
  let id_comunicacion = req.headers.id_comunicacion;
  v_batch = moment().format("YYYYMMDDHHmmss");
  v_fecha = moment().format("YYYY-MM-DD");

  let { detalledoccobros } = req.body;
  let count = detalledoccobros.length;

  //fs.writeFileSync("C:/log_preventa/Pdetalledoccobros_" + id_comunicacion + "_" + cod_ruta + "_" + v_batch + ".json", JSON.stringify(detalledoccobros));

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
            
            detalledoccobros.forEach(async function (Value, index, arr) {

              V_HEADER_ID = Value.HEADER_ID;
              V_COD_DOC_COBRO = Value.COD_DOC_COBRO;
              V_NOM_DOC_COBRO = Value.NOM_DOC_COBRO;
              V_NUMERO_DOC = Value.NUMERO_DOC;
              V_MONTO = Value.MONTO;

              const datos = [
                V_HEADER_ID,
                V_COD_DOC_COBRO,
                V_NOM_DOC_COBRO,
                V_NUMERO_DOC,
                V_MONTO,
                'N',
                'N',
                -3,
                -3,
                v_fecha,
                v_fecha];


              params.push(datos);

            });

            console.log(params);

            conn.query(insert_doccob_sql, [params], function (err, result) {
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
  liquidacion,
  detalleCobros,
  detalleDocCobros,
};