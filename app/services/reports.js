'use strict';
/**
 * Saves reports to the database.
 *
 * @module services/reports
 */
const _ = require('lodash');
const sql = require('mssql');
const moment = require('moment');
const connection = require('./mssql-connection');

const ID_SITE = 3;
const DOW = {
  'monday': 'lunes',
  'tuesday': 'martes',
  'wednesday': 'miercoles',
  'thursday': 'jueves',
  'friday': 'viernes',
  'saturday': 'sabado',
  'sunday': 'domingo'
};

// Module API
module.exports = {
  save
};

function formatDate(value) {
  return moment()
    .day(value.day)
    .month(value.month)
    .year(value.year)
    .format('DD/MM/YYYY');
}

function addDailyInput(request, value, day, name) {
  return request.input(`${name}${DOW[day]}`, sql.VarChar(20), Number(value[day]).toString());
}

function addWeeklyInputs(request, value, name) {
  return _.keys(DOW).forEach((day) => addDailyInput(request, value, day, name));
}

function addAuditInputs(request, audits) {
  return audits.forEach((audit, i) => {
    request.input(`idtipo_auditoriasector${i + 1}`, sql.Int, audit.value)
      .input(`auditoriafecha${i + 1}`, sql.VarChar(20), formatDate(audit.date));
  });
}

function addPhotoInputs(request, photos) {
  return photos.forEach((photo, i) => {
    request.input(`foto${i + 1}`, sql.VarBinary(sql.MAX), photo.data)
      .input(`fototitulo${i + 1}`, sql.VarChar(50), photo.title)
      .input(`fotocomentario${i + 1}`, sql.VarChar(200), photo.comment);
  });
}

/**
 * Persists a given `report`.
 *
 * @param  {Object} report The report being saved
 * @return {Promise}
 */
function save(report, user) {
  return connection.acquire()
    .then((conn) => {
      var request = new sql.Request(conn)
      .input('idsite', sql.Int, ID_SITE)
      .input('idlicitacion', sql.Int, report.id)
      .input('idficha', sql.Int, user.id)
      .input('fecha', sql.VarChar(20), formatDate(report.date))
      .input('idtipo_estadoobra', sql.Int, report.state.state)
      .input('idtipo_estadorazon', sql.Int, report.state.reason)
      .input('comentario', sql.VarChar(20), report.state.comment)
      .input('idtipo_avancerazon', sql.Int, report.progress.reason)
      .input('idtipo_contratistacalidad', sql.Int, report.evaluation.quality)
      .input('idtipo_contratistaconcepto', sql.Int, report.evaluation.concept)
      .input('idtipo_libro', sql.Int, report.doc.book)
      .input('cantordenes', sql.Int, report.doc.quantity)
      .input('idusuariom', sql.Int, user.id);

      addWeeklyInputs(request, report.forecast.inspector, 'visita');
      addWeeklyInputs(request, report.forecast.rain, 'lluvia');
      addAuditInputs(request, report.audits);
      addPhotoInputs(request, report.photos);

      return request.execute('informesemanal_alta');
    })
    .then((result) => result[0]);
}
