/*

Copyright (C) 2016  Adrien THIERRY
http://seraum.com 

*/
module.exports.Event = new WorkerEvent();
var wf = WF();

function WorkerEvent()
{
  	process.on('message', function(processMsg)
    {
      if(processMsg.cmd !== undefined)
      {
         wf.Event.DoCmd(processMsg);
      }
    });

    this.DoCmd = function(processMsg)
    {
      if(wf.Service[processMsg.cmd] !== undefined)
      {
        wf.Service[processMsg.cmd](processMsg);
      }
    };
}
