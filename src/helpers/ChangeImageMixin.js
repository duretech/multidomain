export default {
	methods: {
		onImgChange(e) {
			//console.log(e);
			const file = e.target.files[0];
			const imgSrc = e.target.name;
			this.getImgBase64(file, imgSrc);
		},
		getImgBase64(file, imgSrc) {
			let reader = new FileReader();
			reader.readAsDataURL(file);

			reader.onload = () => {
				/*this.leaderIcon = {
                  url: reader.result
              }*/
				//this.leaderIcon = reader.result;
				this.appData[imgSrc] = reader.result;
				//console.log(this[imgSrc]);
			};
			reader.onerror = function (error) {
				console.log("Error: ", error);
			};
		},
	},
};
