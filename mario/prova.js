var interval
var epsilon = 0.01;
var dx = 1e-4;
var iter = 10000;
function fun(a){
    return Math.log(1.+1/a);
}
var L = 0;

function drawRectangle(a){
    let o = [0,0,x[x.length-1],x[x.length-1],0];
    let f = [fun(x[x.length-1])-a,fun(x[x.length-1])+a,fun(x[x.length-1])+a,fun(x[x.length-1])-a,fun(x[x.length-1])-a];
    return [o,f]
}



function limit(a){
    return Math.abs(fun(a)-L);
}
function der(a,f){
    return (f(a+dx)-f(a-dx))/(2*dx);
}

function Newton(M,initial){
    let a = initial;
    for(var i = 0; i<iter; i++){
        a = a - (limit(a)-M)/der(a,limit);
    }
    return a;

}

var n_epsilon = Newton(epsilon,2.);
n_epsilon = Newton(epsilon,n_epsilon);
n_epsilon = Math.ceil(Math.abs(n_epsilon));
var x = [];
var y = [];
var Nmax = 150;
for(var i = 1;i<Nmax; i ++){
    x.push(i);
    y.push(fun(i));
}  

var trace = {
    x:x,
    y:y,
    name:'an',
    mode:'lines+markers',
    marker: {color: 'red', size:8}
}


var x_plot,y_plot;
[x_plot,y_plot] = drawRectangle(epsilon);
document.getElementById('debugger').innerHTML = n_epsilon
var trace1 = {
    //x :[0,0,x[x.length-1],x[x.length-1],0],
    x: x_plot,
    //y:[fun(x[x.length-1])-epsilon,fun(x[x.length-1])+epsilon,fun(x[x.length-1])+epsilon,fun(x[x.length-1])-epsilon,fun(x[x.length-1])-epsilon],
    y: y_plot,
    name:"banda epsilon",
    fill: 'tozeroy',
    type: 'scatter',
    mode: 'none',
    //fillcolor:'green'
    fillcolor:`rgba(0,255,0,0.5)`
}

var trace2 = {
    x :[n_epsilon,n_epsilon],
    y:[0,y[0]],
    name: 'N0',
    mode:'lines',
    marker:{
        color:'black'
    },
    line: {
        dash :'dot',
        width:4
    }

}



var layout = {
    xaxis: {
        title: {
          text: 'n'
        },
        range:[0,Nmax],
      },
      yaxis: {
        title: {
          text: 'log(1+1/n)'
        },
        range:[0,y[0]+epsilon]
      },
      margin: {t: 0, r:0, l: 50},
      legend: {x:0, y:1.1, "orientation": "h"}
}

Plotly.plot('graph',[trace1,trace2,trace],layout,{displayModeBar:false});

/*
Plotly.newPlot("graph", [{
    y: [1,2,3].map(rand),
    mode: 'markers', 
    marker: {color: 'blue', size: 8},
    line: {width: 0}
    }, 
    {
    y: [1,2].map(rand),
    mode: 'markers',
    marker: {color: 'red', size:8},
    line: {width: 0}
}],{displayModeBar: false});
  
*/

/*var interval = setInterval(function() {
  Plotly.extendTraces('graph', {
    y: [[rand()], [rand()]]
  }, [0, 1])

    cnt = cnt+1;
    if(cnt === 100) clearInterval(interval);
    }, 500);
*/


//document.getElementById('debugger').innerHTML = [y,n];

function changeOnOff(){
    var value = document.getElementById("onoff").checked
    if(value == true){
        interval = setInterval(mainLoop, dtms)
    }else{
        clearInterval(interval)
    }
}

function changeEpsilon(value){
    epsilon = value/4000;
    if (n_epsilon != Infinity && n_epsilon!=NaN){
        n_epsilon = Newton(epsilon,n_epsilon);
    }
    else{
        n_epsilon = Newton(epsilon,2);
        n_epsilon = Newton(epsilon,n_epsilon);
    }
    /*
    if (n_epsilon == Infinity || n_epsilon==NaN){
        n_epsilon = 0;
    }*/
    n_epsilon = Math.ceil(Math.abs(n_epsilon));
    let x_e,y_e;
    [x_e,y_e] = drawRectangle(epsilon);
    var data_update0 = {
        x: x_e,
        y: y_e,
        name:"banda epsilon",
        fill: 'tozeroy',
        type: 'scatter',
        mode: 'none',
        fillcolor:`rgba(0,255,0,0.5)`

    };
    var data_update1 = {
        x :[n_epsilon,n_epsilon],
        y:[0,y[0]],
        name: 'N0',
        mode:'lines',
        marker:{
            color:'black'
        },
        line: {
            dash :'dot',
            width:4
        }
    
        
    }
    var data_update = [data_update0,data_update1,trace];
    Plotly.newPlot('graph',data_update,layout,{displayModeBar:false});
    document.getElementById("debugger").innerHTML = n_epsilon;
    //Plotly.deleteTraces('graph',[1,2])
    document.getElementById('epsilon_label').innerHTML = epsilon;
}