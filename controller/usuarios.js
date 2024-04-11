require("dotenv").config();
const conn = require("../services/db");
const crypto = require("crypto");

let Autorization = process.env.AUTORIZATION;

var VX_RUTA = "";
var VX_PASSWORD = "";
var VX_EPASSWORD = "";

  const valid_user_sql =
  "SELECT  " +
  "RUTA " +
  ",COD_VENDEDOR " +
  ",NOM_VENDEDOR " +
  ",FUERZA_VENTAS " +
  ",EMAIL " +
  ",DIRECCION " +
  ",COD_SUCURSAL " +
  ",IDENTIFICADOR " +
  ",TIPO " +
  ",COD_CLIENTE " +
  ",SUPER_PASSWORD " +
  "FROM  XXDCRN_PREVENTA_USUARIOS_TBL  " +
  "WHERE RUTA = ? " +
  "AND   PASSWORD = ?";


const buscarUsuario = async (req, res = response) => {
  
  let cod_ruta = req.headers.cod_ruta;
  let password = req.headers.password;
  let token = req.headers.authorization;


  VX_RUTA = cod_ruta;
  VX_EPASSWORD = await validaruser("E", cod_ruta, password);
  VX_PASSWORD = VX_EPASSWORD;

  console.log( VX_PASSWORD);
  console.log(password);

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

    conn.query(valid_user_sql, [cod_ruta, VX_PASSWORD], function (err, result) {
      if (err) throw err;
      console.log(result);

      if (result.length == 0) {
        res.json({
          ok: false,
          message: "Usuario Invalido.",
          cod_ruta: cod_ruta,
          password: password,
          token: token,
        });
      } else {
        const data = result;

        res.json({
          ok: true,
          data,
          message: "Usuario Correcto.",
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

async function validaruser(p_action, p_clave, p_valor_encriptado) {
  let valor_salida = "";

  try {
    let ENC_KEY = crypto
      .createHash("md5")
      .update(p_clave, "utf-8")
      .digest("hex")
      .toUpperCase();
    var IV = new Buffer.alloc(16);

    var encrypt = (val) => {
      let cipher = crypto.createCipheriv("aes-256-cbc", ENC_KEY, IV);
      let encrypted = cipher.update(val, "utf8", "hex");
      encrypted += cipher.final("hex");
      return encrypted;
    };

    var decrypt = (encrypted) => {
      let decipher = crypto.createDecipheriv("aes-256-cbc", ENC_KEY, IV);
      let decrypted = decipher.update(encrypted, "hex", "utf8");
      return decrypted + decipher.final("utf8");
    };

    if (p_action == "E") {
      valor_salida = encrypt(p_valor_encriptado);
    } else {
      valor_salida = decrypt(p_valor_encriptado);
    }
  } catch {
    valor_salida = "Error";
  }
  return valor_salida;
}

module.exports = {
  buscarUsuario,
};
