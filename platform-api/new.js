//var fc="function (){var payload,mod,         parsedData = [],         obj = {};     payload=data;     const myArr = data.split('|');     var temperature,lowPress,highPress,counter;     temperature= parseInt(myArr[0])/100;     if (temperature>10000)     {         temperature= temperature/10000     }     else     {         temperature=temperature-10;     }     lowPress= parseInt(myArr[1])/10000;     highPress= parseInt(myArr[2])/100;     counter= parseInt(myArr[3])/10;     console.log(temperature);     obj = {};     obj.key = 'temperature';     obj.value = temperature;     obj.type = 'number';     obj.unit = 'C';     parsedData.push(obj);     obj = {};     obj.key = 'power';     obj.value = lowPress;     obj.type = 'number';     obj.unit = 'Bar';     parsedData.push(obj);     obj = {};     obj.key = 'highPressure';     obj.value = highPress;     obj.type = 'number';     obj.unit = 'Bar';     parsedData.push(obj);     obj = {};     obj.key = 'pemakaian';     obj.value = highPress;     obj.type = 'number';     obj.unit = 'm3';     parsedData.push(obj);     return parsedData;}";
var data = 0|0|0|0|0|0|3114|0|4095|83;
var fc="var payload,mod,         parsedData = [],         obj = {};     payload=data;     const myArr = data.split('|');     var temperature,lowPress,highPress,counter;     temperature= parseInt(myArr[0])/100;     if (temperature>10000)     {         temperature= temperature/10000     }     else     {         temperature=temperature-10;     }     lowPress= parseInt(myArr[1])/10000;     highPress= parseInt(myArr[2])/100;     counter= parseInt(myArr[3])/10;     console.log(temperature);     obj = {};     obj.key = 'temperature';     obj.value = temperature;     obj.type = 'number';     obj.unit = 'C';     parsedData.push(obj);     obj = {};     obj.key = 'power';     obj.value = lowPress;     obj.type = 'number';     obj.unit = 'Bar';     parsedData.push(obj);     obj = {};     obj.key = 'highPressure';     obj.value = highPress;     obj.type = 'number';     obj.unit = 'Bar';     parsedData.push(obj);     obj = {};     obj.key = 'pemakaian';     obj.value = highPress;     obj.type = 'number';     obj.unit = 'm3';     parsedData.push(obj);     return parsedData";
var fun = new Function(fc);

