const CODECS=['audio/ogg','audio/webm'];
const RECORDING=true;

var context=false;
var audio=new Map();
var playing=false;
var recorder=false;
var recordingstream=false;

function pause(key){
  audio.get(key).pause();
  audio.delete(key);
}

function schedule(){
  let durations=Array.from(pads.values()).filter(p=>p.active).map(p=>data.get(p.key).duration);
  console.log(Math.min(...durations),durations)
  return Math.min(...durations)*1000
}

function play(){
  if(!context) context=new AudioContext() //chrome requires it be created from user interaction
  var play=document.querySelector('#play');
  if(playing){
    for(let key of audio.keys()) pause(key);
    clearInterval(playing);
    play.innerHTML='▶';
    playing=false;
    stoprecording();
  }else{
    playing=true;
    tick()
    //playing=setTimeout(tick,schedule());
    if(playing) play.innerHTML='▮▮';
  }
}

function tick(ended=false){
  console.log('tick')
  if(!playing) return false;
  playing=setTimeout(tick,schedule());
  /*if(active.length==0) { //reschedule if not playing anything
    return true;
  }*/
  let active=Array.from(pads.values()).filter(pad=>pad.active);
  for(let key of audio.keys()) //clear/stop deactived, even midway through a playback
    if(active.indexOf(pads.get(key))<0) pause(key);
  if(ended&&audio.size>1){
    var durations=new Array();
    for(let a of audio.values()) if(a.duration) durations.push(a);
    if(durations.size==0) return false;
    var base=durations.sort((a,b)=>a.duration/a.playbackRate-b.duration/b.playbackRate)[0];
    if(base!=ended.target){
      audio.delete(ended.target.key);
      return false;
    }
  }
  if(!recorder) startrecording();
  for(let pad of active) playloop(pad);
  return true;
}

function startrecording(){
  if(!RECORDING) return;
  document.querySelector('#savelink').removeAttribute('href');
  recordingstream=context.createMediaStreamDestination();
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

function overlap(pad,audio){ //allows audio to be longer but start looping early, necessary for echoy loops
  let paddata=data.get(pad.key)
  let position=audio.currentTime/audio.duration
  //console.log(pad.key,position+'%',paddata.overlap)
  if(!pad.active||paddata.overlap==1) return false
  //if(!audio.currentTime||!audio.duration) return false
  if(position<=paddata.overlap) return false
  //console.log(paddata.overlap);
  audio.removeEventListener('ended',tick)
  return true
}

function playloop(pad,register=true){
  let current=audio.get(pad.key);
  if(current&&!current.ended&&!overlap(pad,current)) return;
  let paddata=data.get(pad.key);
  let a=new Audio(paddata.dataurl);
  let mediasource=context.createMediaElementSource(a);
  mediasource.connect(context.destination);
  if(recordingstream) mediasource.connect(recordingstream);
  a.volume=paddata.volume;
  a.playbackRate=paddata.speed;
  a.key=pad.key;
  a.play();
  if(register) audio.set(pad.key,a);
  if(playing) {
    //a.addEventListener('ended',tick);
    a.addEventListener('durationchange',()=>{
      if(paddata.overlap==1){
        console.log('durationchange',a.duration)
        //setTimeout(tick,a.duration*1001)
      }else{
        //setTimeout(tick,a.duration*(paddata.overlap+.05)*1000)
      }
    })
  }
  pad.classList.add('pulse');
  setTimeout(function(){pad.classList.remove('pulse');},250);
}
