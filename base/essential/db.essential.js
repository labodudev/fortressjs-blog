/*

Copyright (C) 2016  Adrien THIERRY
http://seraum.com 

*/
module.exports.LoadDB = LoadDB;
UTILS.LoadDB = LoadDB;
var wf = WF();
try{
    GLOBAL.mongodb = require("mongodb");
}
catch(e){wf.Log("[*] Info : install mongodb module for MongoDB support with : npm install mongodb");}
function Database(connectObj, cb)
{
    //proto, host, port, name
	var Db = mongodb.Db;
    var MongoClient = mongodb.MongoClient;
    var Server = mongodb.Server;
    var ReplSetServers = mongodb.ReplSetServers;
    var Binary = mongodb.Binary;
    var GridStore = mongodb.GridStore;
    var Grid = mongodb.Grid;
    var Code = mongodb.Code;
    //var BSON = mongodb.pure().BSON;
    var BSON = mongodb.BSON;
    var assert = require('assert');
    wf.ObjectID = mongodb.ObjectID;

	var icb = cb;
    var clientString = "";
    if(connectObj.identity)
        clientString = connectObj.protocol + connectObj.identity.login + ":" + connectObj.identity.password + "@" + connectObj.host + ':' + connectObj.port + "/" + connectObj.name;
    else clientString = connectObj.protocol +connectObj. host + ':' + connectObj.port + "/" + connectObj.name;
    if(connectObj.uri) clientString += "?" + connectObj.uri;
	MongoClient.connect(clientString, {native_parser:true}, function(err, db) 
	{
        if(db != null)
        {
            var mdb = new MDB(db);
            if(icb !== undefined && typeof icb == 'function')
                icb(mdb);
          //wf.event.emit("dbLoaded");
        }
        else
        {
          wf.Log("[-] DB Not initialized; waiting");
            console.log(err);
          setTimeout(function(){wf.LoadDB(connectObj, cb);}, 5000);
        }
	});
}

var MDB = function(link)
{
	this.link = link;
  this.Insert = function(coll, data, option, cb)
  {
		this.link.collection(coll).insert(data, option, cb);
  }

  // RAPPEL : QUERY = FIND QUERY && DATA = MONGODB UPDATE OPTION && OPTION = DB OPTION
  // $inc $set ...
   this.Update = function(coll, query, data, option, cb)
  {
		this.link.collection(coll).update(query, data, option, cb);
  }

  this.Save = function(coll, data, option, cb)
  {
		this.link.collection(coll).save(data, option, cb);
  }

  this.Delete = function(coll, data, option, cb)
  {
		this.link.collection(coll).remove(data, option, cb);
  }

  this.Find = function(coll, data, option)
  {
		res = {};
		if(this.link !== undefined)
		{
			var res = this.link.collection(coll).find(data, option);
		}
		else res.toArray = function(){ return {};};

		return res;
  }
  
  this.Distinct = function(coll, field, query, cb)
  {
      this.link.collection(coll).distinct(field, query, cb);
  }
  
}

function LoadDB(connectObj, cb)
{
  try
  {
	 new Database(connectObj, cb);
  }
  catch(e)
  {
    wf.Log("[-] Error on LoaDB; retrying");
    setTimeout(function(){wf.LoadDB(connectObj, cb);}, 5000);
  }
}


