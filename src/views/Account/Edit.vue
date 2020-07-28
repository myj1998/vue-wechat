<template>
	<el-card class="box-card">
		<div slot="header" class="clearfix">
			<span>账户信息</span>
		</div>
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" label-position='left' class="demo-ruleForm el-form">
			<el-form-item label="账户">
				<el-input v-model="ruleForm.username" disabled></el-input>
			</el-form-item>

			<el-form-item label="姓名" prop="fullname">
				<el-input v-model="ruleForm.fullname"></el-input>
			</el-form-item>

			<el-form-item label="性别" prop="sex">
				<el-radio-group v-model="ruleForm.sex">
					<el-radio label="男"></el-radio>
					<el-radio label="女"></el-radio>
				</el-radio-group>
			</el-form-item>

			<el-form-item label="手机" prop="tel">
				<el-input v-model="ruleForm.tel"></el-input>
			</el-form-item>

			<el-form-item label="权限" prop="role">
				<el-select v-model="ruleForm.role" placeholder="请选择">
					<el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="头像" prop="avatar">
				<Upload :url='ruleForm.avatar' @success='handleUploadSuccess($event)' @remove='ruleForm.avatar=""'></Upload>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
			</el-form-item>

		</el-form>
	</el-card>
</template>

<script>
	import { Limits } from '@/api/index';

	import { User } from '@/api/index';
	import Upload from '@/components/Upload.vue';

	export default {
		components: {
			Upload
		},
		data() {
			var checkphone = (rule, value, callback) => {
				if (value == "") {
					callback(new Error("请输入手机号"));
				} else if (!this.isCellPhone(value)) { //引入methods中封装的检查手机格式的方法
					callback(new Error("请输入正确的手机号!"));
				} else {
					callback();
				}
			};
			return {
				roleList: [], //角色列表
				ruleForm: {
					username: '',
					fullname: '',
					sex: '',
					tel: '',
					role: '',
					avatar: '',
				},
				rules: {
					username: [
						{ required: true, message: '请输入活动名称', trigger: 'blur' },
						{ min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
					],
					fullname: [
						{ required: true, message: '请输入姓名', trigger: 'blur' },
						{ min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
					],
					sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
					tel: [{ required: true, message: '请输入手机号', trigger: 'blur' },
						{ validator: checkphone, message: '请输入正确格式的手机号', trigger: 'blur' }
					],
					role_name: [
						{ type: 'array', required: true, message: '请至少选择一个角色', trigger: 'change' }
					],
					avatar: [{ required: true, message: '请选择图片', trigger: 'change' }],
				}
			};
		},
		created() {
			this.loadList();
			this.loadRoleList();
		},
		watch: {
			'$route'(to, from) {
				let { id } = to.params;
				this.loadList(id);
			}
		},
		methods: {
			//获取角色列表信息
			async loadRoleList() { /* 加载列表数据 */
				let { status, data } = await Limits.list();
				if (status) {
					this.roleList = data;
				}
			},
			//获取信息
			async loadList() {
				let id = sessionStorage.uid;
				let { status, data } = await User.info({ id });
				if (status) {
					this.ruleForm = data;
				}
			},

			//头像上传成功
			handleUploadSuccess(res) {
				this.ruleForm.avatar = res.src;
			},

			//编辑个人信息
			submitForm(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						let { status, msg } = await User.edit(this.ruleForm);
						if (status) {
							this.$message.success('修改成功!');
							//更新DOM
							this.loadList();
						}
					}
				});
			},
			//手机号验证
			isCellPhone(val) {
				if (!/^1(3|4|5|6|7|8)\d{9}$/.test(val)) {
					return false;
				} else {
					return true;
				}
			},
		}
	}
</script>

<style scoped>
	.el-form {
		margin: 0 auto;
		width: 70%;
	}
</style>
