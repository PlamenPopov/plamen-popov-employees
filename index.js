(function () {
 
    var fs = require('fs');
    var data = fs.readFileSync('mock_data.txt').toString().trim().split("\n");
    var result = [];

    for (let i = 0; i < data.length; i++) {
        var row_1 = data[i].split(", ");
        var projectID_1 = row_1[1];
        var fromDate_1 = new Date(row_1[2]);
        var toDate_1 = row_1[3].trim() !== "NULL" ? new Date(row_1[3]) : new Date();

       for (let j = i+1; j < data.length; j++) {

           var row_2 = data[j].split(", ");
           var projectID_2 = row_2[1];

           if (projectID_2 === projectID_1) {
                       
                var fromDate_2 = new Date(row_2[2]);
                var toDate_2 = row_2[3].trim() !== "NULL" ? new Date(row_2[3]) : new Date();          
                
               if ((fromDate_1 <= toDate_2) && (fromDate_2 <= toDate_1)) {
                   
                   
                   var overlapFrom = fromDate_1.getTime() > fromDate_2.getTime() ? fromDate_1 : fromDate_2;
                   var overlapTo = toDate_1.getTime() < toDate_2.getTime() ? toDate_1 : toDate_2;                  
                   var tempOverlapRange = Math.round(Math.abs((overlapFrom.getTime() - overlapTo.getTime())));
                   
                   var pairKey = Number(row_1[0]) < Number(row_2[0]) ? row_1[0] + row_2[0] : row_2[0] + row_1[0];
                   
                   var find = result.find(item => item.pairKey === pairKey);
                   if (find) {
                       find.overlapRange += tempOverlapRange;
                       find.projectsIDs.push(projectID_1);
                   } else {
                        result.push({
                            pairKey: pairKey,
                            overlapRange: tempOverlapRange,
                            pairOfEmployees: [row_1[0], row_2[0]],
                            projectsIDs: [projectID_1]
                        })
                   }
               }
           }
       }      
    }
    result.sort(function (a, b) {
        return a.overlapRange - b.overlapRange;
    });
    
    console.log(result.reverse()[0])
   

})();