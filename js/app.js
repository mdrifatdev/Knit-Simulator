(function(){
"use strict";
var $=function(id){return document.getElementById(id);};
var SYM={K:"∧",T:"∨",M:"—"};
var SYM_D={K:"∨",T:"∧",M:"—"};
var NEXT={K:"T",T:"M",M:"K"};
var BASE="#3b6fb6";
var PALETTE=["#3b6fb6","#d9822b","#2f9e6d","#c44569","#7d5ba6","#2aa5b8","#b5a12a","#6b7280"];
var SETS=[
  {key:"d1",name:"ডায়াল ১",bed:"dial",butt:"1",head:"hD1"},
  {key:"d2",name:"ডায়াল ২",bed:"dial",butt:"2",head:"hD2"},
  {key:"c1",name:"সিলিন্ডার ১",bed:"cyl",butt:"1",head:"hC1"},
  {key:"c2",name:"সিলিন্ডার ২",bed:"cyl",butt:"2",head:"hC2"},
  {key:"c3",name:"সিলিন্ডার ৩",bed:"cyl",butt:"3",head:"hC3"}
];
var ALL_K=["K","K","K","K","K"];
var ALL_M=["M","M","M","M","M"];
var SHEET=["MMKMM","KMMMM","KMMKK","MMKMM","MKMMM","MKMKK",
  "MMMKM","KMMMM","KMKMK","MMMKM","MKMMM","MKKMK",
  "MMMMK","KMMMM","KMKKM","MMMMK","MKMMM","MKKKM"].map(function(s){return s.split("");});
var SY=[{c:"#3b6fb6",l:"30/1 কটন · SL 1.95"},{c:"#d9822b",l:"75D/36F পলি+লাইক্রা"},{c:"#2f9e6d",l:"20/1 কটন · SL 3.95"}];

var PRESETS={
  sheet:{F:18,wales:36,layout:"CD",cyl:"123",dial:"12",mirror:true,
    cams:SHEET,colors:SHEET.map(function(_,i){return SY[i%3].c;}),labels:SHEET.map(function(_,i){return SY[i%3].l;})},
  rib11:{F:4,wales:24,layout:"CD",cyl:"1",dial:"1",mirror:false,cams:[ALL_K,ALL_K,ALL_K,ALL_K]},
  rib22:{F:4,wales:24,layout:"CCDD",cyl:"1",dial:"1",mirror:false,cams:[ALL_K,ALL_K,ALL_K,ALL_K]},
  interlock:{F:2,wales:24,layout:"B",cyl:"12",dial:"12",mirror:false,
    cams:[["K","M","K","M","M"],["M","K","M","K","M"]]},
  pique:{F:4,wales:24,layout:"CD",cyl:"12",dial:"1",mirror:false,
    cams:[["K","K","K","T","M"],["K","K","K","M","M"],["K","K","T","K","M"],["K","K","M","K","M"]]},
  waffle:{F:4,wales:24,layout:"CD",cyl:"12",dial:"12",mirror:false,
    cams:[["K","T","K","T","M"],["K","T","K","T","M"],["T","K","T","K","M"],["T","K","T","K","M"]]},
  tuck:{F:4,wales:24,layout:"CD",cyl:"1",dial:"12",mirror:false,
    cams:[["K","K","K","M","M"],["K","T","K","M","M"],["K","K","K","M","M"],["T","K","K","M","M"]]},
  cardigan:{F:2,wales:24,layout:"CD",cyl:"1",dial:"1",mirror:false,
    cams:[["T","M","K","M","M"],["K","M","T","M","M"]]}
};

var INFO={
  sheet:{t:"আপনার শিট: ১৮ ফিডার স্ট্রেচ রিব",
    what:"38×18 মেশিন। সিলিন্ডারে ৩ ট্র্যাক (বাট ১,২,৩) এবং ডায়ালে ২ ট্র্যাক (বাট ১,২)। ৩ ফিডারের ইয়ার্ন-রিপিট ৬ বার চলে।",
    how:"প্রতিটি সুই সেট ১৮ ফিডারে মাত্র ৬ বার নিট করে, বাকি সময় মিস। পলি+লাইক্রা ফিডারে শুধু ডায়াল নিট করে।",
    look:"সামনের দিকে শুধু কটন লুপ দেখা যায়, লাইক্রা পেছনে ডায়ালে থেকে স্ট্রেচ জোগায়।",
    use:"৩৮০ GSM স্ট্রেচ রিব, ৮৯% কটন, ৮% পলিয়েস্টার, ৩% ইলাস্টেন।",
    note:"ডায়ালে ∨ কে নিট ধরে হিসাব করা হয়েছে (শিটের নোটেশন অনুযায়ী)।"},
  rib11:{t:"1×1 রিব (Plain Rib)",what:"সিলিন্ডার ও ডায়াল পালা করে বসে। প্রতি ফিডারে সব সুই নিট।",how:"কোনো টাক বা মিস নেই।",look:"সূক্ষ্ম খাড়া রিব লাইন, সর্বোচ্চ আড়াআড়ি স্থিতিস্থাপকতা।",use:"কাফ, কলার, টি-শার্ট।"},
  rib22:{t:"2×2 রিব (Derby Rib)",what:"সিলিন্ডারে ২টা, ডায়ালে ২টা সুই বিন্যাস (CCDD)।",how:"সব সুই নিট করে।",look:"মোটা স্পষ্ট রিব দাগ ও দ্রুত রিকভারি।",use:"সোয়েটার বর্ডার, কাফ, ফিটেড ওয়্যার।"},
  interlock:{t:"ইন্টারলক (Interlock)",what:"সিলিন্ডার ও ডায়াল সুই মুখোমুখি (B)। বাট ১ ও ২ পালা করে বসে।",how:"ফিডার ১ বাট-১ এবং ফিডার ২ বাট-২ নিট করায়।",look:"উভয় পাশ সমান মসৃণ ও ডবল-নিট ঘন।",use:"উন্নত টি-শার্ট, আন্ডারগার্মেন্টস।"},
  pique:{t:"পিকে (Single Piqué)",what:"রিব বিন্যাসে বাট ১,২ সিলিন্ডারে টাক ও মিস প্যাটার্ন।",how:"৪ ফিডারে টাক ও মিস চক্রাকারে চলে।",look:"মৌচাক বা ডায়মন্ড টেক্সচার।",use:"পোলো শার্ট, স্পোর্টস ফ্যাব্রিক।"},
  waffle:{t:"ওয়াফল (Waffle Fabric)",what:"উভয় বেডে বাট ১,২ এক সেট নিট করলে অন্য সেট টাক করে।",how:"৪ ফিডারের সেল গঠন।",look:"দ্বিমুখী চেকার্ড স্কয়ার গ্রিড টেক্সচার।",use:"থার্মাল ও উইন্টার ওয়্যার।"},
  tuck:{t:"টাক ডিজাইন (Tuck Rib)",what:"1×1 রিবে ডায়ালে টাক অল্টারনেশন।",how:"লুপ জমিয়ে টেক্সচার তৈরি।",look:"পেছনে ড্রপ ডট টেক্সচার।",use:"ডিজাইনার টি-শার্ট।"},
  cardigan:{t:"ফুল কার্ডিগান (Full Cardigan)",what:"প্রতিটি সুই এক কোর্সে নিট, পরের কোর্সে টাক।",how:"ডবল কোর্স সমন্বয়।",look:"মোটা, ফ্লাফি ও উষ্ণ টেক্সচার।",use:"ভারী সোয়েটার, কার্ডিগান।"},
  custom:{t:"কাস্টম ডিজাইন",what:"আপনার নিজস্ব প্যারামিটারে ক্যাম ও সুই সেটআপ।",how:"ক্যামের ঘরে চাপ দিলে ∧, ∨, — পরিবর্তন হবে।",look:"ডান পাশের ক্যানভাসে রিয়েল-টাইমে আউটপুট দেখুন।",use:""}
};

var S={preset:"sheet",F:18,rounds:2,wales:36,layout:"CD",cylButt:"123",dialButt:"12",
  view:"face",cams:[],mirror:true,upto:36,zoom:1,speed:260,sound:true,renderStyle:"realistic"};
var timer=null,audioCtx=null;

function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function totalCourses(){return S.F*S.rounds;}
function resetUpto(){stopPlay();S.upto=totalCourses();}

/* ── Web Audio Feedback ────────────────────────────── */
function playTick(freq, dur){
  if(!S.sound) return;
  try{
    if(!audioCtx) audioCtx=new(window.AudioContext||window.webkitAudioContext)();
    if(audioCtx.state==="suspended") audioCtx.resume();
    var osc=audioCtx.createOscillator(), gain=audioCtx.createGain();
    osc.type="sine"; osc.frequency.setValueAtTime(freq||700, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime+(dur||0.02));
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime+(dur||0.02));
  }catch(e){}
}

/* ── Toast Feedback ────────────────────────────────── */
function showToast(msg){
  var t=$("toast"), tm=$("toastMsg");
  tm.textContent=msg;
  t.classList.add("show");
  clearTimeout(t._tm);
  t._tm=setTimeout(function(){t.classList.remove("show");},2000);
}

function loadPreset(name){
  var p=PRESETS[name];if(!p)return;
  S.preset=name;S.F=p.F;S.layout=p.layout;S.cylButt=p.cyl;S.dialButt=p.dial;S.mirror=p.mirror;S.wales=p.wales;
  S.cams=p.cams.map(function(c,i){
    return{d1:c[0],d2:c[1],c1:c[2],c2:c[3],c3:c[4],color:p.colors?p.colors[i]:BASE,label:p.labels?p.labels[i]:""};
  });
  S.rounds=Math.max(2,Math.round(28/S.F));
  resetUpto();
  showToast(INFO[name]?INFO[name].t+" লোড হয়েছে":"প্রিসেট লোড হয়েছে");
}

function setFeeders(n){
  n=clamp(n,1,18);
  while(S.cams.length<n){
    var l=S.cams[S.cams.length-1]||{d1:"K",d2:"K",c1:"K",c2:"K",c3:"K",color:BASE,label:""};
    S.cams.push({d1:l.d1,d2:l.d2,c1:l.c1,c2:l.c2,c3:l.c3,color:l.color,label:""});
  }
  S.cams.length=n;S.F=n;
}

function build(){
  var out=[],ci=0,di=0;
  for(var p=0;p<S.wales;p++){
    var ch=S.layout.charAt(p%S.layout.length);
    var o={p:p,ch:ch,cyl:null,dial:null};
    if(ch==="C"||ch==="B"){o.cyl=S.cylButt.charAt(ci%S.cylButt.length);ci++;}
    if(ch==="D"||ch==="B"){o.dial=S.dialButt.charAt(di%S.dialButt.length);di++;}
    out.push(o);
  }
  return out;
}
function action(cam,bed,butt){return cam[(bed==="cyl"?"c":"d")+butt]||"M";}
function presentSets(model){return SETS.filter(function(s){return model.some(function(m){return m[s.bed]===s.butt;});});}
function repeatWidth(model){
  var L=S.layout.length;
  for(var w=L;w<=model.length;w+=L){
    var ok=true;
    for(var p=0;p+w<model.length;p++){
      var a=model[p],b=model[p+w];
      if(a.ch!==b.ch||a.cyl!==b.cyl||a.dial!==b.dial){ok=false;break;}
    }
    if(ok)return w;
  }
  return 0;
}
function cssVar(n){return getComputedStyle(document.documentElement).getPropertyValue(n).trim();}
function shade(hex,amt){
  var n=parseInt(hex.slice(1),16);
  var r=clamp(((n>>16)&255)+amt,0,255),g=clamp(((n>>8)&255)+amt,0,255),b=clamp((n&255)+amt,0,255);
  return"rgb("+r+","+g+","+b+")";
}

/* ── Premium Stitch Renderer ──────────────────────── */
function drawLoop(ctx,x,y,w,h,color,type){
  var style = S.renderStyle || "realistic";
  var lw = Math.max(3.0, w * 0.30);
  ctx.lineCap = "round"; ctx.lineJoin = "round";

  if (style === "realistic") {
    if(type === "K"){
      // Premium 3-layer knit stitch with wider Bezier sweep
      var pathLoop = function(){
        ctx.beginPath();
        ctx.moveTo(x - w*0.06, y + h*0.90);
        ctx.quadraticCurveTo(x + w*0.10, y + h*0.98, x + w*0.20, y + h*0.82);
        ctx.bezierCurveTo(x + w*0.28, y + h*0.50, x + w*0.20, y + h*0.10, x + w*0.50, y + h*0.08);
        ctx.bezierCurveTo(x + w*0.80, y + h*0.10, x + w*0.72, y + h*0.50, x + w*0.80, y + h*0.82);
        ctx.quadraticCurveTo(x + w*0.90, y + h*0.98, x + w*1.06, y + h*0.90);
      };
      // Outer glow / shadow
      ctx.save();
      ctx.strokeStyle = "rgba(0,0,0,0.28)";
      ctx.lineWidth = lw + 3.5;
      ctx.globalAlpha = 0.6;
      pathLoop(); ctx.stroke();
      ctx.globalAlpha = 1.0;
      ctx.restore();
      // Dark rim
      ctx.strokeStyle = shade(color, -55);
      ctx.lineWidth = lw + 1.6;
      pathLoop(); ctx.stroke();
      // Core fill
      ctx.strokeStyle = color;
      ctx.lineWidth = lw;
      pathLoop(); ctx.stroke();
      // Mid highlight
      ctx.strokeStyle = shade(color, +50);
      ctx.lineWidth = Math.max(1.0, lw * 0.38);
      ctx.globalAlpha = 0.65;
      pathLoop(); ctx.stroke();
      // Inner specular
      ctx.strokeStyle = shade(color, +95);
      ctx.lineWidth = Math.max(0.5, lw * 0.14);
      ctx.globalAlpha = 0.45;
      pathLoop(); ctx.stroke();
      ctx.globalAlpha = 1.0;

    } else if(type === "T"){
      // Tuck: held loop U-shape + prominent cross bar
      var pathTuckHeld = function(){
        ctx.beginPath();
        ctx.moveTo(x + w*0.18, y + h*0.92);
        ctx.bezierCurveTo(x + w*0.22, y + h*0.60, x + w*0.20, y + h*0.26, x + w*0.50, y + h*0.22);
        ctx.bezierCurveTo(x + w*0.80, y + h*0.26, x + w*0.78, y + h*0.60, x + w*0.82, y + h*0.92);
      };
      var pathTuckBar = function(){
        ctx.beginPath();
        ctx.moveTo(x + w*0.04, y + h*0.36);
        ctx.bezierCurveTo(x + w*0.28, y + h*0.44, x + w*0.72, y + h*0.44, x + w*0.96, y + h*0.36);
      };
      // Held loop — shadow, rim, fill
      ctx.save();
      ctx.strokeStyle = "rgba(0,0,0,0.20)";
      ctx.lineWidth = lw * 0.90 + 2.0;
      ctx.globalAlpha = 0.55;
      pathTuckHeld(); ctx.stroke();
      ctx.globalAlpha = 1.0;
      ctx.restore();
      ctx.strokeStyle = shade(color, -50);
      ctx.lineWidth = lw * 0.90 + 1.4;
      pathTuckHeld(); ctx.stroke();
      ctx.strokeStyle = color;
      ctx.lineWidth = lw * 0.90;
      pathTuckHeld(); ctx.stroke();
      ctx.strokeStyle = shade(color, +55);
      ctx.lineWidth = Math.max(0.8, lw * 0.28);
      ctx.globalAlpha = 0.55;
      pathTuckHeld(); ctx.stroke();
      ctx.globalAlpha = 1.0;
      // Cross bar — shadow, rim, fill, specular
      ctx.save();
      ctx.strokeStyle = "rgba(0,0,0,0.28)";
      ctx.lineWidth = lw + 3.0;
      ctx.globalAlpha = 0.5;
      pathTuckBar(); ctx.stroke();
      ctx.globalAlpha = 1.0;
      ctx.restore();
      ctx.strokeStyle = shade(color, -45);
      ctx.lineWidth = lw + 1.6;
      pathTuckBar(); ctx.stroke();
      ctx.strokeStyle = color;
      ctx.lineWidth = lw;
      pathTuckBar(); ctx.stroke();
      ctx.strokeStyle = shade(color, +75);
      ctx.lineWidth = Math.max(1.0, lw * 0.30);
      ctx.globalAlpha = 0.80;
      pathTuckBar(); ctx.stroke();
      ctx.globalAlpha = 1.0;

    } else {
      // Miss: subtle floating catenary + center dot
      var missX0 = x + 1, missX1 = x + w - 1, midY = y + h * 0.50;
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(1.4, lw * 0.40);
      ctx.globalAlpha = 0.38;
      ctx.setLineDash([3.5, 3]);
      ctx.beginPath();
      ctx.moveTo(missX0, midY);
      ctx.quadraticCurveTo(x + w*0.50, y + h*0.60, missX1, midY);
      ctx.stroke();
      ctx.setLineDash([]);
      // Tiny center needle dot
      ctx.globalAlpha = 0.28;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x + w*0.50, midY + h*0.06, Math.max(1.2, lw*0.22), 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    }

  } else if (style === "shadow") {
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.35)";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetY = 2;
    var V = function(top,bot,col,width){
      ctx.strokeStyle=col;ctx.lineWidth=width;ctx.beginPath();
      ctx.moveTo(x+w*.18,y+top);ctx.lineTo(x+w*.50,y+bot);ctx.lineTo(x+w*.82,y+top);ctx.stroke();
    };
    if(type==="K"){
      V(h*.12,h*.88,shade(color,-50),lw+1.8);
      V(h*.12,h*.88,color,lw);
      V(h*.12,h*.88,shade(color,+65),lw*0.28);
    } else if(type==="T"){
      V(h*.48,h*.90,shade(color,-45),lw*.85+1.4);
      V(h*.48,h*.90,color,lw*.85);
      ctx.strokeStyle=shade(color,-35);ctx.lineWidth=lw*0.70+1.2;
      ctx.beginPath();ctx.moveTo(x+w*.10,y+h*.26);ctx.quadraticCurveTo(x+w*.50,y+h*.34,x+w*.90,y+h*.26);ctx.stroke();
      ctx.strokeStyle=color;ctx.lineWidth=lw*0.70;
      ctx.beginPath();ctx.moveTo(x+w*.10,y+h*.26);ctx.quadraticCurveTo(x+w*.50,y+h*.34,x+w*.90,y+h*.26);ctx.stroke();
    } else {
      ctx.globalAlpha=0.35;ctx.strokeStyle=color;ctx.lineWidth=1.4;ctx.setLineDash([3.5,3]);
      ctx.beginPath();ctx.moveTo(x+1,y+h*.5);ctx.quadraticCurveTo(x+w*.5,y+h*.58,x+w-1,y+h*.5);ctx.stroke();
    }
    ctx.restore();

  } else {
    // Technical CAD Mode
    var V = function(top,bot,col,width){
      ctx.strokeStyle=col;ctx.lineWidth=width;ctx.beginPath();
      ctx.moveTo(x+w*.18,y+top);ctx.lineTo(x+w*.50,y+bot);ctx.lineTo(x+w*.82,y+top);ctx.stroke();
    };
    if(type==="K"){
      V(h*.12,h*.88,shade(color,-60),lw+1.6);
      V(h*.12,h*.88,color,lw);
    } else if(type==="T"){
      V(h*.48,h*.90,shade(color,-60),lw*.82+1.4);
      V(h*.48,h*.90,color,lw*.82);
      ctx.strokeStyle=shade(color,-55);ctx.lineWidth=lw*.55+1.4;
      ctx.beginPath();ctx.moveTo(x+w*.12,y+h*.24);ctx.lineTo(x+w*.88,y+h*.24);ctx.stroke();
      ctx.strokeStyle=color;ctx.lineWidth=lw*.55;
      ctx.beginPath();ctx.moveTo(x+w*.12,y+h*.24);ctx.lineTo(x+w*.88,y+h*.24);ctx.stroke();
    } else {
      ctx.save();ctx.globalAlpha=0.35;ctx.strokeStyle=color;ctx.lineWidth=1.2;ctx.setLineDash([3,3]);
      ctx.beginPath();ctx.moveTo(x+1,y+h*.5);ctx.lineTo(x+w-1,y+h*.5);ctx.stroke();ctx.restore();
    }
  }
}

function drawCell(ctx,x,y,w,h,color,type){
  var pad=1;
  // Base cell background
  ctx.fillStyle=cssVar("--surface2");ctx.fillRect(x+pad,y+pad,w-pad*2,h-pad*2);
  if(type==="K"){
    // Gradient fill for knit
    var gK=ctx.createLinearGradient(x+pad,y+pad,x+pad,y+h-pad);
    gK.addColorStop(0,shade(color,+30));gK.addColorStop(0.5,color);gK.addColorStop(1,shade(color,-30));
    ctx.fillStyle=gK;ctx.fillRect(x+pad,y+pad,w-pad*2,h-pad*2);
    // Top specular
    ctx.fillStyle="rgba(255,255,255,0.20)";
    ctx.fillRect(x+pad,y+pad,w-pad*2,(h-pad*2)*0.35);
  } else if(type==="T"){
    var gT=ctx.createLinearGradient(x+pad,y+pad,x+pad,y+h*0.45);
    gT.addColorStop(0,shade(color,+20));gT.addColorStop(1,color);
    ctx.fillStyle=gT;ctx.fillRect(x+pad,y+pad,w-pad*2,(h-pad*2)*.45);
    ctx.globalAlpha=.28;ctx.fillStyle=color;
    ctx.fillRect(x+pad,y+pad+(h-pad*2)*.45,w-pad*2,(h-pad*2)*.55);ctx.globalAlpha=1;
  }
}

/* ── Live Canvas Drawing ───────────────────────────── */
var canvasLayoutInfo={W:0,H:0,mg:32,tp:16,cw:16,chh:16,cols:[],total:36};

function draw(){
  var cv=$("cv"),ctx=cv.getContext("2d");
  var model=build(),total=totalCourses();S.upto=clamp(S.upto,1,total);
  var cols;
  if(S.view==="face")cols=model.filter(function(m){return m.cyl;});
  else if(S.view==="back")cols=model.filter(function(m){return m.dial;});
  else cols=model;

  var mg=34,tp=18,ww=$("wrap").clientWidth-24;
  var n=Math.max(1,cols.length);
  var base=clamp(Math.floor((ww-mg)/n),12,34);
  var cw=Math.round(base*S.zoom),mm=S.view==="map";
  var chh=mm?Math.round(cw*1.55):Math.round(cw*0.88);
  var W=mg+n*cw+2,H=total*chh+tp+6;
  var dpr=window.devicePixelRatio||1;

  canvasLayoutInfo={W:W,H:H,mg:mg,tp:tp,cw:cw,chh:chh,cols:cols,total:total};

  cv.width=W*dpr;cv.height=H*dpr;cv.style.width=W+"px";cv.style.height=H+"px";
  ctx.setTransform(dpr,0,0,dpr,0,tp*dpr);

  // === Premium canvas background ===
  var isDark=document.documentElement.getAttribute("data-theme")==="dark";
  ctx.fillStyle=isDark?"#080b17":"#f4f6fb";
  ctx.fillRect(0,-tp,W,H+tp);

  // Subtle checkerboard pattern for canvas depth
  var chkSize=Math.max(6,Math.round(chh/2));
  ctx.save();
  ctx.globalAlpha=isDark?0.025:0.035;
  ctx.fillStyle=isDark?"#818cf8":"#4f46e5";
  for(var rr=0;rr<Math.ceil((H+tp)/chkSize);rr++){
    for(var cc2=0;cc2<Math.ceil(W/chkSize);cc2++){
      if((rr+cc2)%2===0) ctx.fillRect(cc2*chkSize,rr*chkSize-tp,chkSize,chkSize);
    }
  }
  ctx.restore();

  // === Grid lines ===
  var bdCol=cssVar("--border");
  ctx.strokeStyle=bdCol;ctx.lineWidth=0.6;
  for(var r=0;r<=total;r++){
    var yy=r*chh+0.5;
    var isRepeatBoundary=(S.F>0&&r%(S.F)===0);
    ctx.globalAlpha=isRepeatBoundary?0.45:0.20;
    ctx.lineWidth=isRepeatBoundary?1.0:0.5;
    ctx.beginPath();ctx.moveTo(mg,yy);ctx.lineTo(W,yy);ctx.stroke();
  }
  ctx.globalAlpha=1.0;ctx.lineWidth=0.5;
  // Column separator lines
  for(var ci2=0;ci2<=cols.length;ci2++){
    ctx.globalAlpha=0.12;
    ctx.beginPath();ctx.moveTo(mg+ci2*cw,0);ctx.lineTo(mg+ci2*cw,H);ctx.stroke();
  }
  ctx.globalAlpha=1.0;

  var acc=cssVar("--brand");
  ctx.font="bold 9px Inter,sans-serif";ctx.textBaseline="middle";

  for(var c=0;c<S.upto;c++){
    var f=c%S.F,cam=S.cams[f],y2=(total-1-c)*chh;
    // Active course highlight
    if(S.upto<total&&c===S.upto-1){
      ctx.save();
      var glowGrad=ctx.createLinearGradient(mg,y2,W,y2);
      glowGrad.addColorStop(0,"rgba(99,102,241,0.20)");
      glowGrad.addColorStop(0.5,"rgba(124,58,237,0.14)");
      glowGrad.addColorStop(1,"rgba(56,189,248,0.10)");
      ctx.fillStyle=glowGrad;
      ctx.fillRect(mg,y2,W-mg,chh);
      // Left accent bar
      ctx.fillStyle=acc;
      ctx.fillRect(mg,y2,3,chh);
      ctx.restore();
    }
    // Feeder label
    ctx.fillStyle=cssVar("--text3");ctx.textAlign="right";
    ctx.fillText("F"+(f+1),mg-4,y2+chh/2);
    for(var i=0;i<cols.length;i++){
      var m=cols[i],x2=mg+i*cw;
      if(!mm){
        var tp2=S.view==="face"?action(cam,"cyl",m.cyl):action(cam,"dial",m.dial);
        drawLoop(ctx,x2,y2,cw,chh,cam.color,tp2);
      } else {
        var half=chh/2;
        if(m.dial)drawCell(ctx,x2,y2,cw,half,cam.color,action(cam,"dial",m.dial));
        if(m.cyl)drawCell(ctx,x2,y2+half,cw,half,cam.color,action(cam,"cyl",m.cyl));
      }
    }
  }

  var rw=repeatWidth(model);
  if(rw>0){
    var k=cols.filter(function(m){return m.p<rw;}).length;
    if(k>0){
      var bx=mg+1,by=(total-S.F)*chh+1,bw=k*cw-2,bh=S.F*chh-2;
      ctx.save();
      ctx.setLineDash([5,4]);
      ctx.strokeStyle=acc;
      ctx.lineWidth=2.0;
      ctx.shadowColor=acc;
      ctx.shadowBlur=6;
      ctx.strokeRect(bx,by,bw,bh);
      ctx.shadowBlur=0;
      ctx.setLineDash([]);
      ctx.fillStyle=acc;
      ctx.font="700 10px Inter,sans-serif";
      ctx.textAlign="left";ctx.textBaseline="bottom";
      ctx.fillText("১ রিপিট ("+k+"×"+S.F+")",bx+3,by-3);
      ctx.restore();
      $("badgeRepeat").textContent="রিপিট: "+S.F+" কোর্স × "+k+" ওয়েল";
      $("hudRepeat").textContent=k+"×"+S.F;
    }
  }

  var hints={
    face:"সামনের দিক (Cylinder Loops): নিচ থেকে উপরে কোর্স বাড়ছে।",
    back:"পেছনের দিক (Dial Loops): ডায়াল সুইয়ের লুপ। ফাঁকা ঘর = মিস।",
    map:"সুই-ম্যাপ (CAD Mode): উপরে ডায়াল, নিচে সিলিন্ডার।"
  };
  $("viewHint").textContent=hints[S.view];
  updateNow();
  updateHUD(model);
}

/* ── HUD & Specs Computation ───────────────────────── */
function updateHUD(model){
  $("hudCourses").textContent=totalCourses();
  $("hudWales").textContent=S.wales;

  var totalLoops=0,countK=0,countT=0,countM=0;
  var cols=model.filter(function(m){return m.cyl||m.dial;});
  S.cams.forEach(function(cam){
    cols.forEach(function(m){
      var vC=m.cyl?action(cam,"cyl",m.cyl):null;
      var vD=m.dial?action(cam,"dial",m.dial):null;
      [vC,vD].forEach(function(v){
        if(v){
          totalLoops++;
          if(v==="K")countK++;
          else if(v==="T")countT++;
          else countM++;
        }
      });
    });
  });

  var pctK=totalLoops?Math.round((countK/totalLoops)*100):0;
  var pctT=totalLoops?Math.round((countT/totalLoops)*100):0;
  var pctM=totalLoops?Math.max(0,100-pctK-pctT):0;

  $("barK").style.width=pctK+"%"; $("valK").textContent=pctK+"%";
  $("barT").style.width=pctT+"%"; $("valT").textContent=pctT+"%";
  $("barM").style.width=pctM+"%"; $("valM").textContent=pctM+"%";

  var typeText="Rib ("+S.layout+")";
  if(S.layout==="B")typeText="Interlock (B)";
  else if(S.layout==="CD"&&pctT>10)typeText="Tuck Rib";
  $("badgeType").textContent="টাইপ: "+typeText;
}

function updateNow(){
  var total=totalCourses(),c=S.upto-1,f=c%S.F,cam=S.cams[f];
  var model=build(),sets=presentSets(model),g={K:[],T:[],M:[]};
  sets.forEach(function(s){g[cam[s.key]].push(s.name);});
  var parts=[];
  if(g.K.length)parts.push("নিট: "+g.K.join(", "));
  if(g.T.length)parts.push("টাক: "+g.T.join(", "));
  if(g.M.length)parts.push("মিস: "+g.M.join(", "));

  $("now").innerHTML="<span><b>কোর্স "+S.upto+"/"+total+"</b> · ফিডার "+(f+1)+(cam.label?" ("+cam.label+")":"")+"</span><span style='font-size:11px;opacity:0.85'>"+parts.join(" | ")+"</span>";
  var up=$("upto");up.max=total;up.value=S.upto;

  var rows=document.querySelectorAll("#camBody tr");
  rows.forEach(function(r,idx){r.classList.toggle("tr-active",idx===f);});
}

function longestRun(seq,val){
  var k=seq.indexOf("K");if(k<0)return seq.length;
  var best=0,cur=0;
  for(var i=1;i<=seq.length;i++){var v=seq[(k+i)%seq.length];if(v===val){cur++;if(cur>best)best=cur;}else cur=0;}
  return best;
}
function analyze(){
  var model=build(),sets=presentSets(model),list=[];
  sets.forEach(function(s){
    var seq=S.cams.map(function(c){return c[s.key];});
    if(seq.indexOf("K")<0)list.push(s.name+" সেটের সুই কোনো ফিডারে নিট করে না।");
    else{
      if(longestRun(seq,"T")>=3)list.push(s.name+" সেটে টানা ৩+ টাক — অতিরিক্ত সুতার টেনশনে ছিঁড়তে পারে।");
      if(longestRun(seq,"M")>=6)list.push(s.name+" সেটে ৬+ মিস — লম্বা ভাসা সুতা হতে পারে।");
    }
  });
  var ul=$("warn");ul.innerHTML="";var li;
  if(!list.length){li=document.createElement("li");li.className="ok";li.textContent="কোনো প্রযুক্তিগত ঝুঁকি ধরা পড়েনি। ডিজাইন নিরাপদ।";ul.appendChild(li);}
  else list.forEach(function(t){li=document.createElement("li");li.textContent=t;ul.appendChild(li);});
  return sets.map(function(s){return s.key;});
}

function symFor(set,v){return(set.bed==="dial"&&S.mirror)?SYM_D[v]:SYM[v];}
function renderLegend(){
  $("legend").innerHTML=S.mirror
    ?"<span class='li'><b>∧</b>সিলিন্ডারে নিট</span><span class='li'><b>∨</b>ডায়ালে নিট</span><span class='li'><b>—</b>মিস</span><span class='li' style='color:var(--brand);font-size:11px'>ঘরে ক্লিক করলে ঘুরবে</span>"
    :"<span class='li'><b>∧</b>নিট</span><span class='li'><b>∨</b>টাক</span><span class='li'><b>—</b>মিস</span><span class='li' style='color:var(--brand);font-size:11px'>ঘরে ক্লিক করলে ঘুরবে</span>";
}
function renderInfo(){
  var i=INFO[S.preset]||INFO.custom;
  $("infoTitle").textContent=i.t;
  var h="<p><b>কী:</b> "+i.what+"</p><p><b>কীভাবে:</b> "+i.how+"</p><p><b>দেখবেন:</b> "+i.look+"</p>";
  if(i.use)h+="<p><b>ব্যবহার:</b> "+i.use+"</p>";
  if(i.note)h+="<div class='inote'>"+i.note+"</div>";
  $("infoBody").innerHTML=h;
}

/* ── Cam Matrix Builder ────────────────────────────── */
function buildTable(){
  var present=analyze();var body=$("camBody");body.innerHTML="";
  S.cams.forEach(function(cam,i){
    var tr=document.createElement("tr");
    var td=document.createElement("td");td.className="fn";td.textContent=i+1;tr.appendChild(td);
    td=document.createElement("td");td.className="yc";
    var ci=document.createElement("input");ci.type="color";ci.value=cam.color;
    ci.addEventListener("input",function(){cam.color=ci.value;draw();});
    td.appendChild(ci);
    if(cam.label){var lb=document.createElement("span");lb.className="yl";lb.textContent=cam.label;td.appendChild(lb);}
    tr.appendChild(td);
    SETS.forEach(function(s){
      var cell=document.createElement("td");
      var b=document.createElement("button");b.className="cb2";b.dataset.v=cam[s.key];
      b.textContent=symFor(s,cam[s.key]);
      if(present.indexOf(s.key)<0)b.classList.add("off");
      b.addEventListener("click",function(){
        playTick(650, 0.02);
        cam[s.key]=NEXT[cam[s.key]];b.dataset.v=cam[s.key];b.textContent=symFor(s,cam[s.key]);
        markCustom();analyze();draw();
      });
      cell.appendChild(b);tr.appendChild(cell);
    });
    body.appendChild(tr);
  });
  SETS.forEach(function(s){$(s.head).classList.toggle("off",present.indexOf(s.key)<0);});
}

function markCustom(){if(S.preset!=="custom"){S.preset="custom";$("preset").value="custom";renderInfo();}}
function syncControls(){
  $("fVal").textContent=S.F;$("rVal").textContent=S.rounds;$("wVal").textContent=S.wales;
  $("layout").value=S.layout;$("cylButt").value=S.cylButt;$("dialButt").value=S.dialButt;
  $("mirror").checked=S.mirror;$("preset").value=S.preset;
}
function refresh(full){syncControls();renderLegend();if(full)buildTable();else analyze();draw();}
function sanitize(v,allowed,fallback){
  v=(v||"").toUpperCase().split("").filter(function(c){return allowed.indexOf(c)>=0;}).join("");
  return v||fallback;
}

/* ── Interactive Column Header Toggling ────────────── */
SETS.forEach(function(s){
  var el=$(s.head);
  if(el){
    el.addEventListener("click",function(){
      var firstVal=S.cams[0][s.key];
      var nextVal=NEXT[firstVal];
      S.cams.forEach(function(cam){cam[s.key]=nextVal;});
      playTick(800, 0.03);
      markCustom();refresh(true);
      showToast(s.name+" এর সব ক্যাম '"+symFor(s,nextVal)+"' এ সেট হয়েছে");
    });
  }
});

/* ── Batch Actions ─────────────────────────────────── */
$("allKnitBtn").addEventListener("click",function(){
  S.cams.forEach(function(cam){SETS.forEach(function(s){cam[s.key]="K";});});
  playTick(900, 0.03);markCustom();refresh(true);showToast("সব ক্যাম নিট (∧) এ সেট হয়েছে");
});
$("allMissBtn").addEventListener("click",function(){
  S.cams.forEach(function(cam){SETS.forEach(function(s){cam[s.key]="M";});});
  playTick(400, 0.03);markCustom();refresh(true);showToast("সব ক্যাম মিস (—) এ সেট হয়েছে");
});

/* ── Step-by-Step Playback ─────────────────────────── */
function stopPlay(){
  if(timer){clearInterval(timer);timer=null;}
  $("playIcon").textContent="▶";$("playLabel").textContent="ধাপে ধাপে";
}
function startPlay(){
  if(S.upto>=totalCourses())S.upto=1;
  $("playIcon").textContent="⏸";$("playLabel").textContent="থামান";draw();
  timer=setInterval(function(){
    if(S.upto>=totalCourses()){stopPlay();return;}
    S.upto++;playTick(750, 0.015);draw();
    if(S.upto>=totalCourses())stopPlay();
  },S.speed);
}

$("play").addEventListener("click",function(){if(timer)stopPlay();else startPlay();});
$("stepPrev").addEventListener("click",function(){stopPlay();S.upto=clamp(S.upto-1,1,totalCourses());playTick(600,0.015);draw();});
$("stepNext").addEventListener("click",function(){stopPlay();S.upto=clamp(S.upto+1,1,totalCourses());playTick(700,0.015);draw();});

function exportPNG(){
  var link=document.createElement("a");link.download="knitsim-fabric-"+S.preset+".png";
  link.href=$("cv").toDataURL("image/png");link.click();
  showToast("PNG ইমেজ ডাউনলোড সম্পন্ন হয়েছে");
}

/* ── Interactive Canvas Tooltip Inspector ──────────── */
var cv=$("cv"), inspectBox=$("canvasInspect");
cv.addEventListener("mousemove",function(e){
  var info=canvasLayoutInfo;
  if(!info.W||!info.cols.length)return;
  var rect=cv.getBoundingClientRect();
  var scaleX=info.W/rect.width, scaleY=info.H/rect.height;
  var canvasX=(e.clientX-rect.left)*scaleX;
  var canvasY=(e.clientY-rect.top)*scaleY-info.tp;

  var colIdx=Math.floor((canvasX-info.mg)/info.cw);
  var courseIdx=info.total-1-Math.floor(canvasY/info.chh);

  if(colIdx>=0&&colIdx<info.cols.length&&courseIdx>=0&&courseIdx<info.total){
    var m=info.cols[colIdx];
    var f=courseIdx%S.F, cam=S.cams[f];
    var act="—";
    if(S.view==="face"&&m.cyl)act=action(cam,"cyl",m.cyl);
    else if(S.view==="back"&&m.dial)act=action(cam,"dial",m.dial);
    else if(S.view==="map")act="D:"+(m.dial?action(cam,"dial",m.dial):"")+" C:"+(m.cyl?action(cam,"cyl",m.cyl):"");
    var actName=act==="K"?"নিট (∧)":act==="T"?"টাক (∨)":"মিস (—)";

    inspectBox.textContent="কোর্স "+(courseIdx+1)+" (F"+(f+1)+") · ওয়েল "+(m.p+1)+" ("+(m.ch==="C"?"সিলিন্ডার":"ডায়াল")+") → "+actName;
    inspectBox.classList.add("show");
  } else {
    inspectBox.classList.remove("show");
  }
});
cv.addEventListener("mouseleave",function(){inspectBox.classList.remove("show");});

/* ── Theme Toggle ──────────────────────────────────── */
(function(){
  var html=document.documentElement,btn=$("themeBtn");
  function isDark(){return html.getAttribute("data-theme")==="dark";}
  function apply(){btn.textContent=isDark()?"☀️":"🌙";}
  btn.addEventListener("click",function(){
    var nowDark=isDark();
    html.setAttribute("data-theme",nowDark?"light":"dark");
    apply();setTimeout(draw,40);
    showToast(nowDark?"লাইট থিম চালু":"ডার্ক থিম চালু");
  });
  if(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches)html.setAttribute("data-theme","dark");
  apply();
})();

/* ── Sound Toggle ──────────────────────────────────── */
$("soundBtn").addEventListener("click",function(){
  S.sound=!S.sound;
  this.textContent=S.sound?"🔊":"🔇";
  showToast(S.sound?"শব্দ ইফেক্ট অন":"শব্দ ইফেক্ট অফ");
});

/* ── Shortcuts Modal ───────────────────────────────── */
$("kbdBtn").addEventListener("click",function(){$("modalOverlay").classList.add("open");});
$("modalClose").addEventListener("click",function(){$("modalOverlay").classList.remove("open");});
$("modalOverlay").addEventListener("click",function(e){if(e.target===this)this.classList.remove("open");});

/* ── Global Keyboard Shortcuts ─────────────────────── */
window.addEventListener("keydown",function(e){
  if(e.target.tagName==="INPUT"||e.target.tagName==="SELECT")return;
  if(e.code==="Space"){e.preventDefault();if(timer)stopPlay();else startPlay();}
  else if(e.key==="1"){selectView("face");}
  else if(e.key==="2"){selectView("back");}
  else if(e.key==="3"){selectView("map");}
  else if(e.key==="ArrowLeft"){stopPlay();S.upto=clamp(S.upto-1,1,totalCourses());draw();}
  else if(e.key==="ArrowRight"){stopPlay();S.upto=clamp(S.upto+1,1,totalCourses());draw();}
  else if(e.key==="d"||e.key==="D"){$("themeBtn").click();}
  else if(e.key==="e"||e.key==="E"){exportPNG();}
  else if(e.key==="Escape"){$("modalOverlay").classList.remove("open");stopPlay();}
});

function selectView(v){
  S.view=v;
  document.querySelectorAll(".vtab").forEach(function(o){o.setAttribute("aria-pressed",o.dataset.view===v?"true":"false");});
  draw();
}

$("exportBtn").addEventListener("click",exportPNG);
$("upto").addEventListener("input",function(){stopPlay();S.upto=parseInt(this.value,10);draw();});
$("zoom").addEventListener("change",function(){S.zoom=parseFloat(this.value);draw();});
$("renderStyle").addEventListener("change",function(){S.renderStyle=this.value;draw();showToast("স্টাইল: "+this.options[this.selectedIndex].text);});
$("speed").addEventListener("change",function(){S.speed=parseInt(this.value,10);if(timer){stopPlay();startPlay();}});
$("preset").addEventListener("change",function(){var v=this.value;if(v==="custom"){S.preset="custom";renderInfo();return;}loadPreset(v);renderInfo();refresh(true);});
$("fMinus").addEventListener("click",function(){setFeeders(S.F-1);markCustom();resetUpto();refresh(true);});
$("fPlus").addEventListener("click",function(){setFeeders(S.F+1);markCustom();resetUpto();refresh(true);});
$("rMinus").addEventListener("click",function(){S.rounds=clamp(S.rounds-1,1,20);resetUpto();refresh(false);});
$("rPlus").addEventListener("click",function(){S.rounds=clamp(S.rounds+1,1,20);resetUpto();refresh(false);});
$("wMinus").addEventListener("click",function(){S.wales=clamp(S.wales-2,8,60);refresh(false);});
$("wPlus").addEventListener("click",function(){S.wales=clamp(S.wales+2,8,60);refresh(false);});
$("layout").addEventListener("change",function(){S.layout=sanitize(this.value,"CDB","CD");markCustom();refresh(true);});
$("cylButt").addEventListener("change",function(){S.cylButt=sanitize(this.value,"123","1");markCustom();refresh(true);});
$("dialButt").addEventListener("change",function(){S.dialButt=sanitize(this.value,"12","1");markCustom();refresh(true);});
$("mirror").addEventListener("change",function(){S.mirror=this.checked;refresh(true);});
$("sameColor").addEventListener("click",function(){var c=S.cams[0].color;S.cams.forEach(function(x){x.color=c;});refresh(true);showToast("সব ফিডারে প্রথম সুতার রঙ প্রয়োগ হয়েছে");});
$("stripeColor").addEventListener("click",function(){S.cams.forEach(function(x,i){x.color=PALETTE[i%PALETTE.length];});refresh(true);showToast("স্ট্রাইপ রঙ প্যালেট প্রয়োগ হয়েছে");});

document.querySelectorAll(".vtab").forEach(function(t){
  t.addEventListener("click",function(){selectView(t.dataset.view);});
});

var rt;window.addEventListener("resize",function(){clearTimeout(rt);rt=setTimeout(draw,120);});
if(window.matchMedia){var mq=window.matchMedia("(prefers-color-scheme: dark)");if(mq.addEventListener)mq.addEventListener("change",draw);}
new MutationObserver(function(){draw();}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});

loadPreset("sheet");renderInfo();refresh(true);
})();
