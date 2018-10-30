const GROUPS=11;

function setgroup(group){
  targetpad.setgroup(group);
  let pad=pads.get(targetpad.key);
  for(let i=0;i<=GROUPS;i++) if(i!=group) pad.classList.remove('group'+i);
  pad.classList.add('group'+group);
  document.querySelector('#grouparea').style.display='none';
}

function opengroups(e){
  e.stopPropagation();
  e.target.blur();
  if(!updatetooldata(e)) return;
  document.querySelector('#grouparea').style.display='initial';
}
