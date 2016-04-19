module.exports.Emulate = new Emulate();
global.Emulate = new Emulate();

function Emulate()
{
	
	this.res = 
	{
		write: function(writable) { console.log("[+] res.write -> " + writable) },
		end: function(writable){ console.log("[+] res.end -> " + writable) },
	}
	
	this.req = 
	{
		url: "/test",
		method: "GET",
		connection: 
		{
			remoteAddress: "127.0.0.1",
		}
	}
	
}