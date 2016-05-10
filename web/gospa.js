function gospa() {
  var m=window.location.pathname.match(/\/view\/(\w+)\/(\w+)/);
  window.location.href = '/wd.html#'+m[1]+':'+m[2];
}

gospa();
