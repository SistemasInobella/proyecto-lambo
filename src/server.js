const express = require('express');
const multer = require('multer');
const fs = require('fs');
const xml2js = require('xml2js');
const { transformData } = require('./transformer');
const { Parser } = require('json2csv');

const app = express();
const upload = multer({ dest: 'uploads/' });

const parser = new xml2js.Parser();

app.post('/upload', upload.array('xmlFiles'), async (req, res) => {
  const modo = req.body.modo;
  const results = [];
  
  const manualData = {
  solicita: req.body.solicita,
  autoriza: req.body.autoriza,
  elaboro: req.body.elabora,
  departamento: req.body.departamento,
  clase: req.body.clase,
  codigoImpuesto: req.body.codigoImpuesto,
  cuenta: req.body.cuenta,
  canalVenta: req.body.canalVenta,
  estadoAprobacion: req.body.estadoAprobacion
};

    const baseId = parseInt(req.body.idExterno);

    if (isNaN(baseId)) {
      return res.status(400).send("ID Externo debe ser numérico");
    }

    for (let i = 0; i < req.files.length; i++) {

      const file = req.files[i];

      const xmlData = fs.readFileSync(file.path, 'utf8');
      const json = await parser.parseStringPromise(xmlData);

      const idActual = baseId + i;

      let cuentasSeleccionadas = [];


     if (modo === "multi") {
      const cuenta1 = req.body[`cuenta_${i}`];
      const cuenta2 = req.body[`cuenta2_${i}`];

      const monto1Raw = req.body[`monto_${i}`];
      const monto2Raw = req.body[`monto2_${i}`];

      const monto1 = monto1Raw ? parseFloat(monto1Raw) : null;
      const monto2 = monto2Raw ? parseFloat(monto2Raw) : null;

      console.log("CUENTA1:", cuenta1);
      console.log("MONTO1:", monto1);
      console.log("CUENTA2:", cuenta2);
      console.log("MONTO2:", monto2);
      console.log("FINAL:", cuentasSeleccionadas);
      console.log("CUENTAS:", cuentasSeleccionadas)

      if (cuenta1 && cuenta1.trim() !== "") {
        cuentasSeleccionadas.push({
          cuenta: cuenta1,
          monto: monto1
        });
      }

      if (cuenta2 && cuenta2.trim() !== "") {
        cuentasSeleccionadas.push({
          cuenta: cuenta2,
          monto: monto2
        });
      }

    } else {

      cuentasSeleccionadas.push({
        cuenta: req.body.cuenta,
        monto: null
      });

}

    if (cuentasSeleccionadas.length === 0) {
    cuentasSeleccionadas.push({
      cuenta: req.body.cuenta,
      monto: null
    });
  }

      console.log("Modo:", modo);
      console.log("Body:", req.body);
      console.log("Cuentas:", cuentasSeleccionadas);
      const transformed = transformData(json, manualData, idActual, cuentasSeleccionadas);

      results.push(...transformed);

      fs.unlinkSync(file.path);
}
  const fields = Object.keys(results[0] || {});
  const json2csv = new Parser({ fields });
  const csv = json2csv.parse(results);

  res.header('Content-Type', 'text/csv');
  res.attachment('resultado.csv');
  res.send('\uFEFF' + csv);
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});