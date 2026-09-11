const KEY="zoksh_v6";
const demo={
 name:"زوكش", income:8500,fixed:1000,saved:1500,
 expenses:[
  {id:1,name:"أكل",amount:1200,date:"2026-09-02"},{id:2,name:"مواصلات",amount:550,date:"2026-09-05"},
  {id:3,name:"سكن",amount:1000,date:"2026-09-07"},{id:4,name:"مصاريف شخصية",amount:400,date:"2026-09-09"},
  {id:5,name:"ترفيه",amount:300,date:"2026-09-10"},{id:6,name:"مواصلات",amount:120,date:"2026-09-11"}
 ],
 tasks:[
  {id:11,name:"مذاكرة إنجليزي",date:"2026-09-11",done:true},{id:12,name:"مراجعة المصاريف",date:"2026-09-11",done:false},
  {id:13,name:"رياضة",date:"2026-09-11",done:false},{id:14,name:"قراءة 20 صفحة",date:"2026-09-11",done:false}
 ],
 habits:[{id:21,name:"شرب مياه",icon:"💧"},{id:22,name:"مذاكرة",icon:"📚"},{id:23,name:"رياضة",icon:"🏃"},{id:24,name:"نوم بدري",icon:"😴"}],
 habitLogs:{},
 goals:[
  {id:31,name:"لابتوب جديد",target:10000,current:6000,deadline:"2026-10-20"},
  {id:32,name:"السفر",target:20000,current:6000,deadline:"2026-12-15"},
  {id:33,name:"تطوير الذات",target:1000,current:800,deadline:"2026-10-01"}
 ],
 installments:[
  {id:41,name:"قسط الموبايل",amount:250,count:3,paid:1,due:"2026-09-15"},
  {id:42,name:"قسط الدراجة",amount:300,count:5,paid:2,due:"2026-09-18"}
 ],
 reminders:[{id:51,name:"مراجعة المصاريف",time:"21:00",date:"2026-09-11"}],
 chat:[{w:"b",t:"أهلاً يا زوكش 👋<br>أنا جاهز أساعدك في فلوسك، عاداتك، مهامك وأهدافك. جرب الزرار اللي فوق أو اكتبلي بطريقتك."}]
};
for(let h of demo.habits){for(let i=1;i<=Math.min(h.id-18,7);i++){let x=new Date();x.setDate(x.getDate()-i);demo.habitLogs[h.id+"_"+x.toISOString().slice(0,10)]=true}}
let data=JSON.parse(localStorage.getItem(KEY)||"null"); if(!data){data=demo;localStorage.setItem(KEY,JSON.stringify(data))}
let selected=new Date().toISOString().slice(0,10),viewMonth=new Date(selected+"T12:00:00");
const $=id=>document.getElementById(id);
const money=n=>Number(n||0).toLocaleString("ar-EG")+" ج";
const uid=()=>Date.now()+Math.floor(Math.random()*1000);
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
function persist(){localStorage.setItem(KEY,JSON.stringify(data));render()}
function go(p){document.querySelectorAll(".page").forEach(x=>x.classList.toggle("active",x.id===p));document.querySelectorAll(".nav button").forEach(x=>x.classList.toggle("active",x.dataset.page===p));render();renderChat();scrollTo(0,0)}
function modal(title,html){$("modalTitle").textContent=title;$("modalBody").innerHTML=html;$("modal").classList.add("show")}
function closeModal(){$("modal").classList.remove("show")}
function actions(fn){return `<div class="action"><button class="save" onclick="${fn}">حفظ</button><button class="cancel" onclick="closeModal()">إلغاء</button></div>`}
function addExpense(){modal("💸 مصروف جديد",`<input id="m1" placeholder="نوع المصروف"><input id="m2" type="number" placeholder="المبلغ"><label>التاريخ</label><input id="m3" type="date" value="${selected}">${actions("saveExpense()")}`)}
function saveExpense(){let n=$("m1").value.trim(),a=+$("m2").value,dt=$("m3").value||selected;if(!n||a<=0)return alert("اكتب النوع والمبلغ");data.expenses.unshift({id:uid(),name:n,amount:a,date:dt});closeModal();persist()}
function addGoal(){modal("🎯 هدف جديد",`<input id="m1" placeholder="اسم الهدف"><input id="m2" type="number" placeholder="المبلغ المستهدف"><input id="m3" type="number" placeholder="المبلغ الحالي" value="0"><label>الموعد النهائي</label><input id="m4" type="date" value="${new Date(Date.now()+30*864e5).toISOString().slice(0,10)}">${actions("saveGoal()")}`)}
function saveGoal(){let n=$("m1").value.trim(),t=+$("m2").value,c=+$("m3").value||0,dl=$("m4").value;if(!n||t<=0||!dl)return alert("كمّل بيانات الهدف");data.goals.push({id:uid(),name:n,target:t,current:c,deadline:dl});closeModal();persist()}
function updateGoal(id){let g=data.goals.find(x=>x.id===id);modal("تحديث الهدف",`<input id="m1" type="number" value="${g.current}" placeholder="المبلغ الحالي">${actions("saveGoalUpdate("+id+")")}`)}
function saveGoalUpdate(id){data.goals.find(x=>x.id===id).current=+$("m1").value||0;closeModal();persist()}
function addInstallment(){modal("📌 قسط جديد",`<input id="m1" placeholder="اسم الالتزام"><input id="m2" type="number" placeholder="قيمة الدفعة"><input id="m3" type="number" value="1" placeholder="عدد الدفعات"><label>أول استحقاق</label><input id="m4" type="date" value="${selected}">${actions("saveInstallment()")}`)}
function saveInstallment(){let n=$("m1").value.trim(),a=+$("m2").value,c=Math.max(1,+$("m3").value||1),dt=$("m4").value;if(!n||a<=0)return alert("كمّل البيانات");data.installments.push({id:uid(),name:n,amount:a,count:c,paid:0,due:dt});closeModal();persist()}
function payInstallment(id){let x=data.installments.find(i=>i.id===id);x.paid=Math.min(x.count,x.paid+1);persist()}
function addTask(){modal("✅ مهمة جديدة",`<input id="m1" placeholder="مثال: مذاكرة ساعة"><label>اليوم</label><input id="m2" type="date" value="${selected}">${actions("saveTask()")}`)}
function saveTask(){let n=$("m1").value.trim(),dt=$("m2").value||selected;if(!n)return;data.tasks.unshift({id:uid(),name:n,date:dt,done:false});closeModal();persist()}
function toggleTask(id){let x=data.tasks.find(t=>t.id===id);x.done=!x.done;persist()}
function addHabit(){modal("🔥 عادة جديدة",`<input id="m1" placeholder="مثال: شرب مية"><input id="m2" placeholder="الإيموجي" value="🔥">${actions("saveHabit()")}`)}
function saveHabit(){let n=$("m1").value.trim(),ic=$("m2").value.trim()||"🔥";if(!n)return;data.habits.push({id:uid(),name:n,icon:ic});closeModal();persist()}
function habitDone(id){return !!data.habitLogs[id+"_"+selected]}
function toggleHabit(id){let k=id+"_"+selected;data.habitLogs[k]=!data.habitLogs[k];persist()}
function streak(id){let s=0,t=new Date();while(true){let dt=t.toISOString().slice(0,10);if(data.habitLogs[id+"_"+dt]){s++;t.setDate(t.getDate()-1)}else break}return s}
function addReminder(){modal("🔔 تذكير",`<input id="m1" placeholder="اسم التذكير"><input id="m2" type="time" value="21:00"><label>التاريخ</label><input id="m3" type="date" value="${selected}">${actions("saveReminder()")}`)}
function saveReminder(){let n=$("m1").value.trim(),t=$("m2").value,dt=$("m3").value||selected;if(!n||!t)return;data.reminders.push({id:uid(),name:n,time:t,date:dt});closeModal();persist()}
function saveFinance(){data.income=+$("incomeInput").value||0;data.fixed=+$("fixedInput").value||0;persist();alert("اتحفظت الميزانية 💜")}
function editName(){let n=prompt("اسمك",data.name);if(n){data.name=n;persist()}}
function backup(){let b=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="zoksh-v6-backup.json";a.click()}
function restore(){let i=document.createElement("input");i.type="file";i.accept=".json";i.onchange=()=>{let r=new FileReader();r.onload=()=>{try{data=JSON.parse(r.result);persist();alert("تم الاسترجاع")}catch{alert("الملف غير صالح")}};r.readAsText(i.files[0])};i.click()}
function clearAll(){if(confirm("تمسح كل بيانات التطبيق؟")){data={...demo,expenses:[],tasks:[],habits:[],habitLogs:{},goals:[],installments:[],reminders:[],chat:[]};persist()}}
function toggleTheme(){document.body.classList.toggle("light");localStorage.setItem("zoksh_theme",document.body.classList.contains("light")?"light":"dark")}
function focusSearch(){setTimeout(()=>{go("settings");$("search").focus()},50)}
function addSaving(){modal("💰 تحويش",`<input id="m1" type="number" placeholder="المبلغ">${actions("saveSaving()")}`)}
function saveSaving(){data.saved+=(+$("m1").value||0);closeModal();persist()}
function changeMonth(n){viewMonth.setMonth(viewMonth.getMonth()+n);renderCalendar()}
function pickDate(dt){selected=dt;viewMonth=new Date(dt+"T12:00:00");render()}
function renderCalendar(){let y=viewMonth.getFullYear(),m=viewMonth.getMonth();$("monthTitle").textContent=new Date(y,m,1).toLocaleDateString("ar-EG",{month:"long",year:"numeric"});let first=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate(),html="";for(let i=0;i<first;i++)html+='<div></div>';for(let n=1;n<=days;n++){let dt=`${y}-${String(m+1).padStart(2,"0")}-${String(n).padStart(2,"0")}`,has=data.tasks.some(t=>t.date===dt)||data.expenses.some(e=>e.date===dt);html+=`<button class="calday ${dt===selected?"sel":""} ${dt===new Date().toISOString().slice(0,10)?"today":""}" onclick="pickDate('${dt}')">${n}${has?'<div class="dots">●</div>':""}</button>`}$("calendar").className="calgrid";$("calendar").innerHTML=html}
function render(){
let month=new Date(selected+"T12:00:00").toISOString().slice(0,7),today=new Date().toISOString().slice(0,10),spendMonth=data.expenses.filter(x=>x.date.startsWith(month)).reduce((a,x)=>a+x.amount,0),spendDay=data.expenses.filter(x=>x.date===today).reduce((a,x)=>a+x.amount,0),free=data.income-data.fixed-spendMonth;
$("heroDate").textContent=new Date().toLocaleDateString("ar-EG",{weekday:"long",day:"numeric",month:"long"});
let ts=data.tasks.filter(x=>x.date===today),td=ts.filter(x=>x.done).length;
$("homeTasks").textContent=`${td}/${ts.length}`;$("homeSpend").textContent=money(spendDay);$("homeSaved").textContent=money(data.saved);$("homeStreak").textContent=(data.habits.length?Math.max(...data.habits.map(h=>streak(h.id))):0)+" يوم";
$("income").textContent=money(data.income);$("monthSpend").textContent=money(spendMonth);$("free").textContent=money(free);$("saved").textContent=money(data.saved);$("commitments").textContent=money(data.installments.reduce((a,x)=>a+x.amount*(x.count-x.paid),0));
$("incomeInput").value=data.income||"";$("fixedInput").value=data.fixed||"";
renderHome(ts);renderExpenses(month);renderGoals();renderInstallments();renderDay();renderCalendar();renderSearch();
}
function renderHome(ts){$("homeTimeline").innerHTML=ts.length?ts.slice(0,5).map(t=>`<div class="row"><button class="check ${t.done?"on":""}" onclick="toggleTask(${t.id})">${t.done?"✓":""}</button><div class="grow ${t.done?"strike":""}"><b>${esc(t.name)}</b><span class="muted">اليوم</span></div><span>${t.done?"✓":"○"}</span></div>`).join(""):'<div class="empty">يومك فاضي — أضف أول مهمة 👌</div>';$("homeGoals").innerHTML=data.goals.slice(0,3).map(g=>goalHTML(g,false)).join("")}
function renderExpenses(month){let e=data.expenses.filter(x=>x.date.startsWith(month));let max=Math.max(1,...e.map(x=>x.amount));let days={};e.forEach(x=>{let k=x.date.slice(-2);days[k]=(days[k]||0)+x.amount});let keys=Object.keys(days).slice(-8);$("chart").innerHTML=keys.length?keys.map(k=>`<div class="bar"><i style="height:${Math.max(5,days[k]/max*100)}%"></i><small>${k}</small></div>`).join(""):'<div class="empty">مفيش بيانات كفاية للرسم البياني.</div>';$("expenseRows").innerHTML=e.slice().reverse().slice(0,8).map(x=>`<div class="row"><div class="grow"><b>${esc(x.name)}</b><span class="muted">${x.date}</span></div><b>${money(x.amount)}</b></div>`).join("")||'<div class="empty">مفيش مصاريف.</div>'}
function goalHTML(g,buttons=true){let p=Math.min(100,Math.round(g.current/g.target*100));return `<div class="row"><div class="grow"><b>🎯 ${esc(g.name)}</b><div class="mini">${money(g.current)} من ${money(g.target)} • ${p}%</div><div class="goalLine"><i style="width:${p}%"></i></div><span class="muted">الموعد ${g.deadline}</span></div>${buttons?`<button class="link" onclick="updateGoal(${g.id})">تحديث</button>`:""}</div>`}
function renderGoals(){$("goalRows").innerHTML=data.goals.map(g=>goalHTML(g,true)).join("")||'<div class="empty">أضف أول هدف.</div>'}
function renderInstallments(){$("installmentRows").innerHTML=data.installments.map(x=>`<div class="row"><div class="grow"><b>📌 ${esc(x.name)}</b><span class="muted">${money(x.amount)} • استحقاق ${x.due}</span><div class="goalLine"><i style="width:${x.paid/x.count*100}%"></i></div><span class="pill">${x.paid}/${x.count} مدفوع</span></div><button class="link" onclick="payInstallment(${x.id})">دفع</button></div>`).join("")||'<div class="empty">مفيش أقساط.</div>'}
function renderDay(){let dtasks=data.tasks.filter(x=>x.date===selected),done=dtasks.filter(x=>x.done).length,p=dtasks.length?Math.round(done/dtasks.length*100):0;$("selectedDateLabel").textContent=new Date(selected+"T12:00:00").toLocaleDateString("ar-EG",{weekday:"long",day:"numeric",month:"long"});$("dayPercent").textContent=p+"% إنجاز";$("dayProgress").style.width=p+"%";
$("habitRows").innerHTML=data.habits.map(h=>`<div class="row habit"><button class="check ${habitDone(h.id)?"on":""}" onclick="toggleHabit(${h.id})">${habitDone(h.id)?"✓":""}</button><div class="grow"><b>${h.icon} ${esc(h.name)}</b><span class="muted">أفضل Streak: ${bestStreak(h.id)} يوم</span></div><span class="streak">🔥 ${streak(h.id)}</span></div>`).join("")||'<div class="empty">أضف عادة.</div>';
$("taskRows").innerHTML=dtasks.map(t=>`<div class="row"><button class="check ${t.done?"on":""}" onclick="toggleTask(${t.id})">${t.done?"✓":""}</button><div class="grow ${t.done?"strike":""}">${esc(t.name)}</div></div>`).join("")||'<div class="empty">مفيش مهام في اليوم ده.</div>';
let rs=data.reminders.filter(r=>r.date===selected);$("reminderRows").innerHTML=rs.map(r=>`<div class="row">🔔<div class="grow"><b>${esc(r.name)}</b><span class="muted">${r.date}</span></div><b>${r.time}</b></div>`).join("")||'<div class="empty">مفيش تذكيرات.</div>'}
function bestStreak(id){let best=0,run=0,dates=Object.keys(data.habitLogs).filter(k=>k.startsWith(id+"_")&&data.habitLogs[k]).map(k=>k.slice(String(id).length+1)).sort();let prev=null;for(let x of dates){let a=new Date(x),b=prev&&new Date(prev);if(!b||Math.round((a-b)/864e5)!==1)run=1;else run++;best=Math.max(best,run);prev=x}return best}
function renderSearch(){if(!$("search"))return;searchAll()}
function searchAll(){let q=($("search")?.value||"").trim().toLowerCase();if(!q){$("results").innerHTML="";return}let all=[];data.expenses.forEach(x=>all.push(["💸 مصروف",x.name,money(x.amount)+" • "+x.date]));data.tasks.forEach(x=>all.push(["✅ مهمة",x.name,x.date]));data.habits.forEach(x=>all.push(["🔥 عادة",x.name,"Streak "+streak(x.id)+" يوم"]));data.goals.forEach(x=>all.push(["🎯 هدف",x.name,money(x.current)+" / "+money(x.target)+" • "+x.deadline]));data.installments.forEach(x=>all.push(["📌 قسط",x.name,money(x.amount)+" • "+x.due]));data.reminders.forEach(x=>all.push(["🔔 تذكير",x.name,x.date+" "+x.time]));let r=all.filter(x=>(x[0]+" "+x[1]+" "+x[2]).toLowerCase().includes(q)).slice(0,40);$("results").innerHTML=r.length?r.map(x=>`<div class="searchResult"><b>${x[0]}</b> ${esc(x[1])}<small>${esc(x[2])}</small></div>`).join(""):'<div class="empty">مفيش نتائج.</div>'}
function ask(t){$("message").value=t;send()}
function send(){let q=$("message").value.trim();if(!q)return;data.chat.push({w:"u",t:esc(q)});let a=ai(q);data.chat.push({w:"b",t:a});$("message").value="";persist();renderChat()}
function renderChat(){$("chat").innerHTML=data.chat.map(m=>`<div class="msg ${m.w}">${m.t}</div>`).join("");$("chat").scrollTop=$("chat").scrollHeight}
function ai(q){
let raw=q.trim(), s=raw.toLowerCase().replace(/[إأآ]/g,"ا"), nums=(raw.match(/\d+(?:[.,]\d+)?/g)||[]).map(x=>+x.replace(",",".")), n=nums[0]||0;
const month=selected.slice(0,7), today=selected;
const say=(x)=>x;
if(/^(اهلا|سلام|هاي|ازيك|عامل ايه|صباح|مساء)/.test(s)) return "أهلاً يا زوكش 👋 أنا المساعد المحلي بتاعك. أقدر أتعامل مع كل بيانات التطبيق وأعمل لك تحليل وخطط وأوامر مباشرة.";
if(/مساعد|تقدر تعمل ايه|اوامر|أوامر|مميزات/.test(s)) return "أقدر أنفذ داخل التطبيق: تسجيل/حذف مصروفات، تعديل الدخل والثابت، إضافة وتحديث أهداف، عادات وStreaks، مهام، تذكيرات، أقساط، تحويش، بحث وتحليل يومي وشهري. مثال: «امسح مصروف المواصلات» أو «زود هدف اللابتوب لـ 8000».";
if(/مرتبي|راتبي|دخلي|المرتب/.test(s)&&n){data.income=n;return `💵 سجلت دخلك الشهري ${money(n)}.`;}
if(/الثابت|التزامات ثابتة|مصروف ثابت/.test(s)&&n){data.fixed=n;return `🏠 سجلت الالتزامات الثابتة ${money(n)}.`;}
if(/حوشت|حوش|ادخار|توفير/.test(s)&&n){data.saved+=n;return `💰 تمام. زودت التوفير ${money(n)}، والإجمالي ${money(data.saved)}.`;}
if(/(امسح|احذف).*(مصروف|صرف)/.test(s)){
 let key=raw.replace(/.*?(مصروف|صرف)/i,"").replace(/احذف|امسح|المبلغ|جنيه|ج/gi,"").trim();
 let idx=data.expenses.findIndex(x=>x.name.toLowerCase().includes(key.toLowerCase()));
 if(idx<0 && n) idx=data.expenses.findIndex(x=>x.amount===n);
 if(idx>=0){let x=data.expenses.splice(idx,1)[0];return `🗑️ حذفت مصروف ${esc(x.name)} بقيمة ${money(x.amount)}.`;} return "مش لاقي المصروف ده. اكتب اسمه أو المبلغ.";
}
if(/مصروف|صرف|دفعت/.test(s)&&n){let name=raw.replace(/\d+(?:[.,]\d+)?/,"").replace(/مصروف|صرف|دفعت|جنيه|ج/gi,"").trim()||"مصروف";data.expenses.unshift({id:uid(),name,amount:n,date:selected});return `✓ سجلت ${money(n)} في "${esc(name)}" بتاريخ ${selected}.`;}
if(/(امسح|احذف).*(مهم|تاسك)/.test(s)){let key=raw.replace(/.*?(مهمة|مهم)/i,"").replace(/احذف|امسح/gi,"").trim();let idx=data.tasks.findIndex(x=>x.name.toLowerCase().includes(key.toLowerCase()));if(idx>=0){let x=data.tasks.splice(idx,1)[0];return `🗑️ حذفت المهمة "${esc(x.name)}".`;}return "مش لاقي المهمة دي.";}
if(/(اعمل|اضف|ضيف).*(مهم|تاسك)|مهمة/.test(s)){let name=raw.replace(/اضف|ضيف|اعمل|مهمة|مهم|تاسك/gi,"").trim()||"مهمة جديدة";data.tasks.push({id:uid(),name,date:selected,done:false});return `✓ ضفت "${esc(name)}" في يومك.`;}
if(/(علّم|علم|خلص|كمل).*(مهم)/.test(s)){let key=raw.replace(/.*?(مهمة|مهم)/i,"").replace(/علّم|علم|خلص|كمل/gi,"").trim();let x=data.tasks.find(t=>t.name.toLowerCase().includes(key.toLowerCase()))||data.tasks.find(t=>!t.done&&t.date===selected);if(x){x.done=true;return `✅ تمام، علمت "${esc(x.name)}" كمكتملة.`;}return "مش لاقي مهمة مفتوحة.";}
if(/(اعمل|اضف|ضيف).*(عادة|روتين)|عادة|روتين/.test(s)){let name=raw.replace(/اعمل|اضف|ضيف|عادة|روتين|جديد|جديدة/gi,"").trim()||"عادة جديدة";data.habits.push({id:uid(),name,icon:"🔥"});return `🔥 أضفت عادة "${esc(name)}". علّمها كل يوم عشان الـ Streak يكبر.`;}
if(/(خلص|عملت|انجزت).*(عادة)/.test(s)){let key=raw.replace(/.*?(عادة)/i,"").replace(/خلص|عملت|انجزت/gi,"").trim();let h=data.habits.find(x=>x.name.toLowerCase().includes(key.toLowerCase()))||data.habits[0];if(h){data.habitLogs[h.id+"_"+selected]=true;return `🔥 سجلت عادة "${esc(h.name)}" لليوم. Streak الحالي ${streak(h.id)+1} يوم تقريبًا.`;}return "مفيش عادة مسجلة.";}
if(/هدف/.test(s)&&n){let existing=data.goals.find(g=>raw.toLowerCase().includes(g.name.toLowerCase()));if(existing){existing.target=n;return `🎯 عدلت هدف "${esc(existing.name)}" إلى ${money(n)}.`;}let name=raw.replace(/\d+(?:[.,]\d+)?/,"").replace(/هدف|حط|عايز|عاوز/gi,"").trim()||"هدف جديد";data.goals.push({id:uid(),name,target:n,current:0,deadline:new Date(Date.now()+30*864e5).toISOString().slice(0,10)});return `🎯 عملت هدف "${esc(name)}" بقيمة ${money(n)}.`;}
if(/(زود|حدث|حدّث).*(هدف)/.test(s)&&n){let key=raw.replace(/.*?(هدف)/i,"").replace(/زود|حدث|حدّث/gi,"").replace(/\d+(?:[.,]\d+)?/,"").trim();let g=data.goals.find(x=>x.name.toLowerCase().includes(key.toLowerCase()));if(g){g.current=n;return `🎯 حدّثت "${esc(g.name)}" إلى ${money(n)}.`;}return "مش لاقي الهدف ده.";}
if(/(امسح|احذف).*(هدف)/.test(s)){let key=raw.replace(/.*?(هدف)/i,"").replace(/احذف|امسح/gi,"").trim();let i=data.goals.findIndex(g=>g.name.toLowerCase().includes(key.toLowerCase()));if(i>=0){let g=data.goals.splice(i,1)[0];return `🗑️ حذفت الهدف "${esc(g.name)}".`;}return "مش لاقي الهدف ده.";}
if(/قسط|التزام/.test(s)&&n){let m=raw.match(/يوم\s*(\d{1,2})/),day=m?+m[1]:15,dt=new Date();dt.setDate(day);data.installments.push({id:uid(),name:"التزام جديد",amount:n,count:1,paid:0,due:dt.toISOString().slice(0,10)});return `📌 سجلت التزام ${money(n)} واستحقاقه يوم ${day}.`;}
if(/دفع.*(قسط|التزام)/.test(s)){let x=data.installments.find(i=>i.paid<i.count);if(x){x.paid++;return `✅ سجلت دفعة في "${esc(x.name)}". المدفوع ${x.paid}/${x.count}.`;}return "مفيش قسط مفتوح.";}
if(/تذكير|فكرني/.test(s)){let tm=raw.match(/(?:الساعة|وقت|الساعة)\s*(\d{1,2})(?::(\d{2}))?/),time=tm?String(tm[1]).padStart(2,"0")+":"+String(tm[2]||"00").padStart(2,"0"):"21:00",name=raw.replace(/تذكير|فكرني|الساعة|وقت|\d{1,2}:?\d{0,2}/gi,"").trim()||"تذكير جديد";data.reminders.push({id:uid(),name,time,date:selected});return `🔔 ضفت تذكير "${esc(name)}" الساعة ${time}.`}
if(/بحث|دور على|فين/.test(s)){let key=raw.replace(/بحث|دور على|فين/gi,"").trim().toLowerCase();let hits=[];data.expenses.forEach(x=>{if(x.name.toLowerCase().includes(key))hits.push("💸 "+x.name+" "+money(x.amount))});data.tasks.forEach(x=>{if(x.name.toLowerCase().includes(key))hits.push("✅ "+x.name)});data.habits.forEach(x=>{if(x.name.toLowerCase().includes(key))hits.push("🔥 "+x.name)});data.goals.forEach(x=>{if(x.name.toLowerCase().includes(key))hits.push("🎯 "+x.name)});return hits.length?"🔎 لقيت:\n"+hits.slice(0,8).join("\n"):"مش لاقي حاجة بالكلمة دي.";}
if(/حلل|تحليل|فلوسي|وضعي/.test(s)){let sp=data.expenses.filter(x=>x.date.startsWith(month)).reduce((a,x)=>a+x.amount,0),free=data.income-data.fixed-sp,td=data.tasks.filter(x=>x.date===today),done=td.filter(x=>x.done).length,commit=data.installments.reduce((a,x)=>a+x.amount*(x.count-x.paid),0);return `📊 تحليل الشهر:\nالدخل: ${money(data.income)}\nالمصاريف: ${money(sp)}\nالثابت: ${money(data.fixed)}\nالمتاح: ${money(free)}\nالتوفير: ${money(data.saved)}\nالالتزامات المتبقية: ${money(commit)}\nإنجاز مهام اليوم: ${td.length?Math.round(done/td.length*100):0}%.`;}
if(/كام|اجمالي|إجمالي/.test(s)&&/مصروف/.test(s)){let sp=data.expenses.filter(x=>x.date.startsWith(month)).reduce((a,x)=>a+x.amount,0);return `💸 إجمالي مصروف الشهر ${money(sp)}.`;}
if(/كام|اجمالي|إجمالي/.test(s)&&/حوشت|توفير|ادخار/.test(s))return `💰 إجمالي التوفير ${money(data.saved)}.`;
return "🤖 أقدر أنفذ أوامر كثيرة داخل التطبيق. جرّب: صرف 50 مواصلات • اعمل عادة مذاكرة • حط هدف 10000 • حدث هدف اللابتوب 8000 • سجل قسط 2500 يوم 15 • أضف مهمة الجيم • فكرني الساعة 9 مراجعة المصاريف • حلل فلوسي.";
}
$("message").addEventListener("keydown",e=>{if(e.key==="Enter")send()});
if(localStorage.getItem("zoksh_theme")==="light")document.body.classList.add("light");
render();renderChat();
if("serviceWorker"in navigator)navigator.serviceWorker.register("./sw.js").catch(()=>{});
