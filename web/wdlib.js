var wdlib = (function() {

if (typeof module !== 'undefined') {
  showdown = require('showdown');
}

var converter = new showdown.Converter();
converter.setOption('tables', true);

function wd2md(wd, domain) {
  var md = wd
	   .replace(/(\s)@\[\[([^\]]*?)\]\]\((.*?)\)/gi, '$1[$2]($3)') // @[[File]](Path)
	   .replace(/(\s)@\[\[([^\]]*?)\]\]/gi, '$1[$2]($2)') // @[[File]]
	   .replace(/(\s)\!\[\[([^\]]*?)\]\]\((.*?)\)/gi, '$1![$2]($3)') // ![[Image]](Path)
     .replace(/(\s)\[\[([^\]]+?)\]\]\(([^:\)]+):([^:\)]+)\)/gi,  '$1[$2](../$3/$4.html)') // [[Link]](domain:file)
     .replace(/(\s)\[\[([^\]]+?)\]\]\((.*?)\)/gi, '$1[$2]($3.html)') // [[Link]](file)
     .replace(/(\s)\[\[([^\]:]+?)\]\]/gi, '$1[$2]($2.html)'); // [[Link]]
  return md;
}

function md2html(md) {
  return converter.makeHtml(md);
}

function wd2html(wd, domain, options) {
  wd  = '\n'+wd+' ';
  wd  = wd.replace(/(\s)@\[\[([^\]]*?)\]\]\((.*?)\)/gi, '$1<a href="file/'+domain+'/$3">$2</a>'); // [[text]](pathToFile)
  wd  = wd.replace(/(\s)@\[\[([^\]]*?)\]\]/gi, '$1<a href="file/'+domain+'/$2">$2</a>'); // [pathToFile]]
  wd  = wd.replace(/(\s)\!\[\[([^\]]*?)\]\]\((.*?)\)/gi, '$1<div class="figure"><img src="file/'+domain+'/$3"/><p class="caption">$2</p></div>'); // ![[text]](file)
  wd  = wd.replace(/(\s)\[\[([^\]]+?)\]\]\(([^:\)]+):([^:\)]+)\)/gi, '$1<a onclick="return go(\'$3\',\'$4\')" href="#$3/$4.wd">$2</a>'); // [[text]](domain:file)
  wd  = wd.replace(/(\s)\[\[([^\]]+?)\]\]\((.*?)\)/gi, '$1<a onclick="return go(\''+domain+'\',\'$3\')" href="#'+domain+'/$3.wd">$2</a>'); // [[text]](file)
  wd  = wd.replace(/(\s)\[\[([^\]:]+):([^\]:]+)\]\]/gi, '$1<a onclick="return go(\'$2\',\'$3\')" href="#$2/$3.wd">$2/$3</a>'); // [[domain:file]]
  wd  = wd.replace(/(\s)\[\[([^\]:]+?)\]\]/gi, '$1<a onclick="return go(\''+domain+'\',\'$2\')" href="#'+domain+'/$2.wd">$2</a>'); // [[file]]
  if (typeof options!=='undefined' && options.isHash===false) {
    wd = wd.replace(/href="#(\w+)\/(\w+)\.wd\"/gi, 'href="../$1/$2.html"').replace(/onclick=".*?"/gi, "");
  }
  return md2html(wd);
}

function wd2staticHtml(wd, domain, pathLink, staticTemplate) {
  var title='', titleMatch = wd.match(/([^#\n]{1,100})/);
  if (typeof pathLink === 'undefined') pathLink = '';
  var path = pathLink.replace(/\(.+?\)/g, '').replace(/[\[\]]/g, '');
  if (titleMatch !== null)
    title = path + "/"+ titleMatch[1];
  else
    title = path;
//  var titleHtml = wd2html(title, domain, {isHash:false});
  var wdHtml = wd2html(pathLink+"\n\n"+wd, domain, {isHash:false});
  var html = staticTemplate.replace("{%=wdHtml%}", wdHtml).replace("{%=title%}", title);
  return html;
}

  return {
    wd2md:wd2md,
		md2html:md2html,
		wd2html:wd2html,
    wd2staticHtml:wd2staticHtml
  }
})();

if (typeof module !== 'undefined') 
	module.exports = wdlib;
