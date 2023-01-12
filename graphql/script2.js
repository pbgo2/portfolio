import ("https://d3js.org/d3.v6.min.js")


let userLogin = "Peter"
let person= []
const MAXServerQueryLimit=50
let offset = [0,MAXServerQueryLimit]
let transaction =[]
let transactionTemp =[0]

let progress =[]
let progressTemp =[0]


const endpoint= 'https://learn.01founders.co/api/graphql-engine/v1/graphql'

  async function user() {
    let response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `{result(where: {user:{login:{_eq:${userLogin}}}},limit:1)   {campus user{id login}}}` }),
    })
    let data = response.json()
    return data
  }
  await user().then(data => {
    data.data.result.forEach(element => {
      person.push(element)
    });
  })
  .catch(err => console.error(err))


  async function transactions() {
    let response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `{transaction(where: {userId:{_eq:${person[0].user.id}}},offset:${offset[0]}) {amount type path createdAt objectId}}` }),
    })
    let data = response.json()
    return data
  }  
for (transactionTemp.length; transactionTemp.length != 0; offset[0] += offset[1]) {
  transactionTemp=[]
  await transactions().then(data => {
    data.data.transaction.forEach(element => {
      transaction.push(element)
      transactionTemp.push(element)
    });
  })
  .catch(err => console.error(err))
}


async function myProgress() {
  let response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: `{progress (where: {userId:{_eq:${person[0].user.id}}_and: {isDone:{_eq:true}}},offset:${offset[0]}) {id userId objectId grade createdAt updatedAt path isDone}}` }),
  })
  let data = response.json()
  return data
}  
for (progressTemp.length; progressTemp.length != 0; offset[0] += offset[1]) {
progressTemp=[]
await myProgress().then(data => {
  data.data.progress.forEach(element => {
    progress.push(element)
    progressTemp.push(element)
  });
})
.catch(err => console.error(err))
}

// console.log("aaa",person)  // 0
// console.log("aaa",person.length)  // 0
// console.log("bbb",transaction)  // 0
// console.log("bbb",transaction.length)  // 0
///////////////////////////////////////////////////////XP & Level/////////////////////////////////////////////////////////////
let xp = transaction.filter(xp => xp.type == "xp")
let level = transaction.filter(level => level.type == "level")
////////////////////////////////////////////////Obtain Levels/////////////////////////////////////////////////////////////////
//found maximum amount of value in the array level corresponding to the path /london/piscine-go/
let myLevel = []
let MAXlevelLondonPiscineGO = level.filter(level=> level.path.includes("/london/piscine-go/")).sort((a, b) => (a.amount > b.amount) ? -1 : 1)
//found maximum amount of value in the array level corresponding to the path /london/weekfour/
let MAXlevelLondonWeekFour = level.filter(level=> level.path.includes("/london/weekfour/")).sort((a, b) => (a.amount > b.amount) ? -1 : 1)
//found maximum amount of value in the array level corresponding to the path /london/div-01/piscine-js/
let MAXlevelLondonPiscineJS = level.filter(level=> level.path.includes("/london/div-01/piscine-js/")).sort((a, b) => (a.amount > b.amount) ? -1 : 1)
//found maximum amount of value in the array level corresponding to the path /london/div-01/ excluding the paths /london/div-01/piscine-js/ and /london/div-01/piscine-go/ and /london/div-01/weekfour/
let MAXlevelLondon = level.filter(level=> level.path.includes("/london/div-01/") && !level.path.includes("/piscine-js/")&& !level.path.includes("/piscine-go/")&& !level.path.includes("/weekfour/")&& !level.path.includes("/check-points/")).sort((a, b) => (a.amount > b.amount) ? -1 : 1)


myLevel.push(MAXlevelLondonPiscineGO[0].amount,MAXlevelLondonWeekFour[0].amount,MAXlevelLondonPiscineJS[0].amount,MAXlevelLondon[0].amount)

// console.log("myLevel",myLevel)  // 0
// console.log("MAXlevelLondonPiscineGO",MAXlevelLondonPiscineGO[0].amount)  // 0
// console.log("MAXlevelLondonWeekFour",MAXlevelLondonWeekFour[0].amount)  // 0
// console.log("MAXlevelLondonPiscineJS",MAXlevelLondonPiscineJS[0].amount)  // 0
// console.log("MAXlevelLondon",MAXlevelLondon[0].amount)  // 0
// console.log("MAXlevelLondon",MAXlevelLondon)  // 0


////////////////////////////////////////////////Obtain Levels/////////////////////////////////////////////////////////////////
///
///////////////////////////////////////////////////////xpLondon///////////////////////////////////////////////////////////////
let xpLondon = xp.filter(pathFilter)
function pathFilter(xp) {
  return xp.path.includes("/london/div-01/") && !xp.path.includes("/piscine-js/")&& !xp.path.includes("/piscine-go/")&& !xp.path.includes("/weekfour/")&& !xp.path.includes("/check-points/")
}
xpLondon= xpLondon.filter(xp=> !xp.path.includes("/london/div-01/atm-management-system"))
xpLondon= xpLondon.filter(xp=> !xp.path.includes("/london/div-01/piscine-js"))

//remove the duplicates from the array xpLondon
let xpLondonUnique = [...new Set(xpLondon.map(item => item.path))]
//use the array xpLondonUnique to create a new array with the max amount of XP per path
let xpLondonUniqueMax = []
for (let i = 0; i < xpLondonUnique.length; i++) {
  let xpLondonUniqueMaxTemp = xpLondon.filter(pathFilterUnique)
    function pathFilterUnique(xp) {
      return xp
      .path == xpLondonUnique[i]
    }
  xpLondonUniqueMaxTemp.sort((a, b) => (a.amount > b.amount) ? -1 : 1)
  xpLondonUniqueMax.push(xpLondonUniqueMaxTemp[0])
}
xpLondonUniqueMax.sort((a, b) => (a.createdAt > b.createdAt) ? 1 : -1)

// console.log("xpLondon",xpLondon)  // 0
// console.log("xpLondonUnique",xpLondonUnique)  // 0
// console.log("xpLondonUniqueMax",xpLondonUniqueMax)  // 0
///////////////////////////////////////////////////////xpLondon//////////////////////////////////////////////////////////////
///
///////////////////////////////////////////////////////xpLondonPiscineGO//////////////////////////////////////////////////////
let xpLondonPiscineGO = xp.filter(xp=> xp.path.includes("/piscine-go/"))
//remove the duplicates from the array xpLondonPiscineGO
let xpLondonPiscineGOUnique = [...new Set(xpLondonPiscineGO.map(item => item.path))]
//use the array xpLondonPiscineGOUnique to create a new array with the max amount of XP per path
let xpLondonPiscineGOUniqueMax = []
for (let i = 0; i < xpLondonPiscineGOUnique.length; i++) {
  let xpLondonPiscineGOUniqueMaxTemp = xpLondonPiscineGO.filter(pathFilterUnique)
    function pathFilterUnique(xp) {
      return xp
      .path == xpLondonPiscineGOUnique[i]
    }
  xpLondonPiscineGOUniqueMaxTemp.sort((a, b) => (a.amount > b.amount) ? -1 : 1)
  xpLondonPiscineGOUniqueMax.push(xpLondonPiscineGOUniqueMaxTemp[0])
}
xpLondonPiscineGOUniqueMax.sort((a, b) => (a.createdAt > b.createdAt) ? 1 : -1)
// console.log("xpLondonPiscineGO",xpLondonPiscineGO)  // 0
// console.log("xpLondonPiscineGOUnique",xpLondonPiscineGOUnique)  // 0
// console.log("xpLondonPiscineGOUniqueMax",xpLondonPiscineGOUniqueMax)  // 0// 0
///////////////////////////////////////////////////////xpLondonPiscineGO//////////////////////////////////////////////////////
///
///////////////////////////////////////////////////////xpLondonWeekFour///////////////////////////////////////////////////////
let xpLondonWeekFour = xp.filter(xp=> xp.path.includes("/weekfour/"))
//remove the duplicates from the array xpLondonWeekFour
let xpLondonWeekFourUnique = [...new Set(xpLondonWeekFour.map(item => item.path))]
//use the array xpLondonWeekFourUnique to create a new array with the max amount of XP per path
let xpLondonWeekFourUniqueMax = []
for (let i = 0; i < xpLondonWeekFourUnique.length; i++) {
  let xpLondonWeekFourUniqueMaxTemp = xpLondonWeekFour.filter(pathFilterUnique)
    function pathFilterUnique(xp) {
      return xp
      .path == xpLondonWeekFourUnique[i]
    }
  xpLondonWeekFourUniqueMaxTemp.sort((a, b) => (a.amount > b.amount) ? -1 : 1)
  xpLondonWeekFourUniqueMax.push(xpLondonWeekFourUniqueMaxTemp[0])
}
xpLondonWeekFourUniqueMax.sort((a, b) => (a.createdAt > b.createdAt) ? 1 : -1)
// console.log("xpLondonWeekFour",xpLondonWeekFour)  // 0
// console.log("xpLondonWeekFourUnique",xpLondonWeekFourUnique)  // 0
// console.log("xpLondonWeekFourUniqueMax",xpLondonWeekFourUniqueMax)  // 0
///////////////////////////////////////////////////////xpLondonWeekFour///////////////////////////////////////////////////////
///
////////////////////////////////////////////////////xpLondonCheckPoints///////////////////////////////////////////////////////
let xpLondonCheckPoints = xp.filter(xp=> xp.path.includes("/check-points/"))
//remove the duplicates from the array xpLondonCheckPoints
let xpLondonCheckPointsUnique = [...new Set(xpLondonCheckPoints.map(item => item.path))]
//use the array xpLondonCheckPointsUnique to create a new array with the max amount of XP per path
let xpLondonCheckPointsUniqueMax = []
for (let i = 0; i < xpLondonCheckPointsUnique.length; i++) {
  let xpLondonCheckPointsUniqueMaxTemp = xpLondonCheckPoints.filter(pathFilterUnique)
    function pathFilterUnique(xp) {
      return xp
      .path == xpLondonCheckPointsUnique[i]
    }
  xpLondonCheckPointsUniqueMaxTemp.sort((a, b) => (a.amount > b.amount) ? -1 : 1)
  xpLondonCheckPointsUniqueMax.push(xpLondonCheckPointsUniqueMaxTemp[0])
}
xpLondonCheckPointsUniqueMax.sort((a, b) => (a.createdAt > b.createdAt) ? 1 : -1)
// console.log("xpLondonCheckPoints",xpLondonCheckPoints)  // 0
// console.log("xpLondonCheckPointsUnique",xpLondonCheckPointsUnique)  // 0
// console.log("xpLondonCheckPointsUniqueMax",xpLondonCheckPointsUniqueMax)  // 0
////////////////////////////////////////////////////xpLondonCheckPoints///////////////////////////////////////////////////////
///
///////////////////////////////////////////////////////xpLondonPiscineJS//////////////////////////////////////////////////////
let xpLondonPiscineJS = xp.filter(xp=> xp.path.includes("/piscine-js/"))
//remove the duplicates from the array xpLondonPiscineJS
let xpLondonPiscineJSUnique = [...new Set(xpLondonPiscineJS.map(item => item.path))]
//use the array xpLondonPiscineJSUnique to create a new array with the max amount of XP per path
let xpLondonPiscineJSUniqueMax = []
for (let i = 0; i < xpLondonPiscineJSUnique.length; i++) {
  let xpLondonPiscineJSUniqueMaxTemp = xpLondonPiscineJS.filter(pathFilterUnique)
    function pathFilterUnique(xp) {
      return xp
      .path == xpLondonPiscineJSUnique[i]
    }
  xpLondonPiscineJSUniqueMaxTemp.sort((a, b) => (a.amount > b.amount) ? -1 : 1)
  xpLondonPiscineJSUniqueMax.push(xpLondonPiscineJSUniqueMaxTemp[0])
}
xpLondonPiscineJSUniqueMax.sort((a, b) => (a.createdAt > b.createdAt) ? 1 : -1)
// console.log("xpLondonPiscineJS",xpLondonPiscineJS)  // 0
// console.log("xpLondonPiscineJSUnique",xpLondonPiscineJSUnique)  // 0
// console.log("xpLondonPiscineJSUniqueMax",xpLondonPiscineJSUniqueMax)  // 0
////////////////////////////////////////////////////xpLondonPiscineJS/////////////////////////////////////////////////////////
///
////////////////////////////////////////////////////xpLondonPiscineJS_total///////////////////////////////////////////////////
let xpLondonPiscineJS_total = xp.filter(xp=> xp.path == "/london/div-01/piscine-js")
////////////////////////////////////////////////////xpLondonPiscineJS_total///////////////////////////////////////////////////




xpLondonUniqueMax.forEach(xpLondonUniqueMax => {
  progress.forEach(progress => {
    if (progress.objectId == xpLondonUniqueMax.objectId) {
      xpLondonUniqueMax.updatedAt = progress.updatedAt
    }
  });
});
xpLondonUniqueMax.sort((a, b) => (a.updatedAt > b.updatedAt) ? 1 : -1)


xpLondonPiscineJS_total.forEach(xpLondonPiscineJS_total => {
  progress.forEach(progress => {
    if (progress.objectId == xpLondonPiscineJS_total.objectId) {
      xpLondonPiscineJS_total.updatedAt = progress.updatedAt
    }
  });
});
xpLondonPiscineJS_total.sort((a, b) => (a.updatedAt > b.updatedAt) ? 1 : -1)


xpLondonWeekFour.forEach(xpLondonWeekFour => {
  progress.forEach(progress => {
    if (progress.objectId == xpLondonWeekFour.objectId) {
      xpLondonWeekFour.updatedAt = progress.updatedAt
    }
  });
});
xpLondonWeekFour.sort((a, b) => (a.updatedAt > b.updatedAt) ? 1 : -1)


xpLondonPiscineJS.forEach(xpLondonPiscineJS => {
  progress.forEach(progress => {
    if (progress.objectId == xpLondonPiscineJS.objectId) {
      xpLondonPiscineJS.updatedAt = progress.updatedAt
    }
  });
});
xpLondonPiscineJS.sort((a, b) => (a.updatedAt > b.updatedAt) ? 1 : -1)


xpLondonPiscineGOUniqueMax.forEach(xpLondonPiscineGOUniqueMax => {
  progress.forEach(progress => {
    if (progress.objectId == xpLondonPiscineGOUniqueMax.objectId) {
      xpLondonPiscineGOUniqueMax.updatedAt = progress.updatedAt
    }
  });
});
xpLondonPiscineGOUniqueMax.sort((a, b) => (a.updatedAt > b.updatedAt) ? 1 : -1)








// console.log("xpLondonUniqueMax",xpLondonUniqueMax)
// console.log("xpLondonPiscineJS_total",xpLondonPiscineJS_total)
// console.log("xpLondonPiscineJS",xpLondonPiscineJS)
// console.log("xpLondonWeekFour",xpLondonWeekFour)






//sum xp from the arrays
let myXP=[]
let SumXpLondon = (xpLondonUniqueMax.reduce((a, b) => a + b.amount, 0))/1000
let SumXpLondonPiscineGO = (xpLondonPiscineGOUniqueMax.reduce((a, b) => a + b.amount, 0))/1000
let SumXpLondonWeekFour = (xpLondonWeekFourUniqueMax.reduce((a, b) => a + b.amount, 0))/1000
let SumXpLondonCheckPoints = (xpLondonCheckPointsUniqueMax.reduce((a, b) => a + b.amount, 0))/1000
let SumXpLondonPiscineJS = (xpLondonPiscineJSUniqueMax.reduce((a, b) => a + b.amount, 0))/1000
let SumXpLondonPiscineJS_total = (xpLondonPiscineJS_total.reduce((a, b) => a + b.amount, 0))/1000
//fix the sum to 0 decimal places and print the sum
myXP.push(Number(SumXpLondonPiscineGO.toFixed(1)),Number(SumXpLondonWeekFour.toFixed(1)),Number(SumXpLondonPiscineJS.toFixed(1)),Number((SumXpLondon+SumXpLondonCheckPoints+SumXpLondonPiscineJS_total).toFixed(1)))

// console.log("myXP=",myXP) // 0
// console.log("XPPiscineGO=",Number((SumXpLondonPiscineGO).toFixed(0))) // 0
// console.log("XPWeekFour=",Number((SumXpLondonWeekFour).toFixed(0))) // 0
// console.log("XPPiscineJS=",Number((SumXpLondonPiscineJS).toFixed(0))) // 0
// console.log("XPsum=",Number((SumXpLondon+SumXpLondonCheckPoints+SumXpLondonPiscineJS_total).toFixed(0))) // 0







//////////////////////////////////////////////////pie chart///////////////////////////////////////////////////////////////////
// Set up the data for the pie chart
//create array labels length equal to xpLondonUniqueMax.length with the path name trimmed first 10 characters out
var labels = xpLondonUniqueMax.map(xp=> xp.path.substring(15, xp.path.length))
var data = xpLondonUniqueMax.map(xp=> Number((xp.amount/1000).toFixed(2)))
//create array colors length equal to data.length with random colors, exclude background color
var colors = [];
let colorComponents = document.defaultView.getComputedStyle(document.querySelector("body"), null).getPropertyValue("background-color").slice(4, -1).split(",");
let hex = "#";
for (let component of colorComponents) {
  let hexValue = parseInt(component).toString(16);
  if (hexValue.length < 2) {
    hexValue = "0" + hexValue;
  }
  hex += hexValue;
}
for (let i = 0; i < data.length; i++) {
  let color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
  // Check if the color string is not same as background color and fix
  if (color == hex) {
    color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
  }
  // Check if the color string is less than 7 characters long and fix
  if (color.length < 7) {
    while (color.length < 7) {
      color = color+"0";
    }
  }
  colors.push(color)
}

// Set up the total size of the pie chart
var total = 0;
for (var i = 0; i < data.length; i++) {
  total += data[i];
}
// Get the SVG element for the pie chart
var pieChartSvg = document.getElementById("myChart");
let cx=document.getElementById("myChart").getAttribute("width")/2
let cy=document.getElementById("myChart").getAttribute("height")/2
let radius=document.getElementById("myChart").querySelector("circle").getAttribute("r")
// Draw the pie chart
var startAngle = 0;
for (var i = 0; i < data.length; i++) {
  var sliceAngle = 2 * Math.PI * data[i] / total;
  // Create a new path element for the pie slice
  var pieSlice = document.createElementNS("http://www.w3.org/2000/svg", "path");
  pieSlice.setAttribute("fill", colors[i]);
  pieSlice.setAttribute("d", `M${cx},${cy} L${cx},${cy} L` + (cx + radius * Math.cos(startAngle)) + "," + (cy + radius * Math.sin(startAngle)) + ` A${radius},${radius} 0 ` + (sliceAngle > Math.PI ? 1 : 0) + ",1 " + (cx + radius * Math.cos(startAngle + sliceAngle)) + "," + (cy + radius * Math.sin(startAngle + sliceAngle)) + " z");

  // Calculate the percentage of the pie chart that this slice represents
  var percentage = Math.round(data[i])
  // Create a new text element for the percentage label
  var percentageLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  percentageLabel.setAttribute("x", cx + (Number(radius) + 10) * Math.cos(startAngle + sliceAngle / 2));
  percentageLabel.setAttribute("y", cy + (Number(radius) + 10) * Math.sin(startAngle + sliceAngle / 2));
  percentageLabel.setAttribute("text-anchor", "middle");
  percentageLabel.innerHTML = percentage;

  // Add the pie slice and percentage label to the pie chart SVG
  pieChartSvg.appendChild(pieSlice);
  pieChartSvg.appendChild(percentageLabel);
  startAngle += sliceAngle;
}

// Set up the legend container element
var legendContainer = document.getElementById("pie-legend");

// Create a new element for each label and color
for (var i = 0; i < data.length; i++) {
  // Create a new div element for the legend item
  var legendItem = document.createElement("div");

  // Create a new div element for the color square
  var colorSquare = document.createElement("div");
  colorSquare.style.backgroundColor = colors[i];
  colorSquare.style.width = "15px";
  colorSquare.style.height = "15px";
  colorSquare.style.display = "inline-block";
  colorSquare.style.marginRight = "5px";

  // Add the color square and label to the legend item
  legendItem.appendChild(colorSquare);
  legendItem.innerHTML += labels[i];

  // Add the legend item to the legend container
  legendContainer.appendChild(legendItem);
}

//////////////////////////////////////////////END/pie chart///////////////////////////////////////////////////////////////////
///

xpLondonPiscineGOUniqueMax.sort((a, b) => new Date(a.updatedAt || a.createdAt) - new Date(b.updatedAt || b.createdAt));
for (let i = 1; i < xpLondonPiscineGOUniqueMax.length; i++) {
  xpLondonPiscineGOUniqueMax[i].amount = (xpLondonPiscineGOUniqueMax[i].amount + xpLondonPiscineGOUniqueMax[i-1].amount)
}
xpLondonPiscineGOUniqueMax=xpLondonPiscineGOUniqueMax.map(d => {
  return {
    ...d,
    amount: d.amount/1000
  }
})

xpLondonWeekFourUniqueMax.sort((a, b) => new Date(a.updatedAt || a.createdAt) - new Date(b.updatedAt || b.createdAt));
for (let i = 1; i < xpLondonWeekFourUniqueMax.length; i++) {
  xpLondonWeekFourUniqueMax[i].amount = (xpLondonWeekFourUniqueMax[i].amount + xpLondonWeekFourUniqueMax[i-1].amount)
}
xpLondonWeekFourUniqueMax=xpLondonWeekFourUniqueMax.map(d => {
  return {
    ...d,
    amount: d.amount/1000
  }
})

xpLondonPiscineJSUniqueMax.sort((a, b) => new Date(a.updatedAt || a.createdAt) - new Date(b.updatedAt || b.createdAt));
for (let i = 1; i < xpLondonPiscineJSUniqueMax.length; i++) {
  xpLondonPiscineJSUniqueMax[i].amount = (xpLondonPiscineJSUniqueMax[i].amount + xpLondonPiscineJSUniqueMax[i-1].amount)
}
xpLondonPiscineJSUniqueMax=xpLondonPiscineJSUniqueMax.map(d => {
  return {
    ...d,
    amount: d.amount/1000
  }
})

//create new array will be contain array xpLondonUniqueMax and xpLondonPiscineJS_total and xpLondonCheckPointsUniqueMax
xpLondonUniqueMax = xpLondonUniqueMax.concat(xpLondonPiscineJS_total).concat(xpLondonCheckPointsUniqueMax)
xpLondonUniqueMax.sort((a, b) => new Date(a.updatedAt || a.createdAt) - new Date(b.updatedAt || b.createdAt));
for (let i = 1; i < xpLondonUniqueMax.length; i++) {
  xpLondonUniqueMax[i].amount = (xpLondonUniqueMax[i].amount + xpLondonUniqueMax[i-1].amount)
}
xpLondonUniqueMax=xpLondonUniqueMax.map(d => {
  return {
    ...d,
    amount: d.amount/1000
  }
})


let xpLondonLineChart = []
xpLondonLineChart.push(xpLondonPiscineGOUniqueMax, xpLondonWeekFourUniqueMax, xpLondonPiscineJSUniqueMax, xpLondonUniqueMax)


//////////////////////////////////////////////////line chart//////////////////////////////////////////////////////////////////

let lineChart=function(arrayLineChart){
// Extract the minimum and maximum updatedAt or createdAt values from the array
const minTime = Math.min(...arrayLineChart.map(d => new Date(d.updatedAt || d.createdAt)));
const maxTime = Math.max(...arrayLineChart.map(d => new Date(d.updatedAt || d.createdAt)));

let chartWidth = document.getElementById("myChartline").getAttribute("width");
let chartHeight = document.getElementById("myChartline").getAttribute("height");
// Calculate the width of the chart
// const chartWidth = 500;
const timeRange = maxTime - minTime;
const scale = chartWidth / timeRange;

// Find the maximum amount value in the array
const maxAmount = Math.max(...arrayLineChart.map(d => d.amount));

// Initialize the string that will hold the point coordinates
let points = "";
let xOffset=chartWidth/20

// Iterate over the arrayLineChart array
for (const data of arrayLineChart) {
  // Extract the amount and updatedAt (or createdAt) values
  const amount = data.amount;
  const time = new Date(data.updatedAt || data.createdAt); 
  // Calculate the x-coordinate of the point
  const x = xOffset+((time - minTime) * scale);
  // Calculate the y-coordinate of the point
  const y = chartHeight - ((amount / maxAmount) * chartHeight);
  // Add the point coordinates to the points string
  points += `${x},${y} `;

}

// set up the svg element
const svg = document.getElementById("myChartline");

// set the width and height of the svg element
svg.setAttribute("width", chartWidth);
svg.setAttribute("height", chartHeight);
// console.log(`${Number(chartWidth)+Number(xOffset)}`)
// set up the x-axis
const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
xAxis.setAttribute("x1", 0);
xAxis.setAttribute("y1", chartHeight);
xAxis.setAttribute("x2",`${Number(chartWidth)+Number(xOffset)}`);
xAxis.setAttribute("y2", chartHeight);
xAxis.setAttribute("stroke", "black");

// set up the y-axis
const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
yAxis.setAttribute("x1", 0);
yAxis.setAttribute("y1", 0);
yAxis.setAttribute("x2", 0);
yAxis.setAttribute("y2", chartHeight);
yAxis.setAttribute("stroke", "black");

// set up the x-axis label
const xLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
xLabel.setAttribute("x", chartWidth / 2);
xLabel.setAttribute("y", chartHeight-5);
xLabel.setAttribute("text-anchor", "middle");
xLabel.textContent = "Time";

// set up the y-axis label
const yLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
yLabel.setAttribute("x", 0);
yLabel.setAttribute("y", chartHeight / 2);
yLabel.setAttribute("text-anchor", "middle");
yLabel.setAttribute("transform", "rotate(-90, 20, 140)");
yLabel.textContent = "Total XP [kB]";

// Set up the line
const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
points = points.trim();
const pointCoordinates = points.split(" ");

let circle
// Iterate over the pointCoordinates array
for (const point of pointCoordinates) {

  //take the index of the point
  const index = pointCoordinates.indexOf(point);
  
  // Extract the x and y coordinates from the point string
  const x = point.split(",")[0];
  const y = point.split(",")[1];
  circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", x);
  circle.setAttribute("cy", y);
  circle.setAttribute("r", "3.5");
  circle.setAttribute("fill", "magenta");

  const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  circle.addEventListener("mouseover", function() {
    // Change the fill color of the circle when it is clicked 
    valueText.setAttribute('x', chartWidth / 2);
    valueText.setAttribute('y', 20);
    valueText.setAttribute('text-anchor', 'middle');
    valueText.setAttribute('font-size', '14');

      if(index != 0) {
      valueText.textContent = `Time: ${String(new Date(arrayLineChart[index].createdAt)).substring(0,15)}, XP: ${Math.floor(arrayLineChart[index].amount)}, Achieved@: ${String(arrayLineChart[index].path).substring(15,arrayLineChart[index].path.length)} (+${Number(Math.floor(arrayLineChart[index].amount))-Number(Math.floor(arrayLineChart[index-1].amount))}kB)`}
      else {
      valueText.textContent = `Time: ${String(new Date(arrayLineChart[index].createdAt)).substring(0,15)}, XP: ${Math.floor(arrayLineChart[index].amount)}, Achieved@: ${String(arrayLineChart[index].path).substring(15,arrayLineChart[index].path.length)}`}
    svg.appendChild(valueText);

    this.setAttribute("fill", "red");
    this.setAttribute("r", "5");

  });

  circle.addEventListener("mouseout", function() {
    // Change the fill color of the circle back to blue when the mouse cursor leaves it
    this.setAttribute("fill", "magenta");
    this.setAttribute("r", "3.5");
    svg.removeChild(valueText);
  });
  // Append the circle to the SVG element
  svg.appendChild(circle);
}

line.setAttribute("d", `M ${points}`);
line.setAttribute("stroke", "magenta");
line.setAttribute("fill", "none");
line.setAttribute("stroke-width", "2");

// add the x-axis, y-axis, x-axis label, y-axis label, and line to the svg element
svg.appendChild(xAxis);
svg.appendChild(yAxis);
svg.appendChild(xLabel);
svg.appendChild(yLabel);
svg.appendChild(line);

// add tick marks and labels for the x-axis
for (let i = 0; i < 3; i=i+2) {
  // add a tick mark
  const xTick = document.createElementNS("http://www.w3.org/2000/svg", "line");
  xTick.setAttribute("x1", xOffset + (i *chartWidth/2));
  xTick.setAttribute("y1", chartHeight-10);
  xTick.setAttribute("x2", xOffset + (i * chartWidth/2));
  xTick.setAttribute("y2", chartHeight);
  xTick.setAttribute("stroke", "black");
  svg.appendChild(xTick);
  // add a label
  const xLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  xLabel.setAttribute("x", xOffset + (i *chartWidth/2));
  xLabel.setAttribute("y", chartHeight-20);
  xLabel.setAttribute("text-anchor", "middle");
  let len=arrayLineChart.length-1
  xLabel.textContent = arrayLineChart[Math.floor(len*i/2)].createdAt.substring(0,10) || arrayLineChart[Math.floor(len*i/2)].updatedAt.substring(0,10);
  svg.appendChild(xLabel);
}

// add tick marks and labels for the y-axis
let xxx=[2,1,0]
for (let i = 0; i < 3; i=i+2) {
  // add a tick mark
  const yTick = document.createElementNS("http://www.w3.org/2000/svg", "line");
  yTick.setAttribute("x1", 0);
  yTick.setAttribute("y1", i*chartHeight/2);
  yTick.setAttribute("x2", xOffset/2);
  yTick.setAttribute("y2", i*chartHeight/2);
  yTick.setAttribute("stroke", "black");
  svg.appendChild(yTick);
  // add a label
  const yLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  yLabel.setAttribute("x", -xOffset);
  if (i==2) {
    yLabel.setAttribute("y", i*chartHeight/2);
  } else {
    yLabel.setAttribute("y", i*chartHeight/2+15);
  }
  
  yLabel.setAttribute("text-anchor", "middle");
  let len=arrayLineChart.length-1
  yLabel.textContent = Math.floor(arrayLineChart[Math.floor(len*xxx[i]/2)].amount)
  
  svg.appendChild(yLabel);
}
}

lineChart(xpLondonLineChart[xpLondonLineChart.length-1])

//////////////////////////////////////////////////bar chart///////////////////////////////////////////////////////////////////
///
//create a unique array of levels eliminating duplicates paths
let MAXlevelLondonPiscineGOUnique= [...new Set(MAXlevelLondonPiscineGO.map(item => item.path))]
let MAXlevelLondonPiscineGOMAX = []
for (let i = 0; i < MAXlevelLondonPiscineGOUnique.length; i++) {
  let MAXlevelLondonPiscineGOMAXTemp = MAXlevelLondonPiscineGO.filter(pathFilterUnique)
    function pathFilterUnique(level) {
      return level
      .path == MAXlevelLondonPiscineGOUnique[i]
    }
  MAXlevelLondonPiscineGOMAXTemp.sort((a, b) => (a.amount > b.amount) ? -1 : 1)
  MAXlevelLondonPiscineGOMAX.push(MAXlevelLondonPiscineGOMAXTemp[0])
}
MAXlevelLondonPiscineGOMAX.sort((a, b) => (a.createdAt > b.createdAt) ? 1 : -1)
for (let i = 0; i < MAXlevelLondonPiscineGOMAX.length; i++) {
  MAXlevelLondonPiscineGOMAX[i].createdAt = new Date(MAXlevelLondonPiscineGOMAX[i].createdAt)
}


let MAXlevelLondonWeekFourUnique= [...new Set(MAXlevelLondonWeekFour.map(item => item.path))]
let MAXlevelLondonWeekFourMAX = []
for (let i = 0; i < MAXlevelLondonWeekFourUnique.length; i++) {
  let MAXlevelLondonWeekFourMAXTemp = MAXlevelLondonWeekFour.filter(pathFilterUnique)
    function pathFilterUnique(level) {
      return level
      .path == MAXlevelLondonWeekFourUnique[i]
    }
  MAXlevelLondonWeekFourMAXTemp.sort((a, b) => (a.amount > b.amount) ? -1 : 1)
  MAXlevelLondonWeekFourMAX.push(MAXlevelLondonWeekFourMAXTemp[0])
}
MAXlevelLondonWeekFourMAX.sort((a, b) => (a.createdAt > b.createdAt) ? 1 : -1)
for (let i = 0; i < MAXlevelLondonWeekFourMAX.length; i++) {
  MAXlevelLondonWeekFourMAX[i].createdAt = new Date(MAXlevelLondonWeekFourMAX[i].createdAt)
}


// let MAXlevelLondonPiscineJSUnique= [...new Set(MAXlevelLondonPiscineJS.map(item => item.path))]
// let MAXlevelLondonPiscineJSMAX = []
// for (let i = 0; i < MAXlevelLondonPiscineJSUnique.length; i++) {
//   let MAXlevelLondonPiscineJSMAXTemp = MAXlevelLondonPiscineJS.filter(pathFilterUnique)
//     function pathFilterUnique(level) {
//       return level
//       .path == MAXlevelLondonPiscineJSUnique[i]
//     }
//   MAXlevelLondonPiscineJSMAXTemp.sort((a, b) => (a.amount > b.amount) ? -1 : 1)
//   MAXlevelLondonPiscineJSMAX.push(MAXlevelLondonPiscineJSMAXTemp[0])
// }
// MAXlevelLondonPiscineJSMAX.sort((a, b) => (a.amount > b.amount) ? 1 : -1)
// for (let i = 0; i < MAXlevelLondonPiscineJSMAX.length; i++) {
//   MAXlevelLondonPiscineJSMAX[i].createdAt = new Date(MAXlevelLondonPiscineJSMAX[i].createdAt)
// }
let MAXlevelLondonPiscineJSUnique= [...new Set(MAXlevelLondonPiscineJS.map(item => item.amount))]
let MAXlevelLondonPiscineJSMAX = []
for (let i = 0; i < MAXlevelLondonPiscineJSUnique.length; i++) {
  let MAXlevelLondonPiscineJSMAXTemp = MAXlevelLondonPiscineJS.filter(pathFilterUnique)
    function pathFilterUnique(level) {
      return level
      .amount == MAXlevelLondonPiscineJSUnique[i]
    }
  MAXlevelLondonPiscineJSMAXTemp.sort((a, b) => (a.amount > b.amount) ? -1 : 1)
  MAXlevelLondonPiscineJSMAX.push(MAXlevelLondonPiscineJSMAXTemp[0])
}
MAXlevelLondonPiscineJSMAX.sort((a, b) => (a.createdAt > b.createdAt) ? 1 : -1)
for (let i = 0; i < MAXlevelLondonPiscineJSMAX.length; i++) {
  MAXlevelLondonPiscineJSMAX[i].createdAt = new Date(MAXlevelLondonPiscineJSMAX[i].createdAt)
}


let MAXlevelLondonUnique = [...new Set(MAXlevelLondon.map(item => item.path))]
let MAXlevelLondonMAX = []
for (let i = 0; i < MAXlevelLondonUnique.length; i++) {
  let MAXlevelLondonMAXTemp = MAXlevelLondon.filter(pathFilterUnique)
    function pathFilterUnique(level) {
      return level
      .path == MAXlevelLondonUnique[i]
    }
  MAXlevelLondonMAXTemp.sort((a, b) => (a.amount > b.amount) ? -1 : 1)
  MAXlevelLondonMAX.push(MAXlevelLondonMAXTemp[0])
}
MAXlevelLondonMAX.sort((a, b) => (a.createdAt > b.createdAt) ? 1 : -1)
for (let i = 0; i < MAXlevelLondonMAX.length; i++) {
  MAXlevelLondonMAX[i].createdAt = new Date(MAXlevelLondonMAX[i].createdAt)
}



let MAXlevelLondonBarChart = []
MAXlevelLondonBarChart.push(MAXlevelLondonPiscineGOMAX, MAXlevelLondonWeekFourMAX, MAXlevelLondonPiscineJSMAX, MAXlevelLondonMAX)


let barChart=function (arrayBarChart) {
  
const svg = document.getElementById("myChartbar");
let chartWidth = svg.getAttribute("width");
let chartHeight = svg.getAttribute("height");
let xOffset=chartWidth/20
const numBars = arrayBarChart.length;
const barWidth = chartWidth / numBars;

const xScale = d3.scaleTime()
  .domain([
    d3.min(arrayBarChart, d => d.createdAt),
    d3.max(arrayBarChart, d => d.createdAt)
  ])
  .range([0, chartWidth]);

const yScale = d3.scaleLinear()
  .domain([0, d3.max(arrayBarChart, d => d.amount)])
  .range([chartHeight, 0]);

  let hoov=[]
arrayBarChart.forEach((d, i) => {
  const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bar.setAttribute('x',barWidth*i);
  bar.setAttribute('y', yScale(d.amount));
  bar.setAttribute('width', barWidth);
  bar.setAttribute('height', chartHeight - yScale(d.amount));
  bar.setAttribute('fill', '#00bcd4');
  bar.setAttribute('stroke', '#000000'); // add border
  bar.setAttribute('stroke-width', '1'); // control border width
  svg.appendChild(bar);

  // Add hover effect
    bar.addEventListener('mouseover', () => {
    const xPos = parseFloat(bar.getAttribute('x')) + barWidth / 2;
    const yPos = parseFloat(bar.getAttribute('y')) + 14;
      // Remove any existing text element
      if (hoov.length>0) {
        svg.removeChild(hoov[0]);
        hoov.pop();
      }
    //channge bar color at position xPos, yPos
    bar.setAttribute('fill', 'cyan', 'x', xPos, 'y', yPos);

    // Add text element for the value
    const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    valueText.setAttribute('x', chartWidth / 2);
    valueText.setAttribute('y', 20);

    valueText.setAttribute('text-anchor', 'middle');
    valueText.setAttribute('font-size', '14');
  
    valueText.textContent = `Time: ${String(d.createdAt).substring(0,15)}, Level: ${d.amount}, Achieved@: ${String(d.path).substring(15,d.path.length)}`;
    svg.appendChild(valueText);
    hoov.push(valueText)
  });

  bar.addEventListener('mouseout', () => {
    bar.setAttribute('fill', '#00bcd4');
    if (hoov.length>0) {
      svg.removeChild(hoov[0]);
      hoov.pop();
    }
  });
});

// Add x-axis
const xAxis = d3.axisBottom(xScale);
xAxis.ticks(d3.timeYear.every(1))
  .tickFormat(d3.timeFormat("%Y"));
const gX = d3.select(svg).append('g');
gX.attr('transform', 'translate(0,500)');
gX.call(xAxis);
gX.selectAll('text').style('font-size', '16px');

// Add y-axis
const yAxis = d3.axisLeft(yScale);
const gY = d3.select(svg).append('g');
gY.attr('transform', 'translate(0,0)');
gY.call(yAxis);
gY.selectAll('text').style('font-size', '16px');
// Add label to x-axis
const xAxisLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
xAxisLabel.setAttribute('x', chartWidth / 2);
xAxisLabel.setAttribute('y', chartHeight-10);
xAxisLabel.setAttribute('text-anchor', 'middle');
xAxisLabel.textContent = 'Time';
svg.appendChild(xAxisLabel);
// Add label to y-axis
const yAxisLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
yAxisLabel.setAttribute('x', -chartHeight / 2);
yAxisLabel.setAttribute('y', xOffset);
yAxisLabel.setAttribute('text-anchor', 'middle');
yAxisLabel.setAttribute('transform', 'rotate(-90)');
yAxisLabel.textContent = 'Level';
svg.appendChild(yAxisLabel);

}

barChart(MAXlevelLondonBarChart[MAXlevelLondonBarChart.length-1])


////////////////////////////////////////////////Page Render///////////////////////////////////////////////////////////////////
document.getElementById("userLogin").innerHTML = "User:  "+String(person[0].user.login)
document.getElementById("campus").innerHTML = "Campus:  "+String(person[0].campus).toUpperCase().charAt(0) + String(person[0].campus).slice(1)
document.getElementById("grade").innerHTML = "ID:  "+ Number(person[0].user.id)

const s = document.getElementById("menu", "option")
//onload page show the xp
document.getElementById("xp").innerHTML = "XP[kB]:  "+myXP[3]
document.getElementById("level").innerHTML = "Level:  "+ myLevel[3]


s.addEventListener("click", function() {
  document.getElementById("xp").innerHTML = "XP[kB]:  "+myXP[s.options.selectedIndex-1]
  document.getElementById("level").innerHTML = "Level:  "+ myLevel[s.options.selectedIndex-1]
  var svg = document.getElementById("myChartline");
  svg.innerHTML = '';
  lineChart(xpLondonLineChart[s.options.selectedIndex-1])
  var svg = document.getElementById("myChartbar");
  svg.innerHTML = '';
  barChart(MAXlevelLondonBarChart[s.options.selectedIndex-1])
})