var config = (function() {
  var title={
    'default' : '',
    'wikidown':' [[Wikidown]](wikidown:home) ',
		main:' [[Main]](main:home) ', 
  };

  var templateBySa='<%=wd%>\n\n----\n\n\<center style="font-size:small;color:#888888"><a href="https://creativecommons.org/licenses/by-sa/4.0/"><img src="/img/by-sa.png" height="36"/></a><br/><a href="https://www.npmjs.com/package/wikidown">Powered by Wikidown!</a></center>\n';

  var template={
    'default':templateBySa,
    'wikidown':templateBySa
  };
  
  var sideBook = "Book#home#active;Directory#directory;Content#content;Appendix#appendix;Reference#reference;";
	
  var sideMooc = "Course#home#active;Textbook#textbook;Lecture#lecture;Video#video;Information#information#active;Assignment#assignment;Announcement#announcement;Overview#overview;Discussion#discussion;Reference#reference;";
  
  var side={
    'default':'',
    wikidown:'',
    main:''
  }
	
  return {
    title: title,
    side: side,
    template: template,
  }

})();

if (typeof module !== 'undefined') 
  module.exports = config;
