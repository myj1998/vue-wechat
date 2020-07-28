import Vue from 'vue'
import VueRouter from 'vue-router'

//引入message来提示用户
import { Message } from 'element-ui';

Vue.use(VueRouter)
//这些东西是为了防止重复点击某一左侧边栏菜单的时候出现错误(错误原因是vue-router版本太新)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}

import Layout from '@/components/Layout.vue';

const routes = [{
		path: '/login',
		name: 'Login',
		alias: '/',
		component: () => import('@/views/Login.vue'),
		meta: { requiresAuth: false }
	},
	{
		path: '/register',
		name: 'Register',
		component: () => import('@/views/Register.vue'),
		meta: { requiresAuth: false }
	},
	{
		path: '/product/',
		name: 'Product',
		component: Layout,
		meta: { requiresAuth: true },
		children: [{
				path: 'list',
				name: 'ProductList',
				component: () => import('@/views/Product/List.vue')
			},
			{
				path: 'classify',
				name: 'ProductClassify',
				component: () => import('@/views/Product/Classify.vue'),
			},
			{
				path: 'put',
				name: 'ProductPut',
				component: () => import('@/views/Product/Put.vue'),
			},
			{
				path: 'edit/:id',
				name: 'ProductEdit',
				component: () => import('@/views/Product/Edit.vue'),
				props: true,
			},
		]
	},
	{
		path: '/account/',
		name: 'Account',
		component: Layout,
		meta: { requiresAuth: true },
		children: [{
			path: 'edit',
			name: 'AccountEdit',
			component: () => import('@/views/Account/Edit.vue')
		}, ]
	},
	{
		path: '/user/',
		name: 'User',
		component: Layout,
		meta: { requiresAuth: true },
		children: [{
			path: 'list',
			name: 'UserList',
			component: () => import('@/views/User/List.vue')
		}, ]
	},
	{
		path: '/order/',
		name: 'Order',
		component: Layout,
		meta: { requiresAuth: true },
		children: [{
			path: 'list',
			name: 'OrderList',
			component: () => import('@/views/Order/List.vue')
		}, ]
	},
	{
		path: '/limits/',
		name: 'Limits',
		component: Layout,
		meta: { requiresAuth: true },
		children: [{
			path: 'role',
			name: 'LimitsRole',
			component: () => import('@/views/Limits/Role.vue')
		}, ]
	},
	{
		path: '/menu/',
		name: 'Menu',
		component: Layout,
		meta: { requiresAuth: true },
		children: [{
			path: 'List',
			name: 'MenuList',
			component: () => import('@/views/Menu/List.vue')
		}, ]
	},
]

const router = new VueRouter({
	routes
})

//全局守卫
router.beforeEach((to, from, next) => {
	//根据meta元信息校验该地址是否需要授权
	let isrequiresAuth = to.matched.some((path) => path.meta.requiresAuth);
	//不需要登录授权，直接放行
	if (!isrequiresAuth) {
		next();
		return;
	}
	//校验Token (登录、注册不进行校验，直接放行（直接检测路由的name）)
	if (to.name == "Login" || to.name == "Register") {
		next();
		return;
	}
	let token = sessionStorage.token;
	//有Token，立即放行
	if (token) {
		next();
		return;
	}
	//无Token 强制跳转登录
	Message.error('无效的Token，请重新登录!');
	setTimeout(() => {
		next(`/login?redirect=${to.path}`);
	}, 2000);
});

export default router
