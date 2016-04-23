var _0777 = parseInt('0777', 8);

module.exports.mkdirp = mkdirP.mkdirp = mkdirP.mkdirP = mkdirP;

function mkdirPErr(err, opts, path, p, made, cb)
{
	if (!err) 
	{
		made = made || p;
		return cb(null, made);
	}
	switch (err.code) 
	{
		case 'ENOENT':
			mkdirP(path.dirname(p), opts, function (err, made) 
			{
				if (err) cb(err, made);
				else mkdirP(p, opts, cb, made);
			});
			break;

		default:
			xfs.stat(p, function (er2, stat) 
			{
				if (er2 || !stat.isDirectory()) cb(err, made);
				else cb(null, made);
			});
			break;
	}
}

function mkdirP (p, opts, f, made) {
    if (typeof opts === 'function') {
        f = opts;
        opts = {};
    }
    else if (!opts || typeof opts !== 'object') 
	{
        opts = { mode: opts };
    }
    
    var mode = opts.mode;
    var xfs = opts.fs || fs;
    
    if (mode === undefined) 
	{
        mode = _0777 & (~process.umask());
    }
    if (!made) made = null;
    
    var cb = f || function () {};
    p = path.resolve(p);
    
    xfs.mkdir(p, mode, function (err) 
	{
        mkdirPErr(err, opts, path, p, made, cb);
    });
}

function syncCatch(err, path, p, opts, made)
{
	switch (err.code) 
	{
		case 'ENOENT' :
			made = sync(path.dirname(p), opts, made);
			sync(p, opts, made);
			break;
		default:
			var stat;
			try 
			{
				stat = xfs.statSync(p);
			}
			catch (err1) 
			{
				throw err;
			}
			if (!stat.isDirectory()) throw err;
			break;
	}
}

mkdirP.sync = function sync (p, opts, made) 
{
    if (!opts || typeof opts !== 'object') 
	{
        opts = { mode: opts };
    }
    
    var mode = opts.mode;
    var xfs = opts.fs || fs;
    
    if (mode === undefined) 
	{
        mode = _0777 & (~process.umask());
    }
    if (!made) made = null;

    p = path.resolve(p);

    try 
	{
        xfs.mkdirSync(p, mode);
        made = made || p;
    }
    catch (err) 
	{
        syncCatch(err, path, p, opts, made);
    }
    return made;
};