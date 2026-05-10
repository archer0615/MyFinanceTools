function calculateIRR(cashflows){
  if(!cashflows || cashflows.length < 2) return 0;
  var hasNegative = cashflows.some(function(c){ return c.value < 0; });
  var hasPositive = cashflows.some(function(c){ return c.value > 0; });
  if(!hasNegative || !hasPositive) return 0;
  var low=-0.9999, high=1;
  for(var i=0;i<180;i++){
    var mid=(low+high)/2;
    var npv=cashflows.reduce(function(s,c){ return s + Number(c.value) / Math.pow(1+mid, Number(c.year)); },0);
    if(npv>0) low=mid; else high=mid;
  }
  return (low+high)/2;
}
function calculateBreakEvenYear(cashflows){ var total=0, sorted=(cashflows||[]).slice().sort(function(a,b){return a.year-b.year;}); for(var i=0;i<sorted.length;i++){ total+=Number(sorted[i].value); if(total>=0) return sorted[i].year; } return null; }
function calculateTotalPremium(cashflows){ return Math.abs((cashflows||[]).filter(function(c){return c.value<0;}).reduce(function(s,c){return s+Number(c.value);},0)); }
