var jslib = (function() {
  function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  }
	
  function replace(str, source, target) {
    return str.split(source).join(target);
  }

  function render(template, map) {
		for (var key in map) {
      replace(template, key, map[key]);
		}
  }

  return {
		endsWith:endsWith,
		replace: replace,
  }
})();

if (typeof module !== 'undefined') 
	module.exports = jslib;