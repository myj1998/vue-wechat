import axios from 'axios';

//获取子级分类
let list = (data) => axios.get('/api/category/sub', { params: data });

//编辑分类
let edit = (data) => axios.put('/api/category', data);

//添加分类
let insert = (data) => axios.post('/api/category', data);

//删除分类 
let remove = (id) => axios.delete('/api/category', { params: id });

export default {
	list,
	edit,
	insert,
	remove
}
