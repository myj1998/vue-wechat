import axios from 'axios';

//管理员列表 
let list = (data) => axios.get('/api/admin/list', { params: data });

//管理员个人资料 (封装)get方法
let info = (data) => axios.get('/api/admin', { params: data }); //get传参 必须后面是对象

//删除管理员角 (封装)
let remove = (id) => axios.delete('/api/admin', { params: id });

// 编辑管理员信息 (封装)post方法
let edit = (data) => axios.put('/api/admin', data);

export default {
	list,
	info,
	remove,
	edit,
}
