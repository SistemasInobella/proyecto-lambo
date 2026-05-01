function transformData(json, manualData, idExterno,cuentasSeleccionadas) {


  const comprobante = json['cfdi:Comprobante'];

  //Error en el caso de que el XML no contenga conceptos
  if (!comprobante) {
    throw new Error("XML inválido: no contiene Comprobante");
  }

  const monedaMap = {
    "MXN": "Peso Mexicano",
    "USD": "US Dollar",      //Mapeo de campos
    "EUR": "Euro"
  };

  const formaPagoMap = {
    "01": "01 Efectivo",
    "02": "02 Cheque Nominativo",
    "03": "03 Transferencia Electrónica de Fondos",
    "04": "04 Tarjeta de Credito",
    "05": "05 Monedero Electronico",             //Mapeo de campos
    "15": "15 Condonacion",
    "17": "17 Compensación",
    "28": "28 Tarjeta de Debito",
    "30": "30 Aplicación de Anticipos",
    "99": "99 Por definir"
  };

  const metodoPagoMap = {
    "PPD": "PPD Pago en parcialidades o diferido",
    "PUE": "PUE Pago en una sola exhibición"   //Mapeo de campos
  }

  //Extraccion del UUID
  const uuid = comprobante['cfdi:Complemento'][0]['tfd:TimbreFiscalDigital'][0]['$'].UUID;

  //Error en el caso de que el XML no contenga UUID
  if (!uuid) {
    throw new Error('UUID no encontrado');
  }

 //Extraccion de campos del XML
  const fechaRaw = comprobante['$'].Fecha;
  const fecha = fechaRaw.split('T')[0];
  const moneda = comprobante['$'].Moneda;
  const formaPago = comprobante['$'].FormaPago;
  const metodoPago = comprobante['$'].MetodoPago;

  const prov = comprobante['cfdi:Emisor'][0]['$'].Nombre;

  const serie = comprobante['$'].Serie || "";
  const folio = comprobante['$'].Folio || ""; 

  const nota = `${serie}${folio}` //Preguntar que diferencia tienen estos const

  const conceptos = comprobante['cfdi:Conceptos'][0]['cfdi:Concepto'];

  const descripcion = conceptos && conceptos.length > 0
    ? conceptos[0]['$'].Descripcion
    : "Sin Descripcion";
//Error en el caso de que el XML no contenga conceptos
  if (!conceptos) {
    throw new Error('XML sin conceptos');
  }

const totalXML = parseFloat(comprobante['$'].SubTotal);

return cuentasSeleccionadas.map(cuentaObj => {

  let importeFinal = totalXML;

  if (cuentaObj.monto !== null && cuentaObj.monto !== undefined) {
    importeFinal = cuentaObj.monto;
  }

  return {
      idExterno: idExterno,
      nºreferencia: uuid,
      proveedor: prov,
      nota: nota,
      moneda: monedaMap[moneda] || moneda,
      fecha: fecha,
      solicita: manualData.solicita,
      autoriza: manualData.autoriza,
      elaboro: manualData.elaboro,
      descripcion: descripcion,
      tarifa: Number(importeFinal).toFixed(2),
      departamento: manualData.departamento,
      clase: manualData.clase,
      codigoImpuesto: manualData.codigoImpuesto,
      formaPago: formaPagoMap[formaPago] || formaPago,
      metodoPago: metodoPagoMap[metodoPago] || metodoPago,
      fechaEmision: fecha,
      uuidReceived: uuid,
      cuenta: cuentaObj.cuenta,
      canalVenta: manualData.canalVenta,
      estado: manualData.estadoAprobacion
  };

});

}

module.exports = { transformData };