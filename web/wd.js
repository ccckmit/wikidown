E.msgNewFile = '# Title：File not found\n\nYou may edit and save now in Wikidown Syntax！\n\n## Wikidown Syntax\n\nThe [Wikidown](https://github.com/ccckmit/wikidown/) is an extension of [Markdown](http://daringfireball.net/projects/markdown/syntax) in the following way : \n\n1. ```[[InnerLink]](domain:file)```\n\n2. ```![[InnerImage]](ImageFile)```\n\n3. ```@[[InnerFile]](PathToFile)```\n\n\n\n';

E.loadScript=function(url, callback) {
	$.getScript(url, function(data, textStatus, jqxhr) {
		console.log(url, 'Load was performed.');
		if (typeof callback !== 'undefined')
			callback();
	});
}

$( document ).ready(function() {
	console.log("document.ready: E.init2");
  E.init2();
});

var domain;
var EloadFile = E.loadFile;
E.loadFile=function(path) {
	domain = path.split('/')[0];
	console.log("domain=", domain);
  E.showTitleHead(domain);
  E.showSide(domain);	
	EloadFile(path);
}

var Einit=E.init;
E.init2 = E.init=function() {
//	E.loadScript('https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_SVG');
//	E.loadScript('js/highlight.min.js');
//	E.loadScript('js/showdown.js');
//	E.loadScript('wdlib.js');
/*
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
*/	
//  E.loadScript('config.js', Einit);
	Einit();
}

E.templateApply=function(wd) {
  var templateNow = config.template[domain];
  if (templateNow===undefined)
    templateNow = config.template['default'];
  return templateNow.split('<%=wd%>').join(wd); // cannot use replace(reg, str), because of ＄...$ symbol，so we use split + join
}

Eshow = E.show;
E.show=function() {
	console.log("E.show()");
  var wd = $('#editBox').val().trim();
  wd  = E.templateApply(wd);
  var html = wdlib.wd2html(wd, domain, {isHash:true});
  $('#htmlBox').html(html);
  $("#htmlBox").animate({ scrollTop: 0 }, "fast");
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
  E.switchPanel('panelShow');
  if (typeof(MathJax) !== 'undefined') {
    MathJax.Hub.Queue(["Typeset",MathJax.Hub, "htmlBox"]);
  }
  E.showTitle();
}

E.showTitleHead=function(domain) {
  var titleHead = config.title['default'];
  if (config.title[domain] !== undefined)
    titleHead = config.title[domain];
  titleHead = ' [[※]](main:home) '+titleHead;
  var titleHtml = wdlib.wd2html(titleHead, domain, {isHash:true});
  $('#titleHead').html(titleHtml);
}

E.showTitle=function() {
  if ($('h1').length > 0)
    $('title').html($('#titleHead').text()+' -- '+$('h1')[0].innerText);
  else if ($('h2').length>0)
    $('title').html($('#titleHead').text()+' -- '+$('h2')[0].innerText);
}

E.showSide=function(domain) {
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

E.go = go = function(pDomain, pFile) {
  if (history.pushState){
    history.pushState({domain:pDomain, file:pFile}, document.title, 'wd.html#'+pDomain+'/'+pFile+".wd");
  }
  E.loadFile(pDomain+"/"+pFile+".wd");
  return false;
}

E.onpopstate = window.onpopstate = function(event) {
  var state = event.state;
  if (history.pushState){
    if (state) {
      E.loadFile(state.domain+"/"+state.file+".wd");
    }
  }
}

