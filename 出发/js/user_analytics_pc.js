/**
 * 配合java做用户行为分析，需加入数据的统计需引用此文件，还需在模板页定义logUrl变量。
 */
var Cookie = {
    write: function (key, value, options) {

        var options = $.extend({
            path: '/',
            domain: false,
            expires: 0,
            secure: false,
            encode: true
        }, (typeof key == 'string' ? options : value) || {});

        if(typeof key == 'string'){

            if (options.encode) {
                value = encodeURIComponent(value);
            }
            if (options.domain) {
                value += '; domain=' + options.domain;
            }
            if (options.path) {
                value += '; path=' + options.path;
            }
            if (options.expires) {
                var date = new Date();
                date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
                value += '; expires=' + date.toGMTString();
            }
            if (options.secure) {
                value += '; secure';
            }
            document.cookie = key + '=' + value;
        }
        else{
            for(var k in key){
                this.write(k, key[k], options);
            }
        }

        return this;
    },

    read: function (key) {
        if(typeof key == 'string'){
            var value = document.cookie.match('(?:^|;)\\s*' + key.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1') + '=([^;]*)');
            return (value) ? decodeURIComponent(value[1]) : null;
        }
        else{
            var obj = {};
            for(var i = 0, len = key.length; i < len; i++){
                obj[key[i]] = this.read(key[i]);
            }
            return obj;
        }
    },

    dispose: function () {

        if(arguments.length <= 0){
        }
        else if(arguments.length > 1 && typeof arguments[arguments.length - 1] == 'object'){
            var options = $.extend(Array.prototype.pop.call(arguments) || {}, {expires: -1});
            for(var i = 0, len = arguments.length; i < len; i++){
                this.write(arguments[i], '', options);
            }
        }
        else{
            for(var i = 0, len = arguments.length; i < len; i++){
                this.write(arguments[i], '', { expires: -1 });
            }
        }
        return this;
    }
};

var dateToStr = function(date, pattern) {
    if(typeof date == 'string'){
        return date;
    }

    var pattern = pattern || 'yyyy-MM-dd';

    var o = {
        "M+" : date.getMonth() + 1, /*month 从 Date 对象返回月份 (0 ~ 11)，加以改成1~12月份*/
        "d+" : date.getDate(),      /*day 从 Date 对象返回一个月中的某一天 (1 ~ 31)。*/
        "h+" : date.getHours(),     /*hour 返回 Date 对象的小时 (0 ~ 23)。*/
        "m+" : date.getMinutes(),   /*minute  返回 Date 对象的分钟 (0 ~ 59)。*/
        "s+" : date.getSeconds(),   /*second 返回 Date 对象的秒数 (0 ~ 59)。*/
        "w+" : "\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d".charAt(date.getDay()),   /*“日一二三四五六”中的某一个*/
        "q+" : Math.floor((date.getMonth() + 3) / 3),  //季度
        "S"  : date.getMilliseconds() //Date 对象的毫秒(0 ~ 999)。
    };

    /*将"yyyy-MM-dd"中的"y"替换成具体年份，并根据"y"的数量保留对应的位数*/
    if (new RegExp("(y+)").test(pattern)) {
        pattern = pattern.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    /*替换剩下的模板，如果有的模板长度大于1，如"yyyy-MM-dd"中的"MM"、"dd"，则定为两位，实际字符串长度不足两位的，前面用0补足*/
    for(var k in o){
        if (new RegExp("("+ k +")").test(pattern)){
            pattern = pattern.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }

    return pattern;
};


var cookies = Cookie.read(['logTime', 'logNum', 'sessionId', 'cookieId', 'cookieNum']);

/*logNum等同于session*/
if(!cookies['logNum'] || parseInt(cookies['logNum']) > 65000){
    cookies['logNum'] = 1;
}
else{
    cookies['logNum'] = parseInt(cookies['logNum']) + 1;
}

Cookie.write('logNum', cookies['logNum']);

if(!cookies['sessionId']){
    cookies['sessionId'] = Math.round(new Date().getTime() / 1000);
}
Cookie.write('sessionId', cookies['sessionId']);

if(!cookies['cookieId']){
    cookies['cookieId'] = (function(){
        function s4(){
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    })();
}

var geolocation = typeof BMap != 'undefined' ? new BMap.Geolocation() : null;

var datas = {
        log_id: cookies['logNum'],
        app_id: 4,
        longitude: Cookie.read('longitude') || '',
        latitude: Cookie.read('latitude') || '',
        user_id: userId,
        current_citycode: cityCode,
        upload_time: dateToStr(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        event_time: Math.round(new Date() / 1000),
        session_id: Math.round(cookies['sessionId']),
        current_url: location.href,
        from_url: document.referrer || ((typeof opener != 'undefined' && opener && opener.location && opener.location.href) ? opener.location.href : ''),
        use_agent: navigator.userAgent,
        visit_ip : clientIp,
        cookie: cookies['cookieId'],
		arg2: w_provinceId
    };

if(geolocation){
    geolocation.getCurrentPosition(function (r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            /*alert(r.point.lng + ' yes ' + r.point.lat);*/
            Cookie.write({ longitude: r.point.lng, latitude: r.point.lat }, {expires : 365});
        }
        else{
            /*alert('无法获取坐标');*/
            Cookie.dispose('longitude', 'latitude');
        }
    });

    setInterval(function(){
        geolocation.getCurrentPosition(function (r) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                Cookie.write({ longitude: r.point.lng, latitude: r.point.lat }, {expires : 365});
            }
            else{
                Cookie.dispose('longitude', 'latitude');
            }
        });
    }, 300000);
}

Cookie.write('cookieId', cookies['cookieId'], { expires: 365, domain: 'yaochufa.com'});

var recordFn = function(params, eventContent, appendObj){

    /*alert(Cookie.read('longitude') + ' ajax ' + Cookie.read('latitude'));*/

    var datas = eventContent ? $.extend({ event_content: eventContent}, params) : params;
	
	if(appendObj){
		datas = $.extend(datas, appendObj);
	}

    $.ajax({
        url: logUrl + 'kafkahttp/kafka/log',
        type: 'GET',
        dataType: 'jsonp',
        data: datas,
        success: function(data) {
            if(data['result'] == 'fail'){
                recordFn(datas);
            }
        }/*,
        error: function(){
            recordFn();
        }*/
    });
};

var appendObj = {};
if(typeof window.log_arg1 != 'undefined'){
	appendObj.arg1 = window.log_arg1;
}

recordFn(datas, location.href, $.extend({
	event_id: window.event_id || 700000,
}, appendObj));



