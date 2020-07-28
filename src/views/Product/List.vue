<template>
	<el-card class="box-card">
		<div slot="header" class="clearfix">
			<span>商品列表</span>
		</div>
		<el-table :data="tableData" style="width: 100%">
			<el-table-column label="商品名称" width="550px">
				<template slot-scope="scope">
					<div>
						<el-image style="width: 80px;" :src="scope.row.img_md"></el-image>
						<span style="padding-left: 10px;" class="one">{{scope.row.name}}</span>
						<p style="padding-left: 90px;" class="tow">商品货号:{{scope.row.articleNo}}</p>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="price" label="价格">
			</el-table-column>
			<el-table-column prop="inventory" label="库存">
			</el-table-column>
			<el-table-column prop="create_time" label="发布时间">
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-link :href='`#/product/edit/${scope.row.id}`' class="am-margin-right-sm" type="primary">
						<el-button type="primary" icon="el-icon-edit"></el-button>
					</el-link>
					<el-button type="danger" @click="removeProduct(scope.row.id,scope.$index)" icon="el-icon-delete"></el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="block">
			<el-pagination @size-change="handleSizeChange" :current-page="currentPage1" background :page-sizes="[4, 8, 16, 32]"
			 :page-size="4" @current-change="handleCurrentChange" layout="total, prev, pager, next, sizes, jumper" :total="11">
			</el-pagination>
		</div>
	</el-card>

</template>

<script>
	import { Product } from '@/api/index'

	export default {
		data() {
			return {
				tableData: [],
				pagesize: 4,
				pageindex: 1,
				//默认第一页
				currentPage1: 1
			}
		},
		created() {
			//生命周期获取数据
			this.loadList();
		},
		methods: {
			//封装一个方法
			async loadList() { /* 加载列表数据 */
				let { status, goods, total, msg } = await Product.list({ pageSize: this.pagesize, pageIndex: this.pageindex });
				if (status) {
					this.tableData = goods;
				}
			},
			//删除
			removeProduct(id, index) {
				this.$confirm('此操作将永久删除该商品, 是否继续?', '删除用户', {
					type: 'warning'
				}).then(async () => {
					let { status } = await Product.remove({ id });
					if (status) {
						//更新DOM
						this.tableData.splice(index, 1);
						this.$message.success('删除成功!');
					}
				}).catch(() => {
					this.$message.info('取消删除');
				});
			},
			//页数
			handleSizeChange(val) {
				this.pagesize = val;
				this.loadList()
			},
			//条数
			handleCurrentChange(val) {
				this.pageindex = val;
				this.loadList()
			},

		}
	}
</script>

<style scoped>
	p {
		margin-block-start: 0em;
		margin-block-end: 0em;
	}

	.one {
		position: absolute;
		top: 30px;
	}

	.tow {
		position: absolute;
		top: 55px;
	}

	.am-margin-right-sm {
		margin-right: 10px;
	}
</style>
