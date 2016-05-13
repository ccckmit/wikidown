function gospa() {
  var m=window.location.pathname.match(/\/file\/(\w+)\/(\w+)\.html/);
  window.location.href = '/wd.html#'+m[1]+'/'+m[2]+".wd";
}

gospa();
