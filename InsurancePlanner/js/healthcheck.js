function calculateHealthCheck(){
  var coverage=calculateCoverage(), annualPremium=totalPremium(), issues=[];
  if(profile.hasChild && (coverage.life||0) < profile.annualIncome*10) issues.push({level:"danger", text:"壽險保障不足"});
  if((coverage.medical||0) < 2000000) issues.push({level:"warn", text:"醫療保障可能不足"});
  if(annualPremium > profile.annualIncome*.1) issues.push({level:"warn", text:"保費佔收入比例偏高"});
  if(policies.some(function(p){ return (p.type==="savings" || p.type==="investment") && Number(p.irr||0)<2; })) issues.push({level:"warn", text:"資金效率偏低"});
  if(policies.some(function(p){ return Number(p.annualPremium||0) > annualPremium*.5; })) issues.push({level:"warn", text:"保費過度集中"});
  if(policies.some(function(p){ return Number(p.insuredAge||0)>60 && p.type==="medical"; })) issues.push({level:"warn", text:"高齡醫療保費可能快速上升"});
  return issues.length ? issues : [{level:"ok", text:"核心保障未見重大缺口"}];
}
