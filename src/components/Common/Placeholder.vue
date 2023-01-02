<template>
	<b-card class="mb-4 summary-card-bg">
		<b-row class="pb-3" v-if="isFavorites">
			<b-col sm="12">
				<b-skeleton :animation="animation"></b-skeleton>
			</b-col>
		</b-row>
		<b-row class="mx-0">
			<b-col sm="2" class="px-0">
				<b-skeleton
					variant="dark"
					:animation="animation"
					type="avatar"
				></b-skeleton>
			</b-col>
			<b-col sm="8" :class="{ 'col-sm-10': isFavorites }">
				<b-skeleton :animation="animation"></b-skeleton>
				<b-skeleton :animation="animation"></b-skeleton>
				<b-skeleton :animation="animation" v-if="isFavorites"></b-skeleton>
			</b-col>
			<b-col sm="2" class="px-0" v-if="!isFavorites">
				<b-skeleton
					:animation="animation"
					type="button"
					width="100%"
				></b-skeleton>
			</b-col>
		</b-row>
		<b-row class="pt-3" v-if="!isFavorites">
			<b-col sm="12">
				<b-skeleton :animation="animation"></b-skeleton>
				<b-skeleton :animation="animation"></b-skeleton>
				<b-skeleton :animation="animation"></b-skeleton>
			</b-col>
		</b-row>
		<b-row class="pt-3" v-if="!isFavorites">
			<b-col sm="12">
				<b-skeleton
					class="border-0"
					:animation="animation"
					type="input"
				></b-skeleton>
			</b-col>
		</b-row>
	</b-card>
</template>
<script>
export default {
	props: ["animation", "isFavorites"],
};
</script>
