/// <reference path="node/node.d.ts" />
/// <reference path="express/express.d.ts" />

import os = require("os");
import express = require("express");
var	stylus = require("stylus"),
	nib = require("nib");
var app = express();
var hgToZip = require("../HgToZip/server.js");

//beginregion Ugly setup stuff
app.enable("strict routing");

app.all('/hgtozip', function(req, res) { res.redirect('/hgtozip/'); });
app.use("/hgtozip/", hgToZip);

var compile = function (str, path) {
	return stylus(str)
		.set('filename', path)
		.use(nib());
};

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(stylus.middleware(
	{ 
		src: __dirname + '/public', 
		compile: compile
  	}
));
app.configure(function() {
	app.use(express.static('public'));
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(app.router);
});
//endregion

app.get("/", function (request, response) {
	response.render("home");
});

console.log(os.hostname());
app.listen(os.hostname() == "myfirefly.me" ? 80 : 8442);