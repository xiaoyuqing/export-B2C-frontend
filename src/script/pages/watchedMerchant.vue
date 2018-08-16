<template>
    <div class="productList clearfix">
        <div class="navigation" data-spm="8">
            <div class="crumbs ">
                <i class="tm-iconfont icon-info"></i>
                <a href="/">选品</a><span>&gt;</span>我关注的店铺
            </div>
            <span></span>
        </div>
        <div class="wacthedMerchant">
            <merchant-table :tableData="tableData" :loading="loading"></merchant-table>
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
    import merchantTable from '../components/MerchantTable.vue'
    export default {
        data() {
            return {
                totalPage: 1,
                tableData: []
            }
        },
        beforeRouteEnter(to, from, next) {
            // 通过beforeRouterEnter钩子函数解除keep alive缓存限制
            next(vm => {
                vm.getData();
            });
        },
        methods: {
            getData: function () {
                this.$http.get('/api/user/merchant/list',{}).then(function (response) {
                    //this.$set(this, 'tableData', response.data.data.productList)
                    this.tableData = response.data.data.list;
                    this.totalPage = response.data.data.totalPage;
                }, function (error) {
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
            showDetail: function (row) {
                var pid = row.pid;
                this.$router.push({path: `/merchant/${pid}`});
            },
            unfollow:function(row){
                this.$http.post('/api/user/merchant/unfollow', {merchantId: row.id}, {emulateJSON: true}).then(function (response) {
                    this.loading = false;
                    if (response.data.errCode == 0) {
                        row.followed = false;
                        this.$message({
                            showClose: true,
                            message: '已取消关注',
                            type:'success'
                        });
                    } else {
                        this.$message({
                            showClose: true,
                            message: '取消关注失败,请重试',
                            type:'error'
                        });
                    }
                }, function (error) {
                    this.loading = false;
                    this.$message({
                        showClose: true,
                        message: '取消关注失败,请重试',
                        type:'error'
                    });
                });
            },
        },
        mounted () {
        },
        created () {
        },
        components:{
            merchantTable
        }
    }

</script>
<style lang="less" scoped>
    @import '../../css/common.less';
    .wacthedMerchant{
        margin-top:20px;
    }

</style>
