<template>
    <div class="productList clearfix">
        <div class="content-top">
            <div class="navigation" data-spm="8">
                <div class="crumbs ">
                    <i class="tm-iconfont icon-info"></i>
                    <a href="/">选品</a><span>&gt;</span><a href="#">商品排行榜</a><span v-if="query_params.type">&gt;</span>{{query_params.type | navigationFilter}}
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

            <div class="clearfix search doSearch">
                <div class="merchant">
                    <div class="row clearfix">
                        <div class="left searchItem">
                            <label for="">店铺近七天销量：</label><input  type="number" v-model="query_params.startMerchantLastWeekOrder"><span class="dataRange">-</span><input
                            type="number" v-model="query_params.endMerchantLastWeekOrder">
                        </div>
                        <div class="left searchItem">
                            <label for="">店铺开张时间：</label>
                            <el-date-picker type="date" placeholder="选择日期" v-model="query_params.startMerchantOpenDate">
                            </el-date-picker>
                            <span class="dataRange">-</span>
                            <el-date-picker type="date" placeholder="选择日期" v-model="query_params.endMerchantOpenDate">
                            </el-date-picker>
                        </div>
                    </div>
                </div>
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
                tableData: [],
                loading: true, // table数据加载状态
                totalPage: 10, // 总页数
                tableRangeLabel: "最近一周",
                totalCount:"",
                unWatched:false,
                userName:"",
                query_range: [{range: "lastWeek", label: "最近一周"},
                    {range: "lastTwoWeek", label: "最近两周"},
                    {range: "lastMonth", label: "最近一月"}],
                query_params: {
                    category: {},
                    rangeType: "lastWeek",
                    page: 0,
                    startMerchantOpenDate: "",
                    endMerchantOpenDate:"",
                    overseaWarehouse: 0,
                    wishVerified: 0,
                    startListingDate: "",
                    endListingDate: "",
                    startTotalWishlistCount:"",
                    endTotalWishlistCount:"",
                    startTotalOrderCount:"",
                    endTotalOrderCount:""
                }
            }
        },
        watch : {
            "$route": function (r) {
                var start = r.path.indexOf("/home/");
				if (start == 0) {
					this.query_params.type = r.params.type;
					this.getData();
				}
            }
        },
        methods: {
            getSearchParams: function () {
                var search_params = {};
                var params = this.query_params;
                for (var prop in params) {
                    if (params[prop]) {
                        if (prop == "category") {
                            search_params["categoryPid"] = params[prop].pid;
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
            getData: function () {
                var search_params = this.getSearchParams();
                this.loading = true;
                this.$http.get('/api/product/list', {params: search_params}).then(function (response) {
                    var data  = response.data.data;
                    this.tableData = data.list;
                    this.query_params.page = data.currentPage;
                    this.totalCount = data.totalCount;
                    this.totalPage = data.totalPage;
                    if(this.totalPage > 100){
                        this.totalPage = 100;
                    }
                    this.setRecentlyLabel();
                    this.loading = false;
                }, function (error) {
                    this.setRecentlyLabel();
                    this.loading = false;
                });
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
                if (this.query_params.page != val) {
                    // 不是当前页， 才加载数据
                    this.query_params.page = val;
                    this.getData();
                }
            },
            search: function () {
                this.query_params.page = 1;
                this.getData();
            },
            onCategorySelected: function (category) {
                console.log("category=", category);
                this.query_params.category = category;
            },
            onTableSort: function (sortObject) {
                this.query_params.sortedBy = sortObject.prop;
                if (sortObject.order == "ascending") {
                    this.query_params.sortedDirection = "asc";
                } else {
                    this.query_params.sortedDirection = "desc";
                }
                this.getData();
            },
        },
        filters:{
            formatFloat: function (value) {
                return (value * 100).toFixed(2) + "%";
            },
            navigationFilter: function(value) {
                let map = {
                    'hot':'商品热销榜',
                    'newHot':'新品热销榜',
                    'preHot':'商品飙升榜',
                    'newPreHot':'新品飙升榜',
                    'largeMerchantNewPreHot':'大店新品榜',
                    'newMerchantNewPreHot':'新店新品榜',
                };
                return map[value];
            }
        },
        mounted () {
            //this.getData();
            this.query_params.type = this.$route.params.type;
        },
        created () {
            //console.log(Category);
        },
        components:{
            'category': Category,
            productTable
        },
    }
</script>

<style lang="less">
    @import '../../css/common.less';

    #breadcrumb {
        padding: 15px;
    }
    .cty_btn {
        width: 281px;
        height: 28px;
        line-height: 6px;
    }
    .productimg {
        width: 100px;
        height: 100px;
    }
    .el-table th>div{
        padding:0 3px !important;
        text-align:center;
    }
    .merchant{
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
        margin-bottom: 10px;
    }
    .el-table .cell{
        padding:0 5px !important;
    }
    .el-table th>.cell{
        font-size:12px;
    }
    .productList h1{
        margin-bottom:10px;
    }
    .productList .search .searchItem .el-radio{
        width:70px;
        text-align: left;
    }
    .productList .search .submit{
        margin: 10px 0 0 134px;
    }
    .productList .search .searchItem label.adjust{width:100px;}
</style>
