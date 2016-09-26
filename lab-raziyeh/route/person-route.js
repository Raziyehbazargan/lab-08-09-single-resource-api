'use strict';

const storage = require('../lib/storage.js');
const response = require('../lib/response.js');
const Person = require('../model/person.js');

module.exports = function(router) {
  router.get('/api/person', function(req, res) {
    if (req.url.query.id) {
      storage.fetchItem('person', req.url.query.id)
    .then( person => {
      response.sendJSON(res,200,person);
    })
    .catch( err => {
      console.error(err);
      response.sendText(res,404,'not found');
    });
      return;
    }
    response.sendText(res,400,'bad request');
  });

  router.post('/api/person', function(req,res) {
    try {
      var person = new Person(req.body.name, req.body.sex);
      storage.createItem('person', person)
      .then(person => {
        response.sendJSON(res, 200, person);
      })
      .catch( err => {
        console.log(err);
        response.sendText(res, 500, 'server error');
      });
    } catch (err) {
      console.error(err);
      response.sendText(res,400,'bad request');
    }
  });

  router.delete('/api/person', function(req, res) {
    if (req.url.query.id) {
      storage.deleteItem('person', req.url.query.id)
    .then( () => {
      response.sendText(res, 204, '');
    })
    .catch( err => {
      console.error(err);
      response.sendText(res, 404, 'not found');
    });
      return;
    }
    response.sendText(res,400,'bad request');
  });
};
