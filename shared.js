/* Shared logic — Loan Application & Approval prototype
   Rule set mirrors business-rules.md v1.0. State lives in the browser's local storage
   so the applicant portal and officer console see the same applications. Nothing is sent anywhere. */

const RULES = { minAge:21, maxAge:60, minIncSal:20000, minIncSelf:30000, minScore:650, maxFoir:0.60,
  stpScore:750, stpFoir:0.40, stpAmount:500000, officerLimit:500000, seniorLimit:1500000 };
const GRID = { A:[11.5,12.0,12.5], B:[13.0,13.5,14.0], C:[15.5,16.0,16.5], D:[18.0,18.5,19.0] };
const REASONS = { AGE_OUT_OF_RANGE:'Age outside 21–60', INCOME_BELOW_MIN:'Income below minimum', SCORE_BELOW_MIN:'Credit score below minimum', RECENT_DEFAULT:'Recent default on credit report', KYC_FAILED:'KYC verification failed', FOIR_EXCEEDED:'Existing obligations too high for this loan', NEGATIVE_LIST:'Internal policy', INCOME_UNVERIFIABLE:'Income could not be verified', DOCUMENT_INCONSISTENCY:'Documents inconsistent with declared details', AMOUNT_ABOVE_RISK_APPETITE:'Amount above risk appetite for profile', OTHER:'Other' };
const OFFICERS = { 'm.iyer':{ name:'Meera Iyer', role:'officer', title:'Credit Officer', limit:RULES.officerLimit },
                   'r.kulkarni':{ name:'Rahul Kulkarni', role:'senior', title:'Senior Credit Officer', limit:RULES.seniorLimit } };
const DEMO_OTP = '482913';

const INR = n => '₹' + Math.round(n).toLocaleString('en-IN');
const fmtDT = d => new Date(d).toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'});
function rateFor(grade, tenure){ return GRID[grade][tenure<=24?0:tenure<=48?1:2]; }
function emiCalc(P, annual, n){ const r=annual/1200; return P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1); }
function ageOf(dob){ const d=new Date(dob), t=new Date(); let a=t.getFullYear()-d.getFullYear(); if(t < new Date(t.getFullYear(), d.getMonth(), d.getDate())) a--; return a; }

function docTemplate(emp){
  const t = { IdentityProof:{label:'Identity proof', sub:'PAN card or passport'}, AddressProof:{label:'Address proof', sub:'Aadhaar (masked), utility bill or rent agreement'}, BankStatement:{label:'Bank statements', sub:'Last 3 months'} };
  if(emp==='Salaried') t.SalarySlip={label:'Latest salary slip', sub:'Most recent month'}; else t.ITR={label:'Income tax returns', sub:'Last 2 years'};
  return t;
}

/* ---- rule engine ---- */
function evaluate(app){
  const age = ageOf(app.dob);
  const indicative = emiCalc(app.amount, rateFor('B', app.tenure), app.tenure);
  const foir = (app.existingEmi + indicative) / app.income;
  const lti = app.amount / (app.income*12);
  const minInc = app.emp==='Salaried' ? RULES.minIncSal : RULES.minIncSelf;
  const hard = [
    {id:'BR-H01', name:'Age at submission', input:age+' yrs', threshold:`${RULES.minAge}–${RULES.maxAge}`, pass: age>=RULES.minAge && age<=RULES.maxAge, code:'AGE_OUT_OF_RANGE'},
    {id:'BR-H02', name:'Net monthly income', input:INR(app.income), threshold:'≥ '+INR(minInc), pass: app.income>=minInc, code:'INCOME_BELOW_MIN'},
    {id:'BR-H03', name:'Bureau score', input:String(app.score), threshold:'≥ '+RULES.minScore, pass: app.score>=RULES.minScore, code:'SCORE_BELOW_MIN'},
    {id:'BR-H04', name:'Default in last 24 months', input: app.recentDefault?'Yes':'None', threshold:'None', pass:!app.recentDefault, code:'RECENT_DEFAULT'},
    {id:'BR-H05', name:'PAN verified', input:'Verified', threshold:'Verified', pass:true, code:'KYC_FAILED'},
    {id:'BR-H06', name:'Identity verified', input:'Verified', threshold:'Verified', pass:true, code:'KYC_FAILED'},
    {id:'BR-H07', name:'FOIR (post-loan)', input:Math.round(foir*100)+'%', threshold:'≤ 60%', pass: foir<=RULES.maxFoir, code:'FOIR_EXCEEDED'},
  ];
  let pts = 0;
  pts += app.score>=800?40:app.score>=750?30:app.score>=700?20:10;
  pts += foir<=.30?25:foir<=.40?18:foir<=.50?10:3;
  pts += app.emp==='Salaried' ? (app.years>2?20:14) : (app.years>3?12:6);
  pts += lti<=1?15:lti<=2?10:4;
  const grade = pts>=85?'A':pts>=70?'B':pts>=55?'C':'D';
  const rate = rateFor(grade, app.tenure);
  const failed = hard.find(h=>!h.pass);
  let routing, reason=null;
  if(failed){ routing='AutoReject'; reason=failed.code; }
  else if(app.score>=RULES.stpScore && foir<=RULES.stpFoir && app.amount<=RULES.stpAmount) routing='AutoApprove';
  else if(app.amount>RULES.stpAmount) routing='SeniorQueue';
  else routing='OfficerQueue';
  return { age, indicative, foir, lti, hard, pts, grade, rate, routing, reason, emi: emiCalc(app.amount, rate, app.tenure), highRisk: grade==='C'||grade==='D' };
}

function runDecision(a){
  const ev = evaluate(a); a.eval = ev; a.grade = ev.grade; a.rate = ev.rate; a.emi = ev.emi; a.foir = ev.foir; a.queue = ev.routing==='SeniorQueue'?'Senior':'Officer';
  const t = Date.now();
  a.history.push({t, text:`Rule set v1.0 evaluated — ${ev.hard.filter(h=>!h.pass).length} hard-rule failure(s), ${ev.pts} points, grade ${ev.grade}`});
  if(ev.routing==='AutoReject'){ a.status='Rejected'; a.reason=ev.reason; a.decidedBy='System'; a.decidedAt=t; a.history.push({t, text:'Auto-rejected: '+REASONS[ev.reason]}); }
  else if(ev.routing==='AutoApprove'){ a.status='Approved'; a.decidedBy='System'; a.decidedAt=t; a.history.push({t, text:`Auto-approved (STP) at ${ev.rate}% p.a.`}); }
  else { a.status='UnderReview'; a.history.push({t, text:`Routed to ${a.queue} queue`+(ev.highRisk?' — flagged high risk':'')}); }
  a.history.push({t, text:'Applicant notified by SMS and email'});
}

/* ---- state store (local storage) ---- */
const KEY = 'laas.apps.v1';
function loadApps(){ try{ const s=localStorage.getItem(KEY); if(s) return JSON.parse(s); }catch(e){} const a=seed(); saveApps(a); return a; }
function saveApps(list){ localStorage.setItem(KEY, JSON.stringify(list)); }
function resetDemo(){ localStorage.removeItem(KEY); }
function nextRef(list){ const n = 124 + list.filter(a=>a.ref.startsWith('LN-2026-')).length; return 'LN-2026-'+String(n).padStart(6,'0'); }
function mkApp(list, o){ return Object.assign({ ref:nextRef(list), history:[], docs:{}, status:'Submitted' }, o); }
function filledDocs(emp){ const d={}; for(const k in docTemplate(emp)) d[k]={status:'Verified', file:k.toLowerCase()+'.pdf'}; return d; }
const hoursAgo = h => Date.now()-h*3600e3;

function seed(){
  const list=[];
  const add = o => { const a=mkApp(list,o); a.docs=filledDocs(a.emp); runDecision(a); a.history.forEach(h=>h.t=a.submittedAt+60e3); list.push(a); return a; };
  add({ mobile:'9820011111', name:'Rohan Mehta', dob:'1981-06-02', pan:'BXKPM4471Q', emp:'SelfEmployed', employer:'Mehta Traders', years:4, income:120000, existingEmi:30000, amount:800000, tenure:48, purpose:'Debt consolidation', score:720, recentDefault:false, submittedAt:hoursAgo(31) });
  add({ mobile:'9820022222', name:'Anjali Desai', dob:'1996-11-19', pan:'DQRPD8823L', emp:'Salaried', employer:'Suncrest Hospitals', years:1.5, income:45000, existingEmi:9000, amount:350000, tenure:48, purpose:'Medical', score:735, recentDefault:false, submittedAt:hoursAgo(19) });
  add({ mobile:'9820033333', name:'Vikram Nair', dob:'1988-02-27', pan:'FTLPN2210C', emp:'Salaried', employer:'Coastline Logistics', years:6, income:95000, existingEmi:12000, amount:650000, tenure:60, purpose:'Home renovation', score:790, recentDefault:false, submittedAt:hoursAgo(7) });
  const s = add({ mobile:'9820044444', name:'Sunita Rao', dob:'1990-08-08', pan:'HZQPR5590K', emp:'Salaried', employer:'Bright Minds School', years:3, income:38000, existingEmi:6000, amount:200000, tenure:24, purpose:'Education', score:705, recentDefault:false, submittedAt:hoursAgo(50) });
  s.status='DocsRequested'; s.docs.SalarySlip={status:'ReuploadRequested', file:'salaryslip.pdf', reason:'Unreadable'};
  s.history.push({t:hoursAgo(20), text:'Meera Iyer requested re-upload of salary slip — Unreadable'});
  return list;
}

/* ---- UI helpers ---- */
let _toastT;
function toast(m){ const t=document.getElementById('toast'); if(!t) return; t.textContent=m; t.classList.add('show'); clearTimeout(_toastT); _toastT=setTimeout(()=>t.classList.remove('show'),3000); }
function statusTag(s){ const m={UnderReview:['warn','Under review'],DocsRequested:['pending','Docs requested'],Approved:['ok','Approved'],Rejected:['bad','Rejected'],CounterOffered:['warn','Counter-offered'],SentToLMS:['ok','Sent to LMS'],Submitted:['pending','Submitted'],Expired:['bad','Expired']}; const x=m[s]||['pending',s]; return `<span class="tag ${x[0]}">${x[1]}</span>`; }
const CLOSED = ['Rejected','Expired','Withdrawn','SentToLMS'];
