<template>
	<div class="bg">
		<el-card class="login-card">
			<div slot="header" class="clearfix">
				<span>登录</span>
			</div>
			<el-form ref="form" :model="form" :rules="rules" label-width="60px">
				<el-form-item label="账户" prop="username">
					<el-input v-model="form.username" prefix-icon="el-icon-user" placeholder="请输入账户名!"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="form.password" prefix-icon="el-icon-key" placeholder="请输入密码" show-password></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleLogin('form')">登录</el-button>
				</el-form-item>
				<div class="active-box">
					<router-link to="/register">注册账户</router-link>
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
			return {
				form: {
					username: '',
					password: '',
				},
				rules: {
					username: [
						{ required: true, message: '请输入账户名称', trigger: 'blur' },
						{ min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
					],
					password: [
						{ required: true, type: 'string', message: '请输入密码', trigger: 'blur' },
						{ pattern: /^\d{3,}$/, message: '密码长度最少 3 个数字', trigger: 'blur' } /* pattern用来验证正则表达书 */
					]
				}
			}
		},
		methods: {
			handleLogin(formName) {
				// 表单验证 
				// async紧跟在await的前面
				this.$refs[formName].validate(async (valid) => {
					if (!valid) {
						// 校验失败
						return false;
					}
					// 获取表单数据发送ajax
					let { status, msg, data } = await Admin.login({ ...this.form });
					if (status) {
						// 登陆成功储存Token,id,editRole
						sessionStorage.token = data.token;
						sessionStorage.uid = data.id;
						sessionStorage.role = data.role;
						// 成功提示
						this.$message.success(msg);
						this.$router.replace('/product/list');

					} else {
						this.$message.error(msg);
					}

				});
			}
		}
	}
</script>

<style scoped>
	/* scoped的意思是 防止其他页面的 重名的css相互影响  scoped是独立为一个新的代码块 */
	.bg {
		height: 100vh;
		background: url(../assets/img/login-bg.jpg) top center no-repeat;
		background-size: cover;
		position: relative;
	}

	.login-card {
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
