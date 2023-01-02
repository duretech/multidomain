const oMethods  = {
    longTerm :[
        "sterilization",
        "iud",
        "implant"
    ],
    shortTerm:[
        "injectable",
        "pill",
        "condom",
        "other modern methods",
        "emergency contraception"
    ]
}
const getSlope = (p_obj,_n) =>{
    let oFinal = {};
    for(let i in p_obj){
        let denominator = ((_n * p_obj[i].sumXsq) - (p_obj[i].sumXofsq))
        let nProd = 0
        if(denominator !=0){
            nProd = ((_n*p_obj[i].sumxY) - (p_obj[i].sumX * p_obj[i].sumY))/denominator;
        }
        oFinal[i] = (nProd * 100).toFixed(3) * 1;
    }
    return oFinal;
}
const getSlopeOperands = (p_data) =>  {
    let _nSumX = 0, _nSumxY = 0,_nSumY = 0,
        _nSumXsq =  0;
    for(let m in p_data){
        _nSumX += m * 1;
        _nSumY += p_data[m];
        _nSumxY += m * p_data[m];
        _nSumXsq += m * m;
    }
    return {
        sumX:_nSumX,
        sumxY:_nSumxY,
        sumY:_nSumY,
        sumXsq:_nSumXsq,
        sumXofsq:_nSumXsq * _nSumXsq
    };
}
const RoundTo = (number, roundto) => {
    return roundto * Math.round(number/roundto);
}
export default{
    /**
        * This function is to get formated data as per charts
        * Usage: `getFormatedData(p_data, p_global)`
        * @param 'p_data, p_global' p_data is data of indivisual tab, p_global is global config.
        * @return {Object} oData
    */
getFormatedData:(p_data,p_global, tabName) => {
        let sources = {
            commoditiesToClients: 'Commodities Distributed to Clients',
            commoditiesToFacilities: 'Commodities Distributed to Facilities',
            fp_visits: 'FP Visits',
            fp_users: 'FP Users'
        }
        let oData = {
            // type:p_data.chartOptions.chart.type.toLowerCase(),
            type:'column',
            // title:p_data.chartOptions.title.title,
            // visible:p_data.chartOptions.title.visible,
            // xTitle:p_data.chartOptions.xAxis.title.text,
            // yTitle:p_data.chartOptions.yAxis.title.text,
            // title:"",
            
            // xTitle:"",
            // yTitle:"",
            startingYear:p_global.startingYear,
            locationId:p_global.defaultLocationID[0],
            chartArr:[]
        },i,aChart = p_data.chartData,nLen = aChart.length,oTotalCyp = null, emuColors = {};

        loop1 : for(i = 0;i < nLen;i++){
            if(aChart[i].indicator.name === "Total CYP" || !aChart[i].indicator.subIndicator){
                oTotalCyp = aChart[i].indicator;
                continue loop1;
            }
            emuColors[aChart[i].indicator.name] = aChart[i].indicator.chartOptions.color
            //console.log(aChart[i].indicator)
            let oOptions = {
                // color:aChart[i].indicator.color,
                title: aChart[i].indicator.chartOptions.title.title,
                ppttitle: sources[tabName] +' - '+aChart[i].indicator.chartOptions.title.title,
                color:aChart[i].indicator.chartOptions.color,
                name:aChart[i].indicator.name,
                xTitle:aChart[i].indicator.chartOptions.xAxis.title.text,
                yTitle:aChart[i].indicator.chartOptions.yAxis.title.text,
                // visible:aChart[i].indicator.visible,
                disable: aChart[i].indicator.disableChart,
                visible:true,
                chartInfo: aChart[i].indicator.chartInfo,
                cID: aChart[i].indicator.cid,
                // source:aChart[i].indicator.source
                source:aChart[i].indicator.chartOptions.chartDataSource.text
            },j,aDataElems = [],aSubInd = aChart[i].indicator.subIndicator,
            njLen = aSubInd.length,oCyp = {};
            
            for(j = 0;j < njLen;j++){
                emuColors[aSubInd[j].name[0]] = aSubInd[j].color
                let oDe = {
                        name:typeof aSubInd[j].name == "object" ? aSubInd[j].name[0] : aSubInd[j].name,
                        displayName:[],de:[],
                        color:aSubInd[j].color
                    } ,oSelectedDE = aSubInd[j].selectedDE ;

                // commented old /
                /* if(!oSelectedDE.length){
                    continue loop1;
                } */
                // /
                let mName = typeof aSubInd[j].name == "object" ? aSubInd[j].name[0] : aSubInd[j].name
                oCyp[mName] = aSubInd[j].cyp;
                oDe.de = aSubInd[j].de;
                // commented for modified api calls /
                /*
                for(let k in oSelectedDE){
                    oDe.displayName.push(oSelectedDE[k].displayName);
                    oDe.de.push(oSelectedDE[k].id);
                } */
                if(oDe.de.length){
                    aDataElems.push(oDe);
                }
            }
            if(!aDataElems.length){
                continue loop1;
            }
            oOptions.dataElems = aDataElems;
            oOptions.cyp = oCyp;
            oData.chartArr.push(oOptions);
        }
        //console.log(emuColors)
        localStorage.setItem("emuColors", JSON.stringify(emuColors));
        return {
            data : oData,
            totalCYP : oTotalCyp
        };
    },
    /**
        * This function is to get formated data as per charts
        * Usage: `getYearFormated(p_start)`
        * @param 'p_start' start year in global config
        * @return {Array} return array of years starting from p_start
    */
    getYearFormated:(p_start,p_end) =>{
        let sCurYear = p_end * 1,
            nStartYear = p_start * 1,
            aYear = [nStartYear];
        while(nStartYear < sCurYear){
            aYear.push(++nStartYear);
        }
        return aYear.join(';');
    },
    /**
        * This function is to get formated data as per charts
        * Usage: `getChartFormatedData(p_response,p_data,oTarget)`
        * @param {p_response,p_data,oTarget}
        * @return {Object} formated data to be used in calculations
    */
    getChartFormatedData : (p_response,p_data,oTarget) =>{
        let i,nLen = p_response.length,
            sName = p_data.name;
        for(i = 0;i < nLen;i++){
            let sYear = p_response[i][1];
            if(!oTarget[sYear]){
                oTarget[sYear] = {};
            }
            oTarget[sYear][sName] = (oTarget[sYear][sName] || 0) + p_response[i][3] * 1;
        }
        return oTarget;
    },
    /**
        * This function is to get formated data as per charts
        * Usage: `getFinalChartData(p_data,p_config)`
        * @param {p_data => year wise data,p_config => chart config containing type, color etc.}
        * @return {Object} formated data to be used in HighCharts
    */
    getFinalChartData:(p_data,p_config)=>{
        let aCharts = p_data.charts,aCats = [],oSeries = {},aData = [],
            oColor = {}, newTableData = [],newFields = [];
        for(let i in aCharts){
            aCats.push(i);
            let nTemp = 0
            for(let j in aCharts[i]){
                if(!oSeries[j]){
                    oSeries[j] = [];
                }
                oSeries[j].push(aCharts[i][j]);
                if(!oColor[j]){
                    oColor[j] = p_data.dataElems[nTemp].color;
                    nTemp++;
                }
            }
        }
        //console.log(oSeries)
        newFields.push({key: 'Period', sortable: true})
        aCats.forEach((key, i)=>{
            let row = {}
            row['Period'] = key
            for(let k in oSeries){
                if(newFields.indexOf(k) == -1){
                    newFields.push(k)
                }
                row[k] = oSeries[k][i]
            }
            newTableData.push(row)
        })
        for(let k in oSeries){
            let oTemp = {
                name:k,
                data:oSeries[k],
                color:oColor[k]
            }
            aData.push(oTemp);
            /*  */
            let oRow = {Method:k};
            oSeries[k].forEach((ele,index) => {
                oRow[aCats[index]] = ele;
            });
            /*  */
        }
       // console.log(aTableData, aFields)
        return {
            categories:aCats,
            data:aData,
            title:p_data.name,
            ppttitle:p_data.ppttitle + p_data.name,
            tableData:newTableData,
            fields:newFields,
            visible: p_data.visible,
            source:p_data.source,
            disableChart:p_data.disable ,
            chartInfo: p_data.chartInfo,
            cid: p_data.cID,
            ...p_config
        };
    },
    /**
        * This function is to calculate total CYP chart
        * Usage: `getTotalCYP(p_charts)`
        * @param {p_charts = > object containing overall data of all the input charts of perticular type}
        * @return {Object} formated data to calculate
    */
    getTotalCYP:(p_charts) => {
        let i,nLen = p_charts.length,oData = {};
        for(i = 0; i < nLen;i++){
            let oCharts = p_charts[i].charts,
                oCyp = p_charts[i].cyp;
            for(let j in oCharts){
                for(let k in oCharts[j]){
                    oData[j] = (oData[j] || 0) + oCharts[j][k] *  oCyp[k];
                }
            }
        }
        return oData
    },
    /**
        * This function is to calculate total CYP chart
        * Usage: `getFinalTotalCYP(p_data,p_config,oConfig)`
        * @param {p_data => total cyp data,p_config => global config,oConfig => total cyp config}
        * @return {Object} formated data to be used in HighCharts
    */
    getFinalTotalCYP:(p_data,p_config,oConfig, tabName) => {
        let sources = {
            commoditiesToClients: 'Commodities Distributed to Clients',
            commoditiesToFacilities: 'Commodities Distributed to Facilities',
            fp_visits: 'FP Visits',
            fp_users: 'FP Users'
        }
        let aCats = [],aSeries = [{name:oConfig.name,data:[],color:oConfig.chartOptions.color}],
            aTableData = [],aFileds = [{key:'Method'}],
            oRow = {Method:'Total CYP'};
        for(let i in p_data){
            aCats.push(i);
            // aSeries[0].data.push(p_data[i].toFixed(2) * 1);
            aSeries[0].data.push(Math.round(p_data[i]));
            aFileds.push({key:i});
            oRow[i] = p_data[i].toFixed(2);
        }
        aTableData.push(oRow);
        return {
            categories:aCats,
            data:aSeries,
            tableData:aTableData,
            fields:aFileds,
            title:oConfig.name,
            ppttitle:sources[tabName]+' - '+oConfig.name,
            visible: true,
            ...oConfig,
            ...p_config
        };
    },
    /**
     *
     *
    */
    calculateCA : (p_arr, p_adjF) =>{
        let i, nLen = p_arr.length,
            oCA = {},oCYP = {};
        for(i = 0;i < nLen;i++){
            let oChart = p_arr[i].charts,
                // sName = p_arr[i].name.toLowerCase(),
                sName = p_arr[i].name,
                otempCyp = p_arr[i].cyp;
            for(let j in oChart){
                for(let k in oChart[j]){
                    if(!oCA[sName+'__'+k]){
                        oCA[sName+'__'+k] = {};
                    }
                    oCA[sName+'__'+k][j] = ((oChart[j][k] * 100) / (p_adjF[k] * 1)).toFixed(3) * 1;
                }
            }
            /* cyp calculation */
            for(let j in otempCyp){
                oCYP[j] = otempCyp[j];
            }
            /*  */
        }
        //console.log(oCA, oCYP)
        return {
            data:oCA,
            cyp:oCYP
        };
    },
    calculateBU:(p_step,p_cont) =>{

        let i,oBU = {};
        for(i in p_step){
            let aSplit = i.split('__'),
                // sMethod = aSplit[0],
                sMethod = aSplit[0].toLocaleLowerCase(),
                sSubM = aSplit[1],
                sYear = Object.keys(p_step[i])[0];
            if(!oBU[i]){
                oBU[i] = {}
            }
            if(oMethods.longTerm.indexOf(sMethod) > -1 && p_cont[sSubM]){
                let nIndex = 0,sFirstYear = Object.keys(p_step[i])[0];
                for(let j in p_step[i]){
                    let nCont = p_cont[sSubM][nIndex] ? p_cont[sSubM][nIndex] : 0;
                    // oBU[i][j] = p_step[i][sYear] * nCont;
                    oBU[i][j] = Math.round(p_step[i][sFirstYear] * nCont);
                    nIndex++
                }
            }else{
                for(let j in p_step[i]){
                    oBU[i][j] = Math.round(p_step[i][j]);
                }
            }
        }
        return oBU;
    },
    calculateAdjustedVals:(p_BU,p_CA,p_repoRate,p_cypFactors,p_isUser,p_cont) => {
        let oAdustedVals = {},oCR = {};
        for(let x in p_cont){
            oCR[x] = [];
            let aMethodCont = p_cont[x].continuation;
            for(let z in aMethodCont){
                oCR[x].push(aMethodCont[z]);
            }
        }
        //console.log(oCR)
        for(let i in p_BU){
            let aSplit = i.split('__'),
                // sMethod = aSplit[0],
                sMethod = aSplit[0].toLocaleLowerCase(),
                sSubM = aSplit[1];
            if(!oAdustedVals[i]){
                oAdustedVals[i] = {};
            }
            if(oMethods.shortTerm.indexOf(sMethod) > -1 || p_isUser){
                for(let j in p_BU[i]){
                    if(p_repoRate[j] < 60){
                        oAdustedVals[i][j] = 0;
                    }else{
                        oAdustedVals[i][j] = Math.round(p_BU[i][j] * p_cypFactors[sSubM]);
                    }
                }
            }else{

                let nCounter = 0,
                    aYears = Object.keys(p_CA[i]);
                for(let j in p_BU[i]){
                    let k = 1,nSum = 0,l = nCounter;
                    oAdustedVals[i][j] = p_BU[i][j];
                    while(l > 0){
                        let sYr = aYears[k];
                        nSum += p_CA[i][sYr] * (oCR[sSubM][l-1] ? oCR[sSubM][l-1] : 0)
                        l--;
                        k++;
                    }
                    oAdustedVals[i][j] += nSum;
                    oAdustedVals[i][j] = Math.round(oAdustedVals[i][j]);
                    if(p_repoRate[j] < 60){
                        oAdustedVals[i][j] = 0;
                    }
                    nCounter++;
                }
            }
        }
        return oAdustedVals;
    },
    getSumOfCont:(p_obj) => {
        let oFinal = {};
        for(let i in p_obj){
            oFinal[i] = [];
            let nSum = 0,aMethods = [],aFinalMthodVals = [],
                aContinuation = p_obj[i].continuation;
            for(let j in aContinuation){
                nSum += aContinuation[j] * 1;
                aMethods.push(aContinuation[j] * 1);
            }
            let nLen = aMethods.length,k;
            aFinalMthodVals.push(nSum.toFixed(3) * 1);
            for(k = 0;k < nLen - 1; k++){
                nSum -= aMethods[k];
                aFinalMthodVals.push(nSum.toFixed(3) * 1);
            }
            oFinal[i] = aFinalMthodVals;
        }
        return oFinal;
    },
    getFinalOutPutChart:(p_data,p_tab)=>{
        /*  */
        let oSSTOEMUCOLORS = localStorage.getItem('SSTOEMUCOLORS'),
            oTabColors = {};
        if(oSSTOEMUCOLORS){
            oSSTOEMUCOLORS = JSON.parse(oSSTOEMUCOLORS);
            oTabColors = oSSTOEMUCOLORS[p_tab] ? oSSTOEMUCOLORS[p_tab] : {};
        }
        /*  */
        let oFinal = {},aCats = [],oFinalColors = {};
        for(let i in p_data){
            let aSplit = i.split('__'),
                sMethod = aSplit[0],
                sSubM = aSplit[1],
                bIsSter = sMethod.toLocaleLowerCase() === 'sterilization',
                sSterProp = `${sMethod} ${sSubM}`;

            if(bIsSter){
                if(!oFinal[sSterProp]){
                    oFinal[sSterProp] = {};
                }
                oFinalColors[sSterProp] = oTabColors[sSubM]
            }else{
                if(!oFinal[sMethod]){
                    oFinal[sMethod] = {};
                }
                oFinalColors[sMethod] = oTabColors[sSubM];
            }

            for(let j in p_data[i]){
                if(aCats.indexOf(j) === -1){
                    aCats.push(j);
                }
                if(bIsSter){
                    oFinal[sSterProp][j] =  (oFinal[sSterProp][j] || 0 )+ p_data[i][j];
                }else{
                    oFinal[sMethod][j] = (oFinal[sMethod][j] || 0) + p_data[i][j];
                }
            }
        }
        /*  */
        let nCats = aCats.length,aFinalData = [], newFields = [], newTableData = [], newFinalData = [];
        /*  */
        
        for(let k in oFinal){
            let oTemp = {name:k,data:[],color:oFinalColors[k]};
            for(let l = 0; l < nCats; l++){
                let nVal = oFinal[k][aCats[l]];
                if(nVal){
                    oTemp.data.push(nVal.toFixed(1) * 1);
                }else{
                    oTemp.data.push(0);
                }
            }
            aFinalData.push(oTemp);
        }
        newFields.push({key: 'Period', sortable: true})
        for(let l = 0; l < nCats; l++){
            let newORow = {}
            newORow['Period'] = aCats[l]
            for(let k in oFinal){
                if(newFields.indexOf(k) == -1){
                    newFields.push(k)
                }
                newORow[k] = oFinal[k][aCats[l]]
            }
            newTableData.push(newORow)
        }
        
        return{
            categories:aCats,
            data:aFinalData,
            tableData:newTableData,
            fields:newFields
        }

    },
    getComparingEstimateModernUsers:(p_data,p_tab) =>{
        let oSSTOEMUCOLORS = localStorage.getItem('SSTOEMUCOLORS'),
            oTabColors = {};
        if(oSSTOEMUCOLORS){
            oSSTOEMUCOLORS = JSON.parse(oSSTOEMUCOLORS);
            oTabColors = oSSTOEMUCOLORS[p_tab] ? oSSTOEMUCOLORS[p_tab] : {};
        }
        let oFinal = {},aCats = [],aMethodMixCats = [],oFinalColors = {};
        for(let i in p_data){
            let aSplit = i.split('__'),
                sMethod = aSplit[0],
                sSubM = aSplit[1],
                bIsSter = sMethod.toLocaleLowerCase() === 'sterilization',
                //sSterProp = `${sMethod} ${sSubM}`;
                sSterProp = `${sSubM}`;

            if(bIsSter && aCats.indexOf(sSterProp) === -1){
                aCats.push(sSterProp);
                aMethodMixCats.push(sSubM);
                oFinalColors[sSterProp] = oTabColors[sSubM];
            }else if(aCats.indexOf(sMethod) === -1){
                aCats.push(sMethod);
                aMethodMixCats.push(sMethod);
                oFinalColors[sMethod] = oTabColors[sSubM];
            }

            for(let j in p_data[i]){
                if(!oFinal[j]){
                    oFinal[j] = {};
                }
                if(bIsSter){
                    oFinal[j][sSterProp] = (oFinal[j][sSterProp] || 0) + p_data[i][j];
                }else{
                    oFinal[j][sMethod] = (oFinal[j][sMethod] || 0) + p_data[i][j]
                }
            }
        }
        /*  */
        let oFinalData = {},nTypes = aCats.length;
        for(let k in oFinal){
            oFinalData[k] = {};
            let aTemp = [];
            for(let l = 0; l < nTypes; l++){
                let oTemp = {name : aCats[l],data:[],color:oFinalColors[aCats[l]]},
                    nVal = oFinal[k][aCats[l]];
                if(nVal){
                    // oTemp.data.push(nVal.toFixed(1) * 1);
                    oTemp.data.push(RoundTo(nVal,100));

                }else{
                    oTemp.data.push(0);
                }
                aTemp.push(oTemp);
            }
            oFinalData[k] = aTemp;
        }

        return {
            cats:aCats,
            data:oFinalData,
            methodMixCats:aMethodMixCats
        }
    },
    getMethodMixComparision:(p_data) => {
        let emuColors = JSON.parse(localStorage.getItem('emuColors'))
        let i,oChartData = {},oColor = {};
        for(i in p_data){
            oChartData[i] = {}
            let j,nLen = p_data[i].length,aArr = p_data[i],aTemparr = [],
                nSum = 0;
            for(j = 0; j < nLen;j++){
                let oSlice = {
                    name:aArr[j].name,
                    y : aArr[j].data[0],
                    color:aArr[j].color
                }
                if(!oColor[oSlice.name]){
                    //oColor[oSlice.name] = oSlice.color ? oSlice.color : '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
                    oColor[oSlice.name] = oSlice.color ? oSlice.color : emuColors[oSlice.name];
                }
                nSum += aArr[j].data[0]
                aTemparr.push(oSlice);
            }
            oChartData[i].data = aTemparr;
            oChartData[i].sum = nSum;
        }
        /*  */
        let oFinalData = {};
        for(let k in oChartData){
            let nTotal = oChartData[k].sum,
                aTempArr = oChartData[k].data,l,nkLen = aTempArr.length;
            for(l = 0; l < nkLen;l++){
                aTempArr[l].y = (aTempArr[l].y / nTotal) * 100;
            }
            oFinalData[k] = aTempArr;
        }
        /* additional Colors for other pie charts*/
        if(!oColor['Tubal Ligation (F)']){
            oColor['Tubal Ligation (F)'] = oColor['Sterilization Tubal Ligation (F)'];
        }
        if(oColor['Condom(m+f)'] !== oColor['Condom']){
            oColor['Condom(m+f)'] = oColor['Condom'];
        }
        if(!oColor['OC Pills']){
            oColor['OC Pills'] = oColor['Pill'];
        }
        oColor['LAM'] = oColor['Other Modern Methods'];
        
        /*  */
        return {
            series:oFinalData,
            color:oColor
        }
    },
    getMethodMixPie:(p_data,p_color) => {
        let aFinalData = []
        for(let i in p_data){
            let oTemp = {name:i,y:p_data[i]};
            if(p_color && p_color[i]){
                oTemp.color = p_color[i];
            }
            aFinalData.push(oTemp)
        }
        return aFinalData;
    },
    getUserTrendsByMethods:(p_cat,p_DHS,p_UNPD,p_data,p_pop,p_bAllWomwn, contName,p_FPET, defaultLevel, currentLevel) => {
        
        let aSource = {
            Commodities_Client: "Commodities to clients",
            Visits: "FP visits",
            Commodities_Facilities: "Commodities to facilitlity",
            User: "FP users"
          }
          let unpLabel = ''
          if(defaultLevel == currentLevel){
            unpLabel = p_bAllWomwn ? 'mCPR(AW):UNPD' : 'mCPR(MW):UNPD'
          }else{
            unpLabel = p_bAllWomwn ? 'mCPR(AW):FPET' : 'mCPR(MW):FPET'
          }
        let i, nLen = p_cat.length,oFinal = {unpd:[],dhs:[],emuCondms:[],emunoncondoms:[]},
            oCategories = {unpd: unpLabel,
                dhs: p_bAllWomwn ? 'mCPR(AW):DHS' : 'mCPR(MW):DHS',
                emuCondms:'EMU: '+aSource[contName]+' inc. Condoms',emunoncondoms:'EMU: '+aSource[contName]+' ex. Condoms'
            },
            oYearlyData = p_data.data,j;
        for(i = 0; i < nLen;i++){
            let sYear = p_cat[i],j
            let nUnpd = 0
            if(defaultLevel == currentLevel){
                nUnpd = p_UNPD[sYear] ? p_UNPD[sYear] : 0
            }else{
                nUnpd = p_FPET[sYear] ? p_FPET[sYear] : 0
            }
                //nUnpd = p_UNPD[sYear] ? p_UNPD[sYear] : 0,
            let nDhs = p_DHS[sYear] ? p_DHS[sYear] : 0
            oFinal.unpd.push(nUnpd);
            oFinal.dhs.push(nDhs);
            /*  */
            if(!oYearlyData[sYear]){
                oFinal.emuCondms.push(0);
                oFinal.emunoncondoms.push(0);
            }else{
                let nSumCon = 0,nSumnonCon = 0;
                for(j in oYearlyData[sYear]){
                    nSumCon += oYearlyData[sYear][j].data[0];
                    if(oYearlyData[sYear][j].name.toLowerCase() !== 'condom'){
                        nSumnonCon += oYearlyData[sYear][j].data[0];
                    }
                }
                let nTemp1 = nSumCon ? (nSumCon/p_pop[sYear]) * 100 : 0,
                    nTemp2 = nSumnonCon ? (nSumnonCon/p_pop[sYear]) * 100 : 0;
                oFinal.emuCondms.push(nTemp1.toFixed(1) * 1);
                oFinal.emunoncondoms.push(nTemp2.toFixed(1) * 1);
            }
        }
        /*  */
        let f,aData = [], aFields = [{key: 'Period', sortable: true}], atableData = [];
        /*  */
        
        for(f in oFinal){
            let nLenF = oFinal[f].length,x;
            for(x = 0; x < nLenF;x++){
                if(oFinal[f][x] == 0){
                    oFinal[f][x] = null;
                }
            }
            let oTemp = {name:oCategories[f],data:oFinal[f]};
            aData.push(oTemp);
        }
        let newLen = p_cat.length;
        for(let x = 0; x < newLen;x++){
            let row = {}
            row['Period'] = p_cat[x]
            for(f in oFinal){
                if(aFields.indexOf(oCategories[f]) == -1){
                    aFields.push(oCategories[f])
                }
                row[oCategories[f]] = oFinal[f][x]
            }
            atableData.push(row)
        }
        
        return{
            categories:p_cat,
            data:aData,
            fields: aFields,
            tableData: atableData
        }
    },
    getComparingSlopesData:({categories,data}, currentYear) => {
        // let _n = categories.length,
        
        let _n = categories.indexOf(currentYear.toString())+1,
            i,nLen = data.length,
            oData = {};
            //console.log(categories.indexOf(currentYear), categories, currentYear, _n, categories.length)
        for(i = 0; i < nLen;i++){
            let aArr = data[i].data,
                nSumX = 0,
                nSumxY = 0,
                nSumXsq = 0,
                nSumY = 0,
                sName = data[i].name;
            /*  */
            /* for(let j = 0; j < _n;j++){
                nSumxY += categories[j] * aArr[j];
                nSumXsq += aArr[j] *  aArr[j];
                nSumX += aArr[j];
                nSumY += categories[j] * 1;
            } */

            for(let j = 0; j < _n;j++){
                nSumxY += categories[j] * (aArr[j] / 100);
                nSumXsq += (categories[j] * 1) *  (categories[j] * 1);
                nSumX += categories[j] * 1;
                nSumY += (aArr[j] / 100) * 1;
            }

            oData[sName] = {
                sumX:nSumX,
                sumxY:nSumxY,
                sumY:nSumY,
                sumXsq:nSumXsq,
                sumXofsq:nSumX * nSumX
            };
        }
        let oRet = getSlope(oData,_n),_data = [],_i = 0,_count = 0,
            nProps = Object.keys(oRet).length, aFields=[{key: 'Method'},{key: 'Value', sortable: true}], aTableData = [];
        
        for(let j in oRet){
            let oRow = {Method: j, Value: oRet[j]}
            aTableData.push(oRow)
            let oTemp = {name:j,data:[]};
            for(_i = 0; _i < nProps;_i++){
                oTemp.data.push( _i === _count ?  oRet[j] : 0);
            }
            _count++
            _data.push(oTemp);
        }
        
        return {
            categories:Object.keys(oRet),
            data:_data,
            fields: aFields,
            tableData: aTableData
        }
    },
    getEMUOPCompChart:(p_data,p_isIncl, filter) => {
        
        let oProps = {
            commoditiesToClients:'EMU :Commodities to clients',
            commoditiesToFacilities:'EMU :Commodities to facilitlity',
            fp_users:'EMU :FP users',
            fp_visits:'EMU :FP visits',
        }
        let aCats, i, aMcprData = [],bMcpr = true,
            oTabsComp = {};
        for(i in p_data){
            if(!p_data[i].data){
                continue;
            }
            if(!aCats){
                aCats = p_data[i].categories;
            }
            let j , aData = p_data[i].data,nLen = aData ? aData.length : 0;
            if(bMcpr){
                for(j = 0; j < nLen; j++){
                    if(aMcprData.length < 2){
                        aMcprData.push(aData[j]);
                    }
                }
            }
            if(!oTabsComp[i]){
                oTabsComp[i] = []
            }
            aData[2].name = oProps[i];
            aData[3].name = oProps[i];
            oTabsComp[i].push(aData[2]);
            oTabsComp[i].push(aData[3]);
            bMcpr = false;
        }
        let aEmus = [];
       // console.log(oTabsComp, filter)
        for(let x in oTabsComp){
            //let oVal = p_isIncl ? oTabsComp[x][0] : oTabsComp[x][1];
            let oVal =  filter[x] == 'inc' ? oTabsComp[x][0] : oTabsComp[x][1];
            aEmus.push(oVal);
        }
        return{
            data:[...aMcprData,...aEmus],
            categories:aCats ? aCats :[]
        }
    },
    getComparisionofEmuMcpr:(p_data,p_isIncl,p_MICS,p_PMS,p_bAllWomwn, filter, locVal, defaultLevel)=>{
        //PMA data is commented for now
        let oStoreData =  {
            [p_bAllWomwn ? 'mCPR (AW): MICS' : 'mCPR (MW): MICS']:getSlopeOperands(p_MICS),
            //[p_bAllWomwn ? 'mCPR (AW): PMA' : 'mCPR (MW): PMA']:getSlopeOperands(p_PMS)
        },nYears = Object.keys(p_PMS).length,
            oStoreSlope = getSlope(oStoreData,nYears);
        /*  */
        let sUnpdprop = ''
        if(locVal == defaultLevel){
            sUnpdprop = p_bAllWomwn ? 'mCPR(AW):UNPD' : 'mCPR(MW):UNPD'
        }else{
            sUnpdprop = p_bAllWomwn ? 'mCPR(AW):FPET' : 'mCPR(MW):FPET'
        }
        let oData = {},
            sDhsprop = p_bAllWomwn ? 'mCPR(AW):DHS' : 'mCPR(MW):DHS',
            oGlobalSlopes = {[sUnpdprop ]:undefined,[sDhsprop]:undefined},
            oCats = {
                "commoditiesToClients":"EMU : Commodities to Clients",
                "commoditiesToFacilities":"EMU : Commodities to Facilities",
                "fp_visits":"EMU : FP Visits",
                "fp_users":"EMU : FP Users"
            };
        for(let i in p_data){
            if(!p_data[i].data){
                continue;
            }
            let aData = p_data[i].data;
            oData[i] = {};
            if(oGlobalSlopes[sUnpdprop] === undefined){
                oGlobalSlopes[sUnpdprop] = aData[0].data[0];
            }
            if(oGlobalSlopes[sDhsprop] === undefined){
                oGlobalSlopes[sDhsprop] = aData[1].data[1];
            }
            oData[i]['EMU: Commodities inc. Condoms'] = aData[2].data[2];
            oData[i]['EMU: Commodities ex. Condoms'] = aData[3].data[3];
        }
        /*  */
        
        for(let j in oData){
            oGlobalSlopes[oCats[j]] =  filter[j] == 'inc' ? oData[j]['EMU: Commodities inc. Condoms'] : oData[j]['EMU: Commodities ex. Condoms'];
           // oGlobalSlopes[oCats[j]] = p_isIncl ? oData[j]['EMU: Commodities inc. Condoms'] : oData[j]['EMU: Commodities ex. Condoms'];
        }
        oGlobalSlopes = {...oGlobalSlopes,...oStoreSlope};
        let aCategories = Object.keys(oGlobalSlopes),aFinalData = [],
            nProps = aCategories.length,_nCount = 0, aFields = ['Method', {key: 'Value', sortable: true}], atableData = [];

        
        for(let k in oGlobalSlopes){
            let row= {'Method': k, 'Value': oGlobalSlopes[k]}
            atableData.push(row)
            let oTemp = {name:k,data:[]};
            for(let x = 0; x < nProps;x++){
                oTemp.data.push(x === _nCount ? oGlobalSlopes[k]: 0);
            }
            _nCount++;
            aFinalData.push(oTemp);
        }
        /*  */
        
        return{
            categories:aCategories,
            data:aFinalData,
            tableData: atableData,
            fields: aFields
        }
    },
    getComparisionofUsersByMethods:(p_data,p_year) =>{
        let aCats = ['User by Methods(Survey)'],
            oProps = {
                commoditiesToClients:{name:'Commodities to Clients',index:1},
                commoditiesToFacilities:{name:'Commodities to Facilitlity',index:2},
                fp_users:{name:'FP Users',index:3},
                fp_visits:{name:'FP Visits',index:4},
            },aFinalData = [],aFinalCats = [],oRef = {},aCategoriesData = [0],aTempCats = [];
        for(let c in p_data){
            let aTemp = p_data[c].cats ? p_data[c].cats: [];
            if(aTemp.length > aFinalCats.length){
                aFinalCats = aTemp;
            }
            if(p_data[c].data){
                aCategoriesData.push(0);
            }else{
                aTempCats.push(oProps[c].name);
            }
        }

        /*  */

        for(let y = 0; y < aFinalCats.length;y++){
            // let oTemp = {name:aFinalCats[y],data:[0,0,0,0,0]}
            let oTemp = {name:aFinalCats[y],data:[...aCategoriesData]}
            aFinalData.push(oTemp);
            oRef[aFinalCats[y]] = y;
        }

        /*  */
        let aFields = [], atableData = []
        for(let i in p_data){
            // aCats.push(oProps[i].name);

            if(!p_data[i].data){
                continue;
            }
            aCats.push(oProps[i].name);
            let oData = p_data[i].data[p_year] ? p_data[i].data[p_year] : [],
                nLenth = oData.length,j,nInd = aCats.length - 1/* oProps[i].index */;
            // aCats.push(oProps[i].name);

            for(j = 0; j < nLenth;j++){
                let sName = oData[j].name,
                    nOrder = oRef[sName];
                if(nOrder !== undefined){
                    aFinalData[nOrder].data[nInd] = oData[j].data[0];
                    aFinalData[nOrder].data[0] =  oData[j].data[1]
                }
            }
        }
        
        aFields.push('Method')
        aFinalData.forEach(d=>{
            let row= {}
            row['Method'] = d.name
            aCats.forEach((c,i)=>{
                aFields.push(c)
                row[c] = d.data[i]
            })
            atableData.push(row)
        })
        //console.log(atableData, aFields)
        return {
            // categories:[...aCats,...aTempCats],
            categories:[...aCats],
            data:aFinalData,
            tableData: atableData,
            fields: aFields
        }
    },
    drawEMUUserbyMethods:(p_data) => {
        
        let aFinalCats = [],aFinalMethods = [],
            aCats = [],oFinalObj = {},
            oProps = {
                commoditiesToClients:{name:'Commodities to Clients',index:0},
                commoditiesToFacilities:{name:'Commodities to Facilitlity',index:1},
                fp_users:{name:'FP Users',index:2},
                fp_visits:{name:'FP Visits',index:3},
            },oRef = {};
        for(let i in p_data){
            if(oProps[i] != undefined){
                aCats.push(oProps[i].name);
            }
            oRef[i] = aCats.length - 1;
            let aTemp = p_data[i] ? p_data[i].categories : [],
                aTempData = p_data[i] ? p_data[i].data : [];
            if(!aTempData){
                continue;
            }
            if(aTemp.length > aFinalCats.length){
                aFinalCats = aTemp;
            }
            if(aTempData.length > aFinalMethods.length){
                aFinalMethods = aTempData.map((ele,ind) => {
                    return ele.name
                });
            }
        }

        for(let y = 0; y < aFinalMethods.length;y++){
            oFinalObj[aFinalMethods[y]] = {
                categories:aFinalCats,
                data:aCats.map((ele,ind) =>{
                    return{
                        name:ele,
                        data:aFinalCats.map(() => {
                            return 0;
                        })
                    }
                }),
                tableData: [],
                fields: []
            };
        }
        
        let aFields = [{key: 'Period', sortable: true}], atableData = []
        for(let k in p_data){
            if(!p_data[k].data){
                continue;
            }
            let aOgData = p_data[k].data,
                nLen = aOgData.length,l,nIndex = oRef[k]/* oProps[k].index */;
            for(l = 0; l < nLen;l++){
                let sName = aOgData[l].name;

                if(oFinalObj[sName]){
                    if(aFields.indexOf(oFinalObj[sName].data[nIndex].name) == -1){
                        aFields.push(oFinalObj[sName].data[nIndex].name)  
                    }
                    oFinalObj[sName].data[nIndex].data = p_data[k].data[l].data;
                }
            }
        }
        Object.keys(oFinalObj).forEach(method=>{
            oFinalObj[method].categories.forEach((p, i)=>{
                let row={}
                row['Period'] = p
                oFinalObj[method].data.forEach(d=>{
                    if(aFields.indexOf(d.name) == -1){
                        aFields.push(d.name)
                    }
                    row[d.name] = d.data[i]
                })
                oFinalObj[method].tableData.push(row)
                oFinalObj[method].fields = aFields
            })
        })
        
        return oFinalObj;
    },
    getTableFormatedData:(newData,methodSeq) =>{
        // let oMethods = {},aData = p_data.data,aMethodCats = p_data.cats,
        //     i,nLen = aData.length,nCatLen = p_cats.length;
        // for(i = 0; i < nLen;i++){
        //     let {name,data} = aData[i],j;
        //     oMethods[name] = {};
        //     for(j = 0; j < nCatLen;j++){
        //         let sYear = p_cats[j],
        //             nIndex = aMethodCats.indexOf(sYear);
        //         oMethods[name][sYear] = nIndex !== -1 ? data[nIndex] : 0;
        //     }
        // }
        // return oMethods;
        let oMethods = {}
        for(let methodind in Object.keys(newData)){
            let method = Object.keys(newData)[methodind]
            methodSeq.forEach((methodName, index)=>{
                if(methodName == method){
            let methodname = method.split('__')[0].split('/')[0],
            sSubMethod = method.split('__')[1].split('/')[0];
            if(!oMethods[methodname])
            oMethods[methodname]={}
            oMethods[methodname][sSubMethod] = {};
            let aCats = Object.keys(newData[method]);
            for(let j in aCats){
                let yr = aCats[j]
                let val = newData[method][yr] && newData[method][yr] !=undefined? newData[method][yr] : 0
                oMethods[methodname][sSubMethod][yr] = val;
            }
        }
        })
        }

        return oMethods;
    },
    getFormatedBackGroundData:(p_data,p_Keys,p_year,p_bAllWomwn) =>{
        let oNewKeys = {},oFinalbg = {},nYear = p_year.length,
            aRows = p_data.rows,r,nRows = aRows.length,oItem = p_data.metaData.items,
            oMethodMixPropsConf = p_bAllWomwn ? {
                'avenir_mcmm_injectable AVENIR WRA':'Injectable',
                //'avenir_mcmm_condom_m_f AVENIR WRA':'Condom(m+f)',
                'avenir_mcmm_condom_m_f AVENIR WRA':'Condom',
                'avenir_mcmm_other_modern_method AVENIR WRA':'Other Modern Methods',
                'avenir_mcmm_implant AVENIR WRA':'Implant',
                'avenir_mcmm_sterilization_male AVENIR WRA':'Vasectomy (M)',
                'avenir_mcmm_lam AVENIR WRA':'LAM',
                'avenir_mcmm_sterilization_female AVENIR WRA':'Tubal Ligation (F)',
                // 'avenir_mcmm_sterilization_female AVENIR WRA':'Sterilization Tubal Ligation (F)',
                //'avenir_mcmm_oc_pills AVENIR WRA':'OC Pills',
                'avenir_mcmm_oc_pills AVENIR WRA':'Pill',
                'avenir_mcmm_iud AVENIR WRA':'IUD',
            } : {
                'avenir_mcmm_injectable AVENIR MWRA':'Injectable',
                //'avenir_mcmm_condom_m_f AVENIR MWRA':'Condom(m+f)',
                'avenir_mcmm_condom_m_f AVENIR MWRA':'Condom',
                'avenir_mcmm_other_modern_method AVENIR MWRA':'Other Modern Methods',
                'avenir_mcmm_implant AVENIR MWRA':'Implant',
                'avenir_mcmm_sterilization_male AVENIR MWRA':'Vasectomy (M)',
                'avenir_mcmm_lam AVENIR MWRA':'LAM',
                'avenir_mcmm_sterilization_female AVENIR MWRA':'Tubal Ligation (F)',
                // 'avenir_mcmm_sterilization_female AVENIR MWRA':'Sterilization Tubal Ligation (F)',
                //'avenir_mcmm_oc_pills AVENIR MWRA':'OC Pills',
                'avenir_mcmm_oc_pills AVENIR MWRA':'Pill',
                'avenir_mcmm_iud AVENIR MWRA':'IUD',
            } ,
            oMethodMix = {},oMethodMixProps = {};
        for(let i in oMethodMixPropsConf){
            oMethodMixProps[i.toLowerCase()] = oMethodMixPropsConf[i];
        }
        for(let k in p_Keys){
            let aTemp = p_Keys[k],j,nLen = aTemp.length,
                sName = k;
            for(j = 0; j < nLen;j++){
                oNewKeys[aTemp[j]] = sName;
            }
            if(k === 'Most Recent Method Mix'){
                for(let l = 0; l < nYear;l++){
                    let sYear = p_year[l]
                    oMethodMix[sYear] = {};
                    for(let m in oMethodMixProps){
                        let sDisplayName = oMethodMixProps[m];
                        oMethodMix[sYear][sDisplayName] = 0;
                    }
                }
            }else{
                oFinalbg[k] = {};
                for(let l = 0; l < nYear;l++){
                    let sYear = p_year[l]
                    oFinalbg[k][sYear] = 0;
                }
            }
        }
        /*  */
        for(r = 0; r < nRows; r++){
            let sYr = aRows[r][1],
                nVal = aRows[r][3],sdes = aRows[r][0],
                sProp = oNewKeys[sdes];
            if(oNewKeys[sdes] === 'Most Recent Method Mix'){
                let sNameDe = oItem[sdes].name,
                    sRealMMName = oMethodMixProps[sNameDe.toLowerCase()];
                oMethodMix[sYr][sRealMMName] = (nVal * 1).toFixed(3) * 1;
            }else if(oFinalbg[sProp] && oFinalbg[sProp][sYr] !== undefined){
                oFinalbg[sProp][sYr] = (nVal * 1).toFixed(3) * 1;
            }
        }
        /*  */
        let y,nRecent = nYear - 1,oMostRecentMM = oMethodMix[nRecent] ? oMethodMix[nRecent] : {},
            bMM = false, recentYear = '';
        for(y = nRecent; y >= 0;y--){
            let sRecentYr = p_year[y],oRecent = oMethodMix[sRecentYr];

            if(oRecent){
                for(let z in oRecent){
                    if(oRecent[z]){
                        bMM = true;
                        break
                    }
                }
                if(bMM){
                    recentYear = sRecentYr
                    oMostRecentMM = oRecent;
                    break;
                }
            }
        }
        /*  */
        return {
            final:oFinalbg,
            methodMix:oMostRecentMM,
            recentYear: recentYear
        };
    },
    saveChartColors:(p_data,p_tab) =>{
        let i,nLen = p_data.length,oFinalColors = {};
        for(i = 0;i < nLen; i++){
            let aData = p_data[i].data;
            if(Array.isArray(aData)){
                let j,nCol = aData.length;
                for(j = 0;j < nCol;j++){
                    let sName = aData[j].name,
                        sColor = aData[j].color;
                    if(sColor){
                        oFinalColors[sName] = sColor;
                    }
                }
            }
        }

        /*  */
        let oSSTOEMUCOLORS = localStorage.getItem("SSTOEMUCOLORS");
        if(!oSSTOEMUCOLORS){
            oSSTOEMUCOLORS = {[p_tab]:oFinalColors}
        }else{
            oSSTOEMUCOLORS = JSON.parse(oSSTOEMUCOLORS);
            oSSTOEMUCOLORS[p_tab] = oFinalColors;
        }
        localStorage.setItem("SSTOEMUCOLORS", JSON.stringify(oSSTOEMUCOLORS));
    },
    getComputedContFact:(p_cont) => {
        for(let i in p_cont){
            for(let j in p_cont[i]){

                let nScalingFactor = p_cont[i][j].scalingFactor === undefined ?  1 : p_cont[i][j].scalingFactor * 1,
                    oContinuation =  p_cont[i][j].continuation,
                    nLen = Object.keys(oContinuation).length,
                    oFinal = {};
                for(let k = 0; k < nLen - 1; k++){
                    oFinal[k] = (((oContinuation[k] * 1 + oContinuation[k + 1] * 1) / 2) * nScalingFactor).toFixed(3) * 1
                }
                p_cont[i][j].continuation = oFinal;
            }
        }
        return p_cont;
    },
    RoundTo : (number, roundto) => {
        return roundto * Math.round(number/roundto);
    }
}
