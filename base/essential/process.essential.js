/*

Copyright (C) 2016  Adrien THIERRY
http://seraum.com 

*/
module.exports.LoadProcess = LoadProcess;
var wf = WF();

function LoadProcess()
{
	wf.PROCESS = {};
	var sArr = [];
	var c = wf.CONF.PROCESS_PATH;
	if(fs.existsSync(c) && fs.lstatSync(c).isDirectory())
	{
		var dArr = fs.readdirSync(c);
		var d = dArr.length;
		while(d--)
		{
			if (fs.lstatSync(c +'/' + dArr[d]).isDirectory() && dArr[d] != "." && dArr[d] != "..")
			{
				
				var proc = new wf.ProcessClass.Process(c, dArr[d]);
				if(proc.processState && proc.conf.config.state)
				{
					sArr.push(proc);
				}
			}
		}
		sArr.sort(function(a, b){return a.conf.config.pos - b.conf.config.pos;});
	}

	wf.PROCESS = sArr;
	var sL = sArr.length;
	for( var i = 0; i < sL; i++)
	{
		var wait = sanitInt(sArr[i].conf.config.wait, false);
		manageProcess(sArr[i], wait);
	}
}

function manageProcess(proc, wait)
{
	if(wait === false)
	{
		setImmediate(function()
		{
			startProcess(proc);
		});
	}
	else
	{
		var delay = sanitInt(proc.conf.config.delay, 3000);
		setTimeout(function()
		{
			startProcess(proc);
		}, delay);
	}

}

function startProcess(proc)
{
	var NAME = proc.name;
    if( proc.conf.config.cmd !== undefined)
    {
		if(proc.restarted === undefined) proc.restarted = 0;

		var level = getLog(proc.conf.config.log);
		var logPath = wf.CONF.LOG_PATH + wf.CONF.PROCESS_FOLDER + NAME + "/" ;

		var logOut = logPath + NAME + wf.CONF.OUT_END;
		var logErr = logPath + NAME + wf.CONF.LOG_END;

		// TEST INIT IF EXISTS
		if(proc.process !== undefined)
		{
			var PROC = require(proc.process);
			if(typeof PROC == "function")
			{
				PROC = new PROC(proc);
				if(PROC.code && typeof PROC.code == "function")
				{
					if(PROC.message)
					{
						if(level > 0 && level < 3)
						{
							mInit = "[!] Init message in " + NAME + " - " + init.message;
							wf.wLog(logOut, mInit + EOL);
						}
					}
					PROC.code();
				}
			}
		}

		var eProc = spawn(proc.conf.config.cmd, proc.conf.config.args, proc.conf.config.options);

		wf.PROCESS[NAME] =
		{
			init: proc,
			handle: eProc,
		};

		var sProc = proc;

		// SET RESTARTED TO 0 AFTER 10 SEC
		var started = sanitInt(proc.conf.config.started, 10000);
		var to = setTimeout(function()
		{
			if(eProc !== undefined)
			{
				sProc.restarted = 0;
			}
		}, started);

		// ON STDOUT
		eProc.stdout.on('data', function (data)
		{
			if(level > 0 && level < 3)
			{
				wf.wLog(logOut, data);
			}

			if(proc.conf.config.onOut && typeof proc.conf.config.onOut == "function")
			{
				proc.conf.config.onOut(data);
			}
		});
		// ON STDERR
		eProc.stderr.on('data', function (data)
		{
			if(level > 0)
			{
				wf.wLog(logErr, "stderr: " + data + os.EOL);
			}
			wf.Error('stderr: ' + data + os.EOL);
			if(proc.conf.config.onError && typeof proc.conf.config.onError == "function")
			{
				proc.conf.config.onError(data);
			}
		});
		// ON CLOSE
		eProc.on('close', function (code)
		{
			clearTimeout(to);
			var end = NAME + ' exited with code : ' + code + os.EOL;
			if(level > 0)
			{
				wf.wLog(logErr, end);
			}

			if(proc.conf.config.onClose && typeof proc.conf.config.onClose == "function")
			{
				proc.conf.config.onClose();
			}
			if(sProc.conf.config.restart == 'auto' && (sProc.conf.config.attempt === 0 || sProc.restarted < sProc.conf.config.attempt) )
			{
				var delay = sanitInt(sProc.conf.config.delay, 3000);
				sProc.restarted = sProc.restarted + 1;
				var rMess = "Restarting attempts : " + sProc.restarted + " - " + NAME + os.EOL;

				wf.Log(rMess);
				wf.wLog(logErr, rMess);

				setTimeout(function()
				{
					startProcess(sProc);
				}, delay);
			}
		});
    }
}

// SANIT INT FOR SETTIMEOUT
function sanitInt(value, def)
{
	var res = value | 0;
	if(res === 0) res = def;
	return res;
}

function sanitBool(value, def)
{
	var res = value | false;
	if(res === false) res = def;
	return res;
}

function getLog(str)
{
	if(str === undefined || str === "none") return 0;
	if(str === "all") return 1;
	if(str === "info") return 2;
	if(str === "error") return 3;
}
