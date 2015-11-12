'use strict';
var router = require('express').Router();
module.exports = router;

router.use('/users', require('./api.users'));