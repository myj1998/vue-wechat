<template>
	<div>
		<el-card class="box-card">
			<div slot="header">
				<span>商品分类</span>
			</div>
			<el-alert :closable="false" class="warn" title="Tips" type="warning" description="设置后台管理系统的左侧菜单，目前至多支持两层菜单，三层以上菜单将不会显示。"
			 show-icon>
			</el-alert>
			<!-- 树形组件   -->
			<el-tree ref="tree" lazy :load="loadNode" node-key="id" :default-expanded-keys="[1]" :props="defaultProps">
				<span class="custom-tree-node" slot-scope="{ node, data }">
					<span>{{ node.label }}</span>
					<span>
						<el-button type="text" :disabled="node.level==1" icon="el-icon-edit" size="mini">
							图标
						</el-button>
						<el-button @click.stop="openEditModal(node,data)" type="text" icon="el-icon-edit" :disabled="node.level==1" size="mini">
							编辑
						</el-button>
						<el-button type="text" @click.stop="openInsertModal(node,data)" icon="el-icon-plus" size="mini">
							添加
						</el-button>
						<el-button type="text" :disabled="node.level==1" @click.stop="handleRemove(node,data)" icon="el-icon-delete" size="mini">
							删除
						</el-button>
						<span class="one" style="font-size: 5px;">显示序号:</span>
						<el-tag size="small">{{data.order}}</el-tag>
					</span>
				</span>
			</el-tree>

			<el-dialog title="编辑分类" :visible.sync="editModalShow">
				<el-form :model="editForm">
					<el-form-item label="菜单名称" label-width="120px">
						<el-input v-model="editForm.name" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="链接地址" label-width="120px">
						<el-input v-model="editForm.path" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="显示顺序" label-width="120px">
						<el-input v-model="editForm.order" autocomplete="off"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="editModalShow = false">取 消</el-button>
					<el-button type="primary" @click='handleUpdateNode'>保 存</el-button>
				</div>
			</el-dialog>
			<!-- 添加 -->
			<el-dialog title="添加分类" :visible.sync="insertModalShow">
				<el-form :model="insertForm">
					<el-form-item label="菜单名称" label-width="120px">
						<el-input v-model="insertForm.name" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="链接地址" label-width="120px">
						<el-input v-model="insertForm.path" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="显示顺序" label-width="120px">
						<el-input v-model="insertForm.order" autocomplete="off"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="insertModalShow = false">取 消</el-button>
					<el-button type="primary" @click='handleInsertNode'>保 存</el-button>
				</div>
			</el-dialog>
		</el-card>
	</div>

</template>

<script>
	import { Menu } from '@/api/index'
	export default {
		data() {
			return {
				defaultProps: {
					label: 'name',
				},
				insertForm: {
					name: '',
					pId: '',
					path: '',
					order: ''
				},
				editForm: {
					id: '',
					name: '',
					path: '',
					order: ''
				},
				nodeData: {}, //节点数据
				node: {}, //节点
				insertModalShow: false,
				editModalShow: false,
			};
		},
		methods: {
			async loadNode(node, resolve) {
				// node:节点对象
				// resolve:返回下一级节点数据的方法
				if (node.level == 0) {
					let { status, data } = await Menu.list({ pId: 0 });
					return resolve(data);
				}

				let pId = node.data.id;

				let { status, data } = await Menu.list({ pId });
				if (status) {
					return resolve(data);
				}
			},
			// 编辑
			openEditModal(node, data) {
				this.editForm = { ...data };
				this.node = node;
				this.editModalShow = true;
			},

			// 编辑节点
			async handleUpdateNode() {
				let { status, msg, data } = await Menu.edit({ ...this.editForm });
				if (status) {
					this.$message.success(msg);
					// 更新节点
					this.node.data = this.editForm;
					this.editModalShow = false;
				}
			},
			// 添加
			// 打开插入model
			openInsertModal(node, data) {
				// node:节点对象
				// data:节点数据
				// console.log(node, data);
				// 转存
				this.node = node;
				this.insertForm.pId = data.id;
				this.insertModalShow = true;
			},

			// 插入节点
			async handleInsertNode() {
				let { status, msg, data } = await Menu.add({ ...this.insertForm });
				if (status) {
					this.$message.success('添加成功');
					// 插入新的节点
					this.$refs.tree.append({ ...data, ...this.insertForm }, this.node);
					this.insertModalShow = false;
					this.insertForm.name = "";
					this.insertForm.path = "";
					this.insertForm.order = "";
				}

			},
			// 删除
			handleRemove(node, data) {
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
						type: 'warning'
					})
					.then(async () => {
						let { status } = await Menu.remove({ ...data });
						if (status) {
							this.$refs.tree.remove({ ...data })
							this.$message.success('删除成功');
						}
					})
					.catch(() => {
						this.$message.info('取消删除');
					})
			}
		}
	};
</script>

<style scoped="scoped">
	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
	}

	.one {
		padding-right: 10px;
		padding-left: 10px;
	}

	.warn {
		margin-bottom: 15px;
	}
</style>
