function transformData(json, manualData) {

  const comprabante = json['cfdi:Comprobante'];

  //Error en el caso de que el XML no contenga conceptos
  if (!comprabante) {
    throw new Error("XML inválido: no contiene Comprobante");
  }

  const monedaMap = {
    "MXN": "Peso Mexican",
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
    "PUE": "PPD Pago en parcialidades o diferido"   //Mapeo de campos
  }

  //Extraccion del UUID
  const uuid = comprabante['cfdi:Complemento'][0]['tfd:TimbreFiscalDigital'][0]['$'].UUID;

  //Error en el caso de que el XML no contenga UUID
  if (!uuid) {
    throw new Error('UUID no encontrado');
  }

 //Extraccion de campos del XML
  const fechaRaw = comprabante['$'].Fecha;
  const fecha = fechaRaw.split('T')[0];
  const moneda = comprabante['$'].Moneda;
  const formaPago = comprabante['$'].FormaPago;
  const metodoPago = comprabante['$'].MetodoPago;

  const prov = comprabante['cfdi:Emisor'][0]['$'].Nombre;

  const serie = comprabante['$'].Serie || "";
  const folio = comprabante['$'].Folio || ""; 

  const nota = `${serie}${folio}` //Preguntar que diferencia tienen estos const

  const conceptos = comprabante['cfdi:Conceptos'][0]['cfdi:Concepto'];
//Error en el caso de que el XML no contenga conceptos
  if (!conceptos) {
    throw new Error('XML sin conceptos');
  }

  const lineas = conceptos.map(c => {
    return{
      idExterno: manualData.idExterno,
      nºreferencia: uuid,
      proveedor: prov,
      nota: nota,
      moneda: monedaMap[moneda] || moneda,
      fecha: fecha,
      solicita: manualData.solicita,
      autoriza: manualData.autoriza,
      elaboro: manualData.elaboro,
      descripcion: c['$'].Descripcion || "Sin Descripcion",
      tarifa: c['$'].Importe,
      departamento: manualData.departamento,
      clase: manualData.clase,
      codigoImpuesto: manualData.codigoImpuesto,
      formaPago: formaPagoMap[formaPago] || formaPago,
      metodoPago: metodoPagoMap[metodoPago] || metodoPago,
      fechaEmision: fecha,
      uuidReceived: uuid,
      cuenta: manualData.cuenta,
      canalVenta: manualData.canalVenta,
      estado: manualData.estadoAprobacion
    };
  });

return lineas;
}

module.exports = { transformData };