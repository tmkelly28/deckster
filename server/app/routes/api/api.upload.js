var router = require('express').Router();
var mongoose = require("mongoose");
var _ = require('lodash');
var AWS = require('aws-sdk');

var accessKeyId =  require('../../../env')['AWS']['accessKey'];
var secretAccessKey = require('../../../env')['AWS']['secretKey'];

AWS.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
});

var s3 = new AWS.S3();

function rename (filename) {
    return filename.replace(/\W+/g, '-').toLowerCase();
}

router.post('/', function (req, res, next) {

	var key = rename(req.body.key);
	var data = req.file.buffer

	var params = {
            Bucket: 'deckster',
            Key: key,
            Body: data,
            ACL: 'public-read'
    };
    
    s3.putObject(params, function (perr, pres) {
    	if (perr) {
    		console.log("Error uploading data: ", perr);
    	} else {
			console.log("Successfully uploaded data to AWS");
			pres.imageUrl = 'https://s3-us-west-2.amazonaws.com/deckster/' + key;
    		res.status(200).json(pres);
      	}
    });
});

module.exports = router;