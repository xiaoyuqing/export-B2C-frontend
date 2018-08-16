<template>
    <div class="productList clearfix">
        <div class="navigation" data-spm="8">
            <div class="crumbs ">
                <i class="tm-iconfont icon-info"></i>
                <a href="/">选品</a><span>&gt;</span>我关注的商品
            </div>
            <span></span>
        </div>
        <div class="productTable">
            <product-table :productListData= "tableData" :loading="loading" v-on:onTableSort="onTableSort" :tableRangeLabel="tableRangeLabel"></product-table>
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
    import productTable from '../components/ProductTable.vue'
    export default {
        data() {
            return {
                firstLoading: true,
                tableData: [],
                loading: true, // table数据加载状态
                totalPage: 10, // 总页数
                unWatched: false,
                tableRangeLabel: "最近一周",
                queryParams: {
                    page: 1,
                    sortedBy: "",
                    sortedDirection: ""
                }
            }
        },
        beforeRouteEnter(to, from, next) {
            // 通过beforeRouterEnter钩子函数解除keep alive缓存限制
            next(vm => {
                if (!vm.firstLoading) {
                    vm.getData();
                }
            });
        },
        methods: {
            getData: function () {
                this.loading = true;
                this.firstLoading = false;
                this.$http.get('/api/user/product/list', {params: this.queryParams}).then(function (response) {
                    this.tableData = response.data.data.list;
                    this.queryParams.page = response.data.data.currentPage + 1;
                    this.totalPage = response.data.data.totalPage;
                    this.loading = false;
                }, function (error) {
                    console.log(error);
                    this.loading = false;
                });
            },
            choosePage: function (val) {
                console.log(`当前页: ${val}`);
                if (this.queryParams.page != val) {
                    // 不是当前页， 才加载数据
                    this.queryParams.page = val;
                    this.getData();
                }
            },
            search: function () {
                this.queryParams.page = 1;
                this.getData();
            },
            rowClick: function (row, event, column) {
                //console.log("rowClick", column)
                var pid = row.pid;
                this.$router.push({path: `/product/${pid}`});
            },
            boolFormatter: function (row, column) {
                if (row[column.property]) return "是";
                return "否";
            },
            onTableSort: function (sortObject) {
                this.queryParams.sortedBy = sortObject.prop;
                if (sortObject.order == "ascending") {
                    this.queryParams.sortedDirection = "asc";
                } else {
                    this.queryParams.sortedDirection = "desc";
                }
                this.getData();
            },
            unfollow: function (row) {
                this.$http.post('/api/user/product/unfollow', {productId: row.id}, {emulateJSON: true}).then(function (response) {
                    this.loading = false;
                    if (response.data.errCode == 0) {
                        row.followed = false;
                        this.$message({
                            showClose: true,
                            message: '已取消关注',
                            type: 'success'
                        });
                    }
                }, function (error) {
                    this.loading = false;
                    this.$message({
                        showClose: true,
                        message: '取消失败,请重试',
                        type: 'error'
                    });
                });
            },
            showDetail: function (row) {
                var pid = row.pid;
                this.$router.push({path: `/product/${pid}`});
            }
        },
        mounted: function () {
            //this.getData()
        },
        components:{
            productTable
        },
    }

</script>
<style lang="less" scoped>
    @import '../../css/common.less';

    .productTable {
        margin-top: 20px;
    }
</style>
