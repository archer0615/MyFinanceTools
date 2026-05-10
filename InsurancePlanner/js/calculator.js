function uid(){ return String(Date.now()) + Math.random().toString(16).slice(2); }
function money(n){ return new Intl.NumberFormat("zh-TW",{style:"currency",currency:"TWD",maximumFractionDigits:0}).format(Number.isFinite(Number(n)) ? Number(n) : 0); }
function pct(n){ return (Number(n) || 0).toFixed(1) + "%"; }
function download(filename, content, type){ var blob = new Blob([content], { type:type }); var url = URL.createObjectURL(blob); var a = document.createElement("a"); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url); }
function calculateInsuranceNeed(input){ var p=input||profile; return { lifeInsuranceNeed:p.annualIncome*10+p.mortgage+p.childrenCount*1000000, medicalReserve:p.annualIncome*.5, emergencyFund:calculateEmergencyFund(p.monthlyExpense) }; }
function calculateAllocation(input){ var p=input||profile, medical=p.age<35?40:45, life=p.age<35?40:35, accident=20; if(p.hasChild) life+=10; var total=medical+life+accident; return { medical:Math.round(medical/total*100), life:Math.round(life/total*100), accident:Math.round(accident/total*100) }; }
function calculateEmergencyFund(monthlyExpense){ return Number(monthlyExpense || 0) * 6; }
function calculateCashflow(policy){ if(policy.cashflows && policy.cashflows.length) return policy.cashflows; var flows=[]; for(var i=1;i<=Number(policy.paymentYears||0);i++) flows.push({year:i,value:-Number(policy.annualPremium||0)}); if(Number(policy.maturityValue||0)) flows.push({year:Number(policy.termYears || policy.paymentYears || 1), value:Number(policy.maturityValue)}); return flows; }
function calculateCoverage(list){ return (list||policies).reduce(function(sum,p){ sum[p.type]=(sum[p.type]||0)+Number(p.coverage||0); return sum; },{}); }
function calculateInsuranceScore(list){
  var c=calculateCoverage(list), need=calculateInsuranceNeed(), score={};
  score.medical = Math.min(100, (c.medical||0) / 2000000 * 100);
  score.life = Math.min(100, (c.life||0) / Math.max(1, need.lifeInsuranceNeed) * 100);
  score.cancer = Math.min(100, (c.cancer||0) / 1000000 * 100);
  score.longtermcare = Math.min(100, (c.longtermcare||0) / 1500000 * 100);
  score.accident = Math.min(100, (c.accident||0) / 3000000 * 100);
  score.total = Math.round((score.medical+score.life+score.cancer+score.longtermcare+score.accident)/5);
  return score;
}
function totalPremium(list){ return (list||policies).reduce(function(s,p){ return s+Number(p.annualPremium||0); },0); }
