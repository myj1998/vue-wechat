<template>
	<div>
		<el-card class="box-card">
			<div slot="header">
				<span>分类列表</span>
			</div>
			<!-- 树形组件 -->
			<el-tree ref="tree" :load="loadNode" node-key="id" :default-expanded-keys="[1]" lazy :props="defaultProps">
				<span class="custom-tree-node" slot-scope="{ node, data }">
					<span>{{ node.label }}</span>
					<span>
						<el-button type="text" icon="el-icon-edit" :disabled="node.level==1" size="mini" @click.stop="() => openEditModal(node,data)">
							编辑
						</el-button>
						<el-button type="text" icon="el-icon-plus" size="mini" @click.stop="() => openInsertModal(node,data)">
							添加
						</el-button>
						<el-button type="text" icon="el-icon-delete" :disabled="node.level==1" size="mini" node-key="id" @click.stop="() => remove(node, data)">
							删除
						</el-button>
					</span>
				</span>
			</el-tree>
		</el-card>
		<!-- 添加弹窗 -->
		<el-dialog title="添加分类" :visible.sync="insertModalShow">
			<el-form :model="insertForm" :rules="rules" ref="insertForm">
				<el-form-item prop="name" label="分类名称" label-width="120px">
					<el-input v-model="insertForm.name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item prop="img" label="头像" label-width="120px">
					<Upload :url='insertForm.img' @success='handleUploadSuccess($event)' @remove='insertForm.img=""'></Upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="insertModalShow = false">取 消</el-button>
				<el-button type="primary" @click="handleInsertNode('insertForm')">添 加</el-button>
			</div>
		</el-dialog>
		<!-- 编辑弹窗 -->
		<el-dialog title="编辑分类" :visible.sync="editModalShow">
			<el-form :model="editForm" :rules="rules" ref="editForm">
				<el-form-item prop="name" label="分类名称" label-width="120px">
					<el-input v-model="editForm.name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item prop="img" label="图片" label-width="120px">
					<Upload :url='editForm.img' @success='handleUploadSuccess($event)' @remove='editForm.img=""'></Upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editModalShow = false">取 消</el-button>
				<el-button type="primary" @click="handleUploadNode('editForm')">保 存</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { Classify } from '@/api/index';
	import Upload from '@/components/Upload.vue';
	export default {
		components: {
			Upload,
		},
		data() {
			return {
				defaultProps: {
					label: 'name'
				},
				insertForm: {
					name: '',
					pId: '',
					img: '',
				},
				editForm: {
					id: '',
					name: '',
					img: '',
				},
				nodeData: {}, //节点数据
				node: {}, //节点
				insertModalShow: false,
				editModalShow: false,
				rules: {
					name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
					img: [{ required: true, message: '请上传图片', trigger: 'blur' }],
				},
			};
		},
		methods: {
			async loadNode(node, resolve) {
				// node:节点对象
				//resolve: 返回节点数据的方法
				if (node.level === 0) {
					let { status, data } = await Classify.list({ pId: 0 });
					return resolve(data);
				}
				//父级节点pid
				let pId = node.data.id;
				//获取子级节点
				let { status, data } = await Classify.list({ pId });
				if (status) {
					return resolve(data);
				}
			},
			// 打开编辑model
			openEditModal(node, data) {
				this.editForm = { ...data };
				this.node = node;
				this.editModalShow = true;
			},
			// //编辑节点
			handleUploadNode(formName) {
				//1.表单校验
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						//2.ajax
						let { status, msg } = await Classify.edit({ ...this.editForm });
						if (status) {
							this.$message.success(msg);
							//更新节点
							this.node.data = this.editForm;
							this.editModalShow = false;
						}
					} else {
						this.$message.info('未编辑成功!');
						return false;
					}
				});

			},
			// //打开插入model
			openInsertModal(node, data) {
				//node：节点   data:节点数据
				// console.log(node);// console.log(data);
				//转存node
				this.node = node;

				this.insertForm.pId = data.id;
				this.insertModalShow = true;
			},
			// //插入节点
			handleInsertNode(formName) {
				//1.表单校验
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						//2.ajax
						let { status, msg, data } = await Classify.insert({ ...this.insertForm });
						if (status) {
							this.$message.success(msg);
							//插入新的节点
							this.$refs.tree.append({ ...data, ...this.insertForm }, this.node);
							this.insertModalShow = false;
							this.insertForm.name = '';
						}
					} else {
						this.$message.info('未添加成功!');
						return false;
					}
				});
			},
			// //删除节点
			remove(node, data) {
				this.$confirm('此操作将永久删除该分类, 是否继续?', '删除用户', {
					type: 'warning'
				}).then(async () => {
					let { status } = await Classify.remove({ id: data.id });
					if (status) {
						//更新DOM
						this.$refs.tree.remove({ id: data.id })
						this.$message.success('删除成功!');
					}
				}).catch(() => {
					this.$message.info('取消删除');
				});
			},
			//头像上传成功
			handleUploadSuccess(res) {
				console.log(res);
				this.editForm.img = res.src;
				this.insertForm.img = res.src;
			},
		}
	};
</script>

<style scoped>
	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
	}
</style>
