import axios from 'axios';

//登录  (封装)
let login = (data) => axios.post('/api/admin/login', data);

//注册 (封装)
let register = (data) => axios.post('/api/admin/register', data);

//外包(供外部使用)
export default {
	login,
	register,
}
