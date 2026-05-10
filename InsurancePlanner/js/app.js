var workspace = loadWorkspace();
var policies = workspace.policies;
var familyMembers = workspace.familyMembers;
var profile = workspace.profile;
var view = (location.hash || "#dashboard").replace("#","");
if(routes.indexOf(view) === -1) view = "dashboard";

function section(id){ return document.getElementById(id+"-section"); }
function showSection(id){ view=id; location.hash=id; render(); }
function setProfile(key,value){ profile[key]=value; workspace.profile=profile; saveWorkspace(); render(); }
function setTheme(theme){ workspace.settings.theme=theme; saveWorkspace(); applyTheme(); drawAllCharts(); }
function applyTheme(){
  var theme = workspace.settings.theme || "system";
  var dark = theme==="dark" || (theme==="system" && window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}
function render(){
  renderNav();
  routes.forEach(function(id){ section(id).classList.toggle("hidden", id!==view); });
  renderDashboard(); renderNeed(); renderHealth(); renderIrr(); renderCompare(); renderRetirement(); renderScenario(); renderPremium(); renderFamily(); renderSettings();
  setTimeout(drawAllCharts, 30);
}
function policySelect(id, selected, onchange){
  return '<label class="field">保單<select id="'+id+'" onchange="'+onchange+'">'+policies.map(function(p){return '<option value="'+p.id+'" '+(p.id===selected?'selected':'')+'>'+escapeHtml(p.name)+'</option>';}).join("")+'</select></label>';
}
function selectedIrrPolicy(){
  var el=document.getElementById("irrPolicy"), id=el?el.value:null;
  return policies.find(function(p){return p.id===id;}) || policies.find(function(p){return p.type==="savings" || p.type==="investment";}) || policies[0] || normalizePolicy(policyTemplates[0]);
}
function policyTable(removable){
  return panel("保單清單",'<div class="table-wrap"><table><thead><tr><th>保單</th><th>公司</th><th>類型</th><th>狀態</th><th>年保費</th><th>保額</th><th>IRR</th><th>回本年</th><th>滿期金</th><th>操作</th></tr></thead><tbody>'+policies.map(function(p){ var flows=calculateCashflow(p), be=calculateBreakEvenYear(flows); return '<tr><td>'+escapeHtml(p.name)+'</td><td>'+escapeHtml(p.company)+'</td><td>'+(typeLabels[p.type]||p.type)+'</td><td>'+(statusLabels[p.status]||p.status)+'</td><td>'+money(p.annualPremium)+'</td><td>'+money(p.coverage)+'</td><td>'+Number(p.irr||0).toFixed(2)+'%</td><td>'+(be||"-")+'</td><td>'+(p.maturityValue?money(p.maturityValue):"-")+'</td><td>'+(removable?'<button class="btn ghost" onclick="removePolicy(\''+p.id+'\')">刪除</button>':'-')+'</td></tr>'; }).join("")+'</tbody></table></div>');
}
function cashflowTable(flows){
  return '<div class="table-wrap"><table><thead><tr><th>年度</th><th>現金流</th></tr></thead><tbody>'+flows.map(function(f){ return '<tr><td>第 '+f.year+' 年</td><td>'+money(f.value)+'</td></tr>'; }).join("")+'</tbody></table></div>';
}
function policyForm(){
  return '<form onsubmit="addPolicy(event)" class="stack"><label class="field">快速模板<select id="tpl">'+policyTemplates.map(function(p,i){return '<option value="'+i+'">'+escapeHtml(p.name)+'</option>';}).join("")+'</select></label><div class="form-grid">'+textInput("pName","保單名稱","")+textInput("pCompany","保險公司","")+'<label class="field">類型<select id="pType">'+Object.keys(typeLabels).map(function(k){return '<option value="'+k+'">'+typeLabels[k]+'</option>';}).join("")+'</select></label><label class="field">狀態<select id="pStatus">'+Object.keys(statusLabels).map(function(k){return '<option value="'+k+'">'+statusLabels[k]+'</option>';}).join("")+'</select></label><label class="field">年保費<input id="pPremium" type="number" value="0"></label><label class="field">保額<input id="pCoverage" type="number" value="0"></label><label class="field">繳費年期<input id="pPayYears" type="number" value="20"></label><label class="field">滿期金<input id="pMaturity" type="number" value="0"></label></div><button class="btn" type="submit">新增保單</button></form>';
}
function addPolicy(e){
  e.preventDefault();
  var t=clone(policyTemplates[Number(document.getElementById("tpl").value)] || policyTemplates[0]);
  t.name=document.getElementById("pName").value || t.name;
  t.company=document.getElementById("pCompany").value || t.company;
  t.type=document.getElementById("pType").value || t.type;
  t.status=document.getElementById("pStatus").value || t.status;
  t.annualPremium=Number(document.getElementById("pPremium").value || t.annualPremium);
  t.coverage=Number(document.getElementById("pCoverage").value || t.coverage);
  t.paymentYears=Number(document.getElementById("pPayYears").value || t.paymentYears);
  t.maturityValue=Number(document.getElementById("pMaturity").value || t.maturityValue);
  policies.push(normalizePolicy(t)); savePolicies(); render(); createToast("保單已新增");
}
function removePolicy(id){ policies=policies.filter(function(p){return p.id!==id;}); workspace.policies=policies; savePolicies(); render(); }
function familyForm(){
  return '<form onsubmit="addFamily(event)" class="stack"><div class="form-grid">'+textInput("fName","姓名","")+textInput("fRelation","關係","")+'<label class="field">年齡<input id="fAge" type="number" value="35"></label><label class="field">年收入<input id="fIncome" type="number" value="0"></label><label class="field wide">月支出<input id="fExpense" type="number" value="0"></label></div><button class="btn" type="submit">新增成員</button></form>';
}
function addFamily(e){
  e.preventDefault();
  familyMembers.push({ name:document.getElementById("fName").value || "家庭成員", relation:document.getElementById("fRelation").value || "家人", age:Number(document.getElementById("fAge").value||0), annualIncome:Number(document.getElementById("fIncome").value||0), monthlyExpense:Number(document.getElementById("fExpense").value||0) });
  saveFamily(); render(); createToast("家庭成員已新增");
}
function removeFamily(i){ familyMembers.splice(i,1); saveFamily(); render(); }
function familyTable(){
  return panel("家庭成員",'<div class="table-wrap"><table><thead><tr><th>姓名</th><th>關係</th><th>年齡</th><th>年收入</th><th>月支出</th><th>操作</th></tr></thead><tbody>'+familyMembers.map(function(m,i){return '<tr><td>'+escapeHtml(m.name)+'</td><td>'+escapeHtml(m.relation)+'</td><td>'+m.age+'</td><td>'+money(m.annualIncome)+'</td><td>'+money(m.monthlyExpense)+'</td><td><button class="btn ghost" onclick="removeFamily('+i+')">刪除</button></td></tr>';}).join("")+'</tbody></table></div>');
}
function enableNotifications(){
  if(!("Notification" in window)){ createToast("此瀏覽器不支援 Notification API"); return; }
  Notification.requestPermission().then(function(permission){ workspace.settings.notifications = permission==="granted"; saveWorkspace(); createToast(permission==="granted" ? "提醒已啟用" : "提醒未啟用"); renderSettings(); });
}
document.getElementById("exportJson").onclick = exportWorkspace;
document.getElementById("importJson").onchange = function(e){ if(e.target.files[0]) importWorkspace(e.target.files[0]); };
document.getElementById("printPdf").onclick = exportPdf;
document.getElementById("notifyBtn").onclick = enableNotifications;
document.getElementById("sampleBtn").onclick = function(){ policies=samplePolicies(); workspace.policies=policies; saveWorkspace(); render(); createToast("範例資料已載入"); };
document.getElementById("themeToggle").onclick = function(){ setTheme(document.documentElement.classList.contains("dark") ? "light" : "dark"); };
window.addEventListener("hashchange", function(){ var next=(location.hash||"#dashboard").replace("#",""); if(routes.indexOf(next)>-1){ view=next; render(); } });
window.addEventListener("resize", drawAllCharts);
applyTheme();
render();
