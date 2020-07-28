import axios from "axios";

//获取子菜单
let list = (data) => axios.get('/api/menu/sub', { params: data });
//删除
let remove = (data) => axios.delete('/api/menu', { params: data });
//编辑  
let edit = (data) => axios.put('/api/menu', data);
//添加
let add = (data) => axios.post('/api/menu', data);

export default {
	list,
	remove,
	edit,
	add
}
