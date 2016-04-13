/*

Copyright (C) 2016  Adrien THIERRY
http://seraum.com 

*/
module.exports.CLI = new CLI();
var wf = WF();

function CLI()
{

	this.check = function()
	{
		wf.yargs.usage(" USAGE :  WF [ {nothing} | install | uninstall | --help ]");
		if(wf.args._.length != 1 || wf.args.help !== undefined)
			wf.yargs.showHelp();
		else
		{
			var cmd = wf.args._[0];
			switch(cmd)
			{
				case 'install':
				case 'service':
					console.log('installing...');
					break;
				case 'uninstall':
				case 'remove':
					console.log('uninstalling...');
					break;
				default:
					wf.yargs.showHelp();
					break;
			}
		}
	}

}
