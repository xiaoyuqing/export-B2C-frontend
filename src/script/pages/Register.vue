<template>
    <div class="form-container">
        <h2>注册您的账号</h2>
        <div class="form-box">
            <div>
                <div class="placeholder-shifting">
                    <input id="id-username" name="name" v-model.trim="queryParams.username" class="text-input" placeholder="用户名 (选填)">
                </div>
                <div class="placeholder-shifting">
                    <input id="id-email" name="email" v-model.trim="queryParams.email" class="text-input" placeholder="邮箱 (选填)">
                </div>
                <div class="placeholder-shifting">
                    <input id="id-mobile" name="phone" class="text-input" maxlength="11" placeholder="手机号码" required
                           v-model.trim="queryParams.mobile">
                    <span class="red">*</span>
                </div>
                <div class="placeholder-shifting">
                    <input id="id-password" name="password" class="text-input" type="password" placeholder="密码"
                           v-model.trim="queryParams.password">
                    <span class="red">*</span>
                </div>
                <div class="placeholder-shifting">
                    <input id="id-verifyCode2" name="verifyCode" class="text-input" type="text" placeholder="图形验证码"
                           v-model.trim="queryParams.imageCode">
                    <div class="captcha-box">
                        <img :src="imgSrc" alt="captcha" class="captcha" @click="getVerifyCode">
                    </div>
                </div>
                <div class="placeholder-shifting">
                    <input id="id-verifyCode" name="verifyCode" class="text-input" type="text" maxlength="6"
                           placeholder="验证码" required v-model.trim="queryParams.code">
                    <div class="captcha-box">
                        <button :disabled="disabled" :class="{disable: disabled}" @click="getSmsCode">{{smsMessage}}
                        </button>
                    </div>
                    <span class="red">*</span>
                </div>
                <div class="tip-text">{{errorMsg}}</div>
                <button class="submit-btn" @click="register">提&nbsp;&nbsp;&nbsp;&nbsp;交</button>
            </div>
        </div>
        <div class="supplementary clearfix">
            <div class="left">已有账号？
                <a class="register" href="#/login">登录</a>
            </div>
        </div>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                imgSrc: "",
                smsMessage: "获取验证码",
                queryParams: {
                    type: "register",
                },
                errorMsg: "",
                disabled: false
            }
        },
        methods: {
            getVerifyCode: function () {
                var timestamp = new Date().getTime();
                var src = "/api/oauth/image?t=" + timestamp;
                this.imgSrc = src;
            },
            register: function () {
                this.loading = true;
                if (!this.queryParams.mobile) {
                    this.errorMsg = "请输入手机号码！";
                    return;
                }
                if (!/^1[3|4|5|7|8][0-9]\d{8}$/.test(this.queryParams.mobile)) {
                    this.errorMsg = "请输入正确格式的手机号码！";
                    return;
                }
                if (!this.queryParams.password) {
                    this.errorMsg = "请输入密码！";
                    return;
                }
                if (!this.queryParams.code) {
                    this.errorMsg = "请输入验证码！";
                    return;
                }
                this.$http.post('/api/user/register', this.queryParams).then(function (response) {
                    this.loading = false;
                    if (response.data.errCode == 0) {
                        this.errorMsg = "";
                        localStorage.setItem('user', response.data.user);
                        setCookie("mobile", response.data.user.mobile, 30);
                        this.$router.push({path: "/login"});
                    } else {
                        this.errorMsg = response.data.errMsg;
                    }
                }, function (error) {
                    console.log(error);
                    this.loading = false;
                });
            },
            success: function () {
                this.$message({
                    showClose: true,
                    message: '注册成功！',
                    type: 'success'
                });
            },
            getSmsCode: function () {
                if (!this.queryParams.mobile) {
                    this.errorMsg = "请输入手机号码！";
                    return;
                }
                if (!this.queryParams.imageCode) {
                    this.errorMsg = "请输入图形验证码";
                    return;
                }
                this.errorMsg = "";
                this.$http.get('/api/user/smsSend', {
                    params: {
                        mobile: this.queryParams.mobile,
                        type: this.queryParams.type,
                        code: this.queryParams.imageCode
                    }
                }).then(function (response) {
                    if (response.data.errCode = 0) {
                        this.disabled = true;
                        this.loading = false;
                        var codeTime = 120;
                        this.smsMessage = "已发送（120)";
                        var that = this;
                        var getCodeInterval = setInterval(function () {
                            codeTime--;
                            that.smsMessage = "已发送(" + codeTime + ")";
                            if (codeTime < 1) {
                                that.disabled = false;
                                that.smsMessage = "获取验证码";
                                clearInterval(getCodeInterval);
                            }
                        }, 1000);
                    } else {
                        this.errorMsg = response.data.errMsg;
                        this.getVerifyCode();
                    }
                }, function (error) {
                    console.log(error);
                    this.loading = false;
                });
            }
        },
        mounted: function () {
            this.getVerifyCode();
            window.scrollTo(0,0);
        }
    }
</script>
<style lang="less" scoped>
    @import '../../css/login.less';
    .form-container {
        padding:100px 20px 20px 20px;
    }
    .form-container .form-box .captcha-box button.disable {
        background-color: #ccc;
        border: 1px solid #ccc;
    }
</style>
