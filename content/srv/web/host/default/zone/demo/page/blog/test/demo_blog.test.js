var test;
var wf = WF();
test = require('../blog.page.js');

var blogPage = new test({});
blogPage.view = {blog:"Blog test"};
blogPage.code(wf.Emulate.req, wf.Emulate.res);
