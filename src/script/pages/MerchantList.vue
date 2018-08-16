<template>
    <div class="productList clearfix">
        <div>
            <div class="navigation" data-spm="8">
                <div class="crumbs ">
                    <i class="tm-iconfont icon-info"></i>
                    <a href="/">选品</a><span>&gt;</span><a href="/">店铺排行榜</a><span v-if="query_params.type">&gt;</span>{{query_params.type | navigationFilter}}
                </div>
                <span></span>
            </div>

            <div class="clearfix search">
                <div class="row clearfix">
                    <div class="left searchItem">
                        <label for="">主营类目：</label>
                        <el-select v-model="query_params.mainCategoryPid" style="margin-right: 10px;">
                            <el-option  key="" label="全部" value=""></el-option>
                            <el-option v-for="cg in categoryTree"  :key="cg.pid" :label="cg.zhName" :value="cg.pid">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="left  searchItem">
                        <label for="">前7天销量：</label><input type="number" v-model="query_params.startLastWeekOrderCount"><span class="dataRange">-</span><input
                        type="number" v-model="query_params.endLastWeekOrderCount">
                    </div>
                    <div class="left  searchItem">
                        <label for="">前8-14天销量：</label><input type="number" v-model="query_params.startLastMonthOrderCount"><span class="dataRange">-</span><input
                        type="number" v-model="query_params.endLastMonthOrderCount">
                    </div>
                </div>
                <div class="row clearfix">
                    <div class="left  searchItem">
                        <label for="">前7天销售额：</label><input type="number" v-model="query_params.startLastWeekSales"><span class="dataRange">-</span><input
                        type="number" v-model="query_params.endLastWeekSales">
                    </div>
                    <div class="left  searchItem">
                        <label for="">开张时间：</label>
                        <el-date-picker v-model="query_params.startOpenDate" type="date" placeholder="选择日期">
                        </el-date-picker>
                        <span class="dataRange">-</span>
                        <el-date-picker v-model="query_params.endOpenDate" type="date" placeholder="选择日期">
                        </el-date-picker>
                    </div>
                </div>
                <div class="row clearfix">
                    <div class="left  searchItem">
                        <label for="">搜索店铺：</label><input v-model="query_params.query" type="text" class="longer" placeholder="店铺ID,如:GL,WalkerJonny">
                    </div>
                </div>
                <div class="submit">
                    <button class="btn pro-btn" @click="search">搜索店铺</button>
                </div>
            </div>
        </div>
        <div class="clearfix">
            <h1 class="left">共有<span  style="color: #08d;">{{totalCount}}</span>家店铺</h1>
            <h1 class="right">爆品：商品总购买人数>20人，前7天中至少有6天出单。</h1>
            <merchant-table :tableData="tableData" :loading="loading" v-on:onTableSort="onTableSort"></merchant-table>
            <div class="pagination">
                <el-pagination
                    @current-change="choosePage"
                    layout="prev, pager, next"
                    :total="totalPage">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
    import Category from './Category.vue'
    import merchantTable from '../components/MerchantTable.vue'
    export default {
        data() {
            return {
                tableData: [],
                loading: true, // table数据加载状态
                categoryTree: [],
                totalCount:"",
                totalPage: 10,
                query_params:{
                    mainCategoryPid: "",
                    type: "",
                    page: 0,
                    startOpenDate:'',
                    endOpenDate:'',
                },
            }
        },
        watch : {
            "$route": function (r) {
                var start = r.path.indexOf("/merchant-list/");
                if (start == 0) {
                    this.query_params.type = r.params.type;
                    this.getData();
                }
            }
        },
        methods: {
            getData: function () {
                var search_params = {};
                this.loading = true;
                var params = this.query_params;
                for (var prop in params) {
                    if (params[prop]) {
                        if (params[prop] instanceof Date) {
                            search_params[prop] = params[prop].Format("yyyy-MM-dd");
                        } else {
                            search_params[prop] = params[prop];
                        }
                    }
                }
                this.$http.get('/api/merchant/list',{params: search_params}).then(function (response) {
                    var data = response.data.data;
                    this.tableData = data.list;
                    this.totalCount = data.totalCount;
                    this.totalPage = data.totalPage;
                    if (this.totalPage > 100) {
                        this.totalPage = 100;
                    }
                    this.loading = false;
                }, function (error) {
                    console.log(error);
                    this.loading = false;
                });
            },
            getCategoryTree: function () {
                this.$http.get('/api/category/tree?level=1').then(function(response) {
                    this.categoryTree = response.data.data
                }, function(error) {
                    console.log(error);
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
        mounted: function () {
            this.getData();
            this.getCategoryTree();
            this.query_params.type = this.$route.params.type;
        },
        created: function () {

        },
        components:{
            'category': Category,
            merchantTable,
        },
        filters:{
            navigationFilter: function(value) {
                let map = {
                    'hot':'店铺热销榜',
                    'newHot':'新店热销榜',
                    'preHot':'店铺飙升榜',
                    'newPreHot':'新品飙升榜',
                };
                return map[value];
            },
        }
    }
</script>
<style lang="less" scoped>
     @import '../../css/common.less';
     a{
         color:#0085D7;
     }
      #breadcrumb {
        padding: 15px;
    }
    img {
        width: 100px;
        height: 100px;
    }
    .productList h1{
        margin-bottom:10px;
    }
    .productList .search .submit{
        margin: 10px 0 0 134px;
    }
</style>
