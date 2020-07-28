<template>
	<router-view></router-view><!-- 路由配置到的组件渲染到这个地方-->
</template>

<script>
	export default {
		name: 'app',
	}
</script>

<style>
	/* 主管公共类 */
	body,
	html {
		padding: 0;
		margin: 0;
		height: 100%;
		width: 100%;
	}

	a {
		color: #666;
		text-decoration: none;
	}
</style>
