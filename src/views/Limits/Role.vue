<template>
	<div class="list">
		<div>
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
							<el-button type="danger" plain icon="el-icon-s-tools" size="mini" @click='openConfig(scope.row.id,)'></el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-card>
		</div>
		<div class="auth" v-if="roleConfig">
			<el-card class="box-card" v-for="(item,index) in roleConfig" :key='item.id'>
				<div slot="header" class="clearfix">
					<div class="congfig"><i class="el-icon-collection-tag"></i>
						<span v-text="item.name"></span></div>
					<el-switch v-model="item.checked" @change="allChecked(item,index)" style="float: right;color: #409EFF;">
					</el-switch>
				</div>
				<div v-for="child in item.children" class="text item">
					{{child.name}}
					<el-switch v-model='child.checked' @change="checked(item,child)" style="float: right;">
					</el-switch>
				</div>
			</el-card>
		</div>
	</div>
</template>

<script>
	import { Limits } from '@/api/index';

	export default {
		data() {
			return {
				tableData: [],
				role_id: '',
				roleConfig: '',
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
			},
			async openConfig(id) {
				this.role_id = id;
				//打开权限配置
				let { status, data, msg } = await Limits.config({ id });
				if (status) {
					this.roleConfig = data;
				}
			},
			checked(item, child) {
				console.log(item);
				let status = false;
				item.children.forEach((item) => {
					if (item.checked) {
						status = true;
					}
				})
				item.checked = status;
				this.handleMenu(item);
				this.handleMenu(child);
			},
			allChecked(item, index) {
				var that = item;
				item.children.forEach((item, idx) => {
					item.checked = that.checked;
					this.$set(that.children, idx, item);
					this.handleMenu(item);
				})
				//判断是添加菜单还是删除菜单
				this.handleMenu(item);
			},
			async handleMenu(item) {
				if (item.checked) {
					//获取
					let data = { role_id: this.role_id, menu_id: item.id }
					console.log(data);
					let res = await Limits.menuAdd(data);
					console.log(res);
				} else {
					let data = { role_id: this.role_id, menu_id: item.id }
					console.log(data);
					let res = await Limits.menuDel(data);
					console.log(res);
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

	.list .el-table {
		box-sizing: border-box;
	}

	.list {
		display: flex;
		justify-content: space-between;
	}

	.congfig {
		color: #409EFF;
		display: flex;
		align-items: center;
		font-size: 18px;
	}
</style>
