const expect = require('ultimate-chai').expect;
const proxyquire =  require('proxyquire').noCallThru();
const sinon = require('sinon');
const sandbox = sinon.sandbox.create();

let dbFindOneError = false;
let dbUpdateError = false;
let dbRemoveError = false;
let dbInsertError = false;

const mongoDBstub = {
  ObjectID: function (id) {
    this.id = id;
  },
  collection: (name) => {
    return {
      findOne: (details, callback) => {
        if(dbFindOneError) return callback('error');
        return callback(null, 'getItem');
      },
      update: (details, newdetails, callback) => {
        if(dbUpdateError) return callback('error');
        return callback(null, newdetails);
      },
      remove: (product, callback) => {
        if(dbRemoveError) return callback('error');
        return callback(null, 'deleted');
      },
      insert: (product, callback) => {
        if(dbInsertError) return callback('error');
        return callback(null, {ops: [product]});
      }
    }
  }
};

const marketRoutes = proxyquire('../../app/routes/market_routes', {
  'mongodb': mongoDBstub
});


describe('market_routes.js', () => {
  let appStub;
  let req, res;
  let resSendStub;
  
  context('testing app.get method', () => {
     
     beforeEach(done => {
      resSendStub = sandbox.stub(); 
      res = {
        send: resSendStub
      }
      req = {
        params : {
          id : 'TESTID'
        }
      }; 
      appStub = {
        get: (route, callback) => {
          callback(req, res);
        },
        put: () => {},
        delete: () => {},
        post: () => {},
      }
      dbFindOneError = false;
      done();
    });
    
    it('should call mongodb collection and findOne, if succcesful should return with item', () => {
      marketRoutes(appStub, mongoDBstub);
      expect(resSendStub).to.have.been.called();
      expect(resSendStub).to.have.been.calledWith('getItem');
    });
    it('should call mongodb collection and findOne, if failure should return with error', () => {
      dbFindOneError = true;
      marketRoutes(appStub, mongoDBstub);
      expect(resSendStub).to.have.been.called();
      expect(resSendStub).to.have.been.calledWith({ error: "An error has occurred" });
    });
  });
  
  context('testing app.put method', () => {
     
     beforeEach(done => {
      resSendStub = sandbox.stub(); 
      res = {
        send: resSendStub
      }
      req = {
        params : {
          id : 'TESTID'
        },
        body : {
          body : '5$',
          title: 'toothpaste'
        }
      }; 
      appStub = {
        get: () => {},
        put: (route, callback) => {
          callback(req, res);
        },
        delete: () => {},
        post: () => {},
      }
      dbUpdateError = false;
      done();
    });
    
    it('should call mongodb collection and update, if succcesful should return with item', () => {
      marketRoutes(appStub, mongoDBstub);
      expect(resSendStub).to.have.been.called();
      expect(resSendStub).to.have.been.calledWith({ text: "5$", title: "toothpaste" });
    });
    it('should call mongodb collection and update, if failure should return with error', () => {
      dbUpdateError = true;
      marketRoutes(appStub, mongoDBstub);
      expect(resSendStub).to.have.been.called();
      expect(resSendStub).to.have.been.calledWith({ error: "An error has occurred" });
    });
  });
  
  context('testing app.delete method', () => {
     
     beforeEach(done => {
      resSendStub = sandbox.stub(); 
      res = {
        send: resSendStub
      }
      req = {
        params : {
          id : 'TESTID'
        }
      }; 
      appStub = {
        get: () => {},
        put: () => {},
        delete: (route, callback) => {
          callback(req, res);
        },
        post: () => {},
      }
      dbRemoveError = false;
      done();
    });
    
    it('should call mongodb collection and remove, if succcesful should return with deleted item id', () => {
      marketRoutes(appStub, mongoDBstub);
      expect(resSendStub).to.have.been.called();
      expect(resSendStub).to.have.been.calledWith('product TESTID deleted!');
    });
    it('should call mongodb collection and remove, if failure should return with error', () => {
      dbRemoveError = true;
      marketRoutes(appStub, mongoDBstub);
      expect(resSendStub).to.have.been.called();
      expect(resSendStub).to.have.been.calledWith({ error: "An error has occurred" });
    });
  });
  
  context('testing app.post method', () => {
     
     beforeEach(done => {
      resSendStub = sandbox.stub(); 
      res = {
        send: resSendStub
      }
      req = {
        body : {
          body : '8$',
          title: 'icecream'
        }
      }; 
      appStub = {
        get: () => {},
        post: (route, callback) => {
          callback(req, res);
        },
        delete: () => {},
        put: () => {},
      }
      dbInsertError = false;
      done();
    });
    
    it('should call mongodb collection and insert, if succcesful should return with item', () => {
      marketRoutes(appStub, mongoDBstub);
      expect(resSendStub).to.have.been.called();
      expect(resSendStub).to.have.been.calledWith({ text: "8$", title: "icecream" });
    });
    it('should call mongodb collection and insert, if failure should return with error', () => {
      dbInsertError = true;
      marketRoutes(appStub, mongoDBstub);
      expect(resSendStub).to.have.been.called();
      expect(resSendStub).to.have.been.calledWith({ error: "An error has occurred" });
    });
  });
});