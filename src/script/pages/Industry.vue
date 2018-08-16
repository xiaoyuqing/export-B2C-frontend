<template>
    <div class="productList clearfix">
        <div>
            <div class="navigation" data-spm="8">
                <div class="crumbs ">
                    <i class="tm-iconfont icon-info"></i>
                    <a href="/">选品</a><span>&gt;</span><a href="/">行业统计</a><span v-if="query_params.type"></span>
                </div>
                <span></span>
            </div>

            <div class="clearfix search">
                <IndustrySelect v-on:industryPid = "getIndustryPid"></IndustrySelect>
            </div>
        </div>
        <div class="clearfix">
            <h1 class="right">爆品：商品总购买人数>20人，前7天中至少有6天出单。</h1>
            <industry-table :tableData="tableData" :loading="loading" v-on:onTableSort="onTableSort"></industry-table>
        </div>
    </div>
</template>
<script>
    import IndustrySelect from '../components/IndustrySelect.vue'
    import industryTable from '../components/IndustryTable.vue'
    export default {
        data() {
            return {
                loading: true, // table数据加载状态
                tableData: [],
                industryData: [],
                totalPage: 10,
                industryPid: '',
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
                }
            }
        },
        methods: {
            getIndustryPid(data) {
                this.industryPid = data;
                this.getData();
            },
            getData() {
                let params = {
                    pid: this.industryPid
                }
                this.$http.get('/api/category/stat',{params: params}).then(function (response) {
                    let data = response.data.data;
                    this.tableData = data;
                    this.loading = false;
                }, function (error) {
                    console.log(error);
                    this.loading = false;
                });
            },
            choosePage: function (val) {
                if (this.query_params.page != val) {
                    // 不是当前页， 才加载数据
                    this.query_params.page = val;
                }
            },
            search: function () {
                this.query_params.page = 1;
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
            // this.getCategoryTree();
            this.query_params.type = this.$route.params.type;
        },
        created: function () {

        },
        components:{
            IndustrySelect,
            industryTable
        },
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
