
import sound1 from '../../assets/uisound/maximize_007.mp3'

import mojs from '@mojs/core'
class Cross extends mojs.CustomShape {
    getShape() { return '<path d="M35.6777 8.80761L27.1924 0.322332L18 9.51472L8.80761 0.322332L0.322331 8.80761L9.51472 18L0.322331 27.1924L8.80761 35.6777L18 26.4853L27.1924 35.6777L35.6777 27.1924L26.4853 18L35.6777 8.80761Z" fill="#FFC600"/>'; }
}
mojs.addShape('cross', Cross);

class Donut extends mojs.CustomShape {
    getShape() { return '<path d="M30.5 18C30.5 24.9036 24.9036 30.5 18 30.5C11.0964 30.5 5.5 24.9036 5.5 18C5.5 11.0964 11.0964 5.5 18 5.5C24.9036 5.5 30.5 11.0964 30.5 18Z" stroke="#01A7E0" stroke-width="11"/>'; }
}
mojs.addShape('donut', Donut);

class Slice extends mojs.CustomShape {
    getShape() { return '<path d="M35 35C30.4037 35 25.8525 34.0947 21.6061 32.3358C17.3597 30.5769 13.5013 27.9988 10.2513 24.7487C7.00121 21.4987 4.42313 17.6403 2.66422 13.3939C0.905301 9.14752 -2.689e-08 4.59627 1.19209e-07 4.17371e-07L35 1.5299e-06L35 35Z" fill="#94C73D"/>'; }
}
mojs.addShape('slice', Slice);

class Box extends mojs.CustomShape {
    getShape() { return '<rect width="36" height="36" fill="#E7004B"/>'; }
}
mojs.addShape('box', Box);

class Curl extends mojs.CustomShape {
    getShape() { return '<path fill-rule="evenodd" clip-rule="evenodd" d="M22.0003 4C15.9889 4 12.0003 8.21707 12.0003 13C12.0003 15.6192 12.7621 17.6281 13.8938 18.9484C15.0054 20.2452 16.571 21 18.5003 21C22.3049 21 24.0003 17.9885 24.0003 16.5C24.0003 15.4545 23.7815 14.2443 23.2373 13.3652C22.7736 12.6161 22.0282 12 20.5003 12C19.3735 12 18.6442 12.5847 18.2421 13.4254C17.7942 14.3619 17.8664 15.3896 18.2153 15.971C18.7836 16.9182 18.4765 18.1467 17.5293 18.715C16.5822 19.2833 15.3536 18.9762 14.7853 18.029C13.6342 16.1104 13.7065 13.6381 14.6336 11.6996C15.6065 9.66526 17.6271 8 20.5003 8C23.4724 8 25.4771 9.38388 26.6384 11.2598C27.7192 13.0057 28.0003 15.0455 28.0003 16.5C28.0003 20.0115 24.6957 25 18.5003 25C15.4296 25 12.7452 23.7548 10.8568 21.5516C8.98852 19.3719 8.00033 16.3808 8.00033 13C8.00033 5.78293 14.0117 0 22.0003 0C30.2387 0 37.5003 7.03411 37.5003 17.5C37.5003 28.3777 27.3104 36.5 16.0003 36.5C6.96529 36.5 1.8347 32.1853 0.272768 29.5077C-0.283793 28.5536 0.0384797 27.329 0.992584 26.7724C1.94669 26.2159 3.17132 26.5382 3.72788 27.4923C4.49928 28.8147 8.23537 32.5 16.0003 32.5C25.6903 32.5 33.5003 25.6223 33.5003 17.5C33.5003 8.96589 27.762 4 22.0003 4Z" fill="#FFC600"/>'; }
}
mojs.addShape('curl', Curl);

class Positive extends mojs.CustomShape {
    getShape() {
      return '<path d="M100 16.0645L84 0L33.3333 60.8711L16 43.4679L0 59.5324L17.3333 76.9355L33.3333 93L100 16.0645Z" fill="#94C73D"/>';
    }
  }
  mojs.addShape("positive", Positive);



const play = (parent, shapes) => {
    const theparent = parent || document.body 
    const theshapes = shapes || ['donut', 'cross', 'slice', 'box', 'curl']
    const burst = new mojs.Burst({
        parent: theparent,
        radius: { 20: 100 },
        count: 10,
        duration: 1000,
        children: {
            // property map - maps over children with mod function
            shape: theshapes,
            // property map - maps over children with mod function
            fill: ['transparent'],
            // rand string - generates random value for every child rand( min, max )
            degreeShift: 'rand(-0, 60)',
            // stagger string( start, step ) for every child
            delay: 'stagger(0, 40)',
            radius: {20:200}
        }
    })
        const raterandom = (Math.random()*0.5)+0.5
        new Howl({ src: [sound1], rate: raterandom, volume: 0.3, autoplay:true })
        new Howl({ src: [sound1], rate: raterandom+0.5, volume: 0.5, autoplay:true })

    burst.play();
}

const playcircle = (parent, shapes) => {
    const theparent = parent || document.body 
    const theshapes = shapes || ['donut', 'cross', 'slice', 'box', 'curl']
    const burst = new mojs.Burst({
        parent: theparent,
        radius: { 20: 100 },
        count: 4,
        children: {
            // property map - maps over children with mod function
            shape: theshapes,
            // property map - maps over children with mod function
            fill: ['transparent'],
            radius:     20,
    rotate:      { 360: 0 },
    duration:   2000
        }
    })

    burst.play();
}



const working = (parent) => {
  const theparent = parent || document.body;
  const theshapes = ["donut", "cross", "slice", "box", "curl"];
  const RADIUS = 28;
  const burst = new mojs.Burst({
    parent: theparent,
    left:'50%',
    top:'50%',
    radius:   { 30 : RADIUS - 20 },
    count: 5,
    children: {
      shape: theshapes,
      fill: ['transparent'],
      radius: { 10 : RADIUS*2},
      duration: 700,
      delay: 200,
      easing: "quad.out"
    }
  });
  //burst.play()
  const timeline = new mojs.Timeline({ repeat:10, parent: theparent });
  timeline.add(burst);
  timeline.replay();
}


const playkeep = (parent, shapes) => {
    const theparent = parent || document.body;
    const theshapes = shapes || ["donut", "cross", "slice", "box", "curl"];
    const RADIUS = 28;
  
    const circle = new mojs.Shape({
      parent: theparent,
      left: '100%',
      top: '0%',
      stroke:   '#94C73D',
      strokeWidth: { [2*RADIUS] : 2 },
      fill:     'none',
      scale:    { 0: 1, easing: 'quad.out' },
      radius:   RADIUS/1.3,
      duration:  450,
    });


  
    const burst = new mojs.Burst({
      parent: theparent,
      left:'100%',
      top:'0%',
      radius:   { 30 : RADIUS - 20 },
      count: 5,
      children: {
        shape: ["donut", "cross", "slice", "box", "curl", ],
        fill: ['transparent'],
        radius: { 10 : RADIUS*2},
        duration: 700,
        delay: 200,
        easing: "quad.out"
      }
    });

    const circlebg = new mojs.Shape({
        parent: theparent,
        left: '100%',
        top: '0%',
        fill:     '#fff',
        opacity: {0:0.8},
        scale:    { 0: 1, easing: 'quad.out' },
        radius:   RADIUS/1.5,
        duration:  450,
      });
  
    const symbol = new mojs.Shape({
      parent: theparent,
      left:'100%',
      top:'0%',
      shape: theshapes,
      fill: "#94C73D",
      scale: { 0: 0.4 },
      easing: "elastic.out",
      duration: 1600,
      delay: 300,
      radius: RADIUS / 1,
      opacity: {0:1}
    });
  
    const timeline = new mojs.Timeline({ speed: 1.5 , parent: theparent });
  
    burst.el.style.zIndex=11;
    circle.el.style.zIndex=10;
    circlebg.el.style.zIndex=10;
    symbol.el.style.zIndex=10;
  
    timeline.add(circle, circlebg,  symbol, burst);
    timeline.replay();
    
    /*
    document.addEventListener("click", function (e) {
      timeline.replay();
    });
    */
  
  };


export default { play, playkeep, working }
