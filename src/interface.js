class PadData{
  constructor(key,name,dataurl,active=undefined,volume=1,speed=1){
    this.key=key;
    this.name=name;
    this.dataurl=dataurl;
    this.active=active===undefined?!playing:active;
    this.volume=volume;
    this.speed=speed;
  }
  
  serialize(){
    localStorage.setItem(this.key+'name',this.name);
    localStorage.setItem(this.key+'dataurl',this.dataurl);
    localStorage.setItem(this.key+'active',this.active);
    localStorage.setItem(this.key+'volume',this.volume);
    localStorage.setItem(this.key+'speed',this.speed);
  }
  
  setactive(active){
    if(active==this.active) return;
    this.active=active;
    localStorage.setItem(this.key+'active',this.active);
  }
  
  static deserialize(key){
    let name=localStorage.getItem(key+'name');
    if(!name) return false;
    let dataurl=localStorage.getItem(key+'dataurl');
    let active=localStorage.getItem(key+'active')=='true';
    let volume=Number(localStorage.getItem(key+'volume'));
    let speed=Number(localStorage.getItem(key+'speed'));
    return new PadData(key,name,dataurl,active,volume,speed);
  }
}

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
    paddata.serialize();
    loadfile(paddata);
  });
  reader.readAsDataURL(file);
}

function loadfile(paddata){
  let a=new Audio(paddata.dataurl);
  a.addEventListener('loadeddata',function(e){
    let key=paddata.key;
    durations.set(key,e.target.duration);
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
  if(e.altKey||e.ctrlKey) return;
  if(e.key==' '){
    play();
    return;
  }
  let pad=pads.get(e.key);
  if(pad) activate(pad);
}

function reset(){
  if(!window.confirm('Are you sure you want to reset your pad layout?')) return;
  localStorage.clear();
  location.reload();
}

window.addEventListener('keypress',presskey);
