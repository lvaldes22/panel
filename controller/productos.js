require("dotenv").config();
const conn = require("../services/db");
let Autorization = process.env.AUTORIZATION;

const listar_prod_sql =
"SELECT  " + 
"COD_LINEA  " +
",COD_SUBLINEA  " +
",COD_PRODUCTO  " +
",NOM_PRODUCTO  " +
",LISTA_PRECIO  " +
",PRECIO  " +
",COSTO  " +
",EMPAQUE  " +
",ITBM  " +
",COD_BARRA  " +
",UNXDSP  " +
",ART_ANID  " + 
",PESO_MAX  " +
",TEMP_CRIT  " +
",TEMP_CRIT2  " +
",COD_MARCA  " +
",UNIDAD  " +
",COD_IMPUESTO  " +
",COD_PRODUCTO_REF   " +
",IND_TIPO_PRODU   " +
",PESO  " +
",COD_CIA   " +
",EXISTENCIA  " +
",PIES_CUBICOS  " +
",SUBINVENTARIO  " +
",ORGANIZATION_ID  " +
",SUBINVTYPE  " +
",ITEM_ID  " +
"FROM  XXDCRN_PREVENTA_PRODUCTOS_TBL  " +
"WHERE COD_RUTA = ? AND COD_CIA = ? AND SUBINVTYPE = ? ";


const listarProductos = async (req, res = response) => {
  
  let token = req.headers.authorization;
  let cod_ruta = req.headers.cod_ruta;
  let cod_cia = req.headers.cod_cia;
  let identificador = req.headers.identificador;

  if (Autorization != token) {
    res.json({
      ok: false,
      message: "Acceso No Autorizado.",
    });
  } else {
    try {
      
      conn.query(listar_prod_sql, [cod_ruta, cod_cia, identificador], function (err, result) {
        if (err) throw err;
        console.log(result);

        if (result.length == 0) {
          res.json({
            ok: false,
            message: "No existen datos.",
            cod_ruta,
            cod_cia,
            identificador,
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
  listarProductos,
};
