<template>
    <div class="form-container">
        <h2>找回密码</h2>
        <div class="form-box">
            <div>
                <div class="placeholder-shifting">
                    <input id="id-email" name="phone" class="text-input" maxlength="11" placeholder="手机号码" required
                           v-model.trim="queryParams.mobile">
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
                <div class="placeholder-shifting">
                    <input id="id-password" name="password" class="text-input" type="password" placeholder="新密码"
                           v-model.trim="queryParams.password">
                    <span class="red">*</span>
                </div>
                <div class="placeholder-shifting">
                    <input id="id-password2" name="password" class="text-input" type="password" placeholder="确认密码"
                           v-model.trim="newpassword">
                    <span class="red">*</span>
                </div>
                <div class="tip-text">{{errorMsg}}</div>
                <button class="submit-btn" @click="resetPassword">重置密码</button>
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
                newpassword: "",
                queryParams: {
                    type: "findPwd",
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
            resetPassword: function () {
                this.loading = true;
                if (!this.queryParams.mobile) {
                    this.errorMsg = "请输入手机号码！";
                    return;
                }
                if (!(/^1[3|4|5|7|8][0-9]\d{8}$/.test(this.queryParams.mobile))) {
                    this.errorMsg = "请输入正确格式的手机号码！";
                    return;
                }
                if (!this.queryParams.password) {
                    this.errorMsg = "请输入密码！";
                    return;
                }
                if (this.queryParams.password != this.newpassword) {
                    this.errorMsg = "两次密码不一致！";
                    return;
                }
                if (!this.queryParams.code) {
                    this.errorMsg = "请输入验证码！";
                    return;
                }
                this.$http.post('/api/user/password/find', this.queryParams, {emulateJSON: true}).then(function (response) {
                    this.loading = false;
                    if (response.data.errCode == 0) {
                        this.errorMsg = "";
                        this.$router.push({path: `/login`});
                    } else {
                        this.errorMsg = response.data.errMsg;
                    }
                }, function (error) {
                    console.log(error);
                    this.loading = false;
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
                    if (response.data.errCode == 0) {
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
