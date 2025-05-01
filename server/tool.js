const express = require('express');

function isMedecin(req,res,next){
	if(req.session && req.session.medecin){
		return next();
	}else{
		console.log("Connection requise");
		return res.redirect('/login');
	}
}

function isAdmin(req,res,next){
	if(req.session && req.session.admin){
		return next();
	}else{
		console.log("Connection requise");
		return res.redirect('/login');
	}
}

function isLogged(req,res,next){
	if(req.session && (req.session.admin || req.session.medecin)){
		return next();
	}else{
		console.log("Connection requise");
		return res.redirect('/login');
	}
}

module.exports = {isMedecin, isAdmin, isLogged};
