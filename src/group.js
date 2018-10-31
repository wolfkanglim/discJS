const GROUPS=11;

function setgroup(group,paddata=targetpad){
  let pad=pads.get(paddata.key);
  for(let i=0;i<=GROUPS;i++) if(i!==group) pad.classList.remove('group'+i);
  document.querySelector('#grouparea').style.display='none';
  if(group===false) return;
  paddata.setgroup(group);
  pad.classList.add('group'+group);
}

function opengroups(e){
  e.stopPropagation();
  e.target.blur();
  if(!updatetargetpad(e)) return;
  document.querySelector('#grouparea').style.display='initial';
}
