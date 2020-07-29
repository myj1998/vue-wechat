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
						<el-popover placement="left" width="100" font-size='20px' trigger="hover">
							<i :class="`el-icon-${data.icon}`" style="font-size: 25px;"></i>
							<el-button slot="reference" type="text" @click.stop='openIconModal(node,data)' :icon="`el-icon-${data.icon}`"
							 :disabled="node.level==0" size="mini">
								图标
							</el-button>
						</el-popover>
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

			<!-- 图标弹窗 -->
			<el-dialog title="修改图标" :visible.sync="editIconShow" width="79%">
				<ul class="icon_box">
					<div v-for="(item,index) in iconList" :class="{icon_active:item.checked}" @click.stop='iconActive(item,index)'>
						<li :class="`el-icon-${item.name}`"></li>
						<p v-text="item.name"></p>
					</div>
				</ul>
				<el-pagination background layout="prev,pager, sizes, next" :page-size="10" @size-change="handleSizeChange" style="float: right;"
				 :page-sizes="pageNum" :total='300' @current-change='currentchange '>
				</el-pagination>
				<div slot="footer" class="dialog-footer">
					<el-button @click='cancel'>取 消</el-button>
					<el-button type="primary" @click="handleIconEdit('editForm')">保 存</el-button>
				</div>
			</el-dialog>

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
				iconEdit: {
					id: '',
					icon: '',
					name: '',
				},
				pageNum: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
				iconList: [],
				nodeData: {}, //节点数据
				node: {}, //节点
				insertModalShow: false,
				editModalShow: false,
				editIconShow: false,
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
			cancel() {
				this.insertModalShow = false;
				this.editModalShow = false;
				this.editIconShow = false;
				this.editForm = { name: '', pId: '', img: '' };
				this.insertForm = { name: '', id: '', img: '' }
			},
			//打开图标编辑
			currentchange(val) {
				this.pageIndex = val;
				this.iconPage();
			},
			//分页器
			handleSizeChange(val) {
				this.pageSize = val;
				this.iconPage();
			},
			//打开icon模板
			async openIconModal(node, data) {
				this.nodeData = data;
				this.editIconShow = true;
				this.iconPage();
				this.iconEdit.id = data.id;
			},
			//获取图标列表
			async iconPage() {
				let res = await Menu.iconList({ pageSize: this.pageSize, pageIndex: this.pageIndex })
				this.total = res.total;
				this.iconList = res.icons
				this.iconList.forEach((item) => {
					item.checked = false;
				})
			},
			//图标点击激活
			iconActive(choose, index) {
				let that = this;
				this.iconList.forEach((item, index) => {
					if (choose == item) {
						item.checked = true;
						that.iconEdit.icon = item.id;
						that.iconEdit.name = item.name;
					} else {
						item.checked = false;
					}
					this.$set(this.iconList, index, item)
				})
			},
			//改变图标
			async handleIconEdit() {
				let { msg, status } = await Menu.editIcon({ ...this.iconEdit })
				if (status && this.iconEdit) {
					this.nodeData.icon = this.iconEdit.name;
					let data = { icon_name: this.iconEdit.name, id: this.nodeData.id }
					New.$emit('updata', data)
				}
				this.cancel();
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

	.icon_box {
		box-sizing: border-box;
	}

	.icon_box {
		display: flex;
		justify-content: space-between;
	}
</style>
