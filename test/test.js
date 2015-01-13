var assert = require("assert"),
    request = require('supertest')

describe('REST API', function(){

  var url = "http://localhost:3000";

  describe('GET /rules', function(){
    it('200 OK', function(done){
      request(url)
       .get('/rules')
       .expect(200, done);
    })
    it('has all rules', function(done){
      request(url)
       .get('/rules')
       .expect(function(res){
          if ( res.body.length == 255 ){
            throw new Error("length is zero");
          }
        })
       .expect(200, done);
    })
  })

})