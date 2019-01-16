const CONTEXT=new AudioContext();
const CODECS=['audio/ogg','audio/webm'];
const RECORDING=true;

var audio=new Map();
var playing=false;
var recorder=false;
var recordingstream=false;

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
    stoprecording();
  }else{
    playing=true;
    playing=tick();
    if(playing) play.innerHTML='▮▮';
  }
}

var lastdate=false;

function logtick(prefix=''){
  return;
  if(!lastdate){
    lastdate=Date.now();
    return;
  }
  var now=Date.now();
  console.log(prefix,now-lastdate);
  lastdate=now;
}

function tick(e=false){//runs each time shortest loop is over
  if(!playing) return false;
  let active=Array.from(pads.values()).filter(pad=>pad.active);
  if(active.length==0) { //reschedule if not playing anything
    setTimeout(tick,100);
    logtick('silence');
    return true;
  }
  if(e&&active.length>1){
    var durations=new Array();
    for(let a of audio.values()) if(a.duration) durations.push(a);
    var base=durations.sort((a,b)=>a.duration/a.playbackRate-b.duration/b.playbackRate)[0];
    if(base!=e.target){
      logtick('wait');
      return false;
    }
  }
  if(!recorder) startrecording();
  for(let key of audio.keys()) //stop deactived midway
    if(active.indexOf(pads.get(key))<0) pause(key);
  for(let pad of active) playloop(pad);
  logtick('loop');
  return true;
}

function startrecording(){
  if(!RECORDING) return;
  document.querySelector('#savelink').removeAttribute('href');
  recordingstream=CONTEXT.createMediaStreamDestination();
  let codec=false;
  for(c of CODECS) if(MediaRecorder.isTypeSupported(c)) {
    codec=c;
    break;
  }
  if(!codec) {
    console.warn("Couldn't find a codec for MediaRecorder! Tried: "+CODECS);
    return;
  }
  recorder=new MediaRecorder(recordingstream.stream,{mimeType:codec});
  recorder.start();
}

function stoprecording(){
  if(!recorder) return;
  recorder.addEventListener('dataavailable',function(e){
    let url=URL.createObjectURL(e.data);
    document.querySelector('#recording').src=url;
    document.querySelector('#savelink').href=url;
    recorder=false;
    recordingstream=false;
  });
  recorder.stop();
}

function playloop(pad,register=true){
  let current=audio.get(pad.key);
  if(current&&!current.ended) return;
  let paddata=data.get(pad.key);
  let a=new Audio(paddata.dataurl);
  let mediasource=CONTEXT.createMediaElementSource(a);
  mediasource.connect(CONTEXT.destination);
  if(recordingstream) mediasource.connect(recordingstream);
  a.volume=paddata.volume;
  a.playbackRate=paddata.speed;
  a.ley=pad.key;
  a.play();
  if(playing) a.addEventListener('ended',tick);
  if(register) audio.set(pad.key,a);
  pad.classList.add('pulse');
  setTimeout(function(){pad.classList.remove('pulse');},250);
}
