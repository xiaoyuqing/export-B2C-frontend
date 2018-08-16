<template>
    <div class="productList clearfix">
        <div class="navigation" data-spm="8">
            <div class="crumbs ">
                <i class="tm-iconfont icon-info"></i>
                <a href="/">选品</a><span>&gt;</span>店铺详情
            </div>
            <span></span>
        </div>
        <el-popover
            v-on:onCategorySelected="onCategorySelected"
            ref="popover_choose_category"
            placement="right"
            trigger="click">
            <category></category>
        </el-popover>
        <div class="clearfix detail">
            <div class="image left"><img :src="merchant.logoImageUrl"></div>
            <div class="table">
                <h1><span class="shopName">店铺名称:</span><span>{{ merchant.name }}</span>
                    <button class="btn pro-btn right" v-if="!merchant.followed" @click="followMerchant">+ 关注店铺</button>
                    <button class="btn pro-btn right" v-if="merchant.followed" @click="unfollowMerchant">取消关注</button>
                </h1>
                <table>
                    <tr>
                        <td><span>开张日期: <label >{{merchant.openDate | formatDate }}</label></span><span>有行业的商品数量: <label >{{ merchant.categoryLabeledProductCount }}</label></span></td>
                        <td><span>被认证产品数量: <label >{{merchant.wishVerifiedProductCount}}</label></span> <span>热销商品数量: <label >{{ merchant.hotProductCount }}</label></span></td>
                    </tr>
                    <tr>
                        <td><span>店铺评分: <label >{{ merchant.rating }}</label></span> <span>评分数量: <label >{{ merchant.ratingCount }}</label></span></td>
                        <td><span>有销量产品数量: <label style="color:#e25d6e;">{{merchant.orderedProductCount}}</label></span>热销商品占比: <span>同比前日: <label >{{ merchant.hotProductRate | formatFloat }}</label></span></td>
                    </tr>
                    <tr>
                        <td><span>产品数量: <label >{{ merchant.totalProductCount}}</label></span> <span>上周有销量商品数: <label >{{ merchant.lastWeekOrderedProductCount }}</label></span></td>
                        <td><span>上周销售额: <label style="color:#e25d6e;">{{ merchant.lastWeekSales }}</label></span> <span>同比上周: <label >{{ merchant.salesGrowthRate | formatFloat }}</label></span></td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="clearfix search doSearch">
            <div class="merchant">
                <div class="row clearfix">
                    <div class="left searchItem">
                        <label for="">商品类目：</label>
                        <!--<input type="text" readonly="readonly" v-popover:popover_choose_category class="longer">-->
                        <el-button v-popover:popover_choose_category class="cty_btn">
                            {{ query_params.category.name }}
                        </el-button>
                    </div>
                    <div class="left searchItem">
                        <label for="">总收藏人数：</label><input type="number" v-model="query_params.startTotalWishlistCount"><span class="dataRange">-</span><input
                        type="number" v-model="query_params.endTotalWishlistCount">
                    </div>
                    <div class="left searchItem">
                        <label for="">总购买人数：</label><input type="number" v-model="query_params.startTotalOrderCount"><span class="dataRange">-</span><input
                        type="number" v-model="query_params.endTotalOrderCount">
                    </div>
                </div>
                <div class="row clearfix">
                    <div class="left searchItem">
                        <label for="">商品总价：</label><input  type="number" v-model="query_params.startTotalPrice"><span class="dataRange">-</span><input
                        type="number" v-model="query_params.endTotalPrice">
                    </div>
                    <div class="left searchItem">
                        <label for="">wish认证：</label>
                        <el-radio-group v-model="query_params.wishVerified">
                            <el-radio label="all">全部</el-radio>
                            <el-radio label="yes">认证</el-radio>
                            <el-radio label="no">未认证</el-radio>
                        </el-radio-group>
                    </div>
                    <!--<div class="left searchItem">-->
                        <!--<label for="" >海外仓：</label>-->
                        <!--<el-radio-group v-model="query_params.overseaWarehouse">-->
                            <!--<el-radio label="all">全部</el-radio>-->
                            <!--<el-radio label="yes">有</el-radio>-->
                            <!--<el-radio label="no">无</el-radio>-->
                        <!--</el-radio-group>-->
                    <!--</div>-->
                </div>
                <div class="row clearfix">
                    <div class="left searchItem">
                        <label for="" style="color: #08d;">搜索商品：</label><input type="text" v-model="query_params.query" class="longer" placeholder="名称，标签，如：wireless bluetooth">
                    </div>
                    <div class="left searchItem">
                        <label for="">商品id：</label><input type="text" v-model="query_params.pid" class="longer" placeholder="如：58b19237a58f5c736b25daf1">
                    </div>
                    <div class="left searchItem">
                        <label for="">上架时间：</label>
                        <el-date-picker type="date" placeholder="选择日期" v-model="query_params.startListingDate">
                        </el-date-picker>
                        <span class="dataRange">-</span>
                        <el-date-picker type="date" placeholder="选择日期" v-model="query_params.endListingDate">
                        </el-date-picker>
                    </div>
                </div>
            </div>
            <div class="row clearfix">
                <div class="left searchItem">
                    <label for="" >时间范围：</label>
                    <el-select v-model="query_params.rangeType" style="margin-right: 10px;">
                        <el-option v-for="range in query_range"  :key="range.range" :label="range.label" :value="range.range">
                        </el-option>
                    </el-select>
                </div>
                <div class="left searchItem">
                    <label for="" >收藏人数：</label>
                    <input v-model="query_params.startWishlistCount" type="number"><span class="dataRange">-</span><input type="number" v-model="query_params.endWishlistCount">
                </div>
                <div class="left searchItem">
                    <label for="" >购买人数：</label>
                    <input type="number" v-model="query_params.startOrderCount"><span class="dataRange">-</span><input type="number" v-model="query_params.endOrderCount">
                </div>
            </div>
            <div class="submit">
                <button @click="search" class="btn pro-btn">搜索商品</button>
                <!-- <button class="btn excel-btn">批量导出</button> -->
            </div>
        </div>
        <div>
            <h1>共有<span  style="color: #08d;">{{totalCount}}</span>件商品</h1>
            <product-table :productListData= "tableData" :loading="loading" :tableRangeLabel="tableRangeLabel"
                          v-on:onTableSort="onTableSort"></product-table>
            <div class="pagination">
                <el-pagination
                    @current-change="choosePage"
                    layout="prev, pager, next"
                    :page-count="totalPage">
                </el-pagination>
            </div>
        </div>
    </div>

</template>

<script>
    import Category from './Category.vue'
    import productTable from '../components/ProductTable.vue'

    export default {
        data() {
            return {
                firstLoading: true, // 是否第一次加载
                loading: true, // table数据加载状态
                tableData: [],
                totalCount:"",
                totalPage: 0,
                merchant: {},
                tableRangeLabel: "最近一周",
                query_range: [{range: "lastWeek", label: "最近一周"},
                    {range: "lastTwoWeek", label: "最近两周"},
                    {range: "lastMonth", label: "最近一月"}],
                query_params: {
                    category: {},
                    rangeType: "lastWeek",
                    page: 0,
                    overseaWarehouse: 0,
                    wishVerified: 0,
                    startListingDate: "",
                    endListingDate: "",
                    startTotalOrderCount:"",
                    endTotalOrderCount:""
                },
            }
        },
        beforeRouteEnter(to, from, next) {
            // 通过beforeRouterEnter钩子函数解除keep alive缓存限制
            next(vm => {
                if (!vm.firstLoading) {
                    vm.getMerchant();
                }
            });
        },
        filters: {
            formatFloat: function (value) {
                return (value * 100).toFixed(2) + "%";
            },
            formatDate: function (value) {
                return new Date(value).Format("yyyy-MM-dd");
            }
        },
        methods: {
            getSearchParams: function () {
                var search_params = {};
                var params = this.query_params;
                for (var prop in params) {
                    if (params[prop]) {
                        if (prop == "category") {
                            search_params["categoryId"] = params[prop].pid;
                        } else if (params[prop] instanceof Date) {
                            search_params[prop] = params[prop].Format("yyyy-MM-dd");
                        } else if (params[prop] == "yes") {
                            search_params[prop] = true;
                        } else if (params[prop] == "no") {
                            search_params[prop] = false;
                        } else if (params[prop] != "all") {
                            search_params[prop] = params[prop];
                        }
                    }
                }
                return search_params;
            },
            getMerchant: function () {
                var search_params = this.getSearchParams();
                var pid = this.$route.params.pid;
                this.loading = true;
                this.firstLoading = false;
                this.$http.get(`/api/merchant/${pid}`, {params: search_params}).then(function (response) {
                    this.merchant = response.data.data.merchantInfo;

                    this.tableData = response.data.data.products.list;
                    this.totalCount = response.data.data.products.totalCount;

                    this.setRecentlyLabel();
                    this.totalPage = response.data.data.products.totalPage;
                    if (this.totalPage > 100) {
                        this.totalPage = 100;
                    }
                    this.loading = false;
                }, function (error) {
                    this.loading = false;
                });
            },
            onTableSort: function (sortObject) {
                this.query_params.sortedBy = sortObject.prop;
                if (sortObject.order == "ascending") {
                    this.query_params.sortedDirection = "asc";
                } else {
                    this.query_params.sortedDirection = "desc";
                }
                this.getMerchant();
            },
            setRecentlyLabel: function () {
                var self = this;
                this.query_range.forEach(function (item) {
                    if (self.query_params.rangeType == item.range) {
                        self.tableRangeLabel = item.label;
                    }
                });
            },
            choosePage: function (val) {
                console.log(`当前页: ${val}`);
                this.query_params.page = val;
                this.getMerchant();
            },
            search: function () {
                this.query_params.page = 1;
                this.getMerchant();
            },
            followMerchant:function(row){
                this.$http.post('/api/user/merchant/follow', {merchantId: this.merchant.id}, {emulateJSON: true}).then(function (response) {
                    this.loading = false;
                    this.handleFollowResponse(response.data.errCode);
                }, function (error) {
                    this.loading = false;
                    this.$router.push({path: "/login"});
                });
            },
            unfollowMerchant:function(row){
                this.$http.post('/api/user/merchant/unfollow', {merchantId: this.merchant.id}, {emulateJSON: true}).then(function (response) {
                    this.loading = false;
                    if (response.data.errCode == 0) {
                        this.merchant.followed = false;
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
            handleFollowResponse: function (errCode) {
                if (errCode == 0) {
                    this.merchant.followed = true;
                    this.$message({
                        showClose: true,
                        message: '关注成功',
                        type:'success'
                    });
                } else if (errCode == 11000){
                    this.$router.push({path: "/login"});
                } else {
                    this.$message({
                        showClose: true,
                        message: '关注失败,请重试',
                        type:'error'
                    });
                }
            },
            onCategorySelected: function (category) {
                console.log("category=", category);
                this.query_params.category = category;
            },
            formatFloat: function (row, column) {
                var value = row[column.property];
                if (value) return (value * 100).toFixed(2) + "%";
            }
        },
        mounted: function () {

        },
        created: function () {
            //this.getMerchant();
        },
        components:{
            'category': Category,
            productTable
        }
    }
</script>
<style lang="less" scoped>
    @import '../../css/common.less';
    #breadcrumb {
        padding: 15px;
    }
    img {
        width: 100px;
        height: 100px;
    }
    .productList .search .searchItem .el-radio{
        width:70px;
        text-align: left;
    }
    .productList .search .submit{
        margin: 10px 0 0 131px;
    }

    .detail {
        margin:20px 0;
        .image {
            img {
                width: 200px;
                height: 200px;
            }
        }
        .table {
            h1{
                margin:20px 0;
                font-size:16px;
                span.shopName{
                    color:#999;
                }
            }
            margin: 0 0 20px 220px;
            table {
                background: #fff;
                width: 100%;
                border-top: 1px solid #ddd;
                border-right: 1px solid #ddd;
                td {
                    padding: 8px;
                    border-left: 1px solid #ddd;
                    border-bottom: 1px solid #ddd;
                    span{
                        display:inline-block;
                        width:47%;
                        label{
                            color:#0085D7;
                            margin-left:5px;
                        }
                    }
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
</style>
