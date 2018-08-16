<template>
<div class="productList clearfix">
    <div class="navigation" data-spm="8">
        <div class="crumbs ">
            <i class="tm-iconfont icon-info"></i>
            <a href="/">选品</a><span>&gt;</span><span>个人资料</span>
        </div>
    </div>
    <div class="user-container">
        <ul>
            <li>
                <label for="" class="user-label">用户名：</label><input type="text" v-model="username"/><button @click="changePassword">修改密码</button>
            </li>
            <li>
                <label for="" class="user-label">邮箱：</label><input type="email" v-model="email"/>
            </li>
            <li>
                <label for="" class="user-label">手机号：</label><span>{{mobile}}</span>
            </li>
            <li><button @click="update">保存</button></li>
        </ul>
    </div>       
</div>
</template>
<script>
    export default {
        data() {
            return {
                email:"",
                mobile:"",
                username:""
            }
        },
        methods:{
            handleSelect(key, keyPath) {
            },
            getUserInfo(){
                this.$http.get('/api/user/info', {}).then(function (response) {
                    var user = response.data.user;
                    this.email = user.email;
                    this.mobile = user.mobile.substr(0,3)+'****'+user.mobile.substr(7);
                    this.username = user.username;
                }, function (error) {
                    console.log(error);                  
                }); 
            },
            changePassword(){
                this.$router.push({path: `/changePassword`});
            },
            update(){
                let params = {
                    username:this.username,
                    email:this.email
                }
                this.$http.post('/api/user/update', params).then(function (response) {
                    this.$message({
                        showClose: true,
                        message: '保存成功！',
                        type:'success'
                    });
                }, function (error) {
                    console.log(error);
                    
                }); 
            }
        },
        mounted: function () {
            this.getUserInfo();
        }
    }
</script>
<style lang="less" scoped>
@import '../../css/common.less';
.user-container{
    border:1px solid #ccc;
    margin-top:20px;
    padding:20px;
    ul{
        li{
            line-height:50px;
            button{
                box-sizing: border-box;
                display: inline-block;
                border: none;
                height: 28px;
                line-height: 26px;
                padding: 0 12px;
                border-radius: 3px;
                cursor: pointer;
                text-decoration: none;
                color: #fff;
                border: 1px solid #1976D2;
                background-color: #1976D2;
                margin-left: 15px;
            }
            .user-label{
                width:70px;
                text-align:right;
                display:inline-block;
            }
            input{
                box-sizing: border-box;
                width: 150px;
                height: 28px;
                line-height: 28px;
                border: 1px solid #dcdcdc;
                border-radius: 5px;
                padding: 0 5px;
            }
        }
    }
}
</style>