function startdrag(e){
  let paddata=data.get(e.target.key);
  if(!paddata) return false; //cancel drag
  let json=JSON.stringify(paddata.todict());
  e.dataTransfer.setData("application/json",json);
  return true;
}

function dragover(e){
  e.preventDefault();
  e.dataTransfer.dropEffect="copy";
}

function dropdrag(e){
  e.preventDefault();
  let destination=e.target;
  while(!destination.classList.contains('pad')) destination=destination.parentNode;
  data.get(destination.key)
  if(destination) resetpad(false,pads.get(destination.key));
  let json=JSON.parse(e.dataTransfer.getData("application/json"));
  let source=PadData.fromdict(json);
  source.key=destination.key;
  loadfile(source);
}

function finishdrag(e){
  if(e.dataTransfer.dropEffect=='none') return;
  resetpad(false,pads.get(e.target.key));
}

function configuredrag(pad){
  pad.draggable='true';
  pad.ondragstart=startdrag;
  pad.ondrop=dropdrag;
  pad.ondragover=dragover;
  pad.ondragend=finishdrag;
}
