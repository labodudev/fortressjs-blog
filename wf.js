'use strict'
/*
  Copyright (C) 2016  Adrien THIERRY
  http://seraum.com 
  FortressJS site : http://fortressjs.com
*/

// DEFINE GLOBAL WF VAR
global.WF = require('./start/singleton.js');
var wf = WF();
// CREATE GLOBAL WF CONF
wf.CONF = {};
wf.CONF.MAIN_PATH = __dirname + "/";
wf.CONF.BASE_PATH = wf.CONF.MAIN_PATH + "base" + "/";

// REQUIRE START CONF
require('./start/start.inc.js');
