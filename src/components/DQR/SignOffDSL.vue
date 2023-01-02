<template>
	<div class="rangeClass d-flex pb-2 range-newslider">
		<div
			class="p-2 nDiv"
			:class="d.class"
			v-for="(d, i) in dsl"
			:key="'dsl-' + i"
		>
			<span class="mr-2">{{ d.text }}</span>
			<b-badge variant="light">{{ d.count }}</b-badge>
		</div>
	</div>
</template>
<script>
export default {
	props: ["dsl"],
};
</script>
