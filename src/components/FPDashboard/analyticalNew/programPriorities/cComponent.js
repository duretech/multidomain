import merge from "lodash/merge";
import i18n from "@/i18n.js";
import {
	translateDate,
	subtractNDate,
} from "@/components/Common/commonFunctions";

export default {
	// Access - Compare chart: Across selected location and period with method as series.
	dxTotalOUDataAccessNew: (
		response,
		countryID,
		catArray,
		items,
		fields,
		derivedChart,
		chartType,
		periodType,
		locale,
		tablePeriodHeader,
		tableLocationHeader,
		moment
	) => {
		// console.log("response",response)
		// console.log("chartType",chartType)
		// console.log("catArray",catArray)
		let ou = response.data.metaData.dimensions.ou.filter(
				(o) => o !== countryID[0]
			),
			pe = response.data.metaData.dimensions.pe;
		// console.log("Locations",ou)

		// console.log("period",pe)
		let categories = [],
			count = 0;
		if (chartType === "period") {
			pe.forEach((p, i) => {
				let formattedPeriod = translateDate({
					rawDate: p,
					periodType: periodType,
				});
				categories.push(formattedPeriod);

				items.push({
					[tablePeriodHeader]: formattedPeriod,
					_cellVariants: {
						[tablePeriodHeader]: "light",
					},
				});
			});
		} else {
			categories.push(response.data.metaData.items[countryID[0]].name);
			items.push({
				[tableLocationHeader]: response.data.metaData.items[countryID[0]].name,
				_cellVariants: {
					[tableLocationHeader]: "light",
				},
			});
		}

		// console.log(items)
		// console.log("categories", categories)

		let valueIndex = 0,
			ouIndex = 0,
			peIndex = 0,
			dxIndex = 0;
		response.data.headers.forEach((h, i) => {
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

		let obj = {},
			series = [],
			rData1 = {};

		let rows = response.data.rows.filter((r) => r[ouIndex] !== countryID[0]);
		// console.log("rows without higher region",rows)
		let uniqueOU = {};
		response.data.metaData.dimensions.ou.forEach((ou, i) => {
			if (ou !== countryID[0]) {
				uniqueOU[ou] = "IA";
			}
		});
		let pData = {};
		pe.forEach((p, pI) => {
			let rCatData = {};
			catArray.forEach((item, itemI) => {
				let catData = { name: item.name, methods: [] };
				item.methods.forEach((m, mI) => {
					let methodData = { name: m.name, de: [] };
					m.dx.forEach((dx, dxI) => {
						let innerDX = { deID: dx, count: {} };
						rows.forEach((r, i) => {
							if (dx === r[dxIndex] && p === r[peIndex]) {
								innerDX["count"][r[ouIndex]] =
									r[valueIndex] * 1 === 0 ? "T" : "F";
							}
						});
						let uniqueOU_Temp = JSON.parse(JSON.stringify(uniqueOU));
						let combinedOU = merge(uniqueOU_Temp, innerDX.count);
						innerDX.count = combinedOU;
						methodData["de"].push(innerDX);
					});
					catData.methods.push(methodData);
				});
				rCatData[item.name] = catData;
			});
			pData[p] = rCatData;
		});

		// console.log("pData",pData)
		// console.log("uniqueOU",uniqueOU)

		let peDECompare = {};
		Object.keys(pData).forEach((pd, pdI) => {
			let deCompare = {};
			Object.keys(pData[pd]).forEach((rData) => {
				let catData = { name: rData, methods: [] };
				pData[pd][rData].methods.forEach((m) => {
					let methodData = { name: m.name, deCompare: {} };

					Object.keys(uniqueOU).forEach((ou, i) => {
						let finalStatus = null;
						m.de.forEach((de, j) => {
							if (j === 0) {
								finalStatus = de.count[ou];
							} else {
								if (
									(finalStatus === "T" && de.count[ou] === "T") ||
									(finalStatus === "T" && de.count[ou] === "IA") ||
									(finalStatus === "IA" && de.count[ou] === "T")
								) {
									finalStatus = "T";
								} else if (finalStatus === "IA" && de.count[ou] === "IA") {
									finalStatus = "IA";
								} else {
									finalStatus = "F";
								}
							}
						});
						methodData.deCompare[ou] = finalStatus;
					});
					// console.log("methodData", methodData)
					catData.methods.push(methodData);
				});
				deCompare[rData] = catData;
			});
			peDECompare[pd] = deCompare;
		});

		// console.log("peDECompare",peDECompare)
		// console.log("uniqueOU",uniqueOU)

		let peMethodCompare = {};
		Object.keys(peDECompare).forEach((pd, pdI) => {
			let methodCompare = {};
			Object.keys(peDECompare[pd]).forEach((deData) => {
				let catData = { name: deData, methodCompare: {} };
				Object.keys(uniqueOU).forEach((ou, i) => {
					let finalStatus = null;
					peDECompare[pd][deData].methods.forEach((de, j) => {
						if (j === 0) {
							finalStatus = de.deCompare[ou];
						} else {
							if (
								(finalStatus === "T" && de.deCompare[ou] === "T") ||
								(finalStatus === "T" && de.deCompare[ou] === "IA") ||
								(finalStatus === "IA" && de.deCompare[ou] === "T")
							) {
								finalStatus = "T";
							} else if (finalStatus === "IA" && de.deCompare[ou] === "IA") {
								finalStatus = "IA";
							} else {
								finalStatus = "F";
							}
						}
					});
					catData.methodCompare[ou] = finalStatus;
				});
				methodCompare[deData] = catData;
			});
			peMethodCompare[pd] = methodCompare;
		});

		// console.log(peMethodCompare)

		let peFinalCount = {};
		Object.keys(peMethodCompare).forEach((pm) => {
			let finalCount = {};
			Object.keys(peMethodCompare[pm]).forEach((deData) => {
				let methodData = peMethodCompare[pm][deData].methodCompare,
					numerator = Object.keys(methodData).filter(
						(d) => methodData[d] === "F"
					).length,
					denominator = Object.keys(methodData).filter(
						(d) => methodData[d] === "T"
					).length;
				finalCount[deData] = {
					numerator,
					denominator: numerator + denominator,
				};
			});
			peFinalCount[pm] = finalCount;
		});

		// console.log("peFinalCount",peFinalCount)

		let name = null,
			color = null,
			visible = null;
		if (chartType === "period") {
			catArray.forEach((cat, catI) => {
				name = cat.name;
				color = cat.color;
				visible = cat.visible;

				fields.push({
					key: name,
					sortable: true,
				});

				obj = {
					name,
					visible,
					data: [],
					color: color
						? color
						: "#" + ((Math.random() * 0xffffff) << 0).toString(16),
				};

				Object.keys(peFinalCount).forEach((d, j) => {
					// console.log(d)
					//console.log(j)
					//console.log(rData[d])
					// Object.keys(peFinalCount[d]).forEach(m => {

					let formattedPeriod = translateDate({
						rawDate: d,
						periodType: periodType,
					});
					obj.data.push({
						name: formattedPeriod,
						y:
							(
								(peFinalCount[d][name].numerator /
									peFinalCount[d][name].denominator) *
								100
							).toFixed(2) * 1 || null,
						pe: d,
					});
					// console.log(items[j])
					// console.log(name)

					items[j] = {
						...items[j],
						[name]:
							(
								(peFinalCount[d][name].numerator /
									peFinalCount[d][name].denominator) *
								100
							).toFixed(2) * 1 || null,
					};
					// });
				});
				series.push(obj);
			});
		} else {
			Object.keys(peFinalCount).forEach((d, j) => {
				// console.log(d)
				//console.log(j)
				//console.log(rData[d])
				Object.keys(peFinalCount[d]).forEach((m) => {
					let catData = catArray.find((c) => c.name == m);
					name = catData.name;
					color = catData.color;
					visible = catData.visible;

					fields.push({
						key: name,
						sortable: true,
					});

					obj = {
						name,
						visible,
						data: [],
						color: color
							? color
							: "#" + ((Math.random() * 0xffffff) << 0).toString(16),
					};

					obj.data.push({
						name: response.data.metaData.items[countryID[0]].name,
						y:
							(
								(peFinalCount[d][m].numerator /
									peFinalCount[d][m].denominator) *
								100
							).toFixed(2) * 1 || null,
						color: catData.color,
					});
					// console.log(items[j])
					// console.log(name)

					items[0] = {
						...items[0],
						[name]:
							(
								(peFinalCount[d][m].numerator /
									peFinalCount[d][m].denominator) *
								100
							).toFixed(2) * 1 || null,
					};
					series.push(obj);
				});
			});
		}

		// console.log(items)
		// console.log(fields)

		return {
			series,
			categories,
			items,
			fields,
		};
	},
	dxTotalOUDataAccessNewCalculated: (
		response,
		countryID,
		catArray,
		items,
		fields,
		derivedChart,
		chartType,
		periodType,
		locale,
		tablePeriodHeader,
		tableLocationHeader,
		moment
	) => {
		// console.log("response",response)
		// console.log("tablePeriodHeader",tablePeriodHeader)
		// console.log("tableLocationHeader",tableLocationHeader)
		// console.log("locale",locale)
		let valueIndex = 0,
			ouIndex = 0,
			peIndex = 0,
			dxIndex = 0;
		response.data.headers.forEach((h, i) => {
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

		let obj = {},
			series = [],
			categories = [],
			drilldown = {
				drillUpButton: {
					position: {
						align: "left",
						x: 0,
						y: 0,
					},
				},
				// allowPointDrilldown: false,
				series: [],
			};

		if (chartType === "period") {
			// console.log("period",pe)
			let pe = response.data.metaData.dimensions.pe;
			pe.forEach((p) => {
				if (response.data.metaData.items[p]) {
					let formattedPeriod = translateDate({
						rawDate: p,
						periodType: periodType,
					});
					categories.push(formattedPeriod);
					items.push({
						[tablePeriodHeader]: formattedPeriod,
						_cellVariants: { [tablePeriodHeader]: "light" },
					});
				}
			});

			// console.log("categories", categories)

			// console.log(catArray)
			// response.data.metaData.dimensions.dx.forEach((dx, dxI) => {
			catArray.forEach((dx, dxI) => {
				let rData = {};
				response.data.rows.forEach((r, i) => {
					if (dx.dx.includes(r[dxIndex])) {
						if (Object.keys(rData).includes(r[ouIndex])) {
							// rData[r[ouIndex]][r[peIndex]] = Number(r[valueIndex])
							if (Object.keys(rData[r[ouIndex]]).includes(r[peIndex])) {
								rData[r[ouIndex]][r[peIndex]] =
									Number(rData[r[ouIndex]][r[peIndex]]) + Number(r[valueIndex]);
							} else {
								rData[r[ouIndex]][r[peIndex]] = Number(r[valueIndex]);
							}
						} else {
							rData[r[ouIndex]] = {
								[r[peIndex]]: Number(r[valueIndex]),
							};
						}
					}
				});

				// console.log("rData trend", rData)
				let bFlag = false;
				Object.keys(rData).forEach((d, j) => {
					//console.log(rData[d])
					//console.log("rData[d]", d)
					// console.log("rData[d]", countryID[0])
					if (d === countryID[0]) {
						//console.log(rData[d])
						//console.log("rData[d]", d)

						let name = null,
							color = null,
							visible = null;

						//console.log(dx)
						Object.keys(response.data.metaData.items).forEach((k) => {
							if (dx.dx.includes(k)) {
								// name = response.data.metaData.items[k].name
								name = dx.name;
								color = dx.color;
								visible = dx.visible;
							}
						});
						fields.push({ key: name, sortable: true });
						obj = {
							name,
							visible,
							data: [],
							color: color
								? color
								: "#" + ((Math.random() * 0xffffff) << 0).toString(16),
							// color: cData.indicator.subIndicator[j] ? cData.indicator.subIndicator[j].color : '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
						};
						let outlier = [],
							narration = [];
						pe.forEach((p, i) => {
							let prevPeriod = subtractNDate({
								rawDate: p,
								periodType: periodType,
							});
							if (Object.keys(rData[d]).includes(p)) {
								// check for double sum of indicator

								obj.data.push({
									name: categories[i],
									pe: p,
									pePrev: i === 0 ? 0 : prevPeriod,
									y: (rData[d][p] * 1).toFixed(2) * 1 || null,
									drilldown:
										i === 0
											? `${name} ( ${categories[i]} )`
											: `${name} ( ${categories[i]} - ${categories[i - 1]} )`,
								});

								items[i] = {
									...items[i],
									[name]: (rData[d][p] * 1).toFixed(2) * 1 || null,
								};
							} else {
								obj.data.push({
									name: categories[i],
									pe: p,
									pePrev: i === 0 ? 0 : prevPeriod,
									y: null,
									drilldown: null,
								});
								items[i] = {
									...items[i],
									[name]: "",
								};
							}
						});
						series.push(obj);
					}
					if (j === Object.keys(rData).length - 1) {
						bFlag = true;
					}
				});
				if (bFlag) {
					// console.log("series", series)
					series[dxI].data.forEach((rt, k) => {
						// console.log(rt)
						obj = {
							id: rt.drilldown,
							type: "column",
							name: rt.drilldown,
							data: [],
						};
						// let regions = []
						Object.keys(rData).forEach((d, j) => {
							let name = null;
							Object.keys(response.data.metaData.items).forEach((k) => {
								if (d === k) {
									name = response.data.metaData.items[k].name;
								}
							});
							if (d !== countryID[0]) {
								if (Object.keys(rData[d]).includes(rt.pe)) {
									let y = null,
										color = null;
									if (k === 0) {
										y =
											rData[d][rt.pe] * 1
												? ((rData[d][rt.pe] * 1).toFixed(2) * 1 - 0).toFixed(
														2
												  ) * 1 || null
												: null;
										color = y > 0 ? "#5BD282" : "#FE8081";
										obj.data.push({
											name,
											y,
											color,
											locationID: d,
										});
									} else {
										if (rData[d][rt.pePrev] * 1) {
											if (rData[d][rt.pe] * 1) {
												y =
													(
														(rData[d][rt.pe] * 1).toFixed(2) * 1 -
														(rData[d][rt.pePrev] * 1).toFixed(2) * 1
													).toFixed(2) * 1 || null;
											} else {
												y =
													(
														0 -
														(rData[d][rt.pePrev] * 1).toFixed(2) * 1
													).toFixed(2) * 1 || null;
											}
										} else if (rData[d][rt.pe] * 1) {
											y =
												((rData[d][rt.pe] * 1).toFixed(2) * 1 - 0).toFixed(2) *
												1 || null;
										} else {
											y = null;
										}
										color = y > 0 ? "#5BD282" : "#FE8081";
										obj.data.push({
											name,
											y,
											color,
											locationID: d,
										});
									}
								}
							}
						});
						drilldown.series.push(obj);
					});
				}
			});
		} else {
			let ou = response.data.metaData.dimensions.ou.filter(
				(o) => o === countryID[0]
			);
			// console.log("ou",ou)
			ou.forEach((o) => {
				Object.keys(response.data.metaData.items).forEach((k) => {
					if (o === k) {
						categories.push(response.data.metaData.items[k].name);
						items.push({
							[tableLocationHeader]: response.data.metaData.items[k].name,
							_cellVariants: { [tableLocationHeader]: "light" },
						});
					}
				});
			});

			// console.log("categories", categories)
			// console.log("catArray",catArray)
			// console.log("countryID[0]",countryID[0])
			let rows = response.data.rows.filter((o) => o[ouIndex] === countryID[0]);
			// console.log("rows",rows)
			catArray.forEach((dx, dxI) => {
				// console.log(dx)
				let rData = {};
				// if (cypArray.length === 0) {
				rows.forEach((r, i) => {
					if (dx.dx.includes(r[dxIndex])) {
						if (Object.keys(rData).includes(r[peIndex])) {
							// if(r[ouIndex] !== countryID[0]){
							if (Object.keys(rData[r[peIndex]]).includes(r[ouIndex])) {
								rData[r[peIndex]][r[ouIndex]] =
									Number(rData[r[peIndex]][r[ouIndex]]) + Number(r[valueIndex]);
							} else {
								rData[r[peIndex]][r[ouIndex]] = Number(r[valueIndex]);
							}
							// }
						} else {
							// if(r[ouIndex] !== countryID[0]){
							rData[r[peIndex]] = {
								[r[ouIndex]]: Number(r[valueIndex]),
							};
							// }
						}
					}
				});
				// }
				// console.log("rData", rData)
				// console.log("rData1", rData1)

				Object.keys(rData).forEach((d, j) => {
					// console.log(rData[d])
					// console.log("rData[d]", d)
					// console.log("rData[d]", countryID[0])
					// if (!Object.keys(rData[d]).includes(countryID[0])) {

					//console.log(rData[d])
					//console.log("rData[d]", d)

					let name = null,
						color = null,
						visible = null;

					// console.log(dx)
					Object.keys(response.data.metaData.items).forEach((k) => {
						if (dx.dx.includes(k)) {
							// name = response.data.metaData.items[k].name
							name = dx.name;
							color = dx.color;
							visible = dx.visible;
						}
					});
					fields.push({ key: name, sortable: true });
					obj = {
						name,
						visible,
						data: [],
						color: color
							? color
							: "#" + ((Math.random() * 0xffffff) << 0).toString(16),
						// color: cData.indicator.subIndicator[j] ? cData.indicator.subIndicator[j].color : '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
					};
					let outlier = [],
						narration = [];
					ou.forEach((o, i) => {
						if (Object.keys(rData[d]).includes(o)) {
							// check for double sum of indicator

							obj.data.push({
								name: categories[i],
								y: (rData[d][o] * 1).toFixed(2) * 1 || null,
							});

							items[i] = {
								...items[i],
								[name]: (rData[d][o] * 1).toFixed(2) * 1 || null,
							};
						} else {
							// console.log(sourceConfig)
							obj.data.push({
								name: categories[i],
								y: null,
							});
							items[i] = {
								...items[i],
								[name]: "",
							};
						}
					});
					// console.log(obj)
					series.push(obj);
					// }
				});
			});
		}

		// console.log("series",series)
		// console.log("categories",categories)
		// console.log(items)
		// console.log(fields)
		return {
			series,
			categories,
			drilldown,
			items,
			fields,
		};
	},
};
