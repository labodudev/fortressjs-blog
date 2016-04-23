/*

Copyright (C) 2016  Adrien THIERRY
http://seraum.com 

*/
var wf = WF();
wf.AppServer.net = Net;

function Net(srv)
{
    function netHandler(socket)
    {
		socket.id = socket.remoteAddress + "_" + socket.remotePort;
        socket.srv = srv;
        // DEFAUL HOST IS LOCAL BECAUSE OF PROTOCOL
		if(wf.SERVERS[srv].HOSTS[wf.CONF.DEFAULT_NET])
		{
			socket.app = wf.SERVERS[srv].HOSTS[wf.CONF.DEFAULT_NET].appArray;
			// FORGE SERVERS
			socket.SERVER = wf.SERVERS[srv];
			// FORGE HOST
			socket.HOST = socket.SERVER.HOSTS[wf.CONF.DEFAULT_NET];
			// Set CLIENTS
			socket.SERVER.CLIENTS[socket.id] = socket;
			// Set disconnect function
			socket.on('end', function()
			{
				delete socket.SERVER.CLIENTS[socket.id];
			});
			// DO
			wf.LoopExec(socket, socket);
		}
		else
		{
			wf.Log("Local host is not defined");
		}
    }

    wf.SERVERS[srv].CLIENTS = {};
    wf.SERVERS[srv].HANDLES = {};
	// LISTEN ON EACH PORTS
    for(var p in wf.SERVERS[srv].port)
    {
        var name = srv + "_" + p + "_" + wf.SERVERS[srv].port[p];
        wf.Log(name);
        var tSrv = net.createServer(netHandler);
        wf.SERVERS[srv].HANDLES[name] = tSrv;
        tSrv.listen(wf.SERVERS[srv].port[p]);
    }
}
