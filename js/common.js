function showLog(e) {
    window.console && console.log && console.log(e)
}
function showError(e) {
    window.console && console.error && console.error(e)
} !
    function() {
        Array.prototype.indexOf || (Array.prototype.indexOf = function(e) {
            var t = this.length >>> 0,
                n = Number(arguments[1]) || 0;
            for (n = 0 > n ? Math.ceil(n) : Math.floor(n), 0 > n && (n += t); t > n; n++) if (n in this && this[n] === e) return n;
            return - 1
        })
    } (),
    function(e) {
        e.cookies = {
            set: function(e, t, n, o, i, a) {
                var r = encodeURIComponent(e) + "=" + encodeURIComponent(t);
                if ("number" == typeof n) {
                    var c = new Date;
                    c.setDate(c.getDate() + n),
                        r += "; expires=" + c
                }
                o && (r += "; path=" + o),
                i && (r += "; domain=" + i),
                a && (r += "; secure"),
                    document.cookie = r
            },
            get: function(e, t) {
                var n = document.cookie,
                    o = null;
                if (n.length > 0) {
                    var i = encodeURIComponent(e) + "=",
                        a = n.indexOf(i);
                    if (a > -1) {
                        var r = n.indexOf(";", a); - 1 == r && (r = n.length),
                            o = decodeURIComponent(n.substring(a + i.length, r))
                    }
                    if (t && o && o.indexOf("&") > -1) {
                        for (var c = o.split("&"), s = "", l = 0; l < c.length; l++) t == c[l].split("=")[0] && (s = c[l].split("=")[1]);
                        o = decodeURIComponent(s)
                    }
                }
                return o
            },
            remove: function(t) {
                e.cookies.set(t, 1, -1)
            }
        },
            e.url = {
                get: function(e, t) {
                    var n = location.search,
                        o = new Object,
                        i = "",
                        a = "";
                    if ( - 1 != n.indexOf("?")) {
                        for (var r = n.substr(1), c = r.split("&"), s = 0; s < c.length; s++) o[c[s].split("=")[0]] = unescape(c[s].split("=")[1]);
                        for (var l in o) l == e && (i = o[l], a = l)
                    }
                    return "undefined" != typeof t && "name" == t ? a: i
                }
            }
    } (jQuery),
    function(e) {
        e.fn.extend({
            loadImg: function(t) {
                function n(e, t) {
                    var n = new Image;
                    return n.src = e,
                        n.complete ? void t.call(n) : void(n.onload = function() {
                            t.call(n)
                        })
                }
                return this.each(function() {
                    var t = e(this);
                    t.find("img.lazy").each(function() {
                        var t = e(this),
                            o = t.attr("data-original"),
                            i = t.attr("src");
                        o && i != o && n(o,
                            function(e) {
                                t.attr({
                                    src: o
                                })
                            })
                    })
                })
            }
        })
    } (jQuery),
    function() {
        "function" == typeof $("img.lazy-load").lazyload && $("img.lazy-load").lazyload({
            effect: "fadeIn",
            threshold: 200,
            height: 800,
            failure_limit: 200
        })
    } (),
    function() {
        $(".focus-input").each(function() {
            $(this).on("focus",
                function() {
                    $.trim(this.value) == this.defaultValue && (this.value = "")
                }).on("blur",
                function() {
                    "" == $.trim(this.value) && (this.value = this.defaultValue)
                })
        })
    } (),
    function() {
        var e = $("#J-change-province"),
            t = e.find(".icon"),
            n = $("#J-province-list"),
            o = n.find("span"),
            i = $("#J-cur-province"),
            a = !0;
        $.ajax({
            type: "GET",
            url: w_siteUrl + "/ajax/checkcity?v=" + (new Date).getTime(),
            dataType: "JSONP",
            success: function(e) {
                1 == e.res && ($.cookies.set("currentProvince", e.data.provinceCode), i.html(e.data.provinceShowName))
            }
        }),
            e.on("click",
                function() {
                    return a ? n.animate({
                            top: "38px",
                            opacity: 1
                        },
                        350,
                        function() {
                            t.removeClass("icon-triangle-bottom").addClass("icon-triangle-top"),
                                a = !1
                        }) : n.animate({
                            opacity: 0,
                            top: "-480px"
                        },
                        350,
                        function() {
                            t.removeClass("icon-triangle-top").addClass("icon-triangle-bottom"),
                                a = !0
                        }),
                        !1
                }),
            $(document).on("click",
                function() {
                    a || setTimeout(function() {
                            n.animate({
                                    opacity: 0,
                                    top: "-480px"
                                },
                                350,
                                function() {
                                    t.removeClass("icon-triangle-top").addClass("icon-triangle-bottom"),
                                        a = !0
                                })
                        },
                        300)
                }),
            o.on("mouseenter",
                function() {
                    $(this).addClass("active")
                }).on("mouseleave",
                function() {
                    o.removeClass("active")
                }).on("click",
                function() {
                    var e = $(this).html();
                    $.ajax({
                        url: "/ajax/switchcity?v=" + (new Date).getTime(),
                        type: "post",
                        data: {
                            province: e
                        },
                        dataType: "json",
                        success: function(e) {
                            return 1 == e.res && ($.cookies.set("currentProvince", e.data.provinceCode), document.location.href = w_siteUrl),
                                !1
                        }
                    })
                })
    } (),
    function() {
        var e = $("#J-search"),
            t = e.find(".search-submit");
        t.on("click",
            function() {
                var e = $(this),
                    t = $.trim($("#J-search-box").val()),
                    n = document.getElementById("J-search-box").defaultValue,
                    o = e.attr("data-search");
                return "" == t || t == n ? window.location = o: window.location = o + "/k_" + t,
                    !1
            })
    } (),
    function() {
        var e = $("#J-open-viewd"),
            t = e.find(".icon-triangle-bottom"),
            n = $("#J-viewed-list"),
            o = !0,
            i = $.cookies.get("recentlyViewed");
        if ("undefined" != typeof productId && "" != productId) if (i) {
            var a = i.split(","); - 1 == a.indexOf(productId) ? a.length < 5 ? a.unshift(productId) : (a.pop(), a.unshift(productId)) : (a.splice($.inArray(productId, a), 1), a.unshift(productId)),
                $.cookies.set("recentlyViewed", a.join(","), 365, "/", "yaochufa.com")
        } else $.cookies.set("recentlyViewed", productId, 365, "/", "yaochufa.com");
        $.cookies.get("recentlyViewed") ? $.ajax({
            type: "GET",
            url: w_siteUrl + "/other/history?v=" + (new Date).getTime(),
            dataType: "JSONP",
            success: function(e) {
                var t = "";
                if (e.success) {
                    for (var o = e.content,
                             i = 0; i < o.length; i++) {
                        var a = o[i].listPicUrl ? "http://cdn.jinxidao.com/" + o[i].listPicUrl: "";
                        t += '<li><a href="' + w_siteUrl + "/package/" + o[i].productId + '" target="_blank"><img src="' + a + '?imageView2/1/w/70/h/50/q/100" alt="' + o[i].productName + '"><p>' + o[i].productName + "</p><span><strong><i>&yen;</i>" + o[i].sellPrice + "</strong><em>\u95e8\u5e02\u4ef7\uff1a&yen;" + o[i].retailPrice + "</em></span></a></li>"
                    }
                    n.html(t)
                } else n.html('<li class="error">\u6ca1\u6709\u6700\u8fd1\u6d4f\u89c8\u8bb0\u5f55~</li>')
            },
            error: function() {
                n.html('<li class="error">\u7f51\u7edc\u9519\u8bef\uff0c\u8bf7\u5237\u65b0\u91cd\u8bd5~</li>')
            }
        }) : n.html('<li class="error">\u6ca1\u6709\u6700\u8fd1\u6d4f\u89c8\u8bb0\u5f55~</li>'),
            e.on("click",
                function() {
                    return o ? n.animate({
                            top: "38px",
                            opacity: 1
                        },
                        350,
                        function() {
                            t.removeClass("icon-triangle-bottom").addClass("icon-triangle-top"),
                                o = !1
                        }) : n.animate({
                            opacity: 0,
                            top: "-742px"
                        },
                        350,
                        function() {
                            t.removeClass("icon-triangle-top").addClass("icon-triangle-bottom"),
                                o = !0
                        }),
                        !1
                }),
            $(document).on("click",
                function() {
                    o || setTimeout(function() {
                            n.animate({
                                    opacity: 0,
                                    top: "-742px"
                                },
                                350,
                                function() {
                                    t.removeClass("icon-triangle-top").addClass("icon-triangle-bottom"),
                                        o = !0
                                })
                        },
                        300)
                })
    } (),
    function() {
        var e = $(".user-info"),
            t = (e.find(".my-ycf"), e.find(".my-order")),
            n = e.find("ul"),
            o = n.find("li"),
            i = !0;
        w_userInfo && (t.attr("href", w_siteUrl + "/usercenter/orderlist").find("span").html("\u6211\u7684\u8ba2\u5355"), e.on("mouseenter", ".my-ycf, ul",
            function(e) {
                n.is(":hidden") && n.stop(!0, !1).show(),
                $(e.target).is(".my-ycf") && i && (i = !1, $.ajax({
                    type: "GET",
                    url: w_apiUrl + "/v2/User/UserProfile?v=" + (new Date).getTime(),
                    dataType: "JSONP",
                    data: {
                        system: w_apiSystem,
                        version: w_apiVersion,
                        securityKey: w_userInfo.securityKey
                    },
                    success: function(e) {
                        if (e.success) {
                            var t = e.data;
                            o.eq(0).find("span").html("(" + t.orderAllNoPayCount + ")"),
                                o.eq(1).find("span").html("(" + t.orderPaidCount + ")"),
                                o.eq(2).find("span").html("(" + t.couponCount + ")"),
                                i = !0
                        }
                    }
                }))
            }).on("mouseleave", ".my-ycf,ul",
            function() {
                n.is(":visible") && n.stop(!0, !1).hide()
            }))
    } (),
    function() {
        function e(e) {
            var t = n.find(".active");
            if (t.length > 0) {
                var o = t.position().left,
                    a = t.find("a").width();
                e ? i.stop(!0, !1).animate({
                        left: o + 30,
                        width: a
                    },
                    300) : i.css({
                    left: o + 30,
                    width: a
                })
            }
        }
        var t = $("#J-main-manu"),
            n = t.find("ul"),
            o = t.find("li"),
            i = $("#J-slider-border");
        e(!1),
            o.on("mouseenter",
                function() {
                    var e = $(this).find("a"),
                        t = $(this).position().left,
                        n = e.width();
                    i.stop(!0, !1).animate({
                            left: t + 30,
                            width: n
                        },
                        300)
                }),
            n.on("mouseleave",
                function() {
                    e(!0)
                });
        var a = $(".side-menu"),
            r = a.find(".menu-mod"),
            c = $(".menu-list-mod");
        r.on("mouseenter",
            function() {
                var e = $(this);
                if (!e.is(".download-app")) {
                    var t = e.index(".menu-mod");
                    r.removeClass("active"),
                        e.addClass("active"),
                        c.hide(),
                        c.eq(t).stop(!0, !1).show()
                }
            }),
            a.on("mouseleave",
                function() {
                    c.hide(),
                        r.removeClass("active")
                })
    } (),
    function() {
        var e = $(".fixed-navbar"),
            t = e.find("li");
        t.on("mouseenter",
            function() {
                t.removeClass("active"),
                    $(this).addClass("active")
            }),
            $(".backto-top").on("click",
                function() {
                    return $("html, body").animate({
                            scrollTop: 0
                        },
                        300),
                        !1
                }),
            e.on("mouseleave",
                function() {
                    t.removeClass("active")
                })
    } ();