<template>
	<div class="release">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>发布新商品</span>
			</div>
			<el-form ref="form" :model="form" label-width="100px" :rules="rules">
				<el-form-item label="商品分类" prop="cate_1st">
					<el-select v-model.number="form.cate_1st">
						<el-option v-for="item in category_1st" :label='item.name' :value="item.id" :key="item.id"></el-option>
					</el-select>
					<el-select v-model.number="form.cate_2nd">
						<el-option v-for="item in category_2nd" :label='item.name' :value="item.id" :key="item.id"></el-option>
					</el-select>
					<el-select v-model.number="form.cate_3rd">
						<el-option v-for="item in category_3rd" :label='item.name' :value="item.id" :key="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="商品名称" prop="name">
					<el-input v-model="form.name"></el-input>
					<div class="remind">商品标题名称长度至少是3个字符，最长是200个汉字</div>
				</el-form-item>
				<el-form-item label="商品卖点" prop="hotPoint">
					<el-input type="textarea" v-model="form.hotPoint"></el-input>
					<div class="remind">商品卖点不能超过140个汉字</div>
				</el-form-item>
				<el-form-item label="商品价格" prop="price">
					<el-input v-model.number="form.price">
						<template slot="append">元</template>
					</el-input>
					<div class="remind">价格必须是0-999999之间的数字，且不能高于市场估价</div>
					<div class="remind">此价格为商品实际销售价格，如果商品存在规格，改价格显示最低价格</div>
				</el-form-item>
				<el-form-item label="市场价" prop="marketPrice">
					<el-input v-model.number="form.marketPrice">
						<template slot="append">元</template>
					</el-input>
					<div class="remind">价格必须是0-999999之间的数字，此价格今为市场参考价，请根据实际情况认真填写</div>
				</el-form-item>
				<el-form-item label="成本价" prop="cost">
					<el-input v-model.number="form.cost">
						<template slot="append">元</template>
					</el-input>
					<div class="remind">价格必须是0-999999之间的数字，且不能高于市场估价此价格为商品实际销售价格，此价格为商户对所销售的商品的世纪成本进行备注记录，非必填，不会在前台的销售页面中显示</div>
				</el-form-item>
				<el-form-item label="折扣" prop="discount">
					<el-input v-model.number="form.discount">
						<template slot="append">折</template>
					</el-input>
					<div class="remind">根据销售与市场价比例自定生成不需要编辑</div>
				</el-form-item>
				<el-form-item label="商品库存" prop="inventory">
					<el-input v-model.number="form.inventory">
						<template slot="append">件</template>
					</el-input>
					<div class="remind">价格必须是0-999999之间的整数</div>
					<div class="remind">若是启动了库存配置，则系统自动计算商品的证书，此处无需卖家填写</div>
				</el-form-item>
				<el-form-item label="商品货号" prop="articleNo">
					<el-input v-model="form.articleNo">
					</el-input>
					<div class="remind">商品货号是商家管理商品的编号，买家不可见</div>
					<div class="remind">最多输入20个字符，值支持输入中文、字母、数字、_、/、-和小数点</div>
				</el-form-item>
				<!-- 商品主图  组件 -->
				<el-form-item label="商品主图" prop="img_lg">
					<el-upload class="avatar-uploader" action="/api/upload/goods" :show-file-list="false" :on-success="handleAvatarSuccess"
					 :before-upload="beforeAvatarUpload">
						<img v-if="form.img_lg" :src="form.img_lg" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
					<div class="remind">
						上传商品默认主图，如果规格时将默认图片或分规格上传，支持jpg、if、平、格式上传或从上传图片空间中选中，
						建议使用尺寸800*800像素以上，大小不超过1M的正方形图片，上传后的图片价格自动保存在图片空间的默认分类中。
					</div>
				</el-form-item>

				<el-form-item label="商品轮播图" prop="slider">
					<el-upload action="/api/upload/slider" :file-list="photo" list-type="picture-card" :on-preview="handlePictureCardPreview"
					 :on-success="sliderSuccess" :on-remove="handleRemove">
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible">
						<img width="100%" :src="form.slider" alt="">
					</el-dialog>
				</el-form-item>
				<el-row>
					<el-col :span="24">
						<div class="grid-content bg-purple-dark">商品详情描述</div>
					</el-col>
				</el-row>
				<el-form-item label="商品品牌" prop="brand">
					<el-input v-model="form.brand" style="width:60%;"></el-input>
				</el-form-item>
				<el-form-item label="商品描述" prop="detail">
					<div ref="editor" style="height: auto;"></div>
				</el-form-item>
				<el-row>
					<el-col :span="24">
						<div class="grid-content bg-purple-dark">商品物流信息</div>
					</el-col>
				</el-row>
				<el-form-item label="所在地">
					<el-select v-model="address.province">
						<el-option v-for="item in getprovince" :label="item.name" :value="item.province_id"></el-option>
					</el-select>
					<el-select v-model="address.city">
						<el-option v-for="item in getcity" :label="item.name" :value="item.city_id"></el-option>
					</el-select>
					<el-select v-model="form.country">
						<el-option v-for="item in getcountry" :label="item.name" :value="item.country_id"></el-option>
					</el-select>
					<!-- <el-select v-model="form.town">
						<el-option v-for="item in gettown" :label="item.name" :value="item.town_id"></el-option>
					</el-select> -->
				</el-form-item>
				<el-form-item label="运费" prop="freight">
					<el-input v-model.number="form.freight">
						<template slot="append">元</template>
					</el-input>
					<div class="remind">
						运费设为0，前台商品将显示免运费。
					</div>
				</el-form-item>
				<el-form-item>
					<el-button type="success" @click="submitForm('form')">立即创建</el-button>
				</el-form-item>
			</el-form>
		</el-card>

	</div>
</template>

<script>
	import E from 'wangeditor';
	import { Product } from '@/api/index'
	import { Province } from '@/api/index'
	import { Classify } from '@/api/index'
	export default {
		props: ['id'],
		data() {
			return {
				form: {
					cate_1st: '',
					cate_2nd: '',
					cate_3rd: '',
					name: '',
					hotPoint: '',
					price: 0,
					marketPrice: 0,
					cost: 0,
					discount: '',
					inventory: '',
					articleNo: '',
					img_lg: '',
					img_md: '',
					slider: '',
					brand: '',
					detail: '',
					freight: 0,
				},
				address: {
					province: '',
					city: '',
					country: '',
					town: ''
				},
				photo: [],
				category_1st: [],
				category_2nd: [],
				category_3rd: [],
				getprovince: [],
				getcity: [],
				getcountry: [],
				gettown: [],
				//商品轮播图
				dialogImageUrl: '',
				dialogVisible: false,
				rules: {
					cate_1st: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
					name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
					hotPoint: [{ required: true, message: '请输入商品卖点', trigger: 'blur' }],
					price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
					marketPrice: [{ required: true, message: '请输入商品市场价', trigger: 'blur' }],
					cost: [{ required: true, message: '请输入商品成本价', trigger: 'blur' }],
					discount: [{ required: true, message: '请输入商品折扣', trigger: 'blur' }],
					inventory: [{ required: true, message: '请输入商品库存', trigger: 'blur' }],
					articleNo: [{ required: true, message: '请输入商品货号', trigger: 'blur' }],
					img_lg: [{ required: true, message: '请选择商品主图', trigger: 'blur' }],
					slider: [{ required: true, message: '请选择商品轮播图', trigger: 'blur' }],
					brand: [{ required: true, message: '请选择商品品牌', trigger: 'blur' }],
					detail: [{ required: true, message: '请选择商品详情', trigger: 'blur' }],
					freight: [{ required: true, message: '请输入商品邮费', trigger: 'blur' }],
				},
			}
		},
		async created() {

			let resolve = await Province.getProvince();
			this.getprovince = resolve.data;
			this.address.province = resolve.data[0].province_id;

			let { data, msg, status } = await Classify.list({ pId: 1 });
			this.category_1st = data;
			this.form.cate_1st = data[0].id;
		},
		async mounted() {
			let id = this.id;
			let res = await Product.acquire({ id });
			this.form = res.data;
			var editor = new E(this.$refs.editor)
			editor.customConfig.onchange = (html) => {
				this.form.detail = html;
			}
			editor.create()
			editor.txt.html(this.form.detail);


			this.form.slider = this.form.slider.split(',');
			this.form.slider.forEach((item, idx) => {
				if (item !== "") {
					this.photo[idx] = {
						url: item
					}
					this.$set(this.photo, idx, this.photo[idx]);
				}
			})
		},
		watch: {
			'form.cate_1st': async function(val) {
				let res = await this.loadSubcate(val);
				this.category_2nd = res;
				this.form.cate_2nd = res[0].id;
			},
			'form.cate_2nd': async function(val) {
				let res = await this.loadSubcate(val);
				this.category_3rd = res;
				this.form.cate_3rd = res[0].id;
			},
			'address.province': async function(val) {
				let id = val
				let { data, msg, status } = await Province.getCity({ id });
				this.getcity = data;
				this.address.city = data[0].city_id;
			},
			'address.city': async function(val) {
				let id = val
				let { data, msg, status } = await Province.getCountry({ id });
				this.getcountry = data;
				this.address.country = data[0].city_id;
			},
			// 'address.country':async function(val){
			// 	let id = val
			// 	let {data,msg,status} = await province.getTown({id});
			// 	this.gettown =  data;
			// 	this.address.town = data[0].town_id;
			// }
		},
		methods: {
			async loadSubcate(pId) {
				let { status, data } = await Classify.list({ pId });
				return data;
			},
			onSubmit() {
				console.log('submit!');
			},
			// 商品主图
			handleAvatarSuccess(res, file) {
				this.imageUrl = URL.createObjectURL(file.raw);
				this.form.img_lg = res.lgImg;
				console.log(res);
				this.form.img_lg = res.lgImg;
				this.form.img_md = res.mdImg;
			},
			beforeAvatarUpload(file) {
				console.log(file)
				const isJPG = file.type === 'image/jpeg';
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isJPG) {
					this.$message.error('上传头像图片只能是 JPG 格式!');
				}
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isJPG && isLt2M;
			},
			//商品轮播图
			handleRemove(file, fileList) {
				let src = '';
				fileList.forEach((item) => {
					src += (item.url + ',');
				})
				this.form.slider = src;
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			//轮播图上传
			sliderSuccess(res, file) {
				console.log(res);
				let { status, src, msg } = res;
				this.form.slider += (src + ',');
				console.log(this.form.slider);
			},
			handlePreview(file) {
				console.log(file);
			},
			//修改
			submitForm(formName) {

				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						var src = '';
						this.form.slider.forEach((item) => {
							src += item;
						})
						this.form.slider = src;
						let { status, msg } = await Product.edit({ ...this.form });
						if (status) {
							this.$message.success(msg);
							this.$router.back(-1)
						}
					} else {
						this.$message.info('未提交成功!');
						return false;
					}
				});
			},
		}
	}
</script>

<style>
	.text {
		font-size: 14px;
	}

	.item {
		margin-bottom: 18px;
	}

	.clearfix:before,
	.clearfix:after {
		display: table;
		content: "";
	}

	.clearfix:after {
		clear: both
	}

	.el-pagination {
		float: right;
		padding: 20px 0;
	}

	.release .el-input {
		width: 150px;
	}

	.remind {
		font-size: 12px;
		color: #999;
	}

	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 148px;
		height: 148px;
		line-height: 148px;
		text-align: center;
	}

	.avatar {
		width: 148px;
		height: 148px;
		display: block;
	}

	.avatar-uploader {
		width: 148px;
		border: 1px dashed #c0ccda;
		border-radius: 6px;
	}


	.el-row {
		background-color: #f5f5f5;
		padding: 10px;
		margin-bottom: 10px;
	}

	.w-e-text-container {
		height: auto !important;
	}
</style>
