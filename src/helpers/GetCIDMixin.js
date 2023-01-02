export default {
	methods: {
		getCID(reportChartData, cid) {
			let updatedCID = null;
            // console.log("reportChartData", reportChartData)
            // console.log("cid", cid)
			if (reportChartData.cid.includes(cid)) {
                updatedCID = reportChartData.cid;
			}
            let found = reportChartData.linkedCharts.find((c) => c.includes(cid));
            if (found) {
                updatedCID = found;
            }
            // console.log("updatedCID", updatedCID)
			return updatedCID;
		},
	},
};
