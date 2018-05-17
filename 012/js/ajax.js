~function () {
    function createXHR() {
        var xhr = null, flag = false;
        ary = [
            function () {
                return new XMLHttpRequest;
            },
            function () {
                return new ActiveXObject("Microsoft.HMLHTTP");
            },
            function () {
                return new ActiveXObject("MSXml2.HMLHTTP");
            },
            function () {
                return new ActiveXObject("MSXml3.HMLHTTP");
            }
        ];

        for (var i = 0, len = ary.length; i < len; i++) {
            var curFn = ary[i];
            try {
                xhr = curFn();
                createXHR = curFn;//惰性思想
                flag = true;
                break;
            } catch (e) {
                if (!flag) {
                    throw new Error("your browser is not support ajax,please change your browser,try again");
                }
            }
        }
        return xhr;
    }

    function ajax(options) {
        var _default = {
            url: "",
            type: "get",
            dataType: "json",
            async: true,
            data: null,
            headReceived: null,
            success: null
        };

        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                _default[key] = options[key];
            }
        }

        if (_default.type === "get") {
            _default.url.indexOf("?") >= 0 ? _default.url += "&" : _default.url += "?";
            _default.url += "_=" + Math.random();
        }

        var xhr = createXHR();
        xhr.open(_default.type, _default.url, _default.async);
        xhr.onreadystatechange = function () {
            if (/^2\d{2}/.test(xhr.status)) {
                if (xhr.readyState === 2) {
                    if (typeof _default.headReceived === "function") {
                        _default.headReceived.call(xhr);
                    }
                }

                if (xhr.readyState === 4) {
                    var val = xhr.responseText;
                    if (_default.dataType === "json") {
                        val = "JSON" in window ? JSON.parse(val) : eval("(" + val + ")");
                    }
                    _default.success && _default.success.call(xhr, val);

                }
            }
        };
        xhr.send(_default.data);
    }

    window.ajax = ajax;
}();