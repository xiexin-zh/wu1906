<template>
	<view>
		<parent-face v-if="currentUserType === '16'"></parent-face>
		<teacher-face v-if="currentUserType === '4'"></teacher-face>
	</view>
</template>

<script>
	import { store } from '@store'
	import parentFace from './component/parentFace.vue'
	import teacherFace from './component/teacherFace.vue'
	export default {
		components: {
			parentFace,
			teacherFace
		},
		computed: {
			currentUserType: () => store.currentUserType
		}
	}
</script>

<style>
</style>
