var test;
test = require('../blog.page.js');

var blogPage = new test({});
blogPage.view = {blog:"Blog test"};
blogPage.code(Emulate.req, Emulate.res);
