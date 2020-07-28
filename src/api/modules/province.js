import axios from 'axios';

//获取所有省份
let getProvince = (data) => axios.get('/api/pcct/province', { params: data });

//获取城市
let getCity = (data) => axios.get('/api/pcct/city', { params: data });

//获取县区
let getCountry = (data) => axios.get('/api/pcct/county', { params: data });

export default {
	getProvince,
	getCity,
	getCountry,
}
