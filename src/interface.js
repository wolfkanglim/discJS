var pads=new Map();
var data=new Map();

function selectfile(event,paddata=false){
  if(paddata){
    loadfile(paddata);
    return;
  }
  let input=event.target;
  input.blur();
  let pad=event.target;
  while(!pad.classList.contains('pad')) pad=pad.parentNode;
  let file=input.files[0];
  if(!file) return;
  let reader=new FileReader();
  reader.addEventListener("load", function (){
    let name=file.name.substring(0,file.name.indexOf('.'));
    let paddata=new PadData(pad.key,name,reader.result);
    loadfile(paddata);
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
  });
  a.load();
}

function activate(e,force=undefined){
  let pad=e.target||e;
  while(!pad.classList.contains('pad')){
    if(pad.tagName=='LABEL') return;
    pad=pad.parentNode;
  }
  if(!data.get(pad.key)) return;
  let active=force===undefined?!pad.active:force;
  pad.active=active;
  if(active) pad.classList.add('active'); 
  else pad.classList.remove('active');
  data.get(pad.key).setactive(active);
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

function reset(){
  if(!window.confirm('Are you sure you want to reset your pad layout?')) return;
  localStorage.clear();
  location.reload();
}

window.addEventListener('keypress',presskey);
