var express = require('express');
var router = express.Router();

// Home page route.
router.get('/', function(req, res, next) {
    res.send('Item catalog home page');
})

module.exports = router;