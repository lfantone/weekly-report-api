'use strict';
/**
 * Fetches list of tenders for a given user.
 *
 * @module services/tenders
 */
const sql = require('mssql');
const connection = require('./mssql-connection');

const ID_SITE = 3;
const STATES = {
  '90000': 'green',
  '90001': 'yellow',
  '90002': 'red'
};

module.exports = {
  getAllFor,
  getOneFor
};

function toTenders(result) {
  return result.map((t) => {
    return {
      id: t.id,
      type: t.tipo,
      establishment: t.establecimiento,
      code: t[''],
      program: 'MISSING',
      state: {
        id: t.estadoUltimoInforme,
        value: STATES[t.estadoUltimoInforme]
      }
    };
  });
}

function toTenderDetail(result) {
  return {
    code: result[''][result[''].length - 1],
    cue: result[''][0],
    establishment: result.establecimiento,
    type: result.tipo[0],
    lastReport: result.FechaInformeAnterior
  };
}

/**
 * Finds and returns all tenders associated
 * with a given `user`.
 *
 * @param  {Object} user The user whose tenders are being looked up
 * @return {Promise}
 */
function getAllFor(user) {
  return connection.acquire()
    .then((conn) => new sql.Request(conn)
      .input('idsite', sql.Int, ID_SITE)
      .input('idinspector', sql.Int, user.id)
      .execute('licitacion_inspector_lista')
      .then((result) => toTenders(result[0])));
}

/**
 * Returns details about a single tender
 * given its `id`
 * @param  {Number|String} id   Tender identifier
 * @param  {Object} user The user whose tenders are being looked up
 * @return {Promise}
 */
function getOneFor(id, user) {
  id = Number(id);
  return connection.acquire()
    .then((conn) => new sql.Request(conn)
      .input('idsite', sql.Int, ID_SITE)
      .input('idlicitacion', sql.Int, id)
      .execute('licitacion_detalle_informesemanal')
      .then((result) => {
        if (!result[0][0]) {
          let notFound = new Error(`No tender of id ${id} found for user <${user.usuario}>`);
          notFound.name = 'NotFound';
          notFound.status = 404;
          throw notFound;
        }
        return toTenderDetail(result[0][0]);
      }));
}
