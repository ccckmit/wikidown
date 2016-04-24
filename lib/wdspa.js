$('.panel').css( "display", "none");

var domain, file; // filepath, 
var wdNewFile = '# Title：File not found\n\nYou may edit and save now in Wikidown Syntax！\n\n## Wikidown Syntax\n\nThe [[Wikidown]](wikidown:home) is an extension of [Markdown](http://daringfireball.net/projects/markdown/syntax) in the following way : \n\n1. ```[[InnerLink]](domain:file)```\n\n2. ```![[InnerImage]](ImageFile)```\n\n3. ```@[[InnerFile]](PathToFile)```\n\n\n\n';

function isLogin() {
  if (localStorage.wd_login !== "true") { // 注意：sessionStorage 不能跨頁面持續，所以得用 localStorage
    alert('You can not save & edit before login. Please login now !');
    login();
    return false;
  }
  return true;
}

Server = {
  timeout : 4000
};

Server.save=function(domain, file, doc) {
  $.ajax({
    type: "POST",
    url: "/file/"+domain+"/"+file,
    timeout: this.timeout,
    data: { obj: doc },
    statusCode: {
      401: function() { // 401:Unauthorized
        localStorage.wd_login = "false";
        isLogin();
      }
    }
  })
  .done(function(data) {
    alert( "Save success!");
  })
  .fail(function() {
    alert( "Save fail!" );
  });
}

Server.load=function(domain, file) {
  return $.ajax({
    type: "GET",
    url: "file/"+domain+"/"+file,
    timeout: this.timeout,
    data: {}
  }).done(function(data) {
		
	}).fail(function(data) {
		if (confirm("Load fail , may be session timeout or network failure! Do you want to reload the app ?")) {
			Server.logout();
			window.location.href=".";
		}
	});
}

Server.login=function() {
  $.ajax({
    type: "POST",
    url: "/login",
    timeout: this.timeout,
    data: { user:$('#loginUser').val(), password:$('#loginPassword').val() },
  })
  .done(function(data) {
    localStorage.wd_login = "true";
    alert( "Login success!");
    $('#loginPassword').val('');
    edit();
  })
  .fail(function() {
    localStorage.wd_login = "false";
    alert("Login fail!\nDefault : user=root , password=123\nModify or add (user, password) in setting.js for security");
    login();
  });
}

Server.logout=function() {
  $.ajax({
    type: "POST",
    url: "/logout",
    timeout: this.timeout,
    data: {},
  })
  .done(function(data) {
    localStorage.wd_login = "false";
    alert( "Logout success!");
    show();
  })
  .fail(function() {
    alert( "Logout fail!" );
  });
}

window.onhashchange = function () {
  filepath = window.location.hash.substring(1);
  var parts  = filepath.split(':');
  var domain = parts[0], file=parts[1];
  loadFile(domain, file, {isAjax:true});
  if (history.pushState){
//    history.replaceState({domain:domain, file:file}, document.title, window.location.href);
    history.pushState({domain:domain, file:file}, document.title, ''+domain+'.'+file);
  }
}

var isHash;

function init() {
//  if (window.location.hash === '')
//    window.location.hash = '#main:home';
  var m = window.location.pathname.match(/\/db\/([^\/]+)\/([^\/]+)\.html/);
  if (m !== null) {
    isHash = false;
    loadFile(m[1], m[2]);
//    window.location.hash = '#'+m[1]+':'+m[2];
  } else {
    isHash = true;
    window.onhashchange();
  }
  if (window.location.protocol === 'https:') {
    $('#menuLogin').removeClass('hide');
    $('#menuEdit').removeClass('hide');
  }
	if (typeof MathJax !== 'undefined') {
		MathJax.Hub.Config({
				extensions: ["tex2jax.js"],
				jax: ["input/TeX", "output/HTML-CSS"],
				displayAlign: "left",
				tex2jax: {
					inlineMath: [ ['$','$'], ["\\(","\\)"] ],
					displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
					processEscapes: true
				},
				"HTML-CSS": { availableFonts: ["TeX"], scale: 130 }
			});		
	}
}

function switchPanel(name) {
  $('.panel').css( "display", "none");
  $('#'+name).css( "display", "block");
}

function templateApply(wd) {
  var templateNow = config.template[domain];
  if (templateNow===undefined)
    templateNow = config.template['default'];
  return templateNow.split('<%=wd%>').join(wd); // cannot use replace(reg, str), because of ＄...$ symbol，so we use split + join
}

function login() {
  switchPanel('panelLogin');
}

function logout() {
  Server.logout();
}

function edit() {
  switchPanel('panelEdit');
}

function upload() {
  if (!isLogin()) return;
  switchPanel('panelUpload');
  $("#imageUpload").fileinput({
    uploadUrl: "/upload/"+domain,
    maxFileCount: 10,
    uploadAsync: false,
    uploadExtraData: {
        domain: domain,
        file: file
    }
  });
}

function absolute(base, relative) {
  var stack = base.split("/"),
      parts = relative.split("/");
  stack.pop(); // remove current file name (or empty string)
               // (omit if "base" is the current folder without trailing slash)
  for (var i=0; i<parts.length; i++) {
    if (parts[i] == ".")
        continue;
    if (parts[i] == "..")
        stack.pop();
    else
        stack.push(parts[i]);
  }
  return stack.join("/");
}

function httpRef() {
  return window.location.href.replace('https:', 'http:');
}

function facebookShare() {
  window.open("https://www.facebook.com/sharer/sharer.php?u="+escape(absolute(httpRef(), 'db/'+domain+'/'+file+'.html'))+'&t='+document.title, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600')
}

function staticShare() {
  window.open(absolute(httpRef(), '../../db/'+domain+'/'+file+'.html'), '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600')
}

function show() {
  var wd = $('#wdBox').val().trim();
  wd  = templateApply(wd);
//  staticUrl = absolute(httpRef(), ''+domain+'/'+file+'');
  var html = wdlib.wd2html(wd, domain, {isHash:isHash});
         //  +'<div class="fb-comments" data-href="'+staticUrl+'" data-numposts="5" data-colorscheme="light"></div>';
  $('#htmlBox').html(html);
  $("#htmlBox").animate({ scrollTop: 0 }, "fast");
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
  switchPanel('panelShow');
  if (typeof(MathJax) !== 'undefined') {
    MathJax.Hub.Queue(["Typeset",MathJax.Hub, "htmlBox"]);
  }
  showTitle();
}

function showTitleHead(domain) {
  var titleHead = config.title['default'];
  if (config.title[domain] !== undefined)
    titleHead = config.title[domain];
// Unicode Symbol page : http://jrgraphix.net/r/Unicode/2600-26FF
  titleHead = ' [[※]](main:home) '+titleHead; // &#x264B; &#x26EA; <- house &#9967;
  var titleHtml = wdlib.wd2html(titleHead, domain, {isHash:isHash});
  $('#titleHead').html(titleHtml);
}

function showTitle() {
  if ($('h1').length > 0)
    $('title').html($('#titleHead').text()+' -- '+$('h1')[0].innerText);
  else if ($('h2').length>0)
    $('title').html($('#titleHead').text()+' -- '+$('h2')[0].innerText);
}

function showSide(domain) {
  var side = config.side['default'];
  if (config.side[domain] !== undefined)
    side = config.side[domain];
  var items = side.split(";");
  var sideHtml = '';
  for (var i in items) {
    var parts = items[i].split("#");
    if (parts.length > 2 && parts[2]==="active")
      sideHtml += '<li class="active"><a href="#'+domain+':'+parts[1]+'">'+parts[0]+'</a></li>\n';    
    else
      sideHtml += '<li><a href="#'+domain+':'+parts[1]+'">'+parts[0]+'</a></li>\n';    
  }
  if (side.length === 0) {
    $('#side').html('');
  } else {
    $('#side').html(sideHtml);
  }
    
}

function loadFile(pDomain, pFile) {
  domain = pDomain, file=pFile;
  showTitleHead(domain);
  showSide(domain);
  $('#staticUrl').val(absolute(httpRef(), ''+domain+'.'+file+''));
  if (isHash === true) {
    Server.load(domain, file+".wd")
    .done(function(wd) {
      $('#wdBox').val(wd);
      show();
    })
    .fail(function() {
      $('#wdBox').val(wdNewFile);
      show();
    });
  } else {
    show();
  }    
}

var go = function(pDomain, pFile) {
  if (history.pushState){
    history.pushState({domain:pDomain, file:pFile}, document.title, ''+pDomain+'.'+pFile);
  }
  loadFile(pDomain, pFile);
  return false;
}

// 在頁面載入時，不同瀏覽器具有不同的 popstate 行為。
// Chrome 與 Safari 會在頁面載入時觸發 popstate 事件，但 Firefox 則不會。
var popEvent;
window.onpopstate = function(event) {
  popEvent = event;
  var state = event.state;
  if (history.pushState){
    if (typeof state !== 'undefined') {
      loadFile(state.domain, state.file);
    }
  }
}

window.onbeforeunload = function() {
  if (history.pushState){
    history.pushState(null, null, 'wd.html#'+domain+':'+file);
  }
}

function save() {
  if (!isLogin()) return;
  var wd = $('#wdBox').val();
  Server.save(domain, file+".wd", wd);
}

/*
You can read the state of the current history entry without waiting for a popstate event using the history.state property like this:

var currentState = history.state;
*/

/*
  if (window.location.hash.length > 0) {
//    console.log('hash=', window.location.hash);
    window.onhashchange();
  } else {
//    window.history.back();
//    window.history.back();
  }
*/

