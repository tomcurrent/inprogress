var express = require('express'),
    router = express.Router(),
    admin = require('../routes/admin');

router.get('/contact', function(req, res) {
  var db = req.db,
      contact = db.get('contact');
  contact.find({},{},function(e, docs) {
    res.render('contact', { 
      title: 'TP Contact List',
      contactData : docs
    });
  });
});

router.get('/subscribe', function(req, res) {
  var db = req.db,
      subscribe = db.get('subscribe');
  subscribe.find({},{},function(e, docs) {
    res.render('subscribe', { 
      title: 'TP Subscribe List',
      subscribeData : docs
    });
  });
});

router.get('/report', function(req, res) {
  var db = req.db;
      report = db.get('report');
  report.find({},{},function(e, docs) {
    res.render('report', { 
      title: 'EC Report',
      reportData : docs
    });
  });
});

router.use('/admin', admin);
router.use('/', admin);
module.exports = router;s