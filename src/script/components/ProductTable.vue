<template>
    <el-table
        :data="productListData"
        v-loading="loading"
        :max-height="tableHeight"
        @row-dblclick="rowClick"
        @sort-change="onSortChange"
        border
        style="width: 100%;text-align:center;" align="center"
        :default-sort="{prop: 'recentOrderCount', order: 'descending'}">
        <el-table-column
            label="图片"
            fixed
            align="center"
            class="productimg" width="110px">
            <template scope="scope">
                <img :src="scope.row.imageUrl | convertToSmall" alt="" class="productimg" @click="showDetail(scope.row)">
            </template>
        </el-table-column>
        <el-table-column
            label="商品名称"
            width="240"
            align="left" class="productName">
            <template scope="scope">
                <span v-html="scope.row.name"></span>
            </template>
        </el-table-column>
        <el-table-column
            prop="discountPrice"
            label="售价"
            align="center" width="60">
        </el-table-column>
        <el-table-column
            prop="discountShippingFee"
            label="运费"
            align="center" width="50">
        </el-table-column>
        <el-table-column
            prop="totalPrice"
            label="总价"
            align="center" width="60">
        </el-table-column>
        <el-table-column
            prop="wishlistCount"
            sortable="custom"
            width="95"
            label="总收藏人数"
            align="center">
        </el-table-column>
        <el-table-column
            prop="orderCount"
            sortable="custom"
            label="总购买人数"
            width="95">
        </el-table-column>
        <el-table-column
            prop="reviewCount"
            label="总评论数">
        </el-table-column>
        <el-table-column :label="tableRangeLabel">
            <el-table-column
                prop="recentWishlistCount"
                sortable="custom"
                label="收藏人数">
            </el-table-column>
            <el-table-column
                prop="recentWishlistCountGrowthRate"
                :formatter="formatFloat"
                width="95"
                label="收藏人数增长率">
            </el-table-column>
            <el-table-column
                prop="recentOrderCount"
                sortable="custom"
                label="购买人数">
            </el-table-column>
            <el-table-column
                prop="recentOrderCountGrowthRate"
                :formatter="formatFloat"
                width="95"
                label="购买人数增长率">
            </el-table-column>
            <el-table-column
                prop="recentConvertRate"
                sortable="custom"
                :formatter="formatFloat"
                label="转化率"
                align="center">
            </el-table-column>
        </el-table-column>
        <el-table-column
            prop="listingDate"
            label="上架时间"
            width="90">
        </el-table-column>
        <el-table-column
            prop="wishVerified"
            :formatter="boolFormatter"
            width="70"
            label="wish认证">
        </el-table-column>
        <el-table-column
            label="店铺"
            width="100">
            <template scope="scope">
                <span>
                    <a  :href="`#/merchant/${scope.row.merchantPid}`" target="_blank">{{ scope.row.merchantName }}</a>
                </span>
                <br>
                <span>{{ scope.row.merchantOpenDate }}</span>
            </template>
        </el-table-column>
        <el-table-column
            label="操作"
            align="center"
            width="70">
            <template scope="scope">
                <a type="text" size="small" @click="showDetail(scope.row)" class="detail">查看</a><br/>
                <a :plain="true" type="text" size="small" @click="follow(scope.row)" v-if="!scope.row.followed">
                    关注
                </a>
                <a :plain="true" type="text" size="small" @click="unfollow(scope.row)"
                           v-if="scope.row.followed">取消关注
                </a>
            </template>
        </el-table-column>
    </el-table>
</template>
<script>
    export default {
        props: {
            productListData: {
                type: Array,
                required: false
            },
            loading: {
                type: Boolean,
                required: false
            },
            tableRangeLabel: {
                type: String,
                required: false
            }
        },
        data() {
            return {
                tableHeight: document.body.clientHeight,
            }
        },
        filters: {
            convertToSmall: function (src) {
                return src.replace("-medium", "-small")
            }
        },
        methods: {
            onSortChange: function (sortObject) {
                if (sortObject.prop) {
                    this.$emit('onTableSort', sortObject);
                }
            },
            rowClick: function (row, event, column) {
                let pid = row.pid;
                this.$router.push({ path: `/productdetail/${pid}` });
            },
            formatFloat: function (row, column) {
                var value = row[column.property];
                if (value) return (value * 100).toFixed(2) + "%";
            },
            boolFormatter: function (row, column) {
                if (row[column.property]) return "是";
                return "否";
            },
            showDetail: function (row) {
                var pid = row.pid;
                window.open(`#/productdetail/${pid}`);
            },
            unfollow: function (row) {
                this.$http.post('/api/user/product/unfollow', { productId: row.id }, { emulateJSON: true }).then(function (response) {
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
            follow: function (row) {
                this.$http.post('/api/user/product/follow', { productId: row.id }, { emulateJSON: true }).then(function (response) {
                    this.loading = false;
                    if (response.data.errCode == 0) {
                        row.followed = true;
                        this.$message({
                            showClose: true,
                            message: '关注成功',
                            type: 'success'
                        });
                    } else {
                        if (response.data.errCode == 11000) {
                            this.$router.push({ path: "/login" });
                            return;
                        }
                        this.$message({
                            showClose: true,
                            message: '关注失败,请重试',
                            type: 'error'
                        });
                    }
                }, function (error) {
                    this.loading = false;
                    this.$router.push({ path: "/login" });
                });
            }
        },
        mounted() {

        }
    }

</script>

<style scoped>
em {
    color: red;
    font-weight: 700;
}
span.productName{
    word-break:break-all;
    display:-webkit-box;
    -webkit-line-clamp:3;
    -webkit-box-orient:vertical;
    overflow:hidden;
}
a{
    color:#0085D7;
}
a:hover{
    color:#05488a;
}
a.detail{
    margin-bottom:20px;
}
</style>
