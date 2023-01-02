export default{
    sortSeries:(p_type,p_data)=>{
        // console.log(p_data.chart.type,p_type, p_data);
        let sType = p_data.chart.type,
            aSeries = p_data.series;

        if(sType === 'line'){
            let axCats = p_data.xAxis.categories.slice();
            if(p_type === "numeric-asc" || p_type === 'date-asc'){
                axCats.sort((a,b) => {
                    let sA = new Date(a).getTime(),
                        sB = new Date(b).getTime();
                    if(sA < sB){
                        return -1 
                    }
                    return 0;
                });
            }else if(p_type === "numeric-desc"  || p_type === 'date-desc'){
                axCats.sort((a,b) => {
                    let sA = new Date(a).getTime(),
                        sB = new Date(b).getTime();
                    if(sA > sB){
                        return -1 
                    }
                    return 0;
                });
            }
            if(p_data.xAxis.categories[0] !== axCats){
                p_data.xAxis.categories = axCats;
                let s,nLength = aSeries.length;
                for(s = 0; s < nLength;s++){
                    aSeries[s].data.reverse();
                }
            }
        }else if(sType === 'bar' || (sType === 'column' && p_data.plotOptions && p_data.xAxis.categories)){
            let axCats = p_data.xAxis.categories.slice(),
                oIndices = {};
            axCats.forEach((element,index) => {
                oIndices[element] = index;
            });
            if(p_type === "alpha-asc"){
                axCats.sort((a,b) => {
                    if(a[0] < b[0]){
                        return -1
                    }
                    return 0;
                })
            }else if(p_type === "alpha-desc"){
                axCats.sort((a,b) => {
                    if(a[0] > b[0]){
                        return -1
                    }
                    return 0;
                });
            }
            if(axCats[0] !== p_data.xAxis.categories){
                p_data.xAxis.categories = axCats;
                let s,nLength = aSeries.length,k;
                for(s = 0; s < nLength;s++){
                    let aTemparr = [];
                    axCats.forEach((ele,ind) => {
                        aTemparr.push(aSeries[s].data[oIndices[ele]]);
                    });
                    aSeries[s].data = aTemparr;
                }
            }
        }else if(sType === 'column'){
            if(p_type === "alpha-asc"){
                let aData = aSeries[0].data;
                aData.sort((a,b) => {
                    if(a[0][0] < b[0][0]){
                        return -1
                    }
                    return 0;
                })
            }else if(p_type === "alpha-desc"){
                let aData = aSeries[0].data;
                aData.sort((a,b) => {
                    if(a[0][0] > b[0][0]){
                        return -1
                    }
                    return 0;
                });
            }
        }
    }
}