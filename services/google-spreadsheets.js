const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('../config/google-credentials.json')

async function loadDoc (){
  const sheetId = '1_PV-GCa2YDpRcWRfa5tH_XS5rsZ6fi0wTZLjFeppmqw'
  const doc = new GoogleSpreadsheet(sheetId);

  await  doc.useServiceAccountAuth(creds);

  await doc.loadInfo(); // loads document properties and worksheets

  return doc
}

async function getSheet(title){
  const doc = await loadDoc();
  return doc.sheetsByTitle[title];
}

async function getHeader(sheet){
  const rows = await sheet.getRows()
  return rows[0]
}

async function getRows(sheet){
  const rows = await sheet.getRows()
  return rows.filter((v, index) => index !== 0)
}

async function hasDuplicate(sheet, query){
  let rows = await sheet.getRows(sheet)
  return rows.filter(row => row[query.key] === query.value).length
}

async function addRow(row) {
  const sheet = await getSheet('Verificados')
  const exists = await hasDuplicate(sheet, {key: 'ID', value: row.ID})
  
  if(exists) return console.log('Esse apartamento já se encontra na planilha.')

  return await sheet.addRow(row).then(() => console.log('Apê adicionado com sucesso!')).catch((err) => console.log(err))
}

module.exports = {
  loadDoc,
  getSheet,
  getHeader,
  getRows,
  addRow,
}