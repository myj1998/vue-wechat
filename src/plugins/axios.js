import axios from 'axios';
//Loading服务方式//message 服务
import { Loading, Message } from 'element-ui';
//路由实例
import router from '@/router/index'
//loading实例
let loading;

//设置默认baseurl
axios.defaults.baseURL = 'http://localhost:3003';
// 添加请求拦截器
axios.interceptors.request.use(function(config) {
	//在发送请求之前做什么
	// console.log(config);
	//开启loading
	loading = Loading.service({ background: 'rgba(0,0,0,0.3)' });
	//判断是否携带token
	if (config.url == 'admin/register' || config.url == 'admin/login') {
		return config;
	}
	//获取携带的token
	let token = sessionStorage.token;
	//无token值时
	// if (!token) {
	// 	Message.error('无效的Token啊，请重新登陆!');
	// 	//跳转路由
	// 	setTimeout(() => {
	// 		loading.close();
	// 		router.replace('/login');
	// 	}, 2000);
	// }
	// 有token值时
	config.headers.Authorization = `Bearer ${token}`;
	return config;
}, function(error) {
	// 对响应错误做点什么
	return Promise.reject(error);
});
// 添加响应拦截器
axios.interceptors.response.use(function(response) {
	let { data, status } = response;
	//关闭loading
	setTimeout(function() {
		loading.close();
	}, 500);
	//判断后台返回数据携带的状态码
	return data;
}, function(error) {
	// 对响应错误做点什么
	return Promise.reject(error);
});

