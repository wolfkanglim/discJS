class PadData{
  constructor(key,name,dataurl,active=undefined,volume=1,speed=1,overlap=1,duration=false,group=0){
    this.key=key;
    this.name=name;
    this.dataurl=dataurl;
    this.active=active===undefined?!playing:active;
    this.volume=volume;
    this.speed=speed;
    this.overlap=overlap
    this.duration=duration;
    this.group=group;
  }
  
  setactive(active){
    if(active==this.active) return;
    this.active=active;
    localStorage.setItem(this.key+'active',this.active);
  }
  
  setvolume(volume){
    if(volume==this.volume) return;
    this.volume=volume;
    localStorage.setItem(this.key+'volume',this.volume);
  }
  
  setspeed(speed){
    if(speed==this.speed) return;
    this.speed=speed;
    localStorage.setItem(this.key+'speed',this.speed);
  }
  
  setoverlap(overlap){
    if(overlap==this.overlap) return;
    this.overlap=overlap;
    localStorage.setItem(this.key+'overlap',this.overlap);
  }
  
  setgroup(group){
    if(group==this.group) return;
    this.group=group;
    localStorage.setItem(this.key+'group',this.group);
  }
  
  serialize(){
    try{
      localStorage.setItem(this.key+'name',this.name);
      localStorage.setItem(this.key+'dataurl',this.dataurl);
      localStorage.setItem(this.key+'active',this.active);
      localStorage.setItem(this.key+'volume',this.volume);
      localStorage.setItem(this.key+'speed',this.speed);
      localStorage.setItem(this.key+'duration',this.duration);
      localStorage.setItem(this.key+'group',this.group);
    }catch(e){
      console.warn(e);
    }
  }
  
  static remove(key){
    for(let property of ['name','dataurl','active','volume','speed','duration','group'])
      localStorage.removeItem(key+property);
  }
  
  todict(){
    let dict={};
    dict['key']=this.key;
    dict['name']=this.name;
    dict['dataurl']=this.dataurl;
    dict['active']=this.active;
    dict['volume']=this.volume;
    dict['speed']=this.speed;
    dict['overlap']=this.overlap;
    dict['duration']=this.duration;
    dict['group']=this.group;
    return dict;
  }
  
  static fromdict(dict){
    return new PadData(
      dict['key'],dict['name'],dict['dataurl'],dict['active'],dict['volume'],dict['speed'],dict['overlap'],
      dict['duration'],dict['group']);
  }

  static deserialize(key){
    let name=localStorage.getItem(key+'name');
    if(!name) return false;
    let dataurl=localStorage.getItem(key+'dataurl');
    let active=localStorage.getItem(key+'active')=='true';
    let volume=Number(localStorage.getItem(key+'volume'));
    let speed=Number(localStorage.getItem(key+'speed'));
    let overlap=Number(localStorage.getItem(key+'overlap'));
    let duration=Number(localStorage.getItem(key+'duration'));
    let group=Number(localStorage.getItem(key+'group'));
    return new PadData(key,name,dataurl,active,volume,speed,overlap,duration,group);
  }
}
