<template>
    <el-table
        :data="tableData"
        border
        v-loading="loading"
        @sort-change="onSortChange"
        style="width: 100%;text-align:center;" align="center"
				:default-sort="{prop: 'lastWeekOrderedProductCount', order: 'descending'}">
        <el-table-column
            prop="zhName"
            label="行业名称"        
            align="center">
        </el-table-column>
        <el-table-column
            prop="totalProductCount"
            label="总商品数"        
            align="center">
        </el-table-column>
        <el-table-column
            prop="hotProductCount"
            label="爆款商品数"
            align="center">
        </el-table-column>
        <el-table-column
            prop="hotProductRate"
            :formatter="formatFloat"
            label="爆款率"
            width="60">
        </el-table-column>
        <el-table-column
            prop="wishVerifiedProductCount"
            label="认证商品数"
            align="center">
        </el-table-column>
        <el-table-column
            prop="orderedProductCount"
            label="出过单的商品总数"
            align="center">
        </el-table-column>
        <el-table-column
            prop="orderedProductRate"
            :formatter="formatFloat"
            label="出单率"        
            align="center">
        </el-table-column>
        <el-table-column
            prop="salesGrowthRate"
            :formatter="formatFloat"
            label="销售额增长率"        
            align="center">
        </el-table-column>       
        <el-table-column
            prop="shippingFee"
            label="前7天"
            align="center">
            <el-table-column
                prop="lastWeekOrderCount"
                label="订单量"
                sortable="custom"
                align="center">
            </el-table-column>
            <el-table-column
                prop="lastWeekSales"
                label="销售额"
                sortable="custom"
                align="center">
            </el-table-column>
            <el-table-column
                prop="lastWeekOrderedProductCount"
                :formatter="formatFloat"
                label="出单商品量"
                sortable="custom"
                align="center">
            </el-table-column>
        </el-table-column>
        <el-table-column
            prop="lastTwoWeekSales"
            label="近两周销售额"
            align="center">
        </el-table-column>
        <el-table-column
            prop="lastMonthOrderCount"
            label="近一个月订单量"
            align="center">
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
