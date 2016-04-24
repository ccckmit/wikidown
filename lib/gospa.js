function gospa() {
  var m=window.location.pathname.match(/\/db\/(\w+)\/(\w+)\.html/);
  window.location.href = '../../wd.html#'+m[1]+':'+m[2];
  
}

gospa();
