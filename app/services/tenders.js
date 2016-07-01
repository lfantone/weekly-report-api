'use strict';
/**
 * Fetches list of tenders for a given user.
 *
 * @module services/tenders
 */
const _ = require('lodash');
const sql = require('mssql');
const connection = require('./mssql-connection');

const ID_SITE = 3;

module.exports = {
  getAllFor,
  getOneFor
};

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
      .then((result) => result[0]));
}

function getOneFor(id, user) {
  id = Number(id);
  return getAllFor(user)
    .then((tenders) => {
      var tender = _.find(tenders, [ 'id', id ]);
      if (!tender) {
        let notFound = new Error(`No tender of id ${id} found for user <${user.usuario}>`);
        notFound.name = 'NotFound';
        notFound.status = 404;
        throw notFound;
      }
      return tender;
    });
}
