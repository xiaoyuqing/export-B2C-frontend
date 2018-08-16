<template>
<div class="productList clearfix">
    <div class="navigation" data-spm="8">
        <div class="crumbs ">
            <i class="tm-iconfont icon-info"></i>
            <a href="/">选品</a><span>&gt;</span><a href="#/usercenter">个人资料</a><span>&gt;</span><span>修改密码</span>
        </div>
    </div>
    <div class="user-container">
        <div class="container">
            <ul>
                <li>
                    <label for="oldPassword">当前密码：</label><input type="password" id="oldPassword" @focus="closeError()" v-model="oldPassword"><span class="import">*</span>
                </li>
                <li>
                    <label for="password1">新密码：</label><input type="password" id="password1" @focus="closeError()" v-model="password1"><span class="import">*</span>
                </li>
                <li>
                    <label for="password2">确认密码：</label><input type="password" id="password2" @focus="closeError()" v-model="password2"><span class="import">*</span>
                </li>
                <li class="import">{{errorMsg}}</li>
                <li>
                    <button @click="changePassword">保存</button>
                </li>
            </ul>
        </div>
    </div>       
</div>
</template>
<script>
    export default {
        data() {
            return {
                oldPassword: "",
                password1: "",
                password2: "",
                errorMsg: "",
            }
        },
        methods:{
            validate() {
                if(this.oldPassword == ""){
                    this.showError('请输入当前密码！');
                    return false;
                }
                if(this.password1 == ""){
                    this.showError('请输入新密码！');
                    return false;
                }
                if(this.password2 == ""){
                    this.showError('请输入确认密码！');
                    return false;
                }
                if(this.password1 != this.password2){
                    this.showError('两次密码不一致');
                    return false;
                }
                return true;
            },
            changePassword() {
                if(!this.validate()){
                    return;
                }
                let params = {
                    oldPassword: this.oldPassword,
                    newPassword: this.password1,
                };
                this.$http.post('/api/user/password/modify', params,{emulateJSON: true}).then(function(response) {
                    let errCode = response.data.errCode;
                    if(errCode == 0) {
                        this.$message({
                            showClose: true,
                            message: '修改成功！',
                            type:'success'
                        });
                    }else{
                        this.errorMsg = response.data.errMsg;
                    }
                },function(error){
                    
                });
            },
            showError(errorMsg) {
                this.errorMsg = errorMsg;
            },
            closeError() {
                this.errorMsg = "";
            },
            
        },
        mounted: function () {
            
        }
    }
</script>
<style lang="less" scoped>
@import '../../css/common.less';
.user-container{
    border:1px solid #ccc;
    margin-top:20px;
    padding:20px;
    .container{
        width:400px;
        margin:0 auto;
        text-align:center;
        ul{
            li{
                label{
                    display: inline-block;
                    width: 130px;
                    text-align: right;
                }
                input{
                    box-sizing: border-box;
                    width: 220px;
                    height: 30px;
                    line-height: 30px;
                    border: 1px solid #dcdcdc;
                    border-radius: 5px;
                    padding: 0 5px;
                }
                line-height:50px;
                button{
                    box-sizing: border-box;
                    display: inline-block;
                    border: none;
                    height: 28px;
                    line-height: 26px;
                    padding: 0 40px;
                    border-radius: 3px;
                    cursor: pointer;
                    text-decoration: none;
                    color: #fff;
                    border: 1px solid #1976D2;
                    background-color: #1976D2;
                }
            }
        }
    }
}
</style>