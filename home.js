(function(){
 'use strict';
 const products=Object.values(window.LabCatalog),root=document.getElementById('catalog'),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const groups=[...new Set(products.map(p=>p.category))];
 document.getElementById('category').innerHTML='<option value="all">All categories</option>'+groups.map(g=>`<option value="${esc(g)}">${esc(g)}</option>`).join('');
 function render(){const query=document.getElementById('search').value.trim().toLowerCase(),category=document.getElementById('category').value;const found=products.filter(p=>(category==='all'||category===p.category)&&[p.name,p.problem,p.customer,p.category].join(' ').toLowerCase().includes(query));document.getElementById('count').textContent=found.length+' prototypes';root.innerHTML=found.length?found.map(p=>`<article class="product-card"><div class="eyebrow">${esc(p.category)}</div><h2>${esc(p.name)}</h2><p>${esc(p.problem)}</p><span class="subtle">For ${esc(p.customer.toLowerCase())}</span><a href="./${p.id}.html">Explore ${esc(p.name)} →</a><span class="tag">${p.id==='modelforge'?'Analytical lab + real toy training':'Computed scenario + decision checks'}</span></article>`).join(''):'<p class="empty">No matching prototype. Try a broader problem or customer search.</p>';}
 document.getElementById('search').addEventListener('input',render);document.getElementById('category').addEventListener('change',render);render();
})();
