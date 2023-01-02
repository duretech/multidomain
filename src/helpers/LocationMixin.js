import service from "@/service";
import { getLocationName } from "@/components/Common/commonFunctions";
export default {
	data() {
		return {
			locationName: "",
			childLocArr: [],
		};
	},
	methods: {
		async getLocationChild({ location, locationList, child = false }) {
			const { locName, childArr } = getLocationName({
				locationList,
				location,
			});
			this.locationName = locName;
			this.childLocArr = child ? childArr : [];
			if (
				this.locationName === "" ||
				(child && this.childLocArr.length === 0)
			) {
				try {
					let loc = location.split("/");
					let locData = await service.getIndividualOrganisation(loc[1], child);
					console.log("locData", locData);
					this.locationName = locData.data.displayName;
					this.childLocArr = locData.data?.children || [];
				} catch {
					console.log("Failed to location details");
				}
			}
		},
	},
};
