import axios from 'axios';

//删除角色 (封装)
let remove = (id) => axios.delete('/api/role', { params: id });

// 编辑角色信息 (封装)post方法
let edit = (data) => axios.put('/api/role', data);

//添加角色
let insert = (data) => axios.post('/api/role', data);

//获取角色列表
let list = (data) => axios.get('/api/role/list', { params: data });

//获取右侧菜单
let config = (id) => axios.get('/api/role/config', { params: id })

//为角色添加菜单
let menuAdd = (data) => axios.post('/api/role/menu', data)
//为角色删除菜单
let menuDel = (data) => axios.delete('/api/role/menu', { params: data })

export default {
	remove,
	edit,
	insert,
	list,
	config,
	menuAdd,
	menuDel
}
