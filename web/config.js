var config = (function() {
  var title={
    'default':' [[Wikidown]](wd:home) ',
		main:' [[Main]](main:home) ', 
  };

  var templateCopyright='<%=wd%>\n\n----\n\n\
  <center style="font-size:small;color:#888888">(C) Copy Right';

  var templateCC='<%=wd%>\n\n----\n\n\
  <center style="font-size:small;color:#888888"><img src="img/by-sa.png"</center>';

  var template={
    'default':templateCC,
		main:templateCopyright,
		wikidown:templateCC,
  };
  
  var sideBook = "Book#home#active;Directory#directory;Content#content;Appendix#appendix;Reference#reference;";
  
  var side={
    'default':'',
  }

  return {
    title: title,
    side: side,
    template: template,    
  }

})();

if (typeof module !== 'undefined') 
  module.exports = config;

