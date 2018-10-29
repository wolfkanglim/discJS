const GROUP=false; //TODO allow 16 groups by color
const KEYS=[
  '1234567890',
  'qwertyuiop',
  'asdfghjklç',
  'zxcvbnm',
]
const CONTEXT = new AudioContext();

var audio=new Map();
var pads=new Map();
var durations=new Map();
var playing=false;

function pause(key){
  audio.get(key).pause();
  audio.delete(key);
}

function play(){
  var play=document.querySelector('#play');
  if(playing){
    for(let key of audio.keys()) pause(key);
    clearInterval(playing);
    play.innerHTML='▶';
    playing=false;
  }else{
    playing=true;
    playing=tick();
    if(playing) play.innerHTML='▮▮';
  }
}

function tick(e=false){//runs each time shortest loop is over
  if(!playing) return false;
  let active=Array.from(document.querySelectorAll('.pad')).filter(pad=>pad.active);
  if(active.length==0) { //reschedule if not playing anything
    setTimeout(tick,100);
    return true;
  }
  if(e&&active.length>1){ //determine if we're the base, quit otherwise
    let base=e.target.duration;
    for(let pad of active){
      if(audio.get(pad.key)&&audio.get(pad.key).ended) continue;
      let duration=durations.get(pad.key);
      if(duration<base) base=duration;
    }
    if(e.target.duration!=base) return false;
  }
  for(let key of audio.keys()){ //stop deactived midway
    if(active.indexOf(pads.get(key))<0) pause(key);
  }
  for(let pad of active){ //start a new loop
    let current=audio.get(pad.key);
    if(current&&!current.ended) continue;
    let a=new Audio(pad.url);
    let track = CONTEXT.createMediaElementSource(a);
    track.connect(CONTEXT.destination);
    a.play();
    a.addEventListener('ended',tick);
    audio.set(pad.key,a);
    pad.classList.add('pulse');
    setTimeout(function(){pad.classList.remove('pulse');},250);
  }
  return true;
}

function selectfile(event){
  let input=event.target;
  input.blur();
  let pad=event.target;
  while(!pad.classList.contains('pad')) pad=pad.parentNode;
  let file=input.files[0];
  if(!file) return;
  pad.filename.innerHTML=file.name.substring(0,file.name.indexOf('.')-1);
  pad.url=URL.createObjectURL(file);
  let a=new Audio(pad.url);
  a.addEventListener('loadeddata',function(e){durations.set(pad.key,e.target.duration);});
  a.load();
  if(!playing) activate(pad,true);
}

function activate(e,force=false){
  let pad=e.target||e;
  while(!pad.classList.contains('pad')){
    if(pad.tagName=='LABEL') return;
    pad=pad.parentNode;
  }
  if(!pad.url) return;
  if(force||!pad.active){
    pad.active=true;
    pad.classList.add('active');
  }else{
    pad.active=false;
    pad.classList.remove('active');
  }
}

function makepad(key,parent){
  let pad=document.createElement('div');
  pads.set(key,pad);
  pad.id='pad'+key;
  pad.className='pad';
  pad.key=key;
  pad.keylabel=document.createElement('div');
  pad.keylabel.innerHTML=key.toUpperCase();
  pad.appendChild(pad.keylabel);
  pad.controls=document.createElement('div');
  pad.controls.classList.add('controlpad');
  pad.appendChild(pad.controls);
  pad.filelabel=document.createElement('label');
  pad.filelabel.innerHTML='🔊';
  pad.filelabel.title='Select audio file';
  pad.controls.appendChild(pad.filelabel);
  pad.file=document.createElement('input');
  pad.file.type='file';
  pad.file.addEventListener('change',selectfile);
  pad.filelabel.appendChild(pad.file);
  if(GROUP){
    pad.group=document.createElement('label');
    pad.group.innerHTML='♬';
    pad.group.title='Select group';
    pad.controls.appendChild(pad.group);
  }
  pad.filename=document.createElement('div');
  pad.appendChild(pad.filename);
  pad.addEventListener('click',activate);
  parent.appendChild(pad);
}

function build(){
  let launchpad=document.querySelector('#launchpad');
  for(let row of KEYS){
    let div=document.createElement('div');
    for(let key of row) makepad(key,div);
    launchpad.appendChild(div);
  }
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

window.addEventListener('keypress',presskey);
