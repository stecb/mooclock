/*
---
description: Mooclock, a mootools plugin that 

license: MIT-style

authors:
- Stefano Ceschi Berrini (http://steweb.it)

requires:
- core/1.3: '*'
- more/1.3: 'Locale'
- more/1.3: 'Date'

provides: [Mooclock]

...
*/


var MooClock = new Class({
  
  Implements : [Options, Events],
  
  options : {
    'clockClass' : 'mooClock',
    'timeClass' : 'mooClockTime',
    style : {
      'pivot' : {
        'color' : '#FF0000',
        'width' : 10
      },
      'clockCircle' : {
        'color' : '#FF0000',
        'size' : 10
      },
      'seconds' : {
        'color' : '#000000',
        'len' : 87, //from 0 to 100
        'size' : 2
      },
      'minutes' : {
        'color' : '#000000',
        'len' : 75, //from 0 to 100
        'size' : 5
      },
      'hours' : {
        'color' : '#000000',
        'len' : 50, //from 0 to 100
        'size' : 8
      },
      'milliseconds' : {
        'color' : '#000000',
        'len' : 100, //from 0 to 100
        'size' : 1
      }
    },
    showSeconds : true,
    showHours : true,
    showMinutes : true,
    showMilliseconds : false,
    showTime : false,
    shwClockCircle : true,
    timeZoneIncrement : 0
  },
  
  initialize : function (placeholder, options) {
    
    this.placeholder = placeholder.empty();
    
    this.setOptions(options);
    
    this.UID = this._uIdGenerator();
      
    var elem = document.createElement('canvas');
    this.supportCanvas = (elem.getContext && elem.getContext('2d')); /* sigh, IE check, Modernizr way */
    
    this._buildClock();
    
    this.updatePeriodical = this._updateClock.periodical(this.options.showMilliseconds ? 10 : 1000,this);
    
  },
  
  _buildClock : function(){
    if(!this.supportCanvas){ // IE's VML
      var vmlClock = "";
      //VML Namespace
      vmlClock += "<xml:namespace ns=\"urn:schemas-microsoft-com:vml\" prefix=\"vml\" /><?import namespace=\"vml\" implementation=\"#default#VML\" ?>";
      //Seconds
      vmlClock += "<vml:group id=\""+this.UID+"_seconds\" style=\"width:80px;height:80px;position:absolute;margin:10px 0px 0px 10px;\" coordorigin=\"0 0\" coordsize=\"80 80\"><vml:line from=\"40,40\" to=\"40,0\"><vml:stroke weight=\"1px\" endcap=\"round\" color=\"#E43942\"/></vml:line></vml:group>";
      //Minutes
      vmlClock += "<vml:group id=\""+this.UID+"_minutes\" style=\"width:80px;height:80px;position:absolute;margin:10px 0px 0px 10px;\" coordorigin=\"0 0\" coordsize=\"80 80\"><vml:line from=\"40,40\" to=\"40,5\"><vml:stroke weight=\"2px\" endcap=\"round\" color=\"#E43942\"/></vml:line></vml:group>";
      //Hours
      vmlClock += "<vml:group id=\""+this.UID+"_hours\" style=\"width:80px;height:80px;position:absolute;margin:10px 0px 0px 10px;\" coordorigin=\"0 0\" coordsize=\"80 80\"><vml:line from=\"40,40\" to=\"40,15\"><vml:stroke weight=\"4px\" endcap=\"round\" color=\"#E43942\"/></vml:line></vml:group>";
      //Pivot
      vmlClock += "<vml:oval id=\""+this.UID+"_pivot\" fillcolor=\"#F7E1E3\" style=\"width:7px;height:7px;position:absolute;margin:47px 0px 0px 47px;\" strokecolor=\"#F7E1E3\" strokeweight=\"1px\" />";
      this.plceholder.set('html',vmlClock)
    }else{ // Canvas
      var canvasClock = new Element('canvas',{'class':this.options.clockClass}).set({'width':this.placeholder.getSize().x,'height':this.placeholder.getSize().y});
      this.placeholder.adopt(canvasClock);
      this.canvasClockCtx = canvasClock.getContext('2d');
    }
    
    if(this.options.showTime){
      var timeElem = new Element('div',{'id':this.UID+"_time",'class':this.options.timeClass});
      this.placeholder.adopt(timeElem);
    }
  },
  
  _updateClock : function(){
    
    var now = new Date().increment('hour',this.options.timeZoneIncrement), date = {};
    date.sec = now.get('sec');
    date.ms = now.get('ms');
    date.min = now.get('min');
    date.hr  = now.get('hr');
    
    date.hrOrig  = now.get('hr');
      
    date.hr = date.hr>=12 ? date.hr-12 : date.hr;
    
    if(this.supportCanvas){ //redraw canvas
      this._updateCanvas(date);
    }else{ //just Update vml markup
      this._updateVML(date);
    }
    
    if(this.options.showTime){
      this._updateTime(date);
    }
  },
  
  _updateVML : function(date){
    var seconds = $(this.UID+"_seconds");
    if(seconds) seconds.rotation = date.sec * 6; 

    var minutes = $(this.UID+"_minutes");
    if(minutes) minutes.rotation = date.min * 6;

    var hours= $(this.UID+"_hours");
    if(hours) hours.rotation = date.hr * 30 + date.min/2;
  },
  
  _updateCanvas : function(date){
    
    var ctx = this.canvasClockCtx;
    
    ctx.save();
      
    var width = this.placeholder.getSize().x;
    var height = this.placeholder.getSize().y;
      
    ctx.clearRect(0,0,width,height);
      
    ctx.translate(Math.floor(width/2),Math.floor(height/2));
    ctx.scale(Math.floor(width/2)/100,Math.floor(height/2)/100);
    ctx.rotate(-Math.PI/2);
    
    
    //Draw Clock circle
    if(this.options.shwClockCircle){
      ctx.beginPath();
      ctx.strokeStyle = this.options.style.clockCircle.color;
      ctx.lineWidth = this.options.style.clockCircle.size;
      ctx.arc(0,0,100 - this.options.style.clockCircle.size/2,0,Math.PI*2,true);
      ctx.stroke();
    }
    
    ctx.lineCap = "round";
    
    // Draw hours
    if(this.options.showHours){
      this._canvasDrawer({
        rotation:date.hr*(Math.PI/6) + (Math.PI/360)*date.min + (Math.PI/21600)*date.sec, 
        lineColor:this.options.style.hours.color,
        lineWidth:this.options.style.hours.size, 
        lineLength:this.options.style.hours.len
      });
    }
    
    // Draw minutes
    if(this.options.showMinutes){
      this._canvasDrawer({
        rotation:(Math.PI/30)*date.min + (Math.PI/1800)*date.sec,
        lineColor:this.options.style.minutes.color,
        lineWidth:this.options.style.minutes.size,
        lineLength:this.options.style.minutes.len
      });
    }
    
    // Draw seconds
    if(this.options.showSeconds){
      this._canvasDrawer({
        rotation:(date.sec) * Math.PI/30,
        lineColor:this.options.style.seconds.color,
        lineWidth:this.options.style.seconds.size,
        lineLength:this.options.style.seconds.len
      });
    }
    
    // Draw milliseconds  
    if(this.options.showMilliseconds){
      this._canvasDrawer({
        rotation:(date.ms) * Math.PI/500,
        lineColor:this.options.style.milliseconds.color,
        lineWidth:this.options.style.milliseconds.size,
        lineLength:this.options.style.milliseconds.len
      });
      
    }
    
    // Draw Pivot
    
    ctx.beginPath();
    ctx.fillStyle = this.options.style.pivot.color;
    ctx.arc(0,0,this.options.style.pivot.width,0,Math.PI*2,true);
    ctx.fill();
    
    ctx.restore();
    
  },
  
  _canvasDrawer : function(data){
    
    var ctx = this.canvasClockCtx;
    ctx.save();
    ctx.rotate(data.rotation);
    ctx.strokeStyle = data.lineColor;
    ctx.lineWidth = data.lineWidth;
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(data.lineLength,0);
    ctx.stroke();
    ctx.restore();
    
  },
  _updateTime : function(date){
     var col = ':';
     var spc = ' ';
     if (date.hr == 0) date.hr=12;
     if (date.hr<=9) date.hr="0"+date.hr;
     if (date.min<=9) date.min="0"+date.min;
     if (date.sec<=9) date.sec="0"+date.sec;
     if (date.ms<=9) date.ms="0"+date.ms;
     
     var str = date.hr+':'+date.min+':'+date.sec;
     
     if(this.options.showMilliseconds){
       str += ':'+date.ms;
     }
     
     $(this.UID+'_time').innerHTML = str+spc+((date.hrOrig > 12) ? "pm" : "am");
  },
  
  _uIdGenerator : function(){
      var S4 = function() {
         return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
      }
      return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  },
  
  /******************/
  /* PUBLIC methods */
  /******************/
  
  stop : function(){
    window.clearInterval(this.updatePeriodical);
  },
  
  play : function(){
    this.updatePeriodical = this._updateClock.periodical(this.refreshTime,this);
  },
  
  getCanvas : function(){
    return this.placeholder.getFirst();
  }
});