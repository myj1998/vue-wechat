<template>
	<div class="bg">
		<el-card class="register-card">
			<div slot="header" class="clearfix">
				<span>注册账户</span>
			</div>
			<el-form :model="form" :rules="rules" ref="form" label-width="70px">
				<el-form-item label="账户" prop="username">
					<el-input v-model="form.username" prefix-icon="el-icon-user" placeholder="请输入账户名!"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="form.password" prefix-icon="el-icon-key" placeholder="请输入密码" show-password></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="checkPass">
					<el-input v-model="form.checkPass" prefix-icon="el-icon-key" placeholder="请再次输入密码" show-password></el-input>
				</el-form-item>
				<el-form-item label="姓名" prop="fullname">
					<el-input v-model="form.fullname" prefix-icon="el-icon-user-solid" placeholder="请输入姓名!"></el-input>
				</el-form-item>
				<el-form-item label="性别" prop="sex">
					<el-radio-group v-model="form.sex">
						<el-radio label="男" name="sex"></el-radio>
						<el-radio label="女" name="sex"></el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="手机" prop="tel">
					<el-input v-model="form.tel" prefix-icon="el-icon-phone-outline" placeholder="请输入手机号"></el-input>
				</el-form-item>
				<el-form-item prop="type">
					<el-checkbox v-model="form.type">同意本站用户协议</el-checkbox>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleRegister('form')">注册</el-button>
				</el-form-item>
				<div class="active-box">
					<router-link to="/login">登录账户</router-link>
					<router-link to="/register">忘记密码?</router-link>
				</div>
			</el-form>
		</el-card>
	</div>
</template>

<script>
	import { Admin } from '@/api/index'

	export default {
		data() {
			var handleCheckPass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.form.password) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			var handleCheckBox = (rule, value, callback) => {
				if (value === false) {
					callback(new Error('请选中框框'));
				} else {
					this.form.type = true;
					callback();
				}
			};
			return {
				form: {
					username: '',
					password: '',
					checkPass: '',
					fullname: '',
					sex: '',
					tel: '',
					type: false,
				},
				rules: {
					username: [
						{ required: true, type: 'string', message: '请输入账户名称', trigger: 'blur' },
						{ min: 1, max: 5, message: '账户名称长度在 1 到 5 个字符', trigger: 'blur' }
					],
					password: [
						{ required: true, type: 'string', message: '请输入密码', trigger: 'blur' },
						{ pattern: /^\d{3,}$/, message: '密码长度最少 3 个数字', trigger: 'blur' } /* pattern用来验证正则表达书 */
					],
					checkPass: [
						{ validator: handleCheckPass, trigger: 'blur' } /* pattern用来验证正则表达书  validator来通过函数判断*/
					],
					fullname: [
						{ required: true, type: 'string', message: '请输入昵称', trigger: 'blur' },
						{ min: 2, max: 5, message: '昵称名称长度在 2 到 5 个字符', trigger: 'blur' }
					],
					sex: [
						{ required: true, message: '请选择性别', trigger: 'change' }
					],
					tel: [
						{ required: true, type: 'string', message: '请输入手机号', trigger: 'blur' },
						{ pattern: /^1(3|4|5|6|7|8)\d{9}$/, message: '请输入合法手机号', trigger: 'blur' }
					],
					type: [
						{ validator: handleCheckBox, trigger: 'blur' } /* pattern用来验证正则表达书  validator来通过函数判断*/
					]
				},
			}
		},
		methods: {
			handleRegister(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (!valid) {
						return false;
					}
					let { status, msg, data } = await Admin.register({ ...this.form });

					if (status) {
						this.$message.success(msg);
						// 跳转到登录页面
						this.$router.replace('/login');
						// 登陆成功储存Token,id,editRole
						sessionStorage.token= data.token;
						sessionStorage.uid = data.id;
						sessionStorage.role = data.role;
					} else {
						this.$message.error(msg);
					}
				});
			}
		}
	}
</script>

<style scoped>
	.bg {
		height: 100vh;
		background: url(../assets/img/login-bg.jpg) top center no-repeat;
		background-size: cover;
		position: relative;
	}

	.register-card {
		position: absolute;
		right: 80px;
		top: 50%;
		transform: translateY(-50%);
	}

	.active-box {
		font-size: 13px;
		color: #ccc;
		display: flex;
		justify-content: space-between;
	}
</style>
