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

    for (let i = 0; i < req.files.length; i++) {

      const file = req.files[i];

      const xmlData = fs.readFileSync(file.path, 'utf8');
      const json = await parser.parseStringPromise(xmlData);

      const idActual = baseId + i;

      let cuentasSeleccionadas = [];

      if (modo === "multi") {
        const cuenta1 = req.body[`cuenta_${i}`];
        const cuenta2 = req.body[`cuenta2_${i}`];

        cuentasSeleccionadas.push(cuenta1);

        if (cuenta2) {
          cuentasSeleccionadas.push(cuenta2);
        }

      } else {
        cuentasSeleccionadas.push(req.body.cuenta); // modo general
      }

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