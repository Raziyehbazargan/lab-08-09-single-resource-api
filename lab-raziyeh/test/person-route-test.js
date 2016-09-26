'use strict';

const request = require('superagent');
const expect = require('chai').expect;
const storage = require('../lib/storage.js');

require('../server.js');

describe('testing Person Rotues', function(){
  var person = null;

  // GET - test 404, responds with 'not found' for unregistered url
  describe('testing GET /api/person/unregistered', function() {
    it('return an error with unregistered url - GET', function(done){
      request.get('localhost:3000/api/woow')
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.text).to.equal('not found');
        });
      done();
    });
  });

// POST - test 200, response body like {<data>} for a post request with a valid body
  describe('testing POST /api/person', function(){
    it('save a Person - POST', function(done){
      request.post('localhost:3000/api/person')
      .send({name: 'rozi', sex: 'female'})
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('rozi');
        expect(res.body.sex).to.equal('female');
        person = res.body;
      });
      done();
    });
  });

// POST - test 400, responds with 'bad request' for if no body provided or invalid body
  describe('testing POST /api/person', function(){
    it('responds with bad request - POST', function(done){
      request.post('localhost:3000/api/person')
      .send({family:'wrong property'})
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.text).to.be.equal('bad request');
      });
      done();
    });
  });

// GET - test 404, responds with 'not found' for valid request made with an id that was not found
  describe('testing GET /api/person', function(){
    describe('testing valid id' , function(){
      it('return an error with unValid ID - GET', function(done){
        request.get('localhost:3000/api/person?id=111')
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.text).to.equal('not found');
          done();
        });
      });
    });
  });

  // GET - test 400, responds with 'bad request' if no id was provided in the request
  describe('testing GET /api/person', function(){
    it('return an error with no id - GET', function(done){
      request.get('localhost:3000/api/person')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.text).to.equal('bad request');
        done();
      });
    });
  });

  // GET - test 200, response body like {<data>} for a request made with a valid id
  describe('testing GET /api/person', function(){
    before(done => {
      var person = {
        id: '1234',
        name: 'rozi',
        sex: 'female',
      };

      storage.createItem('person' , person)
      .then( () =>  done())
      .catch(err => done(err));
    });

    after(done => {
      storage.deleteItem('person', '1234')
      .then( () =>  done())
      .catch(err => done(err));
    });

    it('return person data with valid id - GET', function(done){
      request.get(`localhost:3000/api/person?id=${person.id}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.id).to.equal(person.id);
          expect(res.body.name).to.equal(person.name);
          expect(res.body.sex).to.equal(person.sex);
          done();
        });
    });
  });
//   // DELETE - test 204
  describe('testing DELETE /api/person', function() {
    it('delete person with given id - DELETE', function(done){
      request.delete(`localhost:3000/api/person?id=${person.id}`)
      .end((err,res) => {
        expect(res.status).to.equal(204);
        done();
      });
    });
  });
});
