var test;
// TEST config.core.js
test = require('../config.core.js');
for(var exp in test)
{
		var tested = new test[exp]();
}

// TEST httpUtil.core.js
require('../httpUtil.core.js');

// TEST httpsUtil.core.js
require('../httpsUtil.core.js');

// TEST log.core.js
test = require('../log.core.js');
test.Log('ok');
test.Error('ok');

// TEST mkdirp.core.js
require('../mkdirp.core.js');

// TEST multipart.core.js
test = require('../multipart.core.js');
for(var exp in test)
{
		var tested = new test[exp]();
}

// TEST router.core.js
require('../router.core.js');