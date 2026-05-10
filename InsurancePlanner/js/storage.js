var STORAGE_KEY = "insurance-planner-data";
var defaultWorkspace = {
  policies: [],
  familyMembers: [{ name:"本人", age:35, relation:"本人", annualIncome:900000, monthlyExpense:55000 }],
  settings: { theme:"system", notifications:false },
  profile: { age:35, annualIncome:900000, mortgage:4000000, childrenCount:1, monthlyExpense:55000, hasChild:true, retireAge:65, inflationRate:2, returnRate:4, annualPremiumBudget:90000 }
};
function clone(obj){ return JSON.parse(JSON.stringify(obj)); }
function normalizePolicy(p){
  var now = new Date().toISOString();
  return {
    id: String(p.id || uid()),
    name: String(p.name || ""),
    company: String(p.company || ""),
    type: String(p.type || "medical"),
    subtype: String(p.subtype || ""),
    status: String(p.status || "active"),
    annualPremium: Number(p.annualPremium || 0),
    paymentYears: Number(p.paymentYears || 0),
    coverage: Number(p.coverage || 0),
    termYears: Number(p.termYears || 0),
    startAge: Number(p.startAge || 0),
    insuredAge: Number(p.insuredAge || p.startAge || 0),
    maturityValue: Number(p.maturityValue || 0),
    irr: Number(p.irr || 0),
    currency: String(p.currency || "TWD"),
    tags: Array.isArray(p.tags) ? p.tags : [],
    note: String(p.note || ""),
    cashflows: Array.isArray(p.cashflows) ? p.cashflows.map(function(c){ return { year:Number(c.year), value:Number(c.value) }; }) : [],
    createdAt: p.createdAt || now,
    updatedAt: now
  };
}
function samplePolicies(){ return policyTemplates.map(function(p){ return normalizePolicy(p); }); }
function loadWorkspace(){
  try {
    var raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!raw) throw new Error("empty");
    return {
      policies: Array.isArray(raw.policies) ? raw.policies.map(normalizePolicy) : samplePolicies(),
      familyMembers: Array.isArray(raw.familyMembers) ? raw.familyMembers : clone(defaultWorkspace.familyMembers),
      settings: Object.assign({}, defaultWorkspace.settings, raw.settings || {}),
      profile: Object.assign({}, defaultWorkspace.profile, raw.profile || {})
    };
  } catch (e) {
    var data = clone(defaultWorkspace);
    data.policies = samplePolicies();
    return data;
  }
}
function saveWorkspace(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace)); }
function savePolicies(){ workspace.policies = policies; saveWorkspace(); }
function loadPolicies(){ return loadWorkspace().policies; }
function saveFamily(){ workspace.familyMembers = familyMembers; saveWorkspace(); }
function loadFamily(){ return loadWorkspace().familyMembers; }
function exportWorkspace(){ download("insurance-workspace.json", JSON.stringify(workspace, null, 2), "application/json"); }
function importWorkspace(file){
  var reader = new FileReader();
  reader.onload = function(){
    try {
      var imported = JSON.parse(reader.result);
      workspace = Object.assign(clone(defaultWorkspace), imported);
      policies = Array.isArray(workspace.policies) ? workspace.policies.map(normalizePolicy) : samplePolicies();
      familyMembers = Array.isArray(workspace.familyMembers) ? workspace.familyMembers : clone(defaultWorkspace.familyMembers);
      profile = Object.assign({}, defaultWorkspace.profile, workspace.profile || {});
      workspace.policies = policies; workspace.familyMembers = familyMembers; workspace.profile = profile;
      saveWorkspace(); render(); createToast("匯入完成");
    } catch(e) { createToast("匯入失敗：JSON 格式不正確"); }
  };
  reader.readAsText(file);
}
function clearWorkspace(){
  localStorage.removeItem(STORAGE_KEY);
  workspace = loadWorkspace();
  policies = workspace.policies;
  familyMembers = workspace.familyMembers;
  profile = workspace.profile;
  applyTheme(); render();
}
