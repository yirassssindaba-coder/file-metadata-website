(() => {
  const $ = (id) => document.getElementById(id);
  const input = $('upfile'); const zone = $('dropZone'); const form = $('uploadForm');
  const message = $('message'); const dot = $('stateDot'); const copy = $('copyButton');
  let selected = null; let lastResult = null;
  const units = ['B','KB','MB','GB','TB'];
  const formatBytes = (bytes) => { if (!Number.isFinite(bytes) || bytes < 0) return '—'; if (!bytes) return '0 B'; const i=Math.min(Math.floor(Math.log(bytes)/Math.log(1024)),units.length-1); const v=bytes/1024**i; return `${i===0||v>=10?v.toFixed(0):v.toFixed(2)} ${units[i]}`; };
  const setState=(state,text,type='')=>{dot.className='state-dot '+state;message.textContent=text||'';message.className='message '+type;};
  const choose=(file)=>{selected=file||null;lastResult=null;copy.disabled=true;$('responseStatus').textContent='Awaiting upload';if(!file){$('dropTitle').textContent='Drop a file here';$('fileDescription').textContent='No file selected yet';$('fileName').textContent='Waiting for a file';$('fileSize').textContent='—';setState('','');return;}$('dropTitle').textContent='File ready to inspect';$('fileDescription').textContent=`${file.name} · ${formatBytes(file.size)}`;$('fileName').textContent=file.name;$('fileSize').textContent=formatBytes(file.size);setState('ready','File siap dianalisis.');};
  zone.addEventListener('click',()=>input.click()); input.addEventListener('change',()=>choose(input.files&&input.files[0]));
  ['dragenter','dragover'].forEach(e=>zone.addEventListener(e,ev=>{ev.preventDefault();zone.classList.add('dragging')}));
  ['dragleave','drop'].forEach(e=>zone.addEventListener(e,ev=>{ev.preventDefault();zone.classList.remove('dragging')}));
  zone.addEventListener('drop',ev=>choose(ev.dataTransfer.files&&ev.dataTransfer.files[0]));
  form.addEventListener('submit',async(ev)=>{ev.preventDefault();if(!selected){setState('error','Pilih file terlebih dahulu.','error');return;}setState('busy','Menganalisis metadata…');let payload=null;let source='local fallback';try{const body=new FormData();body.append('upfile',selected);const response=await fetch('./api/fileanalyse',{method:'POST',body});const type=response.headers.get('content-type')||'';if(response.ok&&type.includes('application/json')){payload=await response.json();source='Cloudflare API';}}catch(_e){}if(!payload)payload={name:selected.name,type:selected.type||'application/octet-stream',size:selected.size};lastResult=payload;$('jsonOutput').textContent=JSON.stringify(payload,null,2);$('responseStatus').textContent='200 OK · '+source;copy.disabled=false;setState('success','Analisis berhasil melalui '+source+'.','success');$('response').scrollIntoView({behavior:'smooth',block:'center'});});
  copy.addEventListener('click',async()=>{if(!lastResult)return;try{await navigator.clipboard.writeText(JSON.stringify(lastResult,null,2));setState('success','JSON berhasil disalin.','success');}catch(_e){setState('error','Clipboard diblokir browser. Salin langsung dari kotak JSON.','error');}});
  window.addEventListener('error',()=>setState('error','Sebagian fungsi gagal dimuat, tetapi halaman tetap dapat digunakan.','error'));
})();
