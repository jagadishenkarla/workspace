const expect = require('ultimate-chai').expect;
const proxyquire =  require('proxyquire').noCallThru();
const sinon = require('sinon');
const marketRouteStub = sinon.sandbox.create().stub();
const routesIndex = proxyquire('../../app/routes/index', {
  './market_routes': marketRouteStub
});


describe('index.js', () => {
  context('testing index', () => {
    it('should exist', () => {
      expect(routesIndex).to.be.exist;
    });
    it('should call market route with values supplied', () => {
      routesIndex("test-app", "test-db");
      expect(marketRouteStub).to.have.been.called();
      expect(marketRouteStub).to.have.been.calledWith('test-app','test-db');
    });
  });
});