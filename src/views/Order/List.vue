<template>
	<el-card class="box-card">
		<div slot="header" class="clearfix">
			<span>订单列表</span>
		</div>
		<el-table :data="tableData" style="width: 100%">
			<el-table-column prop="id" label="#" width="50px">
			</el-table-column>
			<el-table-column width="650px">
				<template slot-scope="scope">
					<el-table :data="scope.row.goodsList">
						<el-table-column label="商品" width="410">
							<template slot-scope="scope">
								<div>
									<el-image style="width: 80px;" :src="scope.row.img_md"></el-image>
									<span style="padding-left: 10px;" class="one">{{scope.row.name}}</span>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="goods_price" label="单价">
						</el-table-column>
						<el-table-column prop="goods_num" label="数量">
						</el-table-column>
					</el-table>
				</template>
			</el-table-column>

			<el-table-column prop="payment" label="付款总额" width="100">
			</el-table-column>
			<el-table-column prop="create_time" label="下款时间" width="200">
			</el-table-column>
			<el-table-column prop="status" label="状态" width="150">
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button type="primary" icon="el-icon-edit"></el-button>
				</template>
			</el-table-column>
		</el-table>
	</el-card>

</template>
<script>
	import { Order } from '@/api/index'

	export default {
		data() {
			return {
				tableData: [],
			}
		},
		created() {
			//生命周期获取数据
			this.loadList();
		},
		methods: {
			//封装一个方法
			async loadList() { /* 加载列表数据 */
				let { status, data } = await Order.list();
				if (status) {
					this.tableData = data;
				}
			},
		},
	}
</script>

<style scoped="scoped">
	.one {
		position: absolute;
		top: 30px;
	}
</style>
