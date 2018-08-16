<template>
    <div class="header clearfix">
        <div class="left logo"><a href="#/wish"><i><span style="color:#ffb6c1;">云雀</span>数据</i></a></div>
        <el-menu theme="dark" default-active="1" class="el-menu-demo left" mode="horizontal" @select="handleSelect">
            <el-submenu index="2">
                <template slot="title">商品排行榜</template>
                <el-menu-item index="2-1"><a href="#/home/hot" title="商品热销榜" data-spm="d80">商品热销榜</a></el-menu-item>
                <el-menu-item index="2-2"><a href="#/home/newHot" title="新品热销榜" data-spm="d79">新品热销榜</a></el-menu-item>
                <el-menu-item index="2-3"><a href="#/home/preHot" title="商品飙升榜" data-spm="d8">商品飙升榜</a></el-menu-item>
                <el-menu-item index="2-4"><a href="#/home/newPreHot" title="新品飙升榜" data-spm="d8">新品飙升榜</a>
                </el-menu-item>
                <el-menu-item index="2-5"><a href="#/home/largeMerchantNewPreHot" title="大店新品榜" data-spm="d77">大店新品榜</a>
                </el-menu-item>
                <el-menu-item index="2-6"><a href="#/home/newMerchantNewPreHot" title="新店新品榜" data-spm="d77">新店新品榜</a>
                </el-menu-item>
            </el-submenu>
            <el-submenu index="3">
                <template slot="title">店铺排行榜</template>
                <el-menu-item index="3-1"><a href="#/merchant-list/hot" title="店铺热销榜" data-spm="d0">店铺热销榜</a></el-menu-item>
                <el-menu-item index="3-2"><a href="#/merchant-list/newHot" title="新店热销榜" data-spm="d0">新店热销榜</a></el-menu-item>
                <el-menu-item index="3-3"><a href="#/merchant-list/preHot" title="店铺飙升榜" data-spm="d0">店铺飙升榜</a></el-menu-item>
                <el-menu-item index="3-4"><a href="#/merchant-list/newPreHot" title="新店飙升榜" data-spm="d0">新店飙升榜</a></el-menu-item>
            </el-submenu>
            <el-submenu index="4">
                <template slot="title">行业统计</template>
                <el-menu-item index="3-1"><a href="#/industry" title="行业统计" data-spm="d0">行业统计</a></el-menu-item>
            </el-submenu>
            <el-submenu index="5" v-if="name">
                <template slot="title">我的关注</template>
                <el-menu-item index="5-1"><a href="#/watchedProduct" title="商品" data-spm="d0">关注的商品</a></el-menu-item>
                <el-menu-item index="5-2"><a href="#/watchedMerchant" title="店铺" data-spm="d0">关注的店铺</a></el-menu-item>
            </el-submenu>
        </el-menu>
        <!-- <div class="right nav-login" v-if="!name">
            <a href="#/login" class="login" target="_blank">登录</a>
            <a href="#/register" class="register" target="_blank">注册</a>
        </div> -->
        <div class="right nav-login" v-if="name" >
            <img class="headicon" src="../../images/head_icon.png" alt="">
            <a  class="dropdown-toggle" @click="showDropdown">{{name}}</a>
            <ul class="user-menu" v-show="dropdownShow">
                <li><a href="#/userCenter" target="_blank">用户资料</a></li>
                <li><a @click="logout">退出</a></li>
            </ul>
        </div>
    </div>
</template>
<style lang="less">
    .header {
        background-color: #1976D2;
        box-shadow:0 2px 5px 0 rgba(0,0,0,0.24);
        position:fixed;
        width:100%;
        min-width:830px;
        z-index:100;
        .nav-login{
            a{
                color:#fff;
                font-size:16px;
                font-weight:500;
                height:60px;
                line-height:60px;
                margin-right:100px;
            }
            .headicon{
                width: 40px;
                height: 40px;
            }
            .login{              
                margin-right:30px;           
            }
            .register{
                padding: 5px 23px;
                border-radius: 20px;
                border: 2px solid #fff;
            }
            .register:hover{
                background-color:#fff;
                color:#1976D2;
            }
            .dropdown-toggle{
                position: relative;
            }
            .user-menu{
                
                width: 198px;
                background: #fff;
                border: 1px solid rgba(0, 0, 0, .15);
                position: absolute;
                right: 37px;
                top: 61px;
                li{
                    padding: 5px 10px;
                    line-height: 28px;
                    text-align: left;
                    border-bottom:1px solid #eee;
                    a{
                        color: #5d6570;
                        display: block;
                        padding: 4px 11px;
                        margin: 1px 0;
                        height: 24px;
                        line-height: 24px;
                        border-radius: 5px;
                    }
                    a:hover{
                        color:#1976D2;
                    }
                }
            }
        }
        .el-menu--horizontal .el-submenu .el-submenu__title{
            font-size:16px;
            font-weight:500;
        }
        .el-menu--horizontal .el-menu-item a{
            display:block;
            width:100px;
            height:35px;
        }
    }

    .logo {
        font-size: 36px;
        a{
            color: #fff;
            text-decoration: none;
            cursor: pointer;
        }
        margin: 0 30px 0 20px;
    }

    .el-menu--dark {
        background-color: #1976D2;
    }

    .el-menu--horizontal .el-submenu .el-submenu__icon-arrow, .el-menu--dark .el-submenu__title {
        color: #fff;
    }

</style>
<script>
    export default {
        data() {
            return {
                dropdownShow:false,
                name:"",
                msg: 'hello vue',
            }
        },
        watch: {
            "$route": function (r) {
                if (getCookie && typeof(getCookie) == "function") {
                    this.getUserInfo();
                }
            }
        },
        methods: {
            handleSelect(key, keyPath) {
            },
            getUserInfo(){
                this.name = getCookie("mobile")
            },
            showDropdown(){
                this.dropdownShow = !this.dropdownShow;
            },
            logout(){
                localStorage.clear();
                clearCookie();
                this.$router.push({path: `/login`});
            }
        },
        mounted: function () {
            this.getUserInfo();
            document.addEventListener('click', (e) => {
                if (!this.$el.contains(e.target)) this.dropdownShow = false;
            })
        },
        beforeCreate: function () {
            this.$http.get('/api/user/checkLogin').then(function (response) {
                if (response.data.errCode == 0) {
                    // 检测登录，登录失效清空Cookie
                } else {
                    localStorage.clear();
                    clearCookie();
                }
            }, function (error) {
                // clear cookies
                localStorage.clear();
                clearCookie();
            });
        }
    }
</script>
