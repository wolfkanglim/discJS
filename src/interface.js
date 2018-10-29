var pads=new Map();

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
