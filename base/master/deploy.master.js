/*

Copyright (C) 2016  Adrien THIERRY
http://seraum.com 

*/
module.exports.Deploy = new deployMaster();

/*

    TODO : ADD : REMPLACER LE FOR PAR FUNCTION RECURSIVE CB
        => BOUCLER SUR L'OBJECT ET PLACER LES ID DANS UN ARRAY
    TODO : faire un editeur en ligne

*/


function deployMaster()
{
    var wf = WF();
    var DEFAULT_HOST = "local";
    var DEFAULT_ZONE = "default";
    
    this.launchSrv = function(srvId)
    {
        wf.LoadServer(srvId);
        wf.Service.startSrv(srvId);
    }
    
    /************************* CREATE *************************/
    // CREATE A SERVER AND AN EMPTY HOST
    this.createServer = function(obj)
    {
        if(!obj.id) return;
        var f = wf.CONF.SRV_PATH + obj.id + "/";
        fs.mkdir(f, function(err)
        {
            fs.mkdir(f + wf.CONF.APP_FOLDER, function(err)
            {
                fs.mkdir(f + wf.CONF.HOST_FOLDER, function(err)
                {
                    createSquel(f, "srv", obj.id, wf.CONF.CONFIG_END);
                    wf.Deploy.createHost({id: DEFAULT_HOST, srvId: obj.id});
                });
            });
        });
    }
    
    //CREATE AN EMPTY HOST WITH AN EMPTY ZONE
    this.createHost = function(obj)
    {
        if(!obj.id || !obj.srvId) return;
        var f = wf.CONF.SRV_PATH + obj.srvId + "/" + wf.CONF.HOST_FOLDER + obj.id + "/";
        fs.mkdir(f, function(err)
        {
            fs.mkdir(f + wf.CONF.MODEL_FOLDER, function(err)
            {
                fs.mkdir(f + wf.CONF.PLUGIN_FOLDER, function(err)
                {
                    fs.mkdir(f + wf.CONF.ZONE_FOLDER, function(err)
                    {
                        createSquel(f, "host", obj.id, wf.CONF.CONFIG_END);
                        wf.Deploy.createZone({id: DEFAULT_ZONE, srvId: obj.srvId, hostId: obj.id});
                    });
                });
            });
        });
    }
    
    //CREATE AN EMPTY ZONE
    this.createZone = function(obj)
    {
        if(!obj.id || !obj.srvId || !obj.hostId) return;
        var f = wf.CONF.SRV_PATH + obj.srvId + "/" + wf.CONF.HOST_FOLDER + obj.hostId + "/" + wf.CONF.ZONE_FOLDER + obj.id + "/";
        fs.mkdir(f, function(err)
        {
            fs.mkdir(f + wf.CONF.MOD_FOLDER, function(err)
            {
                fs.mkdir(f + wf.CONF.PAGE_FOLDER, function(err)
                {
                    fs.mkdir(f + wf.CONF.TPL_FOLDER, function(err)
                    {
                        fs.mkdir(f + wf.CONF.JAIL_FOLDER, function(err)
                        {
                            createSquel(f, "zone", obj.id, wf.CONF.CONFIG_END);
                        });
                    });
                });
            });
        });
    }
    
    // CREATE AN ENGINE CONTAINER
    this.createEngineContainer = function(obj, cb)
    {
        if(!obj.id) return;
        var f = wf.CONF.ENGINE_PATH + obj.id + "/";
        fs.mkdir(f, function(err){if(cb && typeof cb == "function") cb();});
    }
    
    // CREATE AN ENGINE
    this.createEngine = function(obj)
    {
        if(!obj.id || !obj.ecId) return;
        var f = wf.CONF.ENGINE_PATH + obj.ecId + "/";
        var e = f + obj.id + "/";
        fs.mkdir(f, function(err)
        {
            fs.mkdir(e, function(err)
            {
                createSquel(e, "appConf", obj.id, wf.CONF.CONFIG_END);
                createSquel(e, "appCode", obj.id, wf.CONF.APP_END);
            })
        });
    }
    
    // CREATE AN APP CONTAINER
    this.createAppContainer = function(obj, cb)
    {
        if(!obj.id || !obj.srvId) return;
        var f = wf.CONF.SRV_PATH + obj.srvId + "/" + wf.CONF.APP_FOLDER + obj.id + "/";
        fs.mkdir(f, function(err){if(cb && typeof cb == "function") cb();});
    }
    
    // CREATE AN APP
    this.createApp = function(obj)
    {
        if(!obj.id || !obj.srvId || !obj.acId) return;
        var f = wf.CONF.SRV_PATH + obj.srvId + "/" + wf.CONF.APP_FOLDER + obj.acId + "/";
        var e = f + obj.id + "/";
        fs.mkdir(f, function(err)
        {
            fs.mkdir(e, function(err)
            {
                createSquel(e, "appConf", obj.id, wf.CONF.CONFIG_END);
                createSquel(e, "appCode", obj.id, wf.CONF.APP_END);
            })
        });
    }
    
    /************************* CREATE *************************/
    
    
    /************************** ADD ***************************/
    this.install = function(obj)
    {
        var reload = [];
        var restart = false;
        
        for(var o in obj.list)
        {
            if(obj.list[o].reload && obj.list[o].srvId) reload.push(obj.list[o]);
            if(obj.list[o].restart) restart = true;
            switch(obj.list[o].type)
            {
                case "core":
                    installCore(o, obj.list[o]);
                    break;
                case "server":
                    installServer(o, obj.list[o]);
                    break;
                case "host":
                    installHost(o, obj.list[o]);
                    break;
                case "engine":
                    installEngine(o, obj.list[o]);
                    break;
                case "app":
                    installApp(o, obj.list[o]);
                    break;
                default:
                    break;
            }
        }
        /*
            in install.conf : reload need an srvID, restart => restart all
        */
        var endCb = function()
        {
            if(restart)
            {
                process.exit();
            }
            else
            {
                var j = reload.length;
                for(var i = 0; i < j; i++)
                {
                    wf.Service.reloadSrv(reload[i]);
                }
            }
        }
        wf.fileUtil.rmdir(obj.tmp, endCb);
    }
    function installCore(src, obj)
    {
        var from = path.join(src, obj.id);
        var to = path.join(wf.CONF.MAIN_PATH, obj.path);
        var rmCb = function(){ fs.rename(from, to, function(err){}); };
        wf.fileUtil.rmdir(to, rmCb);
    }
    function installServer(src, obj)
    {
        var from = path.join(src, obj.id);
        var to = path.join(wf.CONF.SRV_PATH, obj.id);
        var rmCb = function(){ fs.rename(from, to, function(err){}); };
        wf.fileUtil.rmdir(to, rmCb);
    }
    function installHost(src, obj)
    {
        var from = path.join(src, obj.id);
        var to = path.join(wf.CONF.SRV_PATH, obj.srvId, wf.CONF.HOST_FOLDER, obj.id);
        var rmCb = function(){ fs.rename(from, to, function(err){}); };
        wf.fileUtil.rmdir(to, rmCb);
    }
    function installEngine(src, obj)
    {
        var from = path.join(src, obj.id);
        var to = path.join(wf.CONF.ENGINE_PATH, obj.ecId, obj.id);
        fs.mkdir(path.join(wf.CONF.ENGINE_PATH, obj.ecId), function(err)
        {
            var rmCb = function(){ fs.rename(from, to, function(err){}); };
            wf.fileUtil.rmdir(to, rmCb);
        });
    }
    function installApp(src, obj)
    {
        var from = path.join(src, obj.id);
        var to = path.join(wf.CONF.SRV_PATH, obj.srvId, wf.CONF.APP_FOLDER, obj.acId, obj.id);
        fs.mkdir(path.join(wf.CONF.SRV_PATH, obj.srvId, wf.CONF.APP_FOLDER, obj.acId), function(err)
        {
            var rmCb = function(){ fs.rename(from, to, function(err){}); };
            wf.fileUtil.rmdir(to, rmCb);   
        })
    }
    /************************** ADD ***************************/
    
    /************************ DELETE **************************/
    this.delete = function(obj)
    {
        switch(obj.type)
        {
            case "server":
                deleteServer(obj);
                break;
            case "host":
                deleteHost(obj);
                break;
            case "econtainer":
                deleteEContainer(obj);
                break;
            case "engine":
                deleteEngine(obj);
                break;
            case "acontainer":
                deleteAContainer(obj);
                break;
            case "app":
                deleteApp(obj);
                break;
            default:
                break;
        }
    }
    
    function deleteServer(obj)
    {
        var cb = function(){};
        if(obj.stop) wf.Service.stopSrv(obj.id);
        wf.fileUtil.rmdir(path.join(wf.CONF.SRV_PATH, obj.id), cb);
    }
    
    function deleteHost(obj)
    {
        var cb = function(){};
        if(obj.reload)
        {
            cb = function()
            {
                wf.Service.reloadSrv(obj.srvId);
            }
        }
        wf.fileUtil.rmdir(path.join(wf.CONF.SRV_PATH, obj.srvId, wf.CONF.HOST_FOLDER, obj.id), cb);
    }
    
    function deleteEContainer(obj)
    {
        var cb = function(){};
        if(obj.reload)
        {
            cb = function()
            {
                wf.Service.reloadAllSrv();
            }
        }
        wf.fileUtil.rmdir(path.join(wf.CONF.ENGINE_PATH, obj.id), cb);
    }
    
    function deleteEngine(obj)
    {
        var cb = function(){};
        if(obj.reload)
        {
            cb = function()
            {
                wf.Service.reloadAllSrv();
            }
        }
        wf.fileUtil.rmdir(path.join(wf.CONF.ENGINE_PATH, obj.ecId, obj.id), cb);
    }
    
    function deleteAContainer(obj)
    {
        var cb = function(){};
        if(obj.reload)
        {
            cb = function()
            {
                wf.Service.reloadSrv(obj.srvId);
            }
        }
        wf.fileUtil.rmdir(path.join(wf.CONF.SRV_PATH, obj.srvId, wf.CONF.APP_FOLDER, obj.id), cb);
    }
    
    function deleteApp(obj)
    {
        var cb = function(){};
        if(obj.reload)
        {
            cb = function()
            {
                wf.Service.reloadSrv(obj.srvId);
            }
        }
        wf.fileUtil.rmdir(path.join(wf.CONF.SRV_PATH, obj.srvId, wf.CONF.APP_FOLDER, obj.acId, obj.id), cb);
    }
    /************************ DELETE **************************/
    
    // COPY SQUEL FILE
    function createSquel(path, type, id, end)
    {
        var read = fs.createReadStream(wf.CONF.SQUEL_PATH + type + wf.CONF.SQUEL_END);
        read.on("error", function(err){});
        var write = fs.createWriteStream(path + id + end, {flags: 'wx'});
        write.on("error", function(err){});
        read.pipe(write);
    }
    
}