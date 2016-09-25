// 2014-10-14 yanyuji
(function($) {

    $(function() {
        var $authImg = $("#AuthImageLogin"),
            $codeModel = $("#codeModelLogin"),
            $userName = $("#username"),
            $passwd = $("#password"),
            $msg = $('#labmsg'),
            $sendMsg = $('#sendMsgBtn'),
            $labmsglogin = $("#labmsglogin"),
            $loginBtn = $("#loginBtn"),
            $verifkeyvalue = $("#verifkeyvalue"),//验证码判断
            $login_code = $("#login_code"),//验证码
            $returnurl = $("#returnurl"),//jump
            key1 = "";
            RegPhone = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/,
            flushVerifiCode = 0;
            useVerifiCode = 0;
        $('.placeHolder').placeHolder();

        //显示登录控件，记录调用者回调函数
        //提交事件处理，检测输入用户密码是否正确，提交登录ajax请求
        $("#loginControl .lcCloseBtn").click(function() {
            $userName.val('');
            $passwd.val('');
        });
        $userName.keydown(function(e) {
            var code = parseInt(e.keyCode);
            if (code == 13) {
                $loginBtn.get(0).click();
                return false;
            }
        });
        $passwd.keydown(function(e) {
            var code = parseInt(e.keyCode);
            if (code == 13) {
                $loginBtn.get(0).click();
                return false;
            }
        });
        $login_code.keydown(function(e) {
            var code = parseInt(e.keyCode);
            if (code == 13) {
                $loginBtn.get(0).click();
                return false;
            }
        });
        $loginBtn.keydown(function(e) {
            var code = parseInt(e.keyCode);
            if (code == 9) {
                $userName.get(0).focus();
                return false;
            }
        });
        //验证码显示
        if($verifkeyvalue.val() > 3){
            $('#codeModelLogin').css('display','block');
        }
        //ycf登录处理
        function userLogin() {
            var vercode = $login_code.val() ? $login_code.val() : '';

         	var rsakey = new RSAKey();
           	rsakey.setPublic(publickey, "10001");
    		var userName = rsakey.encrypt($userName.val());
    		var password = rsakey.encrypt($passwd.val());
            $loginBtn.val('登录中...');
            $.ajax({
                type: 'post',
                url: w_currentUrl+'/user/loginPost',
                data: 'phoneNum=' + encodeURIComponent(userName) + '&code=' + encodeURIComponent(password) + '&vercode='+vercode +'&APIGEEHEADER2=' + apiHeader2 +'&system=' + apiHeader2System +'&version=' + apiHeader2Version +'&lang=' + apiHeader2Lang,
                dataType: 'json',
                cache: false,
                success: function(result) {
                    if(result.success == true){
                        $loginBtn.val('登陆成功');
                        if($returnurl.val().length > 0){
                            location.href = $returnurl.val();
                        }else{
                            location.href = '/usercenter/index';
                        }
                    }else{
                        //验证码显示
                        if(result.total >= 3){
                            $('#codeModelLogin').css('display','block');
                            $('#verifchange_button').click();
                        }
                        $loginBtn.val('登陆');
                        $msg.html(result.message);
                    }
                }
            });
        }
        //检查是否需要显示验证码
        $userName.blur(function(){
            if(flushVerifiCode != 0 || useVerifiCode != 0) return false;
            var phone = $userName.val();
            if(!RegPhone.test(phone)){
                $('#username').showMsg('请输入账号');
                return false;
            }
            var url = "/user/loginverificode";
            flushVerifiCode = 1;
            $.get(url,{'phone':phone,'APIGEEHEADER2': apiHeader2,'system': apiHeader2System,'version': apiHeader2Version,'lang' : apiHeader2Lang},function(data){
              flushVerifiCode = 0;
              if(data.success){
                   $("#codeModelLogin").show();
                   useVerifiCode = 1;
                   return false;
               }else{
                   $("#codeModelLogin").hide();
                   useVerifiCode = 0;
                   return false;
              }
            },'json');
        });
        //ycf登录
        $loginBtn.click(function() {
            var reg = /^[1]\d{10}$/, error = 0;
            $msg.html("");
            if ($userName.val() == "") {
                $('#username').showMsg('请输入账号');
                error = 1;
            } else if (!reg.test($userName.val())) {
                $('#username').showMsg('账号错误');
                error = 1;
            }
            if ($passwd.val() == "") {
                $('#password').showMsg('请输入密码');
                error = 1;
            }
            if(useVerifiCode == 1 && $login_code.val() == ""){
                $login_code.showMsg('验证码');
                error = 1;
            }
            if (error == 1) return false;
            userLogin();
        });
        //ycf登录发送短信
        $sendMsg.click(function() {
            $msg.html('');
            var reg = /^[1]\d{10}$/,
                error = 0;
            if ($userName.val() == '') {
                $msg.html('请输入手机号');
                error = 1;
            } else if (!reg.test($userName.val())) {
                $msg.html('手机号错误');
                error = 1;
            }
            if (error == 1) return false;
            var sending = $(this).hasClass('sending');
            if (sending) return false;

            $.ajax({
                type: 'post',
                url: '/user/sendlogincode',
                data: 'phoneNum=' + $userName.val()+ '&vercode='+$login_code.val()+ '&APIGEEHEADER2='+apiHeader2+ '&system='+apiHeader2System + '&version='+apiHeader2Version + '&lang='+apiHeader2Lang,
                dataType: 'json',
                beforeSend: function (request) {
                    request.setRequestHeader("secretHeader", secretkey);
                },
                success: function(result) {
                    $msg.html(result.message);
                    var timeseek = 60;
                    if(result.success){ 
                        $sendMsg.addClass('sending').text(timeseek + 'S后重新发送');
                        function waitting() {
                            timeseek--;
                            if (timeseek <= 0) {
                                $sendMsg.removeClass('sending').text('发送短信验证码');
                            } else {
                                $sendMsg.text(timeseek + 'S后重新发送');
                                setTimeout(waitting, 1000);
                            }
                        }
                        setTimeout(waitting, 1000);
                    }else{
                        //验证码显示
                        if(result.total >= 3){
                            $('#codeModelLogin').css('display','block');
                            $('#verifchange_button').click();
                        }
                        if (result.content) {
                            secretkey = result.content;
                        }
                    }
                }
            });
        });

    });
})(jQuery);
// 2014-10-14 yanyuji



$(function () {

    $("#txtInvitationCode").focus(function () {
        if ($(this).val() == "邀请码") {
            $(this).val("");
            $(this).css("color", "#1F190E");
        }
    }).blur(function () {


        if ($(this).val() == "") {
            $(this).val("邀请码");
            $(this).css("color", "#BAB8B3");
        }
    });


    $("#userad").focus(function () {
        if ($(this).val() == "手机号码") {
            $(this).val("");
            $(this).css("color", "#1F190E");
        }
    }).blur(function () {
        if ($(this).val() == "") {
            $(this).val("手机号码");
            $(this).css("color", "#BAB8B3");
        }
    });

    $("#btRegister").click(function () {

        if ($("#password").val().length < 6) {
            $("#RequiredFieldValidator2").show();
            $("password").focus();

            return false;
        }
    });





    $("#password").focus(function () {

        if ($(".reg-label").html() == "密码") {
            $(".reg-label").hide();
            $(this).css("color", "#1F190E");
            $("#labMsg").hide();
            
        }
    }).blur(function () {

        if ($(this).val().length < 6) {

            $("#RequiredFieldValidator2").show();
            //  $("#password").focus();
        }

        if ($(this).val() == "") {
            $(".reg-label").show();
            $(this).css("color", "#BAB8B3")
        }
    });
});



//注册按钮变色
$(function () {
    $(".input_register").hover(
  function () {
      $(this).addClass("input_registerhover");
  },
  function () {
      $(this).removeClass("input_registerhover");
  });
});

//登录按钮变色

$(function () {
    $(".input_login").hover(
  function () {
      $(this).addClass("input_loginhover");
  },
  function () {
      $(this).removeClass("input_loginhover");
  });
});




//背景图片

now = new Date();
erke = now.getSeconds();
erke = erke - parseInt(erke / 6) * 6 + 1;