import axios from 'axios';

//��Ʒ�б�
let list = (data) => axios.get('/api/admin/goods/list', { params: data });
//ɾ����Ʒ
let remove = (id) => axios.delete('/api/admin/goods', { params: id });
//�༭
let edit = (data) => axios.put('/api/admin/goods', data);
//������Ʒ
let register = (data) => axios.post('/api/admin/goods', data);
//��ȡ����
let acquire = (data) => axios.get('/api/admin/goods', { params: data });

export default {
	list,
	acquire,
	remove,
	edit,
	register
}
