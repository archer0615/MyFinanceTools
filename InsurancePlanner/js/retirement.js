function calculateRetirement(input){
  var p=input||profile, years=Math.max(0, Number(p.retireAge)-Number(p.age));
  var futureAnnualExpense = Number(p.monthlyExpense)*12*Math.pow(1+Number(p.inflationRate)/100, years);
  var requiredAssets = futureAnnualExpense*25;
  var presentValue = requiredAssets/Math.pow(1+Number(p.returnRate)/100, Math.max(1, years));
  var series=[];
  for(var i=0;i<=years;i++) series.push({year:Number(p.age)+i,value:Math.round(presentValue*Math.pow(1+Number(p.returnRate)/100,i))});
  return { gap:Math.max(0, requiredAssets-presentValue), requiredAssets:requiredAssets, series:series };
}
