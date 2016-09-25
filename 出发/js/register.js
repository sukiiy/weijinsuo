(function () {
    var $regBtn, $phone, $msgCode, $getMsgCodeBtn, $name, $passwd, $passwdConfirm, $email, $sendMsgBtn, $code, $btnRegister, $regMsg, $returnurl,$verifyCode;

    /* 用户名验证函数 */
    function regUserName(name) {

        var name = name ? name.replace(/^\s+|\s+$/g, '') : ''; //清除左右空格
        var reg = /^[A-Za-z\-\ _·.\u4e00-\u9fa5]+$/; //字母、中文、下划线、横线、空格、·.
        var length = 0;

        //一个中文等于两个字符
        for (var i = 0; i < name.length; i++) {
            if (name.charCodeAt(i) > 127 || name.charCodeAt(i) == 94) {
                length += 2;
            } else {
                length++;
            }
        }

        //不能为空且字符长度大于4小于30
        if (reg.test(name) && length >= 4 && length <= 30) {
            return true;
        } else {
            return false;
        }

    }

    $(function () {
        $regBtn = $("#registerBtn");
        $phone = $('#Login_Phone');
        $msgCode = $('#msgCode');
        $getMsgCodeBtn = $('#getMsgCodeBtn');
        $name = $('#login_Name');
        $passwd = $('#password');
        $passwdConfirm = $('#passwordConfirm');
        $email = $('#login_Email');
        $sendMsgBtn = $('#btSendMsg');
        $code = $('#FindCode');
        $btnRegister = $('#ButtonRegister');
        $regMsg = $('.regMsg');
        $returnurl = $("#returnurl");//jump
        $verifyCode = $('.verifyCode');

        $('.placeHolder').placeHolder();

        if ($("#FindCode").attr("disabled") != "disabled") {
            var $sendMsg = $("#btSendMsg"),
                sending = $sendMsg.hasClass('sending');
            if (sending) return false;
            $sendMsg.addClass('sending');
            $sendMsg.attr("disabled", "disabled");
            var timeseek = 60;
            $sendMsg.val(timeseek + 'S后可重新发送');
            var waitting = function () {
                timeseek--;
                if (timeseek <= 0) {
                    $sendMsg.removeAttr("disabled");
                    $sendMsg.removeClass('sending').val('发送验证码');
                } else {
                    $sendMsg.val(timeseek + 'S后可重新发送');
                    setTimeout(waitting, 1000);
                }
            }
            setTimeout(waitting, 1000);
        }

        $regBtn.click(function () {
            $('.msg').remove();

            var rsakey = new RSAKey();
            rsakey.setPublic(publickey, "10001");

            var phone = rsakey.encrypt($phone.val()),
                msgCode = $msgCode.val(),
                name = rsakey.encrypt($name.val()),
                email = $email.val(),
                vercode = $msgCode.val(),
                passwd = rsakey.encrypt($passwd.val()),
                returnurl = $returnurl.val(),//jump
                passwdConfirm = rsakey.encrypt($passwdConfirm.val()),
            cPhone = checkPhone(),
            /*cMsgCode = checkMsgCode(),*/
            cName = checkName(),
            cPasswd = checkPasswd();
            /*sending = $regBtn.hasClass('sending');*/
            if (/*sending ||*/ !cPhone || !cName || !cPasswd){
                return false;
            }else{
                var regCode = checkCode();
                if(!cPhone || !cName || !cPasswd || !regCode) return false;
            }
            $regBtn.addClass('sending');
            $.ajax({
                type: 'POST',
                url: '/user/preregister',
                data: { phone: phone,email: email, userName: name, password: encodeURIComponent(passwd), repassword: encodeURIComponent(passwdConfirm),vercode:vercode,APIGEEHEADER2: apiHeader2,system: apiHeader2System,version: apiHeader2Version,lang : apiHeader2Lang},
                dataType: 'json',
                beforeSend: function (request) {
                    request.setRequestHeader("secretHeader", secretkey);
                },
                success: function (result) {
                    $regBtn.removeClass('sending');
                    if (result.success == true) {
                        /*写cookies*/
                        /*$.cookies.set('phone', $phone.val());
                        $.cookies.set('userName', $name.val());*/
                        location.href ='/user/registerSetp2?t='+ result.content +'&phone='+ $phone.val();
                        /*var time = 3;
                        $regMsg.html(result.message + "<br/>" + time + "s秒后跳转");
                        var waitting = function () {
                            time--;
                            if (time <= 0) {
                                if (returnurl.length > 0) {
                                    location.href = returnurl;
                                } else {
                                    location.href = '/usercenter/index';
                                }
                            } else {
                                $regMsg.html(result.message + "<br/>" + time + "s秒后跳转");
                                setTimeout(waitting, 1000);
                            }
                        }
                        setTimeout(waitting, 1000);*/
                    } else {
                        $regMsg.text(result.message);
                    }
                    $("#verifchange_button").click();
                }
            });
        });

        $('input').keydown(function (e) {
            var phone = $phone.val(),
                msgCode = $msgCode.val(),
                name = $name.val(),
                passwd = $passwd.val(),
                passwdConfirm = $passwdConfirm.val();
            if (e.keyCode == 13 && phone && msgCode && name && passwd && passwdConfirm) {
                $regBtn.click();
                return false;
            }
        });
        (function(){
            if($phone.val() !='请输入您的手机号码'){
                $verifyCode.show();
            }
        })()
        $getMsgCodeBtn.click(function () {
            var getMsging = $getMsgCodeBtn.hasClass('getMsging'),
                cPhone = checkPhone(),
                phone = $phone.val();
            if (!cPhone) return false;
            if (getMsging) return false;
            var time = 60;
            $.ajax({
                type: 'post',
                url: '/user/sendRegisterCode',
                data: { Phone: phone,APIGEEHEADER2: apiHeader2,system: apiHeader2System,version: apiHeader2Version,lang : apiHeader2Lang},
                dataType: 'json',
                beforeSend: function (request) {
                    request.setRequestHeader("secretHeader", secretkey);
                },
                success: function (result) {
                    $regMsg.text(result.message);
                    if (result.success) {
                        $getMsgCodeBtn.addClass('getMsging').text(time + 'S后可重新获取');
                        function countdown() {
                            time--;
                            if (time <= 0) {
                                $getMsgCodeBtn.removeClass('getMsging').text('获取短信验证码');
                            } else {
                                $getMsgCodeBtn.text(time + 'S后可重新获取');
                                setTimeout(countdown, 1000);
                            }
                        }
                        setTimeout(countdown, 1000);
                    } else {
                        if (result.content) {
                            secretkey = result.content;
                        }
                    }
                }
            });
        }).keydown(function (e) {
            if (e.keyCode == 13) {
                $getMsgCodeBtn.click();
                return false;
            }
        });

        $phone.bind('input propertychange', function () {
            var $this = $(this),
                    reg = /^1\d{10}$/,
                    phone = $this.val(),
                    $i = $this.parents('.regList').find('i');
            if (!phone) {
                $i.attr('class', '');
            } else if (reg.test(phone)) {
                $i.attr('class', 'checkIcon correct');
                $verifyCode.show();
            } else {
                $i.attr('class', 'checkIcon error');
                $verifyCode.hide();
            }
        });

        $name.bind('input propertychange', function () {
            var $this = $(this),

                    reg = /^[\u4E00-\u9FA5]{2,}$/,
                    name = $this.val(),
                    placeholder = $this.attr('data-placeholder'),
                    $i = $this.parents('.regList').find('i');
            if (!name) {
                $i.attr('class', '');
            } else if (regUserName(name) && name != placeholder) {
                $i.attr('class', 'checkIcon correct');

            } else {
                $i.attr('class', 'checkIcon error');
            }
        });

        $passwd.bind('input propertychange', function () {
            var $this = $(this),
                    passwd = $this.val(),
                    $i = $this.parents('.regList').find('i');
            if (!passwd) {
                $i.attr('class', '');
            } else if (passwd.length >= 6 && passwd.length <= 20) {
                $i.attr('class', 'checkIcon correct');
            } else {
                $i.attr('class', 'checkIcon error');
            }
        });

        $passwdConfirm.bind('input propertychange', function () {
            var $this = $(this),
                    passwd = $passwd.val(),
                    passwdConfirm = $this.val(),
                    $i = $this.parents('.regList').find('i');
            if (!passwdConfirm) {
                $i.attr('class', '');
            } else if (passwd === passwdConfirm && passwdConfirm.length >= 6) {
                $i.attr('class', 'checkIcon correct');
            } else {
                $i.attr('class', 'checkIcon error');
            }
        });

        $email.bind('input propertychange', function () {
            var $this = $(this),
                    reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                    email = $email.val(),
                    $i = $this.parents('.regList').find('i');
            if (!email) {
                $i.attr('class', '');
            } else if (reg.test(email)) {
                $i.attr('class', 'checkIcon correct');
            } else {
                $i.attr('class', 'checkIcon error');
            }
        });

        $btnRegister.click(function () {
            var cCode = checkCode();
            if (!cCode) return false;
        });
        /*自动填充手机号和姓名*/
        /*(function(){
            if(document.cookie.indexOf("userName") != -1 && document.cookie.indexOf("phone") != -1){
                $phone.attr("value",$.cookies.get('phone'));
                $name.attr("value",$.cookies.get('userName'));
                $verifyCode.show();
            }*/
            /*if($.cookies.get('phone')!= null && $.cookies.get('userName') != null){



            }*/
        /*})();*/
    });

    function checkPhone() {//检测手机号
        var reg = /^1\d{10}$/,
                error = 0,
                placeholder = $phone.attr('data-placeholder'),
                phone = $phone.val();
        if (!phone || phone == placeholder) {
            $phone.showMsg('请输入您的手机号');
            error = 1;
        } else if (!reg.test(phone)) {
            $phone.showMsg('手机号有误，请重新输入');
            error = 1;
        }
        if (error == 1) return false;
        return true;
    }

    function checkMsgCode() {//检测短信验证码
        var reg = /^\d{4,6}$/,
            error = 0,
            placeholder = $msgCode.attr('data-placeholder'),
            msgCode = $msgCode.val();
        if (!msgCode || msgCode == placeholder) {
            $msgCode.showMsg('请输入验证码');
            error = 1;
        } else if (!reg.test(msgCode)) {
            $msgCode.showMsg('验证码不正确');
            error = 1;
        }
        if (error == 1) return false;
        return true;
    }

    function checkName() {//检测名字
        var reg = /^[\u4E00-\u9FA5]{2,}$/,
            reg = /^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/,
        	placeholder = $name.attr('data-placeholder'),
        	name = $name.val();
        if (regUserName(name) && name != placeholder) {
            return true;
        } else {
            $name.showMsg('请输入您的真实姓名');
        	return false
        }
    }

    function checkPasswd() {//检测密码
        var error = 0,
                passwd = $passwd.val(),
                passwdConfirm = $passwdConfirm.val();
        if (!passwd) {
            $passwd.showMsg('请输入密码');
            error = 1;
        } else if (passwd.length < 6) {
            $passwd.showMsg('密码不能小于6位');
            error = 1;
        } else if (passwd.length > 20) {
            $passwd.showMsg('密码不能大于20位');
            error = 1;
        }
        if (!passwdConfirm) {
            $passwdConfirm.showMsg('请再次输入密码');
            error = 1;
        } else if (passwd !== passwdConfirm) {
            $passwdConfirm.showMsg('两次密码不相同');
            error = 1;
        }
        if (error == 1) return false;
        return true;
    }

    function checkEmail() {//检测邮箱
        var reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
                error = 0,
                email = $email.val();
        if (!email) {
            $email.showMsg('请输入您的邮箱');
            error = 1;
        } else if (!reg.test(email)) {
            $email.showMsg('邮箱有误，请重新输入');
            error = 1;
        }
        if (error == 1) return false;
        return true;
    }

    function checkCode() {//检测验证码
        var error = 0,
            code = $msgCode.val();
        if (code == '请输入验证码' || code == $msgCode[0].defaultValue ) {
            $msgCode.showMsg('请输入验证码');
            return false;
        }
        return true;
    }



})();