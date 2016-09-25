!
    function() {
        if ($("#J-baidu-share").length) {
            var title = $("#J-page-title").html(),
                img = $("#J-page-img").attr("src");
            with(window._bd_share_config = {
                common: {
                    bdSnsKey: {},
                    bdText: title + "\uff01\u771f\u5fc3\u8d5e\uff01",
                    bdMini: "2",
                    bdMiniList: !1,
                    bdPic: img,
                    bdStyle: "0",
                    bdSize: "24"
                },
                share: {}
            },
                document) 0[(getElementsByTagName("head")[0] || body).appendChild(createElement("script")).src = "http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=" + ~ ( - new Date / 36e5)];
            $(document).on("click", ".bds_more",
                function() {
                    $("#bdshare_weixin_qrcode_dialog").hide()
                }),
                $(window).on("scroll",
                    function() {
                        $("#bdshare_weixin_qrcode_dialog").hide(),
                            $(".bdshare_dialog_box").hide()
                    })
        }
    } (),
    function() {
        $("#J-baidu-map").length && $("#J-baidu-map").click(function() {
            var t = $(this).find("img").attr("src"),
                i = t.split("centerpar=")[1].split(",");
            if (i.length < 5) return ! 1;
            var e = $("<div id='div_bdmapwrap' style='width:1200px; height:600px; position:absolute; z-index;999999;'><span class='close'></span><iframe src='/playpoint/baidumap?latitude=" + i[0] + "&longitude=" + i[1] + "&name=" + i[2] + "&address=" + i[3] + "&phone=" + i[4] + "&w=1200&h=600' frameborder='0' scrolling='no' width='1200' height='600'></iframe></div>"),
                n = $("<div id='div_bdmap'style='background:#000; position:absolute; left:0; top:0; z-Index:9999; cursor:pointer; width: " + ($(document.body).width() < 1200 ? 1200 : $(document.body).width()) + "px;height: " + $(document.body).height() + "px'></div>");
            $(document.body).append(n.css({
                opacity: "0.5"
            })),
                $(document.body).append(e),
                e.css({
                    display: "block",
                    zIndex: "999999",
                    left: ($(window).width() - 1200) / 2 < 0 ? 0 : ($(window).width() - 1200) / 2 + "px",
                    top: ($(window).height() - 600) / 2 + $(window).scrollTop() + "px"
                }),
                e.find(".close").css({
                    top: "16px"
                }),
                e.find(".close").click(function() {
                    e.remove(),
                        n.remove()
                }),
                n.click(function() {
                    e.remove(),
                        n.remove()
                })
        })
    } (),
    function() {
        if ($("#J-place-content").length) {
            var t = $("#J-place-content").find("iframe");
            t.each(function() {
                var t = $(this),
                    i = parseInt(t.width() / 1.6 - 14);
                t.height(i),
                    t.attr("height", i)
            })
        }
    } (),
    function() {
        var t = $("#J-comments-num");
        t.length && $(".pagination").pagination({
            url: "/playpoint/commentlist",
            dataType: "JSON",
            data: {
                id: ppId,
                pageIndex: 1,
                pageSize: 10
            },
            content: "#J-comments",
            active: "now_page",
            noDataTips: "\u6682\u65e0\u8bc4\u8bba\u4fe1\u606f\uff01",
            errorTips: "\u83b7\u53d6\u8bc4\u8bba\u4fe1\u606f\u5931\u8d25\uff01\u8bf7\u5237\u65b0\u91cd\u8bd5\uff01",
            callback: function(i) {
                if (i.success) {
                    var e = i.data.list,
                        n = "",
                        d = "";
                    for (var a in e) e[a].user_name && isNaN(e[a].user_name) && (d = e[a].user_name.substring(0, 1) + "**&nbsp;&nbsp;"),
                        n += 0 == a ? '<dl class="first"><dt class="icon icon-avatar"></dt><dd><div><strong>' + d + e[a].districtName + "\u7528\u6237</strong><span>\u53d1\u5e03\u4e8e" + e[a].create_time + "</span><em>" + e[a].floors + "\u697c</em></div><p>" + e[a].content + "</p></dd></dl>": '<dl><dt class="icon icon-avatar"></dt><dd><div><strong>' + d + e[a].districtName + "\u7528\u6237</strong><span>\u53d1\u5e03\u4e8e" + e[a].create_time + "</span><em>" + e[a].floors + "\u697c</em></div><p>" + e[a].content + "</p></dd></dl>";
                    t.html("\uff08" + i.data.total + "\u6761\uff09"),
                        $(this.content).html(n)
                }
            }
        })
    } ();