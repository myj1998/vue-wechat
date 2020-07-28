<template>
	<el-card class="box-card">
		<div slot="header" class="clearfix">
			<span>用户列表</span>
		</div>
		<el-table :data="tableData" style="width: 100%">
			<el-table-column prop="id" label="#">
			</el-table-column>
			<el-table-column prop="avatar" label="头像">
				<template slot-scope="scope">
					<el-image style="height: 60px; width: 60px; border-radius:50px ;" :src="scope.row.avatar"></el-image>
				</template>
			</el-table-column>
			<el-table-column prop="username" label="账号" width="120">
			</el-table-column>
			<el-table-column prop="fullname" label="姓名" width="150">
			</el-table-column>
			<el-table-column prop="sex" label="性别">
			</el-table-column>
			<el-table-column prop="tel" label="手机" width="150">
			</el-table-column>
			<el-table-column prop="role_name" label="角色" width="140">
				<template slot-scope="scope">
					<div slot="reference" class="name-wrapper">
						<el-tag size="medium">{{ scope.row.role_name }}</el-tag>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="login_time" label="上次登陆" width="180">
			</el-table-column>
			<el-table-column prop="login_count" label="登录次数">
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button type="primary" plain icon="el-icon-edit" size="mini" @click='openEditModal(scope.$index)'></el-button>
					<el-button type="danger" :disabled="scope.row.id===1" plain icon="el-icon-delete" size="mini" @click="removeUser(scope.row.id,scope.$index)"></el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-dialog title="修改信息" :visible.sync="editModalShow">
			<el-form :model="editForm" :rules="rules" ref="editForm">
				<el-form-item prop="fullname" label="姓名" label-width="120px">
					<el-input v-model="editForm.fullname" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别" prop="sex" label-width="120px">
					<el-radio-group v-model="editForm.sex">
						<el-radio label="男">男</el-radio>
						<el-radio label="女">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item prop="tel" label="电话" label-width="120px">
					<el-input v-model="editForm.tel" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item prop="role_name" label="权限" label-width="120px">
					<el-select v-model="editForm.role_name">
						<el-option v-for="item in Limitslist" :value="item.name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop="avatar" label="头像" label-width="120px">
					<Upload :url='editForm.avatar' @success='handleUploadSuccess($event)' @remove='editForm.avatar=""'></Upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click='cancel'>取 消</el-button>
				<el-button type="primary" @click="handleUpdateNode('editForm')">保 存</el-button>
			</div>
		</el-dialog>

	</el-card>

</template>

<script>
	import { User } from '@/api/index';
	import { Limits } from '@/api/index';
	import Upload from '@/components/Upload.vue';

	export default {
		components: {
			Upload,
		},
		data() {
			return {
				tableData: [],
				editModalShow: false,
				Limitslist: [],
				editForm: {
					fullname: '',
					avatar: '',
					tel: '',
					role_name: '',
					email: '',
					sex: "",
					role: ''
				},
				idx: 0,
				rules: {
					fullname: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
					sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
					tel: [
						{ required: true, type: 'string', message: '请输入手机号', trigger: 'blur' },
						{ pattern: /^1(3|4|5|6|7|8)\d{9}$/, message: '请输入合法手机号', trigger: 'blur' }
					],
					role_name: [{ required: true, message: '请选择权限', trigger: 'blur' }]
				},
			}
		},
		created() {
			//生命周期获取数据
			this.loadList();
		},
		methods: {
			//删除
			removeUser(id, index) {
				this.$confirm('此操作将永久删除该用户, 是否继续?', '删除用户', {
					type: 'warning'
				}).then(async () => {
					let { status, data } = await User.remove({ id });
					if (status) {
						//更新DOM
						this.tableData.splice(index, 1);
						this.$message.success('删除成功!');
					}
				}).catch(() => {
					this.$message.info('取消删除');
				});
			},
			async openEditModal(idx) {
				this.idx = idx;
				this.editModalShow = true
				this.editForm = this.tableData[idx];
				//获取角色列表
				let { data, status } = await Limits.list();
				this.Limitslist = data;
			},
			cancel() {
				this.editModalShow = false;
			},
			handleUpdateNode(formName) {
				//1.表单校验
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						//2.ajax
						let { status, msg } = await User.edit({ ...this.editForm });
						if (status) {
							this.$message.success(msg);
							this.Limitslist[this.idx] = this.editForm;
							this.editModalShow = false;
						}
					} else {
						this.$message.info('未编辑成功!');
						return false;
					}
				});
			},

			//头像上传成功
			handleUploadSuccess(res) {
				console.log(res);
				this.editForm.avatar = res.src;
			},

			//封装一个方法
			async loadList() { /* 加载列表数据 */
				let { status, data, msg } = await User.list();
				if (status) {
					this.tableData = data;
				}
			},
		}
	}
</script>

<style scoped>

</style>
