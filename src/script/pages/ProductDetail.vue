<template>
    <div>
        <div class="navigation" data-spm="8">
            <div class="crumbs ">
                <i class="tm-iconfont icon-info"></i>
                <a href="">选品</a><span>&gt;</span>商品详情
            </div>
            <span></span>
        </div>
        <div class="title">商品标题: {{ product.name }}</div>
        <div class="clearfix detail">
            <div class="image left"><img :src="product.imageUrl" alt=""></div>
            <div class="table">
                <table>
                    <tr><td>上架时间: {{ product.listingDate }}</td><td>店铺: <a :href="`#/merchant/${merchant.pid}`" target="_blank">{{ merchant.name }}</a></td></tr>
                    <tr><td>wish售价: {{ product.discountPrice }} + {{product.discountShippingFee}}</td><td>Wish链接: <a :href="product.url" target="_blank">{{ product.url }}</a></td></tr>
                    <tr><td>卖家标价: {{ product.price }} + {{product.shippingFee}}</td><td>收藏总数: {{ product.wishlistCount }}</td></tr>
                    <tr><td>海外仓: {{ product.overseaWarehouse | overseaWarehouse}}</td><td>购买人数: {{ product.orderCount }}</td></tr>
                    <tr><td>所属类目: <span v-for="item in categoryNameList"  :key="item">/{{item.enName}}({{item.zhName}})</span></td><td>评价总数: {{ product.reviewCount }}</td></tr>
                    <tr><td>Wish认证: {{ product.wishVerified | wishVerified}}</td><td>商品评分: {{ product.avgReviewStar }}</td></tr>
                </table>

            </div>
            <p class="attention">
                <button class="btn pro-btn" @click="follow" v-if="!product.followed">关注商品</button>
                <button class="btn pro-btn" @click="unfollow" v-if="product.followed">取消关注</button>
            </p>
        </div>

        <div class="tag">
            <h1>商品标签</h1>
            <div class="tag-type">
            <div class="self-built">
                <span>商家自建: </span>
                <span>
                    <el-tag style="margin-left: 10px" type="gray" v-for="tag in product.tags" :key="tag">{{ tag }}</el-tag>
                </span>
            </div>
            <div class="wish">
                <span>Wish优化: </span>
                <span>
                    <el-tag style="margin-left: 10px" type="gray" v-for="merchantTag in product.optimizingTags" :key="merchantTag">{{ merchantTag }}</el-tag>
                </span>
            </div>
            </div>
        </div>

        <div id="chart_sales" style="width: 100%; height: 300px"></div>
        <div id="chart_wishes" style="width: 100%; height: 300px"></div>
    </div>
</template>
<script>
    import echarts from 'echarts/lib/echarts'
    import 'echarts/lib/component/tooltip'
    import 'echarts/lib/component/title'
    import 'echarts/lib/chart/line'
    import 'echarts/lib/component/dataZoom'

    export default {
        data() {
            return {
                product: {},
                categoryNameList : [], // 奇怪 product.category.pid 这样的三层vue居然找不到
                merchant: {id: 0, name: ""},
                updatedAt: [],
                orderCountGrowth: [],
                wishCountGrowth: []
            }
        },
        created: function() {
            //this.getProduct(); 通过钩子路由已经调用
        },
        beforeRouteEnter(to, from, next) {
            // 通过beforeRouterEnter钩子函数解除keep alive缓存限制
            next(vm => {
                vm.getProduct();
            });
        },
        methods: {
            getProduct: function () {
                var pid = this.$route.params.pid;
                this.$http.get(`/api/product/${pid}`, []).then(function(response) {
                    this.product = response.data.data;
                    this.product.optimizingTags = this.product.tags.split(",");
                    this.product.tags = this.product.merchantTags.split(",");
                    if (this.product.categoryNameList) {
                        this.categoryNameList = this.product.categoryNameList;
                    }
                    if (this.product.merchant) {
                        this.merchant = this.product.merchant;
                    }
                    this.initCharts();
                }, function(error) {
                    console.log(error);
                });
            },
            unfollow:function(){
                this.$http.post('/api/user/product/unfollow', {productId: this.product.id}, {emulateJSON: true}).then(function (response) {
                    this.loading = false;
                    if (response.data.errCode == 0) {
                        this.product.followed = false;
                        this.$message({
                            showClose: true,
                            message: '已取消关注',
                            type:'success'
                        });
                    }
                }, function (error) {
                    this.loading = false;
                    this.$message({
                        showClose: true,
                        message: '取消失败,请重试',
                        type:'error'
                    });
                });
            },
            follow:function(){
                this.$http.post('/api/user/product/follow', {productId: this.product.id}, {emulateJSON: true}).then(function (response) {
                    this.loading = false;
                    if (response.data.errCode == 0) {
                        this.product.followed = true;
                        this.$message({
                            showClose: true,
                            message: '关注成功',
                            type:'success'
                        });
                    } else {
                        if (response.data.errCode == 11000) {
                            this.$router.push({path: "/login"});
                            return;
                        }
                        this.$message({
                            showClose: true,
                            message: '关注失败,请重试',
                            type:'error'
                        });
                    }
                }, function (error) {
                    this.loading = false;
                    this.$router.push({path: "/login"});
                });
            },
            initCharts: function () {
                var self = this;
                this.product.productHistoryList.forEach(function (item) {
                    self.updatedAt.push(new Date(item.updatedAt).Format("yyyy-MM-dd"));
                    self.orderCountGrowth.push(item.orderCount);
                    self.wishCountGrowth.push(item.wishlistCount);
                });

                var salesChart = echarts.init(document.getElementById('chart_sales'));
                salesChart.setOption({
                    title: { text: '最近14天每日销售数量' },
                    tooltip: {},
                    dataZoom: [
                        {
                            show: true,
                            start: 70,
                            end: 100
                        }
                    ],
                    xAxis: {
                        data: this.updatedAt,
                    },
                    yAxis: {},
                    series: [{
                        name: '销量',
                        type: 'line',
                        data: this.orderCountGrowth,
                    }]
                });

                var wishChart = echarts.init(document.getElementById('chart_wishes'));
                wishChart.setOption({
                    title: { text: '最近14天每日新增收藏' },
                    tooltip: {},
                    dataZoom: [
                        {
                            show: true,
                            start: 70,
                            end: 100
                        }
                    ],
                    xAxis: {
                        //axisLabel:{interval: 0},
                        data: this.updatedAt
                    },
                    yAxis: {},
                    series: [{
                        name: '销量',
                        type: 'line',
                        data: this.wishCountGrowth
                    }]
                });
            }
        },
        filters:{
            wishVerified:function(value){
                if(value == true){
                    return '认证'
                }else{
                    return '未认证'
                }
            },
            overseaWarehouse:function(value){
                if(value == true){
                    return '有'
                }else{
                    return '无'
                }
            }
        }
    }
</script>
<style lang="less" scoped>
    .title {
        padding: 10px 15px;
        border: 1px solid #e0e0e0;
        background: #fafafa;
        margin: 20px 0 15px 0;
    }

    .detail {
        .image {
            img {
                width: 280px;
                height: 280px;
            }
        }
        .table {
            margin: 0 0 20px 300px;
            background: #fff;
            table {
                width: 100%;
                border-top: 1px solid #ddd;
                border-right: 1px solid #ddd;
                td {
                    width: 50%;
                    padding: 8px;
                    border-left: 1px solid #ddd;
                    border-bottom: 1px solid #ddd;
                }
            }
        }
        .pro-btn {
            color: #fff;
            border: 1px solid #ff4200;
            background-color: #ff1d00;
            margin-left: 20px;
        }
    }

    .tag {
        margin: 20px 0 15px 0;
        border: 1px solid #e0e0e0;
        h1 {
            padding: 10px 15px;
            border-bottom: 1px solid #e0e0e0;
            background: #fafafa;
        }
        .tag-type {
            padding: 15px;
            background: #fff;
            .self-built {
                margin-bottom: 15px;
            }
        }
    }

    a {
        text-decoration: none;
        transition: color 218ms ease;
        color: #0085D7;
    }

    a:hover {
        cursor: pointer;
        text-decoration: none;
        color: #20a0ff;
    }
</style>
