import axios from 'axios';

//商品列表
let list = (data) => axios.get('/api/admin/goods/list', { params: data });
//删除商品
let remove = (id) => axios.delete('/api/admin/goods', { params: id });
//编辑
let edit = (data) => axios.put('/api/admin/goods', data);
//发布商品
let register = (data) => axios.post('/api/admin/goods', data);
//获取详情
let acquire = (data) => axios.get('/api/admin/goods', { params: data });

export default {
	list,
	acquire,
	remove,
	edit,
	register
}
