import service from "@/service";
import geoCalc from "@/components/FPDashboard/analyticalNew/geographical/geoCalc.js";
export default {
	methods: {
		async calculateFlag({
			rawData,
			location,
			globalFactorsData,
			type,
			periodType,
			dataType = null,
			period = null,
			oCypFactorConf = null,
			calType = null,
		}) {
			let locId = location.split("/")[1];
			let d = new Date();
			let defaultDate = this.$moment(d, "YYYYMM").subtract(
				globalFactorsData.period.Period.backtrackedMonth * 1,
				"months"
			);
			let currDate = this.$moment(defaultDate, "YYYYMM").format("MMM YYYY");
			let prevDate = this.$moment(defaultDate, "YYYYMM")
				.subtract(1, "months")
				.format("MMM YYYY");
			if (type === "type1") {
				let totalEMU =
					typeof rawData.data["totalEMU"] === "string"
						? JSON.parse(rawData.data["totalEMU"])
						: rawData.data["totalEMU"];

				let eTrend =
					typeof rawData.data["emuTrend"] === "string"
						? JSON.parse(rawData.data["emuTrend"])
						: rawData.data["emuTrend"];
				if (totalEMU[locId]) {
					let nationalData = totalEMU[locId];
					let nationalDiff = "";
					let flaggedArr = [];

					let currDateFound = nationalData.saveCategories.findIndex(
						(p) => p === currDate
					);
					let prevDateFound = nationalData.saveCategories.findIndex(
						(p) => p === prevDate
					);
					if (currDateFound >= 0 && prevDateFound >= 0) {
						let dataArr = nationalData.saveData[0].data;
						let currDateValue = dataArr[currDateFound];
						let prevDateValue = dataArr[prevDateFound];
						nationalDiff = currDateValue * 1 - prevDateValue * 1;
						this.flagTableFields = [
							{
								key: "Method",
								sortable: true,
							},
							{
								key: currDate,
								sortable: true,
							},
							{
								key: prevDate,
								sortable: true,
							},
							{
								key: "% Change",
								sortable: true,
							},
							{
								key: "Notification",
								sortable: true,
							},
						];
						this.flagTableData.push({
							Method: "Total EMU",
							[currDate]: currDateValue.toFixed(2),
							[prevDate]: prevDateValue.toFixed(2),
							"% Change": nationalDiff.toFixed(2),
							Notification: "",
						});
						let childData = eTrend[locId];
						if (childData) {
							let currDateFoundChild = childData.saveCategories.findIndex(
								(p) => p === currDate
							);
							let prevDateFoundChild = childData.saveCategories.findIndex(
								(p) => p === prevDate
							);
							if (currDateFoundChild >= 0 && prevDateFoundChild >= 0) {
								let methodName = "",
									dataKey = calType === "aggregate" ? "agreData" : "saveData";
								childData[dataKey].forEach((d) => {
									let currDateValue = d.data[currDateFoundChild];
									let prevDateValue = d.data[prevDateFoundChild];
									let childDiff = currDateValue * 1 - prevDateValue * 1;
									if (
										(nationalDiff > 0 && childDiff < 0) ||
										(nationalDiff < 0 && childDiff < 0)
									) {
										flaggedArr.push("flag");
										methodName = methodName === "" ? d.name : `${methodName}, ${d.name}`;
										this.flagTableData.push({
											Method: d.name,
											[currDate]: currDateValue.toFixed(2),
											[prevDate]: prevDateValue.toFixed(2),
											"% Change": childDiff.toFixed(2),
											Notification: "Flag",
											_cellVariants: { Notification: "danger" },
										});
									} else {
										flaggedArr.push("no flag");
										this.flagTableData.push({
											Method: d.name,
											[currDate]: currDateValue.toFixed(2),
											[prevDate]: prevDateValue.toFixed(2),
											"% Change": childDiff.toFixed(2),
											Notification: "No Flag",
											_cellVariants: { Notification: "success" },
										});
									}
								});
								let isFlagged = flaggedArr.find((f) => f === "flag");
								if (isFlagged) {
									this.$emit("flag", {
										tab: this.flagKey,
										value: "flag",
										messages: [`Flagged for ${methodName}`],
									});
								} else {
									this.$emit("flag", {
										tab: this.flagKey,
										value: "no flag",
										messages: ["No Flag"],
									});
								}
							} else {
								this.$emit("flag", {
									tab: this.flagKey,
									value: "error",
									messages: ["EMU Not saved for methods..."],
								});
							}
						} else {
							this.$emit("flag", {
								tab: this.flagKey,
								value: "error",
								messages: ["EMU Not saved for methods..."],
							});
						}
					} else {
						this.$emit("flag", {
							tab: this.flagKey,
							value: "error",
							messages: ["EMU Not saved for selected period..."],
						});
					}
				} else {
					this.$emit("flag", {
						tab: this.flagKey,
						value: "error",
						messages: ["EMU Not saved..."],
					});
				}
			}

			if (type === "type2") {
				let totalEMU =
					typeof rawData.data["totalEMU"] === "string"
						? JSON.parse(rawData.data["totalEMU"])
						: rawData.data["totalEMU"];
				console.log("totalEMU", totalEMU);
				if (totalEMU[locId]) {
					await service
						.getChildOrganisation(locId)
						.then((response) => {
							if (
								response.data &&
								response.data.children &&
								response.data.children.length
							) {
								let childrens = response.data.children;
								console.log("childrens", childrens);
								let nationalData = totalEMU[locId];
								let nationalDiff = "";
								let flaggedArr = [];
								let currDateFound = nationalData.saveCategories.findIndex(
									(p) => p === currDate
								);
								let prevDateFound = nationalData.saveCategories.findIndex(
									(p) => p === prevDate
								);
								if (currDateFound >= 0 && prevDateFound >= 0) {
									let dataArr = nationalData.saveData[0].data;
									let currDateValue = dataArr[currDateFound * 1];
									let prevDateValue = dataArr[prevDateFound * 1];
									nationalDiff = currDateValue * 1 - prevDateValue * 1;
									this.flagTableFields = [
										{
											key: "Location",
											sortable: true,
										},
										{
											key: currDate,
											sortable: true,
										},
										{
											key: prevDate,
											sortable: true,
										},
										{
											key: "% Change",
											sortable: true,
										},
										{
											key: "Notification",
											sortable: true,
										},
									];
									this.flagTableData.push({
										Location: "Harmonia",
										[currDate]: currDateValue.toFixed(2),
										[prevDate]: prevDateValue.toFixed(2),
										"% Change": nationalDiff.toFixed(2),
										Notification: "",
									});
									console.log("nationalDiff", nationalDiff);
									let childMessages = [];
									childrens.forEach((c) => {
										let childData = totalEMU[c.id];
										console.log("childData", childData);
										if (childData) {
											let currDateFoundChild =
												childData.saveCategories.findIndex(
													(p) => p === currDate
												);
											let prevDateFoundChild =
												childData.saveCategories.findIndex(
													(p) => p === prevDate
												);
											if (currDateFoundChild >= 0 && prevDateFoundChild >= 0) {
												childData.saveData.forEach((d) => {
													let currDateValue = d.data[currDateFoundChild * 1];
													let prevDateValue = d.data[prevDateFoundChild * 1];
													let childDiff = currDateValue * 1 - prevDateValue * 1;
													console.log("childDiff", childDiff);
													if (
														(nationalDiff > 0 && childDiff < 0) ||
														(nationalDiff < 0 && childDiff < 0)
													) {
														flaggedArr.push("flag");
														childMessages.push(`Flagged for ${c.name}`);
														this.flagTableData.push({
															Location: c.name,
															[currDate]: currDateValue.toFixed(2),
															[prevDate]: prevDateValue.toFixed(2),
															"% Change": childDiff.toFixed(2),
															Notification: "Flag",
															_cellVariants: { Notification: "danger" },
														});
													} else {
														flaggedArr.push("no flag");
														this.flagTableData.push({
															Location: c.name,
															[currDate]: currDateValue.toFixed(2),
															[prevDate]: prevDateValue.toFixed(2),
															"% Change": childDiff.toFixed(2),
															Notification: "No Flag",
															_cellVariants: { Notification: "success" },
														});
													}
												});
											} else {
												childMessages.push(`EMU Not saved for ${c.name}`);
											}
										} else {
											childMessages.push(`EMU Not saved for ${c.name}`);
										}
									});
									console.log("flaggedArr", flaggedArr);
									let isFlagged = flaggedArr.find((f) => f === "flag");
									console.log("isFlagged", isFlagged);
									if (isFlagged) {
										this.$emit("flag", {
											tab: this.flagKey,
											value: "flag",
											messages: childMessages,
										});
									} else {
										if (flaggedArr.length) {
											childMessages.unshift("No Flag");
										}
										this.$emit("flag", {
											tab: this.flagKey,
											value: flaggedArr.length ? "no flag" : "error",
											messages: childMessages,
										});
									}
								} else {
									this.$emit("flag", {
										tab: this.flagKey,
										value: "error",
										messages: ["EMU Not saved for selected period..."],
									});
								}
							} else {
								this.$emit("flag", {
									tab: this.flagKey,
									value: "error",
									messages: ["Child locations not present to compare..."],
								});
							}
						})
						.catch(() => {
							this.$emit("flag", {
								tab: this.flagKey,
								value: "error",
								messages: ["Error in fetching child locations..."],
							});
						});
				} else {
					this.$emit("flag", {
						tab: this.flagKey,
						value: "error",
						messages: ["EMU Not saved..."],
					});
				}
			}

			if (type === "type3") {
				console.log("locId", locId);
				console.log("currDate", currDate);
				console.log("prevDate", prevDate);
				console.log("rawData", rawData);
				if (rawData.data.rows.length) {
					let currDateCompare = this.$moment(defaultDate, "YYYYMM").format(
						"YYYYMM"
					);
					let prevDateCompare = this.$moment(defaultDate, "YYYYMM")
						.subtract(1, "months")
						.format("YYYYMM");
					console.log("currDateCompare", currDateCompare);
					console.log("prevDateCompare", prevDateCompare);
					let valueIndex = 0,
						ouIndex = 0,
						peIndex = 0,
						dxIndex = 0;
					rawData.data.headers.forEach((h, i) => {
						if (h.name === "value") {
							valueIndex = i;
						}

						if (h.name === "ou") {
							ouIndex = i;
						}

						if (h.name === "dx") {
							dxIndex = i;
						}

						if (h.name === "pe") {
							peIndex = i;
						}
					});
					let rData = {};
					if (
						dataType === "Commodities_Client" ||
						dataType === "Commodities_Facilities"
					) {
						console.log("globalFactorsData", globalFactorsData);
						let p_cyp = geoCalc.calculateCypFactors(
							globalFactorsData.cyp[dataType],
							oCypFactorConf
						);
						rawData.data.rows.forEach((r) => {
							// let c = cypArray.find((ca) => ca.dx === r[dxIndex]);
							let nFact = p_cyp[r[dxIndex]] || 1;
							if (Object.keys(rData).includes(r[ouIndex])) {
								if (Object.keys(rData[r[ouIndex]]).includes(r[peIndex])) {
									rData[r[ouIndex]][r[peIndex]] =
										Number(rData[r[ouIndex]][r[peIndex]]) +
										parseInt(Number(r[valueIndex]) * Number(nFact));
								} else {
									rData[r[ouIndex]][r[peIndex]] = parseInt(
										Number(r[valueIndex]) * Number(nFact)
									);
								}
							} else {
								rData[r[ouIndex]] = {
									[r[peIndex]]: parseInt(Number(r[valueIndex]) * Number(nFact)),
								};
							}
						});
					} else {
						rawData.data.rows.forEach((r) => {
							if (Object.keys(rData).includes(r[ouIndex])) {
								if (Object.keys(rData[r[ouIndex]]).includes(r[peIndex])) {
									rData[r[ouIndex]][r[peIndex]] =
										Number(rData[r[ouIndex]][r[peIndex]]) +
										Number(r[valueIndex]);
								} else {
									rData[r[ouIndex]][r[peIndex]] = Number(r[valueIndex]);
								}
							} else {
								rData[r[ouIndex]] = {
									[r[peIndex]]: Number(r[valueIndex]),
								};
							}
						});
					}
					console.log("rData", rData);
					if (Object.keys(rData).length) {
						if (rData[locId]) {
							let nationalDiff = "";
							let currValue = rData[locId][currDateCompare]
								? rData[locId][currDateCompare]
								: null;
							let prevValue = rData[locId][prevDateCompare]
								? rData[locId][prevDateCompare]
								: null;
							console.log("currValue", currValue);
							console.log("prevValue", prevValue);
							if (currValue && prevValue) {
								if (prevValue !== 0) {
									nationalDiff = ((currValue - prevValue) / prevValue) * 100;
									console.log("nationalDiff", nationalDiff);

									let flaggedArr = [],
										childMessages = [];

									Object.keys(rData).forEach((d) => {
										if (d !== locId) {
											let childDiff = "";
											let currValueChild = rData[d]
												? rData[d][currDateCompare]
													? rData[d][currDateCompare]
													: null
												: null;
											let prevValueChild = rData[d]
												? rData[d][prevDateCompare]
													? rData[d][prevDateCompare]
													: null
												: null;
											console.log("currValueChild", currValueChild);
											console.log("prevValueChild", prevValueChild);
											if (currValueChild && prevValueChild) {
												childDiff =
													((currValueChild - prevValueChild) / prevValueChild) *
													100;
												console.log("childDiff", childDiff);

												if (
													(nationalDiff > 0 && childDiff < 0) ||
													(nationalDiff < 0 && childDiff < 0)
												) {
													flaggedArr.push("flag");
													childMessages.push(
														`Flagged for ${rawData.data.metaData.items[d].name}`
													);
												} else {
													flaggedArr.push("no flag");
												}
											} else {
												childMessages.push(
													`Data not found for ${rawData.data.metaData.items[d].name}`
												);
											}
										}
									});

									console.log("flaggedArr", flaggedArr);
									let isFlagged = flaggedArr.find((f) => f === "flag");
									console.log("isFlagged", isFlagged);
									if (isFlagged) {
										this.$emit("flag", {
											tab: this.flagKey,
											value: "flag",
											messages: childMessages,
										});
									} else {
										if (flaggedArr.length) {
											childMessages.unshift("No Flag");
										}
										this.$emit("flag", {
											tab: this.flagKey,
											value: flaggedArr.length ? "no flag" : "error",
											messages: childMessages,
										});
									}
								} else {
									this.$emit("flag", {
										tab: this.flagKey,
										value: "error",
										messages: ["Previous month value is 0..."],
									});
								}
							} else {
								this.$emit("flag", {
									tab: this.flagKey,
									value: "error",
									messages: ["Data not present for selected period..."],
								});
							}
						} else {
							this.$emit("flag", {
								tab: this.flagKey,
								value: "error",
								messages: ["Data not present for selected location..."],
							});
						}
					} else {
						this.$emit("flag", {
							tab: this.flagKey,
							value: "error",
							messages: ["Error in calculation..."],
						});
					}
				} else {
					this.$emit("flag", {
						tab: this.flagKey,
						value: "error",
						messages: ["No data found..."],
					});
				}
			}
			if (type === "type4") {
				console.log("locId", locId);
				console.log("currDate", currDate);
				console.log("prevDate", prevDate);
				console.log("rawData", rawData);
				if (rawData.data.rows.length) {
					let currDateCompare = this.$moment(defaultDate, "YYYYMM").format(
						"YYYYMM"
					);
					let prevDateCompare = this.$moment(defaultDate, "YYYYMM")
						.subtract(1, "months")
						.format("YYYYMM");
					console.log("currDateCompare", currDateCompare);
					console.log("prevDateCompare", prevDateCompare);
					let valueIndex = 0,
						ouIndex = 0,
						peIndex = 0,
						dxIndex = 0;
					rawData.data.headers.forEach((h, i) => {
						if (h.name === "value") {
							valueIndex = i;
						}

						if (h.name === "ou") {
							ouIndex = i;
						}

						if (h.name === "dx") {
							dxIndex = i;
						}

						if (h.name === "pe") {
							peIndex = i;
						}
					});
					let rData = {};
					if (
						dataType === "Commodities_Client" ||
						dataType === "Commodities_Facilities"
					) {
						console.log("globalFactorsData", globalFactorsData);
						let p_cyp = geoCalc.calculateCypFactors(
							globalFactorsData.cyp[dataType],
							oCypFactorConf
						);
						rawData.data.rows.forEach((r) => {
							// let c = cypArray.find((ca) => ca.dx === r[dxIndex]);
							let nFact = p_cyp[r[dxIndex]] || 1;
							if (Object.keys(rData).includes(r[ouIndex])) {
								if (Object.keys(rData[r[ouIndex]]).includes(r[peIndex])) {
									rData[r[ouIndex]][r[peIndex]] =
										Number(rData[r[ouIndex]][r[peIndex]]) +
										parseInt(Number(r[valueIndex]) * Number(nFact));
								} else {
									rData[r[ouIndex]][r[peIndex]] = parseInt(
										Number(r[valueIndex]) * Number(nFact)
									);
								}
							} else {
								rData[r[ouIndex]] = {
									[r[peIndex]]: parseInt(Number(r[valueIndex]) * Number(nFact)),
								};
							}
						});
					} else {
						rawData.data.rows.forEach((r) => {
							if (Object.keys(rData).includes(r[ouIndex])) {
								if (Object.keys(rData[r[ouIndex]]).includes(r[peIndex])) {
									rData[r[ouIndex]][r[peIndex]] =
										Number(rData[r[ouIndex]][r[peIndex]]) +
										Number(r[valueIndex]);
								} else {
									rData[r[ouIndex]][r[peIndex]] = Number(r[valueIndex]);
								}
							} else {
								rData[r[ouIndex]] = {
									[r[peIndex]]: Number(r[valueIndex]),
								};
							}
						});
					}
					console.log("rData", rData);
					if (Object.keys(rData).length) {
						if (rData[locId]) {
							let nationalDiff = "";
							let currValue = rData[locId][currDateCompare]
								? rData[locId][currDateCompare]
								: null;
							let prevValue = rData[locId][prevDateCompare]
								? rData[locId][prevDateCompare]
								: null;
							console.log("currValue", currValue);
							console.log("prevValue", prevValue);
							if (currValue && prevValue) {
								if (prevValue !== 0) {
									nationalDiff = ((currValue - prevValue) / prevValue) * 100;
									console.log("nationalDiff", nationalDiff);

									let flaggedArr = [],
										childMessages = [];

									Object.keys(rData).forEach((d) => {
										if (d !== locId) {
											let childDiff = "";
											let currValueChild = rData[d]
												? rData[d][currDateCompare]
													? rData[d][currDateCompare]
													: null
												: null;
											let prevValueChild = rData[d]
												? rData[d][prevDateCompare]
													? rData[d][prevDateCompare]
													: null
												: null;
											console.log("currValueChild", currValueChild);
											console.log("prevValueChild", prevValueChild);
											if (currValueChild && prevValueChild) {
												childDiff =
													((currValueChild - prevValueChild) / prevValueChild) *
													100;
												console.log("childDiff", childDiff);

												if (
													(nationalDiff > 0 && childDiff < 0) ||
													(nationalDiff < 0 && childDiff < 0)
												) {
													flaggedArr.push("flag");
													childMessages.push(
														`Flagged for ${rawData.data.metaData.items[d].name}`
													);
												} else {
													flaggedArr.push("no flag");
												}
											} else {
												childMessages.push(
													`Data not found for ${rawData.data.metaData.items[d].name}`
												);
											}
										}
									});

									console.log("flaggedArr", flaggedArr);
									let isFlagged = flaggedArr.find((f) => f === "flag");
									console.log("isFlagged", isFlagged);
									if (isFlagged) {
										this.$emit("flag", {
											tab: this.getNewFlagKey,
											value: "flag",
											messages: childMessages,
										});
									} else {
										if (flaggedArr.length) {
											childMessages.unshift("No Flag");
										}
										this.$emit("flag", {
											tab: this.getNewFlagKey,
											value: flaggedArr.length ? "no flag" : "error",
											messages: childMessages,
										});
									}
								} else {
									this.$emit("flag", {
										tab: this.getNewFlagKey,
										value: "error",
										messages: ["Previous month value is 0..."],
									});
								}
							} else {
								this.$emit("flag", {
									tab: this.getNewFlagKey,
									value: "error",
									messages: ["Data not present for selected period..."],
								});
							}
						} else {
							this.$emit("flag", {
								tab: this.getNewFlagKey,
								value: "error",
								messages: ["Data not present for selected location..."],
							});
						}
					} else {
						this.$emit("flag", {
							tab: this.getNewFlagKey,
							value: "error",
							messages: ["Error in calculation..."],
						});
					}
				} else {
					this.$emit("flag", {
						tab: this.getNewFlagKey,
						value: "error",
						messages: ["No data found..."],
					});
				}
			}
		},
	},
};
