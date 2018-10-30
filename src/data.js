class PadData{
  constructor(key,name,dataurl,active=undefined,volume=1,speed=1,duration=false){
    this.key=key;
    this.name=name;
    this.dataurl=dataurl;
    this.active=active===undefined?!playing:active;
    this.volume=volume;
    this.speed=speed;
    this.duration=duration;
  }
  
  serialize(){
    try{
      localStorage.setItem(this.key+'name',this.name);
      localStorage.setItem(this.key+'dataurl',this.dataurl);
      localStorage.setItem(this.key+'active',this.active);
      localStorage.setItem(this.key+'volume',this.volume);
      localStorage.setItem(this.key+'speed',this.speed);
      localStorage.setItem(this.key+'duration',this.duration);
    }catch(e){
      console.warn(e);
    }
  }
  
  setactive(active){
    if(active==this.active) return;
    this.active=active;
    localStorage.setItem(this.key+'active',this.active);
  }
  
  setvolume(volume){
    if(volume==this.volume) return;
    paddata.volume=volume;
    localStorage.setItem(this.key+'volume',this.volume);
  }
  
  setspeed(speed){
    if(speed==this.speed) return;
    paddata.speed=speed;
    localStorage.setItem(this.key+'speed',this.speed);
  }

  static deserialize(key){
    let name=localStorage.getItem(key+'name');
    if(!name) return false;
    let dataurl=localStorage.getItem(key+'dataurl');
    let active=localStorage.getItem(key+'active')=='true';
    let volume=Number(localStorage.getItem(key+'volume'));
    let speed=Number(localStorage.getItem(key+'speed'));
    let duration=Number(localStorage.getItem(key+'duration'));
    return new PadData(key,name,dataurl,active,volume,speed,duration);
  }
}
