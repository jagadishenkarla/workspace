
const ObjectID = require('mongodb').ObjectID;
 

module.exports = function(app, db) {
 
  app.get('/webmarket/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('supermarket').findOne(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(item);
      } 
    });
  });

  app.put('/webmarket/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    const product = { text: req.body.body, title: req.body.title };
    db.collection('supermarket').update(details, product, (err) => {
      if (err) {
          res.send({'error':'An error has occurred'});
      } else {
          res.send(product);
      }
    });
  });

  app.delete('/webmarket/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('supermarket').remove(details, (err) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send('product ' + id + ' deleted!');
      } 
    });
  });



  app.post('/webmarket', (req, res) => {
    const product = { text: req.body.body, title: req.body.title };
    db.collection('supermarket').insert(product, (err, result) => {
      if (err) { 
        res.send({ 'error': 'An error has occurred' }); 
      } else {
        res.send(result.ops[0]);
      }
    });
  });
};