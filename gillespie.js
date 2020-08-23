var n=0
var m=0
var N=[]
var M=[]
var i=0
var interval

var t=0;
var nt=100
var a1=0.037/1.5
var a2=1/1.5*m
var a3=2.67*m
var a4=n/60.
var A=a1+a2+a3+a4
var r1=Math.random()
var dtms = 40

var trace1 = {
	x: [t],
	y: [m],
	mode: 'lines',
	type: 'scatter',
	name: 'mRNA'
}

var trace2 = {
	x: [t],
	y: [n],
	mode: 'lines',
	type: 'scatter',
	name: 'Proteins'
}
var trace3=[
  {
    x:N,
    type :'histogram',
    histnorm: 'probability'
  }
]

var layout = {
	xaxis: {
	  title: {
	    text: 'Time'
	  },
	},
	yaxis: {
	  title: {
	    text: 'Biomolecule',
			autorange: true,
			range: [0, 10]
	  }
	},
	margin: {t: 0, r:0, l: 50},
	legend: {x:0, y:1.1, "orientation": "h"}
}

var layout_2={
  xaxis: {
	  title: {
	    text: 'Proteins'
	  },
	},
	yaxis: {
	  title: {
	    text: 'Occurrences',
			autorange: true,
			range: [0, 10]
	  }
	},
	margin: {t: 0, r:0, l: 50},
	legend: {x:0, y:1.1, "orientation": "h"}
}

Plotly.newPlot('plot', [trace1, trace2], layout, {displayModeBar: false});
Plotly.newPlot('plot_2',trace3,layout_2, {displayModeBar:false})

function mainLoop() {
  a1=0.037/1.5;
  a2=1/1.5*m;
  a3=2.67*m;
  a4=n/60;
  A=a1+a2+a3+a4;
  r1=Math.random();
  dt=-Math.log(Math.random())/A
  t=t+dt
  if (r1<a1/A) {
    m+=1
  } else if (r1<(a1+a2)/A) {
    m-=1
  } else if (r1<(a1+a2+a3)/A) {

    n+=1
  } else {
    n-=1
  }
  i+=1
  M[i]=m
  N[i]=n
  Plotly.extendTraces('plot',
    {x: [[t], [t]], y: [[m], [n]]},
    [0,1], nt)
  Plotly.newPlot('plot_2',trace3,layout_2, {displayModeBar:false})
}

function changeOnOff(){
	var value = document.getElementById("onoff").checked
	if(value == true){
			interval = setInterval(mainLoop, dtms)
		}else{
			clearInterval(interval)
			}
  }
