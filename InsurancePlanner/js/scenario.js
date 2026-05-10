function applyScenario(name){
  if(name==="marriage") profile.hasChild = true;
  if(name==="child"){ profile.hasChild = true; profile.childrenCount += 1; profile.monthlyExpense += 15000; }
  if(name==="house") profile.mortgage += 5000000;
  if(name==="incomeDown") profile.annualIncome = Math.round(profile.annualIncome*.8);
  if(name==="earlyRetire") profile.retireAge = Math.max(profile.age+1, profile.retireAge-5);
  workspace.profile = profile; saveWorkspace(); render();
}
