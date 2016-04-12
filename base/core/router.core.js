var ROUTER = new Router();
module.exports.Router = ROUTER;
UTILS.Router = ROUTER;

function Router()
{
    var localRoutes = [];
    this.routes = [];
    this.routeMap = [];
    
    this.addRoute = function(host, method, path, fn)
    {
        if (!host) return;
        if (!method) return;
        if (!path) return;
        if (!fn) return;
        
        var fPath = {host: host, method: method, url: path};
        var exist = this.match(fPath);
        if(exist)
        {
           exist.fn.push(fn);
        }
        else
        {
            var route = this.Route(host + "/" + method + path, this.routeMap.length);
            route.fn = [];
            route.fn.push(fn);
            this.routes.push(route);
            this.routeMap.push([path, [fn]]);
        }
    },
        
    this.GET = function(host, path, fn)
    {
        this.addRoute(host, "GET", path, fn)
    }
    this.POST = function(host, path, fn)
    {
        this.addRoute(host, "POST", path, fn)
    }
    this.PUT = function(host, path, fn)
    {
        this.addRoute(host, "PUT", path, fn)
    }
    this.DELETE = function(host, path, fn)
    {
        this.addRoute(host, "DELETE", path, fn)
    }
    this.ANY = function(host, path, fn)
    {
        this.addRoute(host, "*", path, fn)
    }

    // Require http req param
    this.match = function(req, startAt)
    {
      var route = this.Match(this.routes, req.host + "/" + req.method + req.url, startAt);
      if(route)
      {
        route.fn = this.routeMap[route.index][1];
      }
      return route;
    }

    this.Route = function(path, index)
    {
      var src, re, keys = [];

      if(path instanceof RegExp)
      {
        re = path;
        src = path.toString();
      }
      else
      {
        re = this.pathToRegExp(path, keys);
        src = path;
      }

      return {
         re: re,
         src: path.toString(),
         keys: keys,
         index: index
      }
    };

    this.pathToRegExp = function (path, keys) 
    {
        path = path
            .concat('/?')
            .replace(/\/\(/g, '(?:/')
            .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?|\*/g, function(_, slash, format, key, capture, optional){
                if (_ === "*"){
                    keys.push(undefined);
                    return _;
                }

                keys.push(key);
                slash = slash || '';
                return ''
                    + (optional ? '' : slash)
                    + '(?:'
                    + (optional ? slash : '')
                    + (format || '') + (capture || '([^/]+?)') + ')'
                    + (optional || '');
            })
            .replace(/([\/.])/g, '\\$1')
            .replace(/\*/g, '(.*)');
        return new RegExp('^' + path + '$', 'i');
    };
    

    this.Match = function (routes, uri, startAt) 
    {
        var captures, i = startAt || 0;

        for (var len = routes.length; i < len; ++i) 
        {
            var route = routes[i],
                re = route.re,
                keys = route.keys,
                splat = [],
                param = {};

            if (captures = uri.match(re)) 
            {
                for (var j = 1, len = captures.length; j < len; ++j) 
                {
                    var key = keys[j-1],
                        val = typeof captures[j] === 'string'
                            ? unescape(captures[j])
                            : captures[j];
                    if (key) 
                    {
                        param[key] = val;
                    } 
                    else 
                    {
                        splat.push(val);
                    }
                }
                return {
                    param: param,
                    splat: splat,
                    route: route.src,
                    index: route.index
                };
            }
        }
    };
};