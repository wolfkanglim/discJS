const ESC=27;
const ENTER=13;

var callback=false;
var paddata=false;

function opentool(value,label,min,max,step,e,onchange){
  if(callback) return;
  callback=onchange;
  document.querySelector('#toollabel').innerHTML=label;
  let area=document.querySelector('#toolarea');
  area.style.display='initial';
  if(e){
    e.stopPropagation();
    e.target.blur();
  }
  let input=document.querySelector('#toolinput');
  input.min=min;
  input.max=max;
  input.step=step;
  input.value=value;
  updatetoolvalue(e);
  input.addEventListener('change',callback);
  input.focus();
}

function updatetooldata(e){
  let pad=e.target;
  while(!pad.classList.contains('pad')) pad=pad.parentNode;
  paddata=data.get(pad.key);
  return paddata;
}

function updatetoolvalue(e){
  document.querySelector('#toolvalue').innerHTML=
    Math.round(100*document.querySelector('#toolinput').value)+'%';
}

function closetool(e){
  if(!callback) return;
  document.querySelector('#toolarea').style.display='none';
  document.querySelector('#toolinput').removeEventListener('change',callback);
  paddata=false;
  callback=false;
}

function resettool(e){
  document.querySelector('#toolinput').value=1;
  updatetoolvalue(e);
  if(callback) callback(e);
}

function changevolume(e){
  paddata.setvolume(document.querySelector('#toolinput').value);
  let a=audio.get(paddata.key);
  if(a) a.volume=paddata.volume;
}

function openvolume(e){
  if(!updatetooldata(e)) return;
  opentool(paddata.volume,'Select volume',0,1,.01,e,changevolume);
}

function changespeed(e){
  paddata.setspeed(document.querySelector('#toolinput').value);
  let a=audio.get(paddata.key);
  if(a) a.speed=paddata.speed;
}

function openspeed(e){
  if(!updatetooldata(e)) return;
  opentool(paddata.speed,'Select playback speed',0.25,5,.005,e,changespeed);
}

document.addEventListener('keypress',function(e){
  if (e.keyCode==ESC||e.keyCode==ENTER) closetool(e);
});
