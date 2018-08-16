<template>
    <el-table
        :data="tableData"
        border
        v-loading="loading"
        :max-height="tableHeight"
        @sort-change="onSortChange"
        style="width: 100%;text-align:center;" align="center"
				:default-sort="{prop: 'lastWeekOrderedProductCount', order: 'descending'}">
        <el-table-column
            prop="name"
            label="店铺"
            align="center">
        </el-table-column>
        <el-table-column
            prop="rating"
            label="评分"
            sortable="custom"
            width="60">
        </el-table-column>
        <el-table-column
            prop="ratingCount"
            label="评论总数"
            sortable="custom"
            align="center">
        </el-table-column>
        <el-table-column
            prop="totalProductCount"
            label="商品总数"
            sortable="custom"
            align="center">
        </el-table-column>
        <el-table-column
            prop="orderedProductCount"
            label="出过单的商品总数"
            sortable="custom"
            align="center">
        </el-table-column>
        <el-table-column
            prop="hotProductCount"
            label="爆品总数"
            sortable="custom"
            align="center">
        </el-table-column>
        <el-table-column
            prop="hotProductRate"
            label="店铺爆品率"
            sortable="custom"
            :formatter="formatFloat"
            align="center">
        </el-table-column>
        <!-- <el-table-column
            prop="orderCount"
            label="前90天新上架商品的爆品率"
            align="center">
        </el-table-column> -->
        <el-table-column
            prop="shippingFee"
            label="前7天"
            align="center">
            <el-table-column
                prop="lastWeekOrderedProductCount"
                label="店铺销售件数"
                sortable="custom"
                align="center">
            </el-table-column>
            <el-table-column
                prop="lastWeekSales"
                label="店铺销售金额"
                sortable="custom"
                align="center">
            </el-table-column>
            <el-table-column
                prop="salesGrowthRate"
                :formatter="formatFloat"
                label="店铺交易增幅"
                sortable="custom"
                align="center">
            </el-table-column>
        </el-table-column>
        <el-table-column
            prop="openDate"
            :formatter="formatDate"
            label="店铺开张时间"
            align="center">
        </el-table-column>
        <el-table-column
            label="操作"
            align="center">
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
			tableData: {
				type: Array,
				required: false
			},
			loading: {
				type: Boolean,
				required: false
			}
		},
		data() {
			return {
				tableHeight: document.body.clientHeight,
			}
		},
		methods: {
			onSortChange(sortObject) {
				if (sortObject.prop) {
					this.$emit('onTableSort', sortObject);
				}
			},
			formatDate(row, column) {
				var timestamp = row[column.property];
				return new Date(timestamp).Format("yyyy-MM-dd");
			},
			showDetail(row) {
				var pid = row.pid;
				window.open(`#/merchant/${pid}`);
			},
			formatFloat(row, column) {
				var value = row[column.property];
				if (value) return (value * 100).toFixed(2) + "%";
			},
			unfollow(row) {
				this.$http.post('/api/user/merchant/unfollow', { merchantId: row.id }, { emulateJSON: true }).then(function (response) {
					this.loading = false;
					if (response.data.errCode == 0) {
						row.followed = false;
						this.$message({
							showClose: true,
							message: '已取消关注',
							type: 'success'
						});
					} else {
						this.$message({
							showClose: true,
							message: '取消关注失败,请重试',
							type: 'error'
						});
					}
				}, function (error) {
					this.loading = false;
					this.$message({
						showClose: true,
						message: '取消关注失败,请重试',
						type: 'error'
					});
				});
			},
			follow(row) {
				this.$http.post('/api/user/merchant/follow', { merchantId: row.id }, { emulateJSON: true }).then(function (response) {
					this.loading = false;
					if (response.data.errCode == 0) {
						row.followed = true;
						this.$message({
							showClose: true,
							message: '关注成功',
							type: 'success'
						});
					} else if (response.data.errCode == 11000) {
						this.$router.push({ path: "/login" });
					} else {
						this.$message({
							showClose: true,
							message: '关注失败,请重试',
							type: 'error'
						});
					}
				}, function (error) {
					this.loading = false;
				});
			}
		},
		mounted() {
		}
	}
</script>
<style scoped>
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
