const CONTEXT = new AudioContext();

var audio=new Map();
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
      let a=audio.get(pad.key);
      if(!a||a.ended) continue;
      let duration=durations.get(pad.key);
      if(duration<base) base=duration;
    }
    if(e.target.duration!=base) {
      setTimeout(tick,100);
      return false;
    }
  }
  for(let key of audio.keys()){ //stop deactived midway
    if(active.indexOf(pads.get(key))<0) pause(key);
  }
  for(let pad of active){ //start a new loop
    let current=audio.get(pad.key);
    if(current&&!current.ended) continue;
    let a=new Audio(data.get(pad.key).dataurl);
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
