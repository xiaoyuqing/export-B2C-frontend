<template>
    <div class="form-container">
        <h2>登录到您的账号</h2>
        <div class="form-box">
            <div>
                <div class="placeholder-shifting">
                    <input id="id-email" name="name" class="text-input" type="text" maxlength="11" placeholder="请输入手机号码" required v-model.trim="queryParams.mobile">
                </div>
                <div class="placeholder-shifting">
                    <input id="id-password" name="password" class="text-input" type="password"  placeholder="密码" required v-model.trim="queryParams.password">
                </div>
                <div class="placeholder-shifting">
                    <input id="id-verifyCode" name="verifyCode" class="text-input" type="text"  placeholder="验证码" required v-model.trim="queryParams.code">
                    <div class="captcha-box">
                        <img :src="imgSrc" alt="captcha" class="captcha" @click="getVerifyCode">
                    </div>
                </div>
                <div class="tip-text">{{errorMsg}}</div>
                <div class="checkbox-mask">
                    <input type="checkbox" checked="true">
                    <span>记住密码</span>
                </div>
                <button class="submit-btn" @click="signIn">登&nbsp;&nbsp;&nbsp;&nbsp;录</button>
            </div>
        </div>
        <div class="supplementary clearfix">
            <div class="left">还没有账号？
                <a class="register" href="#/register" target="_blank">立即注册</a>
            </div>
            <div class="right">
                <a class="forget-pwd-link" href="#/findPassword" target="_blank">忘记密码？</a>
            </div>
        </div>
    </div>
</template>
<script>
export default{
    data(){
        return {
            imgSrc:"",
            queryParams:{
            },
            errorMsg:""
        }
    },
    methods:{
        getVerifyCode:function(){
            var timestamp = new Date().getTime();
            var src = "/api/oauth/image?t="+timestamp;
            this.imgSrc = src;
        },
        signIn:function(){
            this.loading = true;
            var that = this;
            this.$http.get('/api/user/login', {params: this.queryParams}).then(function (response) {
                this.loading = false;
                if (response.data.errCode == 0) {
                    this.errorMsg = "";
                    localStorage.setItem('user', response.data.user);
                    setCookie("mobile", response.data.user.mobile, 30);
                    this.$router.push({path: `/`});
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
    mounted:function(){
        this.getVerifyCode();
    }
}
</script>
<style lang="less" scoped>
    @import '../../css/login.less';
    .form-container{padding:100px 20px 20px 20px;}
</style>
