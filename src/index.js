const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const { transformData } = require('./transformer');
const { generateCSV } = require('./csvGenerator');

const parser = new xml2js.Parser();

//campos Manuales
const manualData = {
  idExterno: "810210",
  //proveedor: "GONTELLE",
  solicita: "Juan islas",
  autoriza: "Juan Islas",
  elaboro: "Juan Islas",
  departamento: "TI",
  clase: "Supplies",
  codigoImpuesto: "IVA_MX 16%:IVA16%",
  cuenta: "613-02-000 GASTOS : VIATICOS Y GASTOS DE VIAJE : Hospedaje",
  canalVenta: "MAYOREO",
  estadoAprobacion: "Aprobado"
}

async function main() {
  const folderPath = './input_xml';
  const files = fs.readdirSync(folderPath);

  const results = [];

  for (const file of files) {
    if (!file.endsWith('.xml')) continue;

    try {
      const xmlData = fs.readFileSync(path.join(folderPath, file), 'utf8');
      const json = await parser.parseStringPromise(xmlData);

      const transformed = transformData(json, manualData);

      //console.log("📄 XML leído:", xmlData.substring(0, 200));
      
     // console.log("📂 Archivos encontrados:", files);
      //console.log("👉 Procesando archivo:", file);

      results.push(...transformed);
    }catch (error) {
      console.error(`Error en archivo ${file}:`, error.message);
    };
  };

  generateCSV(results);
}

main();