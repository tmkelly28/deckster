'use strict';
var router = require('express').Router();
module.exports = router;

router.use('/users', require('./api.users'));
router.use('/card', require('./api.card'));
router.use('/deck', require('./api.deck'));
router.use('/upload', require('./api.upload'));