/*

Copyright (C) 2016  Adrien THIERRY
http://seraum.com 

*/
module.exports.LoadTask = LoadTask;

function LoadTask()
{
  setInterval(function()
  {
    var options =
    {
      port: 10001,
      hostname: '127.0.0.1',
      method: 'GET',
      path: '/',
    }
    var req = http.request(options);
    req.end();
  }, 1000);

}
