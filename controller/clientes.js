require("dotenv").config();
const conn = require("../services/db");

let Autorization = process.env.AUTORIZATION;
console.log(Autorization);


const listar_clie_sql =
"SELECT " +
"COD_RUTA  " +
",COD_CLIENTE  " +
",NOM_CLIENTE  " +
",DIRECCION " +
",IND_ATENDIDO  " +
",NOM_CONTACTO  " +
",TEL_CLIENTE  " +
",TOT_LIMITE  " +
",SEC_ORD_VISITA  " +
",IND_DIA  " +
",COD_SUBGRUPO  " +
",IND_MODO_PAG  " +
",TOT_DIAS_VEN  " +
",IND_CLIENTE  " +
",COD_LISTA_PRECIO  " +
",COD_TIPO_CLIENTE  " +
",COD_ZONA_CLIENTE  " +
",IND_CREDITO  " +
",PORCENTAJE  " +
",DISPONIBLE  " +
",IND_TIPO_PAGO  " +
",MENSAJE_CLIENTE  " +
",COD_COMPANIA  " +
",'Falso' VALIDO  " +
",TAX_SCHEDULE  " +
",DISTANCIA " +
",LATITUD  " +
",LONGITUD  " +
"FROM XXDCRN_PREVENTA_CLIENTES_TBL WHERE COD_RUTA = ?";

//const listarClientes = async (req, res = response) => {
async function listarClientes (req, res = response) {

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

      conn.query(listar_clie_sql, [cod_ruta], function (err, result) {
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
  listarClientes,
};
