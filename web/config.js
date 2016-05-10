var config = (function() {
    
  var titleCcc  = ' [[陳鍾誠]](ccc:home) ';
  var titleBook  = ' / [[電子書]](book:home) ';
  var titleCourse  = ' / [[課程]](course:home) ';
  var titlePmag = ' [[程式人雜誌]](pmag:home) ';
  var titleYmag = ' [[少年科技人雜誌]](ymag:home) ';

  var title={
    'default':' [[Wikidown]](wikidown:home) ',
		main:titleCcc, 
    ccc:titleCcc,
    book:titleCcc+titleBook,
    course:' [[課程]](course:home) ',
    exam:titleCcc+' / [[考題]](exam:home) ',
    novel:titleCcc+' / [[小說]](novel:home) ',
		mag: '[[雜誌]](mag:home) ',
    pmag:titlePmag,
    ymag:titleYmag,
    ymag201502:titleYmag+' / [[2015年2月號]](ymag201502:home) ',
    pmag201503:titlePmag+' / [[2015年3月號]](pmag201503:home) ',
    ymag201504:titleYmag+' / [[2015年4月號]](ymag201504:home) ',
    pmag201505:titlePmag+' / [[2015年5月號]](pmag201505:home) ',
    ymag201506:titleYmag+' / [[2015年6月號]](ymag201506:home) ',
    pmag201507:titlePmag+' / [[2015年7月號]](pmag201507:home) ',
    ymag201508:titleYmag+' / [[2015年8月號]](ymag201508:home) ',
    pmag201509:titlePmag+' / [[2015年9月號]](pmag201509:home) ',
    ymag201510:titleYmag+' / [[2015年10月號]](ymag201510:home) ',
    pmag201511:titlePmag+' / [[2015年11月號]](pmag201511:home) ',
    ymag201512:titleYmag+' / [[2015年12月號]](ymag201512:home) ',
    poem:titleCcc+' / [[程式與詩]](poem:home) ',
    jsh:titleCcc+titleBook+' [[專為中學生寫的 JavaScript 程式書]](jsh:home) ',
    pb:titleCcc+titleBook+' / [[程式設計]](pb:home) ',
    db:titleCcc+titleBook+' / [[資料庫]](db:home) ',
    ss:titleCcc+titleBook+' / [[系統軟體]](ss:home) ',
    co:titleCcc+titleBook+' / [[計算機結構]](co:home) ',
    ai:titleCcc+titleBook+' / [[人工智慧]](ai:home) ',
    cl:titleCcc+titleCourse+' / [[計算語言學]](cl:home) ',
    ct:titleCcc+titleBook+' / [[計算理論]](ct:home) ',
    ca:titleCcc+titleBook+' / [[微積分]](ca:home) ',
    st:titleCcc+titleBook+' / [[機率統計]](st:home) ',
    "3d":titleCcc+titleBook+' / [[Blender動畫]](3d:home) ',
    dm:titleCcc+titleBook+' / [[離散數學]](dm:home) ',
    se:titleCcc+titleBook+' / [[軟體工程]](se:home) ',
    ss:titleCcc+titleBook+' / [[系統軟體]](ss:home) ',    
    sci:titleCcc+titleBook+' / [[科學技術]](sci:home) ',
    cr:titleCcc+titleBook+' / [[密碼學]](cr:home) ',
    ph:titleCcc+titleBook+' / [[物理]](ph:home) ',
    ch:titleCcc+titleBook+' / [[化學]](ch:home) ',
    bi:titleCcc+titleBook+' / [[生物]](bi:home) ',
    sh:titleCcc+titleBook+' / [[科技史]](sh:home) ',
    ar:titleCcc+titleBook+' / [[Arduino]](ar:home) ',
    pi:titleCcc+titleBook+' / [[樹莓派]](pi:home) ',
    c :titleCcc+titleBook+' / [[C 語言]](c:home) ',
    cd:titleCcc+titleBook+' / [[編譯器設計]](cd:home) ',
    js:titleCcc+titleBook+' / [[JavaScript 語言]](js:home) ',
    jsh:titleCcc+titleBook+' / [[專為中學生寫的 JavaScript 程式書]](jsh:home) ',
    sc1:titleCcc+titleCourse+' / [[科學計算]](sc1:home) ',
    js1:titleCcc+titleCourse+' / [[JavaScript]](js1:home) ',
    co1:titleCcc+titleCourse+' / [[計算機結構]](co1:home) ',
    sp1:titleCcc+titleCourse+' / [[系統程式]](sp1:home) ',
    st1:titleCcc+titleCourse+' / [[機率統計]](st1:home) ',
    ai1:titleCcc+titleCourse+' / [[人工智慧]](ai1:home) ',
    mt:titleCcc+titleCourse+' / [[機器翻譯]](mt:home) ',
    c1:titleCcc+titleCourse+' / [[C語言]](c1:home) ',
    js0:titleCcc+titleBook+' / [[JavaScript 第一門課]](js0:home) ',
    jsb:titleCcc+titleBook+' / [[JavaScript 前端技術]](jsb:home) ',
    wp:titleCcc+titleBook+' / [[Web 程式設計]](wp:home) ',
    r :titleCcc+titleBook+' / [[R 軟體]](r:home) ',
    cs:titleCcc+titleBook+' / [[C# 語言]](cs:home) ',
    mm:titleCcc+titleBook+' / [[媒體]](mm:home) ',
    ee:titleCcc+titleBook+' / [[動手玩電路]](ee:home) ',
    lojban:titleCcc+titleBook+' / [[邏輯語 Lojban]](lojban:home) ',
    '8gL': '[[八極語]](8gL:home) ',
    '8gC': '[[八極漢語]](8gC:home) ',
    '8gE': '[[八極英語]](8gE:home) ',
    lo1:titleCcc+titleCourse+' / [[邏輯語初學]](lo1:home) ',
    ma:titleCcc+titleBook+' / [[學習當一位 maker]](ma:home) '
  };

  var templateCopyright='<%=wd%>\n\n----\n\n\
  <center style="font-size:small;color:#888888">(C) 版權所有，但可以轉貼網址。<br/> 作者：  [陳鍾誠](#ccc:home)  email: <ccckmit@gmail.com> </center>\n\
  [陳鍾誠]: http://ccckmit.wikidot.com/\n';

  var templatePhysics='<%=wd%>\n\n----\n\n\
  <center style="font-size:small;color:#888888">本文部份內容與大部份圖片修改自 [維基百科] 與 OpenStax College 的 [College Physics](https://openstaxcollege.org/textbooks/college-physics) 一書 ， 使用時請遵守 [姓名標示、相同方式分享] 授權。<br/> 編輯：  [陳鍾誠](#ccc:home)  email: <ccckmit@gmail.com></center>\n\
  [程式人雜誌社團]: https://www.facebook.com/groups/programmerMagazine/\n\
  [少年科技人社團]: https://www.facebook.com/groups/youngmaker.magazine/\n\
  [少年科技人雜誌]: http://programmermagazine.github.io/youngmaker/\n\
  [程式人雜誌]: http://programmermagazine.github.io/home/\n\
  [姓名標示、相同方式分享]: http://creativecommons.org/licenses/by-sa/3.0/tw/\n\
  [姓名標示、非商業性、相同方式分享]: http://creativecommons.org/licenses/by-nc-sa/3.0/tw/\n\
  [陳鍾誠]: http://ccckmit.wikidot.com/\n\
  [維基百科]:http://zh.wikipedia.org/\n';
	
  var templateCC='<%=wd%>\n\n----\n\n\
  <center style="font-size:small;color:#888888">本文部份內容與大部份圖片修改自 [維基百科] ， 使用時請遵守 [姓名標示、相同方式分享] 授權。<br/> 編輯：  [陳鍾誠](#ccc:home)  email: <ccckmit@gmail.com></center>\n\
  [程式人雜誌社團]: https://www.facebook.com/groups/programmerMagazine/\n\
  [少年科技人社團]: https://www.facebook.com/groups/youngmaker.magazine/\n\
  [少年科技人雜誌]: http://programmermagazine.github.io/youngmaker/\n\
  [程式人雜誌]: http://programmermagazine.github.io/home/\n\
  [姓名標示、相同方式分享]: http://creativecommons.org/licenses/by-sa/3.0/tw/\n\
  [姓名標示、非商業性、相同方式分享]: http://creativecommons.org/licenses/by-nc-sa/3.0/tw/\n\
  [陳鍾誠]: http://ccckmit.wikidot.com/\n\
  [維基百科]:http://zh.wikipedia.org/\n';

  var template={
    'default':templateCC,
    js:templateCopyright,
    js0:templateCopyright,
		cr:templateCopyright,
    novel:templateCopyright,
		ph:templatePhysics,
    ccc:templateCopyright
  };
  
  var sideBook = "本書#home#active;目錄#directory;內容#content;附錄#appendix;參考#reference;";
  var sideMooc = "課程#home#active;課本#textbook;講義#lecture;影片#video;進度#info#active;作業#assignment;公告#announcement;大綱#overview;討論#discuss;參考#reference;";
  
  var side={
    'default':'',
    cd:sideBook,
    js1:sideMooc,
    st1:sideMooc,
    ai1:sideMooc,
    sc1:sideMooc,
    c1 :sideMooc,
    '8gL' :sideMooc,
    '8gE' :sideMooc,
    '8gC' :sideMooc,
    sp1:sideMooc,
    lo1:sideMooc,
    cl:sideMooc,
    co1:sideMooc
  }

  return {
    title: title,
    side: side,
    template: template,    
  }

})();

if (typeof module !== 'undefined') 
  module.exports = config;

