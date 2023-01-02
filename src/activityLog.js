export default {
  exportActivityLog: (data, filename) => {
    // Export activity logs in a text file
    var newD = [];
    const walk = (data) => {
      data.forEach((pdata, i) => {
        //  p.forEach((pdata,pi) =>{
        console.log(pdata);
        if (pdata.name != undefined) {
          newD.push(
            pdata.name + "\n" + pdata.time + "\n" + pdata.content + "\n\n\n\n"
          );
        } else {
          console.log(pdata);
          walk(pdata);
        }
        // })
      });
    };
    walk(data);
    console.log(newD);
    // exit();
    var newBlob = new Blob(newD);
    const url = window.URL.createObjectURL(newBlob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename); //or any other extension
    document.body.appendChild(link);
    link.click();
  },
  //exportActivityLog();
};
