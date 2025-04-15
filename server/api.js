const express = require('express');
const router = express.Router();
const {isMedecin} = require('./tool');

router.get('/getmedecin',isMedecin, (req,res) => {
	res.json(req.session.medecin);
});

module.exports = router;
