(function(){
 'use strict';
 const $=id=>document.getElementById(id),key='future-lab:model-comparisons:v2';let pins=[];
 const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function render(){if(!pins.length){$('model-comparisons').innerHTML='<p class="empty">Capture a baseline to begin. A captured result retains its assumptions; it is not a hardware benchmark.</p>';return}
  const metrics=[['LoRA trainable parameters',p=>p.adapter.lora.toLocaleString()],['Adapter rank',p=>p.adapter.rank],['Assumed runtime',p=>(p.compute.seconds/3600).toFixed(3)+' hours'],['Full-FT persistent states',p=>(p.compute.rows[0].total/2**30).toFixed(3)+' GiB'],['QLoRA persistent subtotal',p=>(p.compute.rows[3].total/2**30).toFixed(3)+' GiB'],['Tiny-model data',p=>p.tinyModel.dataset],['Gradient steps',p=>p.tinyModel.step],['Train MSE',p=>p.tinyModel.trainMSE.toExponential(4)],['Holdout MSE',p=>p.tinyModel.holdoutMSE.toExponential(4)]];
  $('model-comparisons').innerHTML=`<div class="overflow"><table><caption>Analytical estimates and measured toy-model losses; use matching data and assumptions when interpreting changes.</caption><thead><tr><th>Measure</th>${pins.map((_,k)=>`<th>${k?'Candidate '+k:'Baseline'}</th>`).join('')}</tr></thead><tbody>${metrics.map(([label,get])=>`<tr><th>${esc(label)}</th>${pins.map(p=>`<td>${esc(get(p))}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
 }
 function save(){try{sessionStorage.setItem(key,JSON.stringify(pins))}catch{$('model-compare-message').textContent='Session storage unavailable. Export comparisons to retain them.'}}
 $('capture-model').addEventListener('click',()=>{try{if(pins.length>=4)throw Error('Four comparison slots are full. Export or clear before starting a new set.');pins.push(window.captureModelForge());render();save();$('model-compare-message').textContent='Configuration captured with freshly calculated inputs and current training weights.';}catch(e){$('model-compare-message').textContent=e.message}});
 $('clear-model-comparisons').addEventListener('click',()=>{pins=[];save();render();$('model-compare-message').textContent='Comparison pins cleared; current lab state retained.'});
 $('export-model-comparisons').addEventListener('click',()=>{const blob=new Blob([JSON.stringify({schemaVersion:2,product:'ModelForge Lab',llmTrainingExecuted:false,resourceValuesAreEstimates:true,exportedAt:new Date().toISOString(),comparisons:pins},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='modelforge-comparisons.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
 try{const data=JSON.parse(sessionStorage.getItem(key)||'[]');if(Array.isArray(data)&&data.length<=4&&data.every(p=>p?.adapter&&p?.compute?.rows?.length===4&&p?.tinyModel&&Number.isFinite(p.tinyModel.trainMSE)))pins=data;}catch{}
 render();
})();
