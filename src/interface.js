var pads=new Map();
var data=new Map();
var targetpad=false;

function updatetargetpad(e){
  let pad=e.target;
  while(!pad.classList.contains('pad')) pad=pad.parentNode;
  targetpad=data.get(pad.key);
  return targetpad;
}

function selectfile(e){
  let input=e.target;
  input.blur();
  let pad=e.target;
  while(!pad.classList.contains('pad')) pad=pad.parentNode;
  let file=input.files[0];
  if(!file) return;
  let reader=new FileReader();
  reader.addEventListener("load", function (){
    let name=file.name.substring(0,file.name.indexOf('.'));
    let paddata=new PadData(pad.key,name,reader.result);
    let old=data.get(pad.key);
    if(old) paddata.group=old.group;
    pad.classList.add('group'+paddata.group);
    loadfile(paddata);
    input.value='';//ensures 'onchange/oninput' always triggers
  });
  reader.readAsDataURL(file);
}

function loadfile(paddata){
  let a=new Audio(paddata.dataurl);
  a.addEventListener('loadeddata',function(e){
    let key=paddata.key;
    paddata.duration=e.target.duration;
    paddata.serialize();
    data.set(key,paddata);
    let pad=pads.get(key);
    pad.filename.innerHTML=paddata.name;
    if(paddata.active) activate(pad,true);
    pad.classList.add('group'+paddata.group);
  });
  a.load();
}

function activate(e,force=undefined){
  let pad=e.target||e;
  while(!pad.classList.contains('pad')){
    if(pad.tagName=='LABEL') return;
    pad=pad.parentNode;
  }
  let paddata=data.get(pad.key);
  if(!paddata) return;
  let active=force===undefined?!pad.active:force;
  if(active) {
    pad.classList.add('active'); 
    if(paddata.group!=0) for(let p of data.values())
      if(p!=paddata&&p.active&&p.group==paddata.group)
        activate(pads.get(p.key),false);
  }
  else pad.classList.remove('active');
  pad.active=active;
  paddata.setactive(active);
}

function presskey(e){
  e.preventDefault();
  if(e.ctrlKey||e.altKey) return;
  if(e.key==' '){
    play();
    return;
  }
  let key=e.key;
  if(e.shiftKey) key=key.toLowerCase();
  let pad=pads.get(key);
  if(!pad||!data.get(key)) return;
  if(e.shiftKey) playloop(pad);
  else activate(pad);
}

function resetpad(e,paddata=false){
  if(e){
    e.stopPropagation();
    let input=e.target;
    input.blur();
    if(!confirm('Are you sure you want to reset this pad?')) return;
    paddata=updatetargetpad(e);
  }
  if(!paddata) return;
  let pad=pads.get(paddata.key);
  if(paddata.active) activate(pad,false);
  pad.filename.innerHTML='';
  setgroup(false,paddata);
  PadData.remove(paddata.key);
  data.delete(paddata.key);
}

function resetlayout(confirm=true){
  if(confirm&&!window.confirm('Are you sure you want to reset your pad layout?')) return;
  for(let paddata of data.values()) resetpad(false,paddata);
}

function exportlayout(anchor){
  let serialized=[];
  for(let paddata of data.values()){
    serialized.push(paddata.todict());
  }
  if(serialized.length==0) return;
  let blob=new Blob([JSON.stringify(serialized)],{type:"application/json"});
  anchor.href=URL.createObjectURL(blob);
}

function importlayout(input){
  let file=input.files[0];
  if(!file) return;
  let reader=new FileReader();
  reader.addEventListener("load", function (){
    input.value='';//ensures 'onchange/oninput' always triggers
    for(let dict of JSON.parse(reader.result)) loadfile(PadData.fromdict(dict));
  });
  reader.readAsText(file);
}

window.addEventListener('keypress',presskey);
