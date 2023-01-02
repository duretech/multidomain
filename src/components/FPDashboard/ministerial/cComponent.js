import merge from "lodash/merge";
import {
	translateDate,
	subtractNDate,
} from "@/components/Common/commonFunctions";
import i18n from "@/i18n.js"

export default {
	totalData: (
		response,
		countryID,
		items,
		fields,
		cypArray,
		color,
		sourceConfig,
		derivedChart,
		tablePeriodHeader,
		periodType
	) => {
		let pe = response.data.metaData.dimensions.pe;
		let categories = [];
		pe.forEach((p) => {
			if (response.data.metaData.items[p]) {
				let formattedPeriod = translateDate({
					rawDate: p,
					periodType: periodType,
				});
				categories.push(formattedPeriod);
				if (derivedChart) {
					items.push({
						[tablePeriodHeader]: formattedPeriod,
						_cellVariants: { [tablePeriodHeader]: "light" },
					});
				}
			}
		});
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

		let rData = {};
		if (cypArray.length === 0) {
			response.data.rows.forEach((r) => {
				if (Object.keys(rData).includes(r[ouIndex])) {
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
			});
		} else {
			response.data.rows.forEach((r) => {
				let c = cypArray.find((ca) => ca.dx === r[dxIndex]);
				if (Object.keys(rData).includes(r[ouIndex])) {
					if (Object.keys(rData[r[ouIndex]]).includes(r[peIndex])) {
						rData[r[ouIndex]][r[peIndex]] =
							Number(rData[r[ouIndex]][r[peIndex]]) +
							parseInt(Number(r[valueIndex]) * Number(c.cyp));
					} else {
						rData[r[ouIndex]][r[peIndex]] = parseInt(
							Number(r[valueIndex]) * Number(c.cyp)
						);
					}
				} else {
					rData[r[ouIndex]] = {
						[r[peIndex]]: parseInt(Number(r[valueIndex]) * Number(c.cyp)),
					};
				}
			});
		}
		let obj = {},
			bFlag = false,
			series = [],
			drilldown = {
				drillUpButton: {
					position: {
						align: "left",
						x: 0,
						y: 0,
					},
				},
				series: [],
			};

		Object.keys(rData).forEach((d, j) => {
			if (d === countryID[0]) {
				let name = response.data.metaData.items[d]
					? response.data.metaData.items[d].name
					: null;

				fields.push({ key: name, sortable: true });
				obj = {
					name,
					data: [],
					visible: true,
					color: color
						? color
						: "#" + ((Math.random() * 0xffffff) << 0).toString(16),
				};
				pe.forEach((p, i) => {
					let prevPeriod = subtractNDate({
						rawDate: p,
						periodType: periodType,
					});
					if (Object.keys(rData[d]).includes(p)) {
						obj.data.push({
							name: categories[i],
							pe: p,
							pePrev: i === 0 ? 0 : prevPeriod,
							// y: (rData[d][p] * 1).toFixed(2) * 1,
							y: Math.round(rData[d][p]),
							drilldown:
								i === 0
									? `${name} ( ${categories[i]} )`
									: `${name} ( ${categories[i]} - ${categories[i - 1]} )`,
						});
						items[i] = {
							...items[i],
							// [name]: (rData[d][p] * 1).toFixed(2) * 1
							[name]: Math.round(rData[d][p]),
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
			series[0].data.forEach((rt, k) => {
				obj = {
					id: rt.drilldown,
					type: "column",
					name: rt.drilldown,
					data: [],
				};
				Object.keys(rData).forEach((d) => {
					let name = response.data.metaData.items[d]
						? response.data.metaData.items[d].name
						: null;

					if (d !== countryID[0]) {
						if (Object.keys(rData[d]).includes(rt.pe)) {
							let y = null,
								color = null;
							if (k === 0) {
								y =
									rData[d][rt.pe] * 1
										? ((rData[d][rt.pe] * 1).toFixed(2) * 1 - 0).toFixed(2) * 1
										: null;
								color = y > 0 ? "#5BD282" : "#FE8081";
								obj.data.push({
									name,
									y,
									color,
									locationID: d,
									originalY: rData[d][rt.pe] * 1,
								});
							} else {
								if (rData[d][rt.pePrev] * 1) {
									if (rData[d][rt.pe] * 1) {
										y =
											(
												(rData[d][rt.pe] * 1).toFixed(2) * 1 -
												(rData[d][rt.pePrev] * 1).toFixed(2) * 1
											).toFixed(2) * 1;
									} else {
										y =
											(0 - (rData[d][rt.pePrev] * 1).toFixed(2) * 1).toFixed(
												2
											) * 1;
									}
								} else if (rData[d][rt.pe] * 1) {
									y = ((rData[d][rt.pe] * 1).toFixed(2) * 1 - 0).toFixed(2) * 1;
								} else {
									y = null;
								}

								color = y > 0 ? "#5BD282" : "#FE8081";
								obj.data.push({
									name,
									y,
									color,
									locationID: d,
									originalY: rData[d][rt.pe] * 1,
								});
							}
						}
					}
				});
				drilldown.series.push(obj);
			});
		}
		return {
			series,
			drilldown,
			categories,
			items,
			fields,
		};
	},
	dxData: (
		response,
		countryID,
		catArray,
		items,
		fields,
		sourceConfig,
		derivedChart,
		tablePeriodHeader,
		periodType
	) => {
		let pe = response.data.metaData.dimensions.pe;
		let categories = [];
		pe.forEach((p) => {
			if (response.data.metaData.items[p]) {
				let formattedPeriod = translateDate({
					rawDate: p,
					periodType: periodType,
				});
				categories.push(formattedPeriod);
				if (derivedChart) {
					items.push({
						[tablePeriodHeader]: formattedPeriod,
						_cellVariants: { [tablePeriodHeader]: "light" },
					});
				}
			}
		});
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

		catArray.forEach((dx, dxI) => {
			let rData = {};
			response.data.rows.forEach((r) => {
				if (dx.dx.includes(r[dxIndex])) {
					if (Object.keys(rData).includes(r[ouIndex])) {
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

			let bFlag = false;

			Object.keys(rData).forEach((d, j) => {
				if (d === countryID[0]) {
					let name = dx.name;
					let color = dx.color;
					let visible = dx.visible;

					fields.push({ key: name, sortable: true });
					obj = {
						name,
						visible,
						data: [],
						color: color
							? color
							: "#" + ((Math.random() * 0xffffff) << 0).toString(16),
					};
					pe.forEach((p, i) => {
						let prevPeriod = subtractNDate({
							rawDate: p,
							periodType: periodType,
						});

						if (Object.keys(rData[d]).includes(p)) {
							obj.data.push({
								name: categories[i],
								pe: p,
								pePrev: i === 0 ? 0 : prevPeriod,
								y: (rData[d][p] * 1).toFixed(2) * 1,
								drilldown:
									i === 0
										? `${name} ( ${categories[i]} )`
										: `${name} ( ${categories[i]} - ${categories[i - 1]} )`,
							});

							items[i] = {
								...items[i],
								[name]: (rData[d][p] * 1).toFixed(2) * 1,
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
				series[dxI].data.forEach((rt, k) => {
					obj = {
						id: rt.drilldown,
						type: "column",
						name: rt.drilldown,
						data: [],
					};
					Object.keys(rData).forEach((d) => {
						let name = response.data.metaData.items[d]
							? response.data.metaData.items[d].name
							: null;

						if (d !== countryID[0]) {
							if (Object.keys(rData[d]).includes(rt.pe)) {
								let y = null,
									color = null;
								if (k === 0) {
									y =
										rData[d][rt.pe] * 1
											? ((rData[d][rt.pe] * 1).toFixed(2) * 1 - 0).toFixed(2) *
											  1
											: null;
									color = y > 0 ? "#5BD282" : "#FE8081";
									obj.data.push({
										name,
										y,
										color,
										locationID: d,
										originalY: rData[d][rt.pe] * 1,
									});
								} else {
									if (rData[d][rt.pePrev] * 1) {
										if (rData[d][rt.pe] * 1) {
											y =
												(
													(rData[d][rt.pe] * 1).toFixed(2) * 1 -
													(rData[d][rt.pePrev] * 1).toFixed(2) * 1
												).toFixed(2) * 1;
										} else {
											y =
												(0 - (rData[d][rt.pePrev] * 1).toFixed(2) * 1).toFixed(
													2
												) * 1;
										}
									} else if (rData[d][rt.pe] * 1) {
										y =
											((rData[d][rt.pe] * 1).toFixed(2) * 1 - 0).toFixed(2) * 1;
									} else {
										y = null;
									}
									color = y > 0 ? "#5BD282" : "#FE8081";
									obj.data.push({
										name,
										y,
										color,
										locationID: d,
										originalY: rData[d][rt.pe] * 1,
									});
								}
							}
						}
					});
					drilldown.series.push(obj);
				});
			}
		});
		return {
			series,
			drilldown,
			categories,
			items,
			fields,
		};
	},
	dxDataNonCalculated: (
		response,
		countryID,
		catArray,
		items,
		fields,
		chartType,
		tableLocationHeader,
		tablePeriodHeader,
		periodType
	) => {
		let pe = response.data.metaData.dimensions.pe;
		let categories = [];
		if (chartType === "period") {
			pe.forEach((p) => {
				if (response.data.metaData.items[p]) {
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
				}
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
			series = [];

		let rows = response.data.rows.filter((r) => r[ouIndex] !== countryID[0]);
		let uniqueOU = {};
		response.data.metaData.dimensions.ou.forEach((ou) => {
			if (ou !== countryID[0]) {
				uniqueOU[ou] = "IA";
			}
		});
		let pData = {};
		pe.forEach((p) => {
			let rCatData = {};
			catArray.forEach((item) => {
				let catData = { name: item.name, methods: [] };
				item.methods.forEach((m) => {
					let methodData = { name: m.name, de: [] };
					m.dx.forEach((dx) => {
						let innerDX = { deID: dx, count: {} };
						rows.forEach((r) => {
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

		let peDECompare = {};
		Object.keys(pData).forEach((pd) => {
			let deCompare = {};
			Object.keys(pData[pd]).forEach((rData) => {
				let catData = { name: rData, methods: [] };
				pData[pd][rData].methods.forEach((m) => {
					let methodData = { name: m.name, deCompare: {} };

					Object.keys(uniqueOU).forEach((ou) => {
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
					catData.methods.push(methodData);
				});
				deCompare[rData] = catData;
			});
			peDECompare[pd] = deCompare;
		});

		let peMethodCompare = {};
		Object.keys(peDECompare).forEach((pd) => {
			let methodCompare = {};
			Object.keys(peDECompare[pd]).forEach((deData) => {
				let catData = { name: deData, methodCompare: {} };
				Object.keys(uniqueOU).forEach((ou) => {
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

		let peFinalCount = {};
		Object.keys(peMethodCompare).forEach((pm) => {
			let finalCount = {};
			Object.keys(peMethodCompare[pm]).forEach((deData) => {
				let methodData = peMethodCompare[pm][deData].methodCompare,
					numerator = Object.keys(methodData).filter(
						(d) => methodData[d] === "T"
					).length,
					denominator = Object.keys(methodData).filter(
						(d) => methodData[d] === "F"
					).length;
				finalCount[deData] = {
					numerator,
					denominator: numerator + denominator,
				};
			});
			peFinalCount[pm] = finalCount;
		});

		let name = null,
			color = null,
			visible = null;
		if (chartType === "period") {
			catArray.forEach((cat) => {
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
					obj.data.push({
						name: response.data.metaData.items[d].name,
						y:
							peFinalCount[d][name].denominator * 1 !== 0
								? (
										(peFinalCount[d][name].numerator /
											peFinalCount[d][name].denominator) *
										100
								  ).toFixed(2) * 1
								: null,
						pe: d,
					});

					items[j] = {
						...items[j],
						[name]:
							peFinalCount[d][name].denominator * 1 !== 0
								? (
										(peFinalCount[d][name].numerator /
											peFinalCount[d][name].denominator) *
										100
								  ).toFixed(2) * 1
								: i18n.t("inactive"),
					};
				});
				series.push(obj);
			});
		} else {
			Object.keys(peFinalCount).forEach((d) => {
				Object.keys(peFinalCount[d]).forEach((m) => {
					let catData = catArray.find((c) => c.name == m);
					name = catData.name;
					color = catData.color;
					visible = catData.visible;
					let loc = fields.find((f) => f.key === name);
					if (!loc) {
						fields.push({
							key: name,
							sortable: true,
						});
					}

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
							peFinalCount[d][name].denominator * 1 !== 0
								? (
										(peFinalCount[d][m].numerator /
											peFinalCount[d][m].denominator) *
										100
								  ).toFixed(2) * 1
								: null,
						color: catData.color,
					});

					items[0] = {
						...items[0],
						[name]:
							peFinalCount[d][name].denominator * 1 !== 0
								? (
										(peFinalCount[d][m].numerator /
											peFinalCount[d][m].denominator) *
										100
								  ).toFixed(2) * 1
								: i18n.t("inactive"),
					};
					series.push(obj);
				});
			});
		}

		return {
			series,
			categories,
			items,
			fields,
		};
	},
	dxTotalOUData: (
		response,
		countryID,
		catArray,
		items,
		fields,
		sourceConfig,
		cypArray,
		total,
		totalObj,
		tableLocationHeader,
		methodCYP
	) => {
		let ou = response.data.metaData.dimensions.ou.filter(
			(o) => o !== countryID[0]
		);
		let categories = [];
		ou.forEach((o) => {
			if (response.data.metaData.items[o]) {
				categories.push(response.data.metaData.items[o].name);
				items.push({
					[tableLocationHeader]: response.data.metaData.items[o].name,
					_cellVariants: { [tableLocationHeader]: "light" },
				});
			}
		});
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

		catArray.forEach((dx) => {
			let rData = {};
			response.data.rows.forEach((r) => {
				let c =
					cypArray.length !== 0
						? cypArray.find((ca) => ca.dx === r[dxIndex])
						: null;
				if (dx.dx.includes(r[dxIndex])) {
					if (Object.keys(rData).includes(r[peIndex])) {
						if (r[ouIndex] !== countryID[0]) {
							if (Object.keys(rData[r[peIndex]]).includes(r[ouIndex])) {
								rData[r[peIndex]][r[ouIndex]] = methodCYP
									? Number(rData[r[peIndex]][r[ouIndex]]) +
									  parseInt(Number(r[valueIndex]) * Number(c.cyp))
									: Number(rData[r[peIndex]][r[ouIndex]]) +
									  Number(r[valueIndex]);
							} else {
								rData[r[peIndex]][r[ouIndex]] = methodCYP
									? parseInt(Number(r[valueIndex]) * Number(c.cyp))
									: Number(r[valueIndex]);
							}
						}
					} else {
						if (r[ouIndex] !== countryID[0]) {
							rData[r[peIndex]] = {
								[r[ouIndex]]: methodCYP
									? parseInt(Number(r[valueIndex]) * Number(c.cyp))
									: Number(r[valueIndex]),
							};
						}
					}
				}
			});
			if (total) {
				if (cypArray.length !== 0) {
					response.data.rows.forEach((r) => {
						let c = cypArray.find((ca) => ca.dx === r[dxIndex]);
						if (dx.dx.includes(r[dxIndex])) {
							if (Object.keys(rData1).includes(r[peIndex])) {
								if (r[ouIndex] !== countryID[0]) {
									if (Object.keys(rData1[r[peIndex]]).includes(r[ouIndex])) {
										rData1[r[peIndex]][r[ouIndex]] =
											Number(rData1[r[peIndex]][r[ouIndex]]) +
											parseInt(Number(r[valueIndex]) * Number(c.cyp));
									} else {
										rData1[r[peIndex]][r[ouIndex]] = parseInt(
											Number(r[valueIndex]) * Number(c.cyp)
										);
									}
								}
							} else {
								if (r[ouIndex] !== countryID[0]) {
									rData1[r[peIndex]] = {
										[r[ouIndex]]: parseInt(
											Number(r[valueIndex]) * Number(c.cyp)
										),
									};
								}
							}
						}
					});
				} else {
					response.data.rows.forEach((r) => {
						if (dx.dx.includes(r[dxIndex])) {
							if (Object.keys(rData1).includes(r[peIndex])) {
								if (r[ouIndex] !== countryID[0]) {
									if (Object.keys(rData1[r[peIndex]]).includes(r[ouIndex])) {
										rData1[r[peIndex]][r[ouIndex]] =
											Number(rData1[r[peIndex]][r[ouIndex]]) +
											Number(r[valueIndex]);
									} else {
										rData1[r[peIndex]][r[ouIndex]] = Number(r[valueIndex]);
									}
								}
							} else {
								if (r[ouIndex] !== countryID[0]) {
									rData1[r[peIndex]] = {
										[r[ouIndex]]: Number(r[valueIndex]),
									};
								}
							}
						}
					});
				}
			}

			Object.keys(rData).forEach((d) => {
				let name = dx.name;
				let color = dx.color;
				let visible = dx.visible;

				fields.push({ key: name, sortable: true });
				obj = {
					name,
					visible,
					data: [],
					color: color
						? color
						: "#" + ((Math.random() * 0xffffff) << 0).toString(16),
				};
				ou.forEach((o, i) => {
					if (Object.keys(rData[d]).includes(o)) {
						obj.data.push({
							name: categories[i],
							y: (rData[d][o] * 1).toFixed(2) * 1,
						});

						items[i] = {
							...items[i],
							[name]: (rData[d][o] * 1).toFixed(2) * 1,
						};
					} else {
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
				series.push(obj);
			});
		});

		if (total && Object.keys(rData1).length) {
			Object.keys(rData1).forEach((d) => {
				let name = totalObj.name,
					color = totalObj.color,
					visible = totalObj.visible;

				fields.push({ key: name, sortable: true });
				obj = {
					name,
					visible,
					data: [],
					color,
				};
				ou.forEach((o, i) => {
					if (Object.keys(rData1[d]).includes(o)) {
						obj.data.push({
							name: categories[i],
							y: (rData1[d][o] * 1).toFixed(2) * 1,
						});

						items[i] = {
							...items[i],
							[name]: (rData1[d][o] * 1).toFixed(2) * 1,
						};
					} else {
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
				series.unshift(obj);
			});
		}
		return {
			series,
			categories,
			items,
			fields,
		};
	},
	dxPEData: (
		response,
		countryID,
		catArray,
		items,
		fields,
		sourceConfig,
		cypArray,
		tablePeriodHeader,
		periodType
	) => {
		let pe = response.data.metaData.dimensions.pe;
		let categories = [];
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
			series = [];
		catArray.forEach((dx) => {
			let rData = {};
			if (cypArray.length === 0) {
				response.data.rows.forEach((r) => {
					if (dx.dx.includes(r[dxIndex])) {
						if (Object.keys(rData).includes(r[ouIndex])) {
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
			} else {
				response.data.rows.forEach((r) => {
					let c = cypArray.find((ca) => ca.dx === r[dxIndex]);
					if (dx.dx.includes(r[dxIndex])) {
						if (Object.keys(rData).includes(r[ouIndex])) {
							if (Object.keys(rData[r[ouIndex]]).includes(r[peIndex])) {
								rData[r[ouIndex]][r[peIndex]] =
									Number(rData[r[ouIndex]][r[peIndex]]) +
									parseInt(Number(r[valueIndex]) * Number(c.cyp));
							} else {
								rData[r[ouIndex]][r[peIndex]] = parseInt(
									Number(r[valueIndex]) * Number(c.cyp)
								);
							}
						} else {
							rData[r[ouIndex]] = {
								[r[peIndex]]: parseInt(Number(r[valueIndex]) * Number(c.cyp)),
							};
						}
					}
				});
			}

			Object.keys(rData).forEach((d) => {
				if (d === countryID[0]) {
					let name = dx.name;
					let color = dx.color;
					let visible = dx.visible;

					fields.push({ key: name, sortable: true });
					obj = {
						name,
						visible,
						data: [],
						color: color
							? color
							: "#" + ((Math.random() * 0xffffff) << 0).toString(16),
					};
					pe.forEach((p, i) => {
						if (Object.keys(rData[d]).includes(p)) {
							obj.data.push({
								name: categories[i],
								pe: p,
								y: (rData[d][p] * 1).toFixed(2) * 1,
							});

							items[i] = {
								...items[i],
								[name]: (rData[d][p] * 1).toFixed(2) * 1,
							};
						} else {
							obj.data.push({
								name: categories[i],
								pe: p,
								y: null,
							});
							items[i] = {
								...items[i],
								[name]: "",
							};
						}
					});
					series.push(obj);
				}
			});
		});

		return {
			series,
			categories,
			items,
			fields,
		};
	},
};
