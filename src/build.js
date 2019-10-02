const KEYS=[
  '1234567890',
  'qwertyuiop',
  'asdfghjklç',
  'zxcvbnm',
]

function makepad(key,parent){
  let pad=document.createElement('div');
  pads.set(key,pad);
  pad.id='pad'+key;
  pad.className='pad';
  configuredrag(pad);
  pad.key=key;
  pad.keylabel=document.createElement('div');
  pad.keylabel.innerHTML=key.toUpperCase();
  pad.keylabel.classList.add('padtext');
  pad.appendChild(pad.keylabel);
  pad.controls1=document.createElement('div');
  pad.controls1.classList.add('controlpad');
  pad.appendChild(pad.controls1);
  pad.filelabel=document.createElement('label');
  pad.filelabel.innerHTML='🖪';
  pad.filelabel.title='Select audio file';
  pad.file=document.createElement('input');
  pad.file.type='file';
  pad.file.addEventListener('input',selectfile);
  pad.filelabel.appendChild(pad.file);
  pad.controls1.appendChild(pad.filelabel);
  pad.reset=document.createElement('a');
  pad.reset.innerHTML='🗘';
  pad.reset.title='Reset pad';
  pad.reset.addEventListener('click',resetpad);
  pad.controls1.appendChild(pad.reset);
  pad.groups=document.createElement('a');
  pad.groups.innerHTML='♣';
  pad.groups.title='Set control group';
  pad.groups.addEventListener('click',opengroups);
  pad.controls1.appendChild(pad.groups);
  pad.controls2=document.createElement('div');
  pad.controls2.classList.add('controlpad');
  pad.appendChild(pad.controls2);
  pad.bpm=document.createElement('a');
  pad.bpm.innerHTML='🕑';
  pad.bpm.title='Adjust speed';
  pad.bpm.addEventListener('click',openspeed);
  pad.controls2.appendChild(pad.bpm);
  pad.volume=document.createElement('a');
  pad.volume.innerHTML='🔊';
  pad.volume.title='Adjust volume';
  pad.volume.addEventListener('click',openvolume);
  pad.controls2.appendChild(pad.volume);
  pad.overlap=document.createElement('a');
  pad.overlap.innerHTML='&#127926;' //multiple musical notes
  pad.overlap.title='Adjust overlap';
  pad.overlap.addEventListener('click',openoverlap);
  pad.controls2.appendChild(pad.overlap);
  pad.filename=document.createElement('div');
  pad.filename.classList.add('padtext');
  pad.appendChild(pad.filename);
  pad.addEventListener('click',activate);
  parent.appendChild(pad);
  let paddata=PadData.deserialize(key);
  if(paddata) loadfile(paddata);
}

function build(){
  let launchpad=document.querySelector('#launchpad');
  for(let row of KEYS){
    let div=document.createElement('div');
    for(let key of row) makepad(key,div);
    launchpad.appendChild(div);
  }
}
