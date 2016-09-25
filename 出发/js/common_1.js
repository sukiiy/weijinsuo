/*
 * 时间： 2014-10-21
 * 说明： 全站通用脚本
 *
 */

//indexOf方法兼容
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (elt) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0)
             ? Math.ceil(from)
             : Math.floor(from);
        if (from < 0) from += len;
        for (; from < len; from++) {
            if (from in this && this[from] === elt)
                return from;
        }
        return -1;
    }
}

; (function ($, window, document) {

    /* ============================
     * 公用组件封装
     * ============================ */

    /* Cookie组件 by guoshuohui 2015-02-03 
     * 获取：$.cookies.get('名')
     * 设置：$.cookies.set('名', '值')
     * 移除：$.cookies.remove('名')
     */
    $.cookies = {

        //设置cookie
        set: function (name, value, expires, path, domain, secure) {
            var cName = encodeURIComponent(name) + '=' + encodeURIComponent(value)
            if (typeof expires == 'number') {
                var date = new Date();
                date.setDate(date.getDate() + expires);
                cName += '; expires=' + date;
            }
            if (path) {
                cName += '; path=' + path;
            }
            if (domain) {
                cName += '; domain=' + domain;
            }
            if (secure) {
                cName += '; secure';
            }
            document.cookie = cName;
        },

        //获取cookie
        get: function (name, param) {
            var cookie = document.cookie;
            var cValue = null;

            if (cookie.length > 0) {
                var cName = encodeURIComponent(name) + '=';
                var cStart = cookie.indexOf(cName);

                //截取cookie值
                if (cStart > -1) {
                    var cEnd = cookie.indexOf(';', cStart);
                    if (cEnd == -1) {
                        cEnd = cookie.length;
                    }
                    cValue = decodeURIComponent(cookie.substring(cStart + cName.length, cEnd));
                }

                //截取cookie值内的参数
                if (param) {
                    if (cValue) {
                        if (cValue.indexOf('&') > -1) {
                            var arr = cValue.split('&');
                            var pValue = '';
                            for (var i = 0; i < arr.length; i++) {
                                if (param == arr[i].split('=')[0]) {
                                    pValue = arr[i].split('=')[1];
                                }
                            }
                            cValue = decodeURIComponent(pValue);
                        }
                    }
                }

            }
            return cValue;
        },

        //移除cookie
        remove: function (name) {
            $.cookies.set(name, 1, -1);
        }

    };


    /* 截取url参数值  by guoshuohui 2015-03-20 
     * 获取参数值：$.url.get('参数名')
     * 获取参数名：$.url.get('参数名', 'name')，name为常量
     */
    $.url = {

    	// $.url.get()
        get: function (param, paramName) {
            var url = location.search;
            var obj = new Object();
            var value = '';
            var name = '';
            if (url.indexOf('?') != -1) {
                var str = url.substr(1);
                var strs = str.split('&');
                for (var i = 0; i < strs.length; i++) {
                    obj[strs[i].split('=')[0]] = decodeURIComponent(strs[i].split('=')[1]);
                }
                for (var j in obj) {
                    if (j == param) {
                        value = obj[j];
                        name = j;
                    }
                }
            }
            if (typeof paramName != 'undefined' && paramName == 'name') {
                return name;
            } else {
                return value;
            }
        }
    };

    /* 
     * 弹窗组件 by zhengshaoli 2015-01-23
     * @param {Array} obj 弹窗对象
     * @param {String} obj.title 弹窗标题 （可选，默认不显示）
     * @param {String} obj.text 弹窗内容   （必填）
     * @param {Function} obj.accept  接受  （可选，默认空函数）
     * @param {Function} obj.refuse  拒绝  （可选，默认空函数）
     * @param {String} obj.acceptWord 接受按钮文字  （可选，默认'确定'）
     * @param {String} obj.refuseWord 拒绝按钮文字  （可选，默认'拒绝'）
     * @param {Boolean} obj.auto       是否自动消失  （可选，默认false）
     * @param {Boolean} obj.cancel     是否可以取消  （可选，默认不显示）
     * @param {Boolean} obj.close      是否可以关闭  （可选，默认不显示）
     * 
     * 示例：
     * commonPopStyle({
     *     title: 'title',
     *     text: 'texttext',
     *     accept: function(){
     *         console.log('accept')
     *     },
     *     refuse: function(){
     *         console.log('refuse')
     *     },
     *     close: true,
     *     cancel: true
     *  });
     *
     */
    var APP = {};
    var commonPopStyle = function (obj) {
        var $body = $('body'),
            $pop,
            noop = function () { },
            tempHtml = '';
        if (!obj.text) {   //没有内容则返回
            return
        }
        obj.title === undefined && (obj.title = '');
        obj.acceptWord = obj.acceptWord ? obj.acceptWord : '确定';
        obj.refuseWord = obj.refuseWord ? obj.refuseWord : '拒绝';
        obj.auto === undefined && (obj.auto = false);
        obj.cancel === undefined && (obj.cancel = false);
        obj.close === undefined && (obj.close = false);
        tempHtml = '<div class="common-pop">' +
                    '<div class="common-pop-box">' +
                      (obj.close ? '<span class="cp-close">X</span>' : '') +
                      '<h3 class="cp-title">' + obj.title + '</h3>' +
                      '<div class="cp-text">' +
                        '<p class="cp-text-inner">' + obj.text + '</p>' +
                      '</div>' +
                      '<div class="cp-buttons">' +
                        (obj.accept ? '<button class="cp-accept">' + obj.acceptWord + '</button>' : '') +
                        (obj.refuse ? '<button class="cp-refuse">' + obj.refuseWord + '</button>' : '') +
                        (obj.cancel ? '<span class="cp-cancel">取消</span>' : '') +
                      '</div>' +
                    '</div>' +
                  '</div>';
        $body.append(tempHtml);
        $pop = $('.common-pop');
        $pop.fadeIn();
        if (obj.auto) {
            setTimeout(function () {
                $pop.remove();
            }, 5000);
        }
        $pop.on('click', '.cp-close,.cp-cancel', function () { //关闭，取消
            $pop.remove();
        }).on('click', '.cp-accept', function () {    //确定，回调
            $pop.remove();
            obj.accept();
        }).on('click', '.cp-refuse', function () {    //拒绝，回调
            $pop.remove();
            obj.refuse();
        });
    };
    window.APP = APP = $.extend(APP, {
        commonPopStyle: commonPopStyle
    });


    /* ============================
     * 公用业务逻辑
     * ============================ */

    $(function () {

        /* 计时器 */
        var start = null;
        function counter(num, callback) {
            var count = 0;
            start = setInterval(function () {
                count++;
                if (count >= num) {

                    if (callback) {
                        callback();
                    };
                    clearInterval(start);
                }
            }, 100);
        };

        /* 首页头部banner的效果处理 */
        var isIndexPage = (location.pathname.length == 1) ? true : false;
        if (isIndexPage) {
            window.onbeforeunload = function () {
                $.cookies.set("closebanner", "true", 1);
                $.cookies.set("sessionid", "false", 1);
            };
            $(".app-banner-box").show();
        };
        var cBanner = $.cookies.get("closebanner");
        var sessionId = $.cookies.get("sessionid");
        if (cBanner != undefined || cBanner != null) {
            if (sessionId == "true" && cBanner == "true") {
                $(".app-banner-box").show();
            } else if (sessionId == "false" && cBanner == "true") {
                $(".app-banner-box").show();
            } else if (sessionId == "true" && $.cBanner == "false") {
                $(".app-banner-box").hide();
            } else if (sessionId == "false" && $.cBanner == "false") {
                $(".app-banner-box").hide();
            }
        };
        $(".close-banner").click(function () {
            $(this).parent().hide();
            $.cookies.set("closebanner", "false", 1);
        });


        /* 我的要出发’hover事件 */
        var $myYcf = $('.my_ycf'),
            $orderUlBox = $('.order-ul-box');
        $myYcf.on('mouseenter', function () {
            $orderUlBox.stop(false, true).slideDown();
        }).on('mouseleave', function () {
            $orderUlBox.on('mouseenter', function () {
                $myYcf.on('mouseenter', function () {
                    $myYcf.addClass('my_ycf_hover');
                    $orderUlBox.stop(false, true).show();
                });
                $(this).stop(false, true).show();
            }).on('mouseleave', function () {
                $myYcf.removeClass('my_ycf_hover');
                $(this).stop(false, true).hide();
            });
            $orderUlBox.stop(false, true).slideUp();
        });

        /* 下拉省份列表 */
        $(".changeCity").on("click", function (e) {
            $("#J_warehouse_wrap").slideToggle(300);
            return false;
        })
        $("body").on("click", function () {
            $("#J_warehouse_wrap").slideUp(300);
        });

        /* 设置默认省份 
        var provinceCode = $.cookies.get('currentIpAddress', 'provinceShowName');
        $(".curProvince2,.curProvince").html(provinceCode);*/


        /* 子站省份切换 
        var $curProvince = $('.curProvince');
        $('.area_choose').on('click', 'a', function () {
            var $this = $(this),
                link = $this.attr('href');
            $.cookies.set('youProvince', $this.html());
            $curProvince.html($this.html());
            window.location.href = link;
            return false;
        });*/

        /* 获取选中的省份 */
        $.ajax({
            type: 'GET',
            url: w_siteUrl + '/ajax/checkcity?t=' + new Date().getTime(),
            dataType: 'JSONP',
            success: function (result) {
                if (result.res == 1) {
                	$.cookies.set('currentProvince', result.data.provinceCode);
                    $('.curProvince').text(result.data.provinceShowName);
                }
            }
        });

        /* 主站省份切换 */
        var lock = true;
        $('.area_choose').on('click', '.city-item', function () {
            if (lock) {
                lock = false;
                var province = $(this).html();
                $.ajax({
                    url: "/ajax/switchcity",
                    type: "post",
                    data: {
                        province: province
                    },
                    dataType: "json",
                    success: function (result) {
                        $("#J_warehouse_wrap").slideUp(300);
                        if (result.res == 1) {
                        	$.cookies.set('currentProvince', result.data.provinceCode);
                            document.location.href = w_siteUrl;
                        }
                        lock = true;
                        return false;
                    }
                });
            }
        });

        /* 返回顶部 */
        $('.gototop').click(function () {
            $(window).scrollTop(0);
        });

        /* 最近浏览记录 */
        (function () {

            var $recentlyBox = $('.recently-box');
            var $recentlyListBox = $('.recentlyListBox');
            var $ul = $recentlyListBox.find('ul');
            var viewed = true; //记录cookie是否更新过,true是已经有记录

            //没有“最近浏览”模块则退出
            if (!$recentlyBox) return false;

            var recentlyViewed = $.cookies.get('recentlyViewed');
            
            //记录cookie
		    if (typeof productId != 'undefined' && productId != '') {
		        if (recentlyViewed) { //如果已经有记录
		            var allViewed = recentlyViewed.split(',');
		            if (allViewed.indexOf(productId) == -1) { //如果没有保存过
		                if (allViewed.length < 5) {
		                    allViewed.unshift(productId);
		                } else { //大于等于5个时删除最旧的一个
		                    allViewed.pop();
		                    allViewed.unshift(productId);
		                }
		            } else { //如果保存过
		                allViewed.splice($.inArray(productId, allViewed), 1);
		                allViewed.unshift(productId);
		            }
		            $.cookies.set('recentlyViewed', allViewed.join(','), 365, '/', 'yaochufa.com');
		        } else {
		            $.cookies.set('recentlyViewed', productId, 365, '/', 'yaochufa.com');
		        }
		    }

            //获取数据
            if ($.cookies.get('recentlyViewed')) {
                $.ajax({
                    type: 'GET',
		            url: w_siteUrl + '/other/history?v=' + new Date().getTime(),
		            dataType: 'JSONP',
                    success: function (result) {
                        var li = '';
                        if (result.success) {
                            var data = result.content;
                            for (var i = 0; i < data.length; i++) {
                                var imgLink = data[i].listPicUrl ? 'http://cdn.jinxidao.com/' + data[i].listPicUrl : '';
                                li += '<li class="recentlyList">' +
                                   		   '<a class="clearfix" href="' + w_siteUrl + '/package/' + data[i].productId + '" target="_blank">' +
                                               '<img src="' + imgLink + '?imageView2/1/w/71/h/50/q/100" alt="'+ data[i].productName +'">' +
                                               '<div>' +
                                                   '<p class="recentlyListName">' + data[i].productName + '</p>' +
                                                   '<p class="clearfix recentlyListPrice"><em>￥' + data[i].sellPrice + '</em><del>门市价：￥' + data[i].retailPrice + '</del></p>' +
                                               '</div>' +
                                           '</a>' +
                                       '</li>';
                            }
                            $ul.html(li);
                        } else {
                            $ul.html('<li class="recentlyList">没有最近浏览记录~</li>');
                        }
                    },
                    error: function () {
                        $ul.html('<li class="recentlyList">网络错误，请刷新重试~</li>');
                    }
                });
            } else {
                $ul.html('<li class="recentlyList">没有最近浏览记录~</li>');
            }

            //悬停显示记录列表
            $('.recently-viewed').on('mouseenter', function () {
                $recentlyListBox.show();
            });
            $recentlyListBox.on('mouseleave', function () {
                $(this).hide();
            });

        })();

        /* 右侧功能导航 */
        var $sidebar = $('.sidebar');
        var $sList = $sidebar.find('.sList');

        /* 侧边栏 */
        $sList.hover(function () {
            var $this = $(this);
            $sList.find('.sShow').find('em').css('display', 'none');
            $sList.find('.sHide').hide();
            $this.find('.sShow').find('em').css('display', 'block');
            $this.find('.sHide').show();
        }, function () {
            var $this = $(this);
            $this.find('.sShow').find('em').css('display', 'none');
            $this.find('.sHide').hide();
        });

        $sidebar.find('.sToTop').click(function () {
            $("body").scrollTop(0);
        });
    });
})(jQuery, window, document);


