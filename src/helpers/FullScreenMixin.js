export default {
	methods: {
		toggleFullscreen(key) {
			this[`${key}Full`] = true;
		},
	},
};
