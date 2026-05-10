var chartColors = ["#0f766e","#2563eb","#be123c","#b45309","#64748b","#7c3aed","#0891b2","#65a30d"];
function chartCtx(id){
  var c=document.getElementById(id); if(!c) return null;
  var r=c.getBoundingClientRect(), d=window.devicePixelRatio||1;
  c.width=Math.max(1,r.width*d); c.height=Math.max(1,r.height*d);
  var x=c.getContext("2d"); x.setTransform(d,0,0,d,0,0); x.clearRect(0,0,r.width,r.height);
  return {x:x,w:r.width,h:r.height};
}
function cssColor(name){ return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
function drawAxes(g,max){ var x=g.x,w=g.w,h=g.h,pad=44; x.strokeStyle=cssColor("--line"); x.fillStyle=cssColor("--muted"); x.font="12px Arial"; for(var i=0;i<5;i++){ var y=pad+(h-pad*2)*i/4; x.beginPath(); x.moveTo(pad,y); x.lineTo(w-pad,y); x.stroke(); x.fillText(Math.round(max*(1-i/4)).toLocaleString(),4,y+4); } return pad; }
function drawLine(id, labels, values, fill){
  var g=chartCtx(id); if(!g) return; var x=g.x,w=g.w,h=g.h,max=Math.max.apply(null, values.map(function(v){return Math.abs(v);} ).concat([1])), pad=drawAxes(g,max);
  x.beginPath(); values.forEach(function(v,i){ var px=pad+(w-pad*2)*(i/(values.length-1||1)), py=h-pad-(h-pad*2)*(v/max); i?x.lineTo(px,py):x.moveTo(px,py); });
  if(fill){ x.lineTo(w-pad,h-pad); x.lineTo(pad,h-pad); x.closePath(); x.fillStyle="rgba(15,118,110,.12)"; x.fill(); x.beginPath(); values.forEach(function(v,i){ var px=pad+(w-pad*2)*(i/(values.length-1||1)), py=h-pad-(h-pad*2)*(v/max); i?x.lineTo(px,py):x.moveTo(px,py); }); }
  x.strokeStyle=cssColor("--primary"); x.lineWidth=2; x.stroke(); x.fillStyle=cssColor("--muted");
  labels.forEach(function(l,i){ if(i%Math.ceil(labels.length/7)===0) x.fillText(String(l).slice(0,8),pad+(w-pad*2)*(i/(labels.length-1||1))-12,h-12); });
}
function drawBar(id, labels, values){
  var g=chartCtx(id); if(!g) return; var x=g.x,w=g.w,h=g.h,max=Math.max.apply(null, values.map(function(v){return Math.abs(v);}).concat([1])), pad=drawAxes(g,max), step=(w-pad*2)/Math.max(1,values.length), bw=step*.58;
  values.forEach(function(v,i){ var px=pad+step*i+(step-bw)/2, hh=Math.abs((h-pad*2)*(v/max)), py=v>=0?h-pad-hh:h-pad; x.fillStyle=v>=0?chartColors[i%chartColors.length]:cssColor("--rose"); x.fillRect(px,py,bw,Math.max(2,hh)); });
}
function drawPie(id, labels, values){
  var g=chartCtx(id); if(!g) return; var x=g.x,w=g.w,h=g.h,total=values.reduce(function(s,v){return s+v;},0)||1,a=-Math.PI/2,r=Math.min(w,h)*.3;
  values.forEach(function(v,i){ var n=a+v/total*2*Math.PI; x.beginPath(); x.moveTo(w/2,h/2); x.arc(w/2,h/2,r,a,n); x.fillStyle=chartColors[i%chartColors.length]; x.fill(); a=n; });
  x.fillStyle=cssColor("--muted"); x.font="12px Arial"; labels.forEach(function(l,i){ x.fillStyle=chartColors[i%chartColors.length]; x.fillRect(16,16+i*20,10,10); x.fillStyle=cssColor("--muted"); x.fillText(l+" "+Math.round(values[i]/total*100)+"%",32,26+i*20); });
}
function drawRadar(id, labels, values){
  var g=chartCtx(id); if(!g) return; var x=g.x,w=g.w,h=g.h,cx=w/2,cy=h/2+6,r=Math.min(w,h)*.34,max=Math.max.apply(null, values.concat([1]));
  x.strokeStyle=cssColor("--line"); x.fillStyle=cssColor("--muted"); x.font="12px Arial";
  for(var ring=1;ring<=4;ring++){ x.beginPath(); labels.forEach(function(_,i){ var a=-Math.PI/2+i*2*Math.PI/labels.length, rr=r*ring/4, px=cx+Math.cos(a)*rr, py=cy+Math.sin(a)*rr; i?x.lineTo(px,py):x.moveTo(px,py); }); x.closePath(); x.stroke(); }
  x.beginPath(); labels.forEach(function(l,i){ var a=-Math.PI/2+i*2*Math.PI/labels.length, rr=r*values[i]/max, px=cx+Math.cos(a)*rr, py=cy+Math.sin(a)*rr; i?x.lineTo(px,py):x.moveTo(px,py); x.fillStyle=cssColor("--muted"); x.fillText(String(l).slice(0,8),cx+Math.cos(a)*(r+26)-18,cy+Math.sin(a)*(r+26)+4); });
  x.closePath(); x.fillStyle="rgba(15,118,110,.18)"; x.fill(); x.strokeStyle=cssColor("--primary"); x.lineWidth=2; x.stroke();
}
function drawAllCharts(){
  var c=calculateCoverage(), labels=Object.keys(c).map(function(k){return typeLabels[k]||k;}), values=Object.keys(c).map(function(k){return c[k];});
  drawPie("coveragePie", labels, values); drawRadar("coverageRadar", scoreLabels(), scoreValues()); drawBar("premiumBar", policies.map(function(p){return p.name;}), policies.map(function(p){return p.annualPremium;}));
  drawLine("premiumLine", policies.map(function(p){return p.name;}), policies.map(function(p){return p.annualPremium;}), true);
  var need=calculateInsuranceNeed(); drawRadar("needRadar", ["壽險","醫療","緊急"], [need.lifeInsuranceNeed, need.medicalReserve, need.emergencyFund]);
  drawPie("allocationPie", ["醫療","壽險","意外"], Object.values(calculateAllocation()));
  drawRadar("healthRadar", scoreLabels(), scoreValues());
  var p=selectedIrrPolicy(), flows=calculateCashflow(p); drawBar("cashflowChart", flows.map(function(f){return "第"+f.year+"年";}), flows.map(function(f){return f.value;}));
  drawRadar("compareRadar", policies.map(function(p){return p.name;}), policies.map(function(p){return Math.round(p.coverage/Math.max(1,p.annualPremium));}));
  var r=calculateRetirement(); drawLine("retirementLine", r.series.map(function(s){return s.year;}), r.series.map(function(s){return s.value;}), true);
  drawLine("premiumGrowth", Array.from({length:30},function(_,i){return profile.age+i;}), Array.from({length:30},function(_,i){return Math.round(totalPremium()*Math.pow(1.025,i));}), true);
  drawBar("familyBar", familyMembers.map(function(m){return m.name;}), familyMembers.map(function(m){return m.annualIncome;}));
}
function scoreLabels(){ return ["醫療","壽險","癌症","長照","意外"]; }
function scoreValues(){ var s=calculateInsuranceScore(); return [s.medical,s.life,s.cancer,s.longtermcare,s.accident]; }
