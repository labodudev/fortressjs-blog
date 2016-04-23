/*

Copyright (C) 2016  Adrien THIERRY
http://seraum.com 

*/
var wf = WF();
module.exports.Cluster = new MasterCluster();


function MasterCluster()
{
	wf.CLUSTERS = {};

	this.exitFunction = function(worker, code, signal)
	{
		//wf.Log("[M] A worker died; reloading one with srvid : " + worker.srvId + " - " + worker.wrkId);
        if(wf.SERVERS[worker.srvId] && wf.SERVERS[worker.srvId].state)
        {
            wf.Cluster.createWorker( worker.srvId, worker.wrkId );
        }
		delete wf.CLUSTERS[worker.id];
	};
	
    // ON CAPTE LA FERMETURE D'UN WORKER ET ON LE RELANCE
    cluster.on('exit', this.exitFunction);

	this.createWorker = function(srvId, wrkId)
	{
		var currentCluster = cluster.fork( { srvId: srvId, wrkId: wrkId } );
		wf.CLUSTERS[currentCluster.id] = currentCluster;
		wf.CLUSTERS[currentCluster.id].srvId = srvId;
        wf.CLUSTERS[currentCluster.id].wrkId = wrkId;
		cluster.workers[currentCluster.id].on('message', function(msg)
		{
  			 if(msg.cmd !== undefined)
			{
			   wf.Event.DoCmd(msg);
			}
		});
		return currentCluster;
	};
	
	this.deleteClusters = function()
	{
		for(var currentCluster in wf.CLUSTERS)
		{
			this.deleteCluster(wf.CLUSTERS[currentCluster].id);
		}
	};
	
	this.deleteCluster = function(id)
	{
		delete wf.CLUSTERS[id];
	};
}
