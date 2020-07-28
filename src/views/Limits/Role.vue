<template>
	<el-card class="box-card">
		<div slot="header" class="clearfix">
			<span>管理员角色</span>
			<el-button @click="openInsertModal" type="primary" icon="el-icon-circle-plus-outline" style="float: right; padding: 10px">添加角色</el-button>
		</div>
		<el-table :data="tableData" style="width: 100%">
			<el-table-column prop="id" label="#"> </el-table-column>
			<el-table-column prop="name" label="分类">
				<template slot-scope="scope">
					<div slot="reference" class="name-wrapper">
						<el-tag size="medium">{{ scope.row.name }}</el-tag>
					</div>
				</template>
			</el-table-column>

			<el-table-column label="操作" width="200">
				<template slot-scope="scope">
					<el-link class="am-margin-right-sm" type="primary">
						<el-button type="primary" plain icon="el-icon-edit" size="mini" @click="updateLimits(scope.row,scope.$index)"
						 :disabled="scope.row.id===1"></el-button>
					</el-link>
					<el-button type="danger" plain icon="el-icon-delete" size="mini" @click="removeRole(scope.row.id,scope.$index)"
					 :disabled="scope.row.id===1"></el-button>
					<el-button type="danger" plain icon="el-icon-s-tools" size="mini"></el-button>
				</template>
			</el-table-column>
		</el-table>
	</el-card>
</template>

<script>
	import { Limits } from '@/api/index';

	export default {
		data() {
			return {
				tableData: []
			}
		},
		created() {
			this.loadList();
		},
		methods: {
			//删除普通用户
			removeRole(id, index) {
				this.$confirm('此操作将永久删除该分类, 是否继续?', '删除用户', {
					type: 'warning'
				}).then(async () => {
					let { status } = await Limits.remove({ id });
					if (status) {
						//更新DOM
						this.tableData.splice(index, 1);
						this.$message.success('删除成功!');
					}
				}).catch(() => {
					this.$message.info('取消删除');
				});
			},
			//添加事件
			openInsertModal() {
				this.$prompt('请输入添加的角色名称!', '添加角色', {
					inputPattern: /^\S+$/,
					/* /\S/也可以完成 */
					inputErrorMessage: '不能输入空白字符'
				}).then(async ({ value }) => {
					let { status, data } = await Limits.insert({ name: value });
					if (status) {
						//更新DOM
						this.tableData.push({ name: value, ...data });
						this.$message.success('添加成功!');
					}
				}).catch(() => {
					this.$message.info('取消添加');
				});
			},
			updateLimits(data, index) {
				this.$prompt('请输入需要修改的角色', '修改角色', {
					inputValue: data.name,
					inputPattern: /\S/,
					inputErrorMessage: '角色名不能为空'
				}).then(async ({ value }) => {
					let { status } = await Limits.edit({ id: data.id, name: value });
					if (status) {
						//更新DOM
						data.name = value;
						this.$set(this.tableData, index, data);
						this.$message.success('修改成功!');
					}
				}).catch(() => {
					this.$message.info('取消修改');
				});
			},
			//封装一个方法
			async loadList() { /* 加载列表数据 */
				let { status, total, data, msg } = await Limits.list();
				if (status) {
					this.tableData = data;
				}
			}
		}
	}
</script>

<style scoped="scoped">
	.box-card {
		width: 500px;
	}

	.am-margin-right-sm {
		margin-right: 10px;
	}
</style>
