  GLOBAL.wfStringEndsWith = function(haystack, needle)
  {
	  return haystack.indexOf(needle, haystack.length - needle.length) !== -1;
  }
  
  GLOBAL.wfStringContains = function(haystack, needle)
  {
	  return haystack.indexOf(needle) !== -1;
  }
  
