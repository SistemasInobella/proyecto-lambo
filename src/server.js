const express = require('express');
const multer = require('multer');
const fs = require('fs');
const xml2js = require('xml2js');
const { transformData } = require('./transformer');
const { Parser } = require('json2csv');

const app = express();
const upload = multer({ dest: 'uploads/' });

const parser = new xml2js.Parser();

const manualData = {
  idExterno: "810210",
  solicita: "Juan Islas",
  autoriza: "Juan Islas",
  elaboro: "Juan Islas",
  departamento: "TI",
  clase: "Supplies",
  codigoImpuesto: "IVA_MX 16%",
  cuenta: "Cuenta prueba",
  canalVenta: "MAYOREO",
  estadoAprobacion: "Aprobado"
};

app.post('/upload', upload.array('xmlFiles'), async (req, res) => {
  const results = [];

  for (const file of req.files) {
    const xmlData = fs.readFileSync(file.path, 'utf8');
    const json = await parser.parseStringPromise(xmlData);

    const transformed = transformData(json, manualData);
    results.push(...transformed);
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