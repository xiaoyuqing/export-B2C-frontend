<template>
<div class="w-default">
    <div class="headers">
        <div class="con">
            <div class="h1">
                <div>Wish全面精准数据分析</div>
                <div>以最快的方式拉升销量</div>
            </div>
            <div v-if="!name">
                <a class="login" href="#/login" target="_blank">立即登录</a>
                <div class="register">
                    <span>还没有云雀数据网账号？</span>
                    <a class="J-register" href="#register" target="_blank">马上注册</a>
                </div>
            </div>
            <a class="login" href="#/home" v-if="name" target="_blank">立即试用</a>
        </div>
    </div>
    <div class="content">
        <div class="h1">核心优势</div>
        <div class="h2">CORE ADVANTAGES</div>
        <div class="h3">我们的专业，换来您的信任</div>
        <div class="cores">
            <div class="core">
                <span></span>
                <h3>每日更新</h3>
                <p>
                    每日更新内容，及时把握市场动向，<br>了解大家都在卖什么
                </p>
            </div>
            <div class="core">
                <span class="icon-2"></span>
                <h3>数据实力</h3>
                <p>
                    千万级数据处理记录，庞大的数据<br>分析，让你更好经营店铺
                </p>
            </div>
            <div class="core">
                <span class="icon-3"></span>
                <h3>精密算法</h3>
                <p>
                    多维度立体化数据分析，历史现在<br>完全展现
                </p>
            </div>
            <div class="core last-core">
                <span class="icon-4"></span>
                <h3>高效服务</h3>
                <p>
                    专属客服解惑答疑，随时随地解决<br>您的疑惑
                </p>
            </div>
        </div>
        <div class="h1">核心功能</div>
        <div class="h2">INDUSTRY SOLUTIONS</div>
        <div class="programme">
            <div class="midline">
                <span class="s-dot s-dot-t"></span>
                <span class="bb-dot bb-dot-b"></span>
            </div>
            <div class="programme-1">
                <div class="line line-r">
                    <span class="b-dot b-dot-r"></span>
                    <span class="s-dot s-dot-l"></span>
                </div>
                <h2>01</h2>
                <h3>全站概况</h3>
                <p>
                    了解Wish整体销售趋势，挖掘Wish爆款产品拓宽自己思路<br>
                    <img src="../../images/programme-1.jpg" alt="wish店铺销售数据全店概括分析">
                </p>
                <a class="link_now" href="#/home" target="_blank">立即体验</a>
            </div>
            <div class="programme-2">
                <div class="line line-l">
                    <span class="b-dot b-dot-l"></span>
                    <span class="s-dot s-dot-r"></span>
                </div>
                <h2>02</h2>
                <h3>行业统计</h3>
                <p>
                    行业规模，概况分析，更好把握行业走势，发现潜力类目<br>
                    <img src="//cdn.maijia.com/www-index-cdn/page/wish/index/pagelet/body/imgs/programme-2.jpg" alt="wish店铺行业销售数据分析">
                </p>
                <a class="link_now" href="#/home" target="_blank">立即体验</a>
            </div>
            <div class="programme-3">
                <div class="line line-r">
                    <span class="b-dot b-dot-r"></span>
                    <span class="s-dot s-dot-l"></span>
                </div>
                <h2>03</h2>
                <h3>店铺统计</h3>
                <p>
                    店铺销售数据追踪，查看热卖店铺定价及刊登策略，<br>
                    跟随热卖店铺脚步走<br>
                    <img src="//cdn.maijia.com/www-index-cdn/page/wish/index/pagelet/body/imgs/programme-3.jpg" alt="wish店铺销售详情统计，店铺成绩明细，店铺热销产品飙升产品数据分析，店铺刊登">
                </p>
                <a class="link_now" href="#/home" target="_blank">立即体验</a>
            </div>
            <div class="programme-4">
                <div class="line line-l">
                    <span class="b-dot b-dot-l"></span>
                    <span class="s-dot s-dot-r"></span>
                </div>
                <h2>04</h2>
                <h3>产品统计</h3>
                <p>
                    统计产品销售趋势，学习热卖产品标签打法<br>
                    根据Wish标签优化卖家自填标签，让您的产品被更多人看到 <img src="//cdn.maijia.com/www-index-cdn/page/wish/index/pagelet/body/imgs/programme-4.jpg" alt="wish产品统计，行业统计信息，7天日均销量，7天日均收藏量">
                </p>
                <a class="link_now" href="#/home" target="_blank">立即体验</a>
            </div>
        </div>
        <div class="h1">Wish专业卖家数据分析工具</div>
        <div class="h4">同行都在用，您还在等什么？</div>
        <a class="register-button J-register" href="#/register" v-if="!name" target="_blank">立即注册，免费试用</a>
        <a class="register-button J-register" href="#/home" v-if="name" target="_blank">立即试用</a>
    </div>
</div>
</template>
<script>
export default {
    data(){
        return {
            name:""
        }
    },
    methods: {
        getUserInfo(){
            this.name = getCookie("mobile")
        },
    },
    mounted(){
        this.getUserInfo();
        window.scrollTo(0,0);
    }
}
</script>
<style lang="less">
@import '../../css/common.less';
@import '../../css/wish.css';
</style>