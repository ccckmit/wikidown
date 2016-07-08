var S = require("fdbserver");
var fs = require('fs');
var mkdirp  = require('mkdirp');
var mzfs = require('mz/fs');
var wdlib = require('./web/wdlib');
var config = require('./web/config');

// console.log("config.title=", config.title);

var staticHtml = mzfs.readFileSync(__dirname+'/web/static.html', 'utf-8');

function replace(str, source, target) {
  return str.split(source).join(target);
}
	
S.doAfterFilePost=function*(path, self, callback) {
	console.log("doAfterFilePost enter");
	var wd = self.request.body.text;
	var domain = path.split("/")[2];
	var toHtml = wdlib.wd2staticHtml(wd, domain, config.title[domain], staticHtml);
/*	
	var wdHtml = wdlib.wd2html(wd, domain);
	var toHtml = replace(staticHtml, "{%=wdHtml%}", wdHtml);
	toHtml = replace(toHtml, "{%=pathLink%}", config.title[domain]);
	toHtml = replace(toHtml, "{%=title%}", config.title[domain]);
*/	
	self.body = toHtml;
	var vpath = process.cwd()+path.replace(/\.wd$/, ".html");
	yield S.comkdir(vpath);
	fs.writeFile(vpath, toHtml, function(err) {
		if (err)
			console.log("writeFile : ", path, " fail!");
	});
}

S.run();


