var fs      = require('fs');
var path    = require('path');
var http    = require('http');
var https   = require('https');
var mzfs    = require('mz/fs');
var koa     = require('koa');
var bodyParser = require("koa-bodyparser"); // 參考：http://codeforgeek.com/2014/09/handle-get-post-request-express-4/
var session = require('koa-session');
var route   = require('koa-route');
var parse   = require('co-busboy');
var saveTo  = require('save-to');
var wdlib   = require('./web/wdlib');
var config  = require('./web/config');
var setting = require('./setting');
var passwords = setting.passwords;
var app = koa();
var routeMap = {
  web:path.join(__dirname, 'web'),
  file:path.join(process.cwd(), 'file'),
};
// var sysFileRoot=fileDirs[0];
// var workFileRoot=fileDirs[1];
var staticTemplate = fs.readFileSync(routeMap.web+"/static.html", "UTF-8");
app.keys = ['@#$TYHaadfa1'];
app.use(session(app));
app.use(bodyParser({formLimit:5*1000*1000, jsonLimit:5*1000*1000}));

function response(res, code, msg) {
  res.status = code;
  res.set({'Content-Length':''+msg.length,'Content-Type':'text/plain'});
  res.body = msg;
  console.log("response: code="+code+"\n"+msg+"\n");
}

function isPass(req) {
  console.log("loginToSave="+setting.loginToSave);
  if (setting.loginToSave === false) 
    return true;
  console.log('req.session.user='+req.session.user);
  return typeof(req.session.user)!=='undefined';
}

// File upload : multipart upload
app.use(function *(next){
  var domain = this.request.url.split("/").pop();
  if ('POST' !== this.request.method) return yield next;
  if (!this.request.url.startsWith('/upload/')) return yield next;
  if (!this.request.header["content-type"].startsWith("multipart/form-data;")) return yield next;
  var part, parts = parse(this);
  var files = [], file;
  while (part = yield parts) {
    console.log('part=%j', part);
    if (typeof part.filename !== 'undefined') {
      files.push(file = path.join(routeMap.file, domain, part.filename));
      console.log('uploading %s -> %s', part.filename, file);
      yield saveTo(part, file);
    }
  }
  this.body = files;
});

app.use(route.get('/', function*() {
  this.redirect('wd.html#main:home');
}));

var mime = { ".js":"application/javascript", ".css": "text/css", ".html": "text/html", ".htm":"text/html", ".jpg":"image/jpg", ".png":"image/png", ".gif":"image/gif", ".pdf":"application/pdf"};

function fileMimeType(path) {
  for (var tail in mime) {
    if (path.endsWith(tail))
      return mime[tail];
  }
}

app.use(route.get(/.*/, function *toStatic() {
  if (!this.path.startsWith("/setting.js")) {
    var mimetype = fileMimeType(this.path)
    if (mimetype) this.type = mimetype+";";
    console.log('get %s', this.path);   
    this.body = mzfs.createReadStream(routeMap.web+this.path);
  }
}));

app.use(route.post('/file/:domain/:file', function*(domain, file) {
  var req = this.request, res = this.response;
  var text = this.request.body.obj;
  if (!isPass(this)) {
    response(res, 401, 'Please login to save!')
    return;
  }
  console.log('post %s:%s', domain, file)
  yield mzfs.mkdir(routeMap.file+"/"+domain+"/").catch(function(){});
  yield mzfs.writeFile(routeMap.file+"/"+domain+"/"+file, text).then(function() {
    response(res, 200, 'write success!');
  }).catch(function() {
    response(res, 403, 'write fail!'); // 403: Forbidden
  });
  if (file.endsWith(".wd")) {
    var html = wdlib.wd2staticHtml(text, domain, config.title[domain], staticTemplate);
    yield mzfs.writeFile(routeMap.file+"/"+domain+"/"+file.replace(/\.wd$/,".html"), html);
  }
}));

// https version : in self signed certification
// You can save & modify in SSL mode, no edit allowed in HTTP mode.

var secureApp = app;

secureApp.use(route.post("/login", function*() {
  var req = this.request, res = this.response;
  var p = this.request.body;
  if (req.protocol !== 'https') {
    response(res, 401, p.user+":login fail!");
    return;
  }  
  if (p.user in passwords && passwords[p.user].toUpperCase() === p.password.toUpperCase()) {
    this.session.user = p.user;
    response(res, 200, p.user+":login success!");
  } else {
    response(res, 401, p.user+":login fail!");
  }
}));

secureApp.use(route.post("/logout", function*() {
  var req = this.request, res = this.response;
  this.session = null;
  response(res, 200, "logout success!");
}));

app.run=function() {
	var port = setting.port || 80; // process.env.PORT for Heroku
	console.log('Server started: http://localhost:'+port);
	http.createServer(app.callback()).listen(port);
	var sslPort = setting.portSsl || 443;
	https.createServer({
		key: mzfs.readFileSync(routeMap.web+'/key.pem'),
		cert: mzfs.readFileSync(routeMap.web+'/cert.pem'),
		// The folowing is for self signed certification.
		requestCert: true, 
		ca: [ mzfs.readFileSync(routeMap.web+'/csr.pem') ]
	}, app.callback()).listen(sslPort);
	console.log('Ssl Server started: https://localhost:'+sslPort);
}

module.exports = app;


