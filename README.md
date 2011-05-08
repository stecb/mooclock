Mooclock
===========

Mooclock is a Mootools plugin that shows an animated Clock.

Demo: http://stecb.github.com/mooclock/

How to use
----------

Import the plugin

    <script src="/Source/mooclock.js"></script>

Insert an empty `div` in the html

    <div id="mooClock-placeholder"></div>
    
Set width/height of the element

    #mooClock-placeholder{
      width:100px;
      height:100px;
    }

Run the plugin
  
    window.addEvent('domready',function(){
      var mooClockInstance = new Mooclock($('mooClock-placeholder'),
        /* default options 
        {
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
        }
      */
      );
      
      //stop(pause) clock
      mooClockInstance.stop();
      
      //play clock
      mooClockInstance.play();
    });