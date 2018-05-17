var cookieRender = (function () {
    //设置
    function setValue(options) {
        var _defaule = {
            name: null,
            value: null,
            expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24)),
            path: '/',
            domain: ''
        };
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                _defaule[key] = options[key];
            }
        }
        document.cookie = _defaule.name + "=" + escape(_defaule.value) + ";expires=" + _defaule.expires.toGMTString() + ";path=" + _defaule.path + ";domain=" + _defaule.domain;
    }

    //获取
    function getValue(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) {
            return unescape(arr[2]);
        }
        return null;
    }

    //删除
    function removeValue(options) {
        var _defaule = {
            name: null,
            path: '/',
            domain: ''
        };
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                _defaule[key] = options[key];
            }
        }
        if (getValue(_defaule.name)) {
            document.cookie = _defaule.name + "= ;path=" + _defaule.path + ";domain=" + _defaule.domain + ";expires=Fri, 02-Jan-1970 00:00:00 GMT";
        }
    }

    return {
        set: setValue,
        get: getValue,
        remove: removeValue
    }
})();