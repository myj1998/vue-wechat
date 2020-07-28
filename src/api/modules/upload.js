import axios from 'axios';

//删除图片(封装)
let remove = (data) => axios.delete('/api/upload', { params: data });
//轮播图上传
let slider = (data) => axios.post('/api/upload/slider', data);
export default {
	remove,
	slider
}
