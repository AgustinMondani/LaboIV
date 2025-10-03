import{a as I}from"./chunk-B62DE3ON.js";import{d as k}from"./chunk-IUAF4EHQ.js";import"./chunk-NSFHJ6NV.js";import{a as M}from"./chunk-2QAIXTRJ.js";import"./chunk-JHHDI4HL.js";import{$a as m,Ab as C,Bb as P,Ca as j,Db as O,Ga as p,Na as l,Pa as r,Qa as a,Ua as x,Va as _,W as b,Wa as u,X as h,_a as s,ab as v,ta as o,xa as d}from"./chunk-4LKR36O3.js";import"./chunk-LJ5XHLMQ.js";import{h as f}from"./chunk-FK42CRUA.js";function y(i,e){if(i&1&&(r(0,"pre"),s(1),a()),i&2){let t=e.$implicit;o(),m(t)}}function S(i,e){if(i&1){let t=x();r(0,"button",10),_("click",function(){let c=b(t).$implicit,g=u();return h(g.presionarLetra(c))}),s(1),a()}if(i&2){let t=e.$implicit,n=u();l("disabled",n.letrasAdivinadas.includes(t)||n.letrasIncorrectas.includes(t)),o(),v(" ",t," ")}}function T(i,e){if(i&1){let t=x();r(0,"button",11),_("click",function(){b(t);let c=u();return h(c.reiniciarJuego())}),s(1,"Reiniciar"),a()}}var w=class i{constructor(e,t,n){this.router=e;this.supabase=t;this.puntuacionService=n}palabra="";letrasAdivinadas=[];letrasIncorrectas=[];maxIntentos=6;letras="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");mensaje="";juegoTerminado=!1;dibujoAhorcado=[];ultimaPalabra="";puntaje=0;palabrasDisponibles=["perro","gato","python","ionic","angular","celular","canguro"];ngOnInit(){return f(this,null,function*(){this.iniciarJuego()})}iniciarJuego(){this.letrasAdivinadas=[],this.letrasIncorrectas=[],this.mensaje="",this.juegoTerminado=!1,this.palabra=this.seleccionarPalabraAleatoria(),this.actualizarDibujo()}seleccionarPalabraAleatoria(){let e="";do e=this.palabrasDisponibles[Math.floor(Math.random()*this.palabrasDisponibles.length)].toUpperCase();while(e===this.ultimaPalabra);return this.ultimaPalabra=e,e}presionarLetra(e){this.juegoTerminado||this.letrasAdivinadas.includes(e)||this.letrasIncorrectas.includes(e)||(this.palabra.includes(e)?(this.letrasAdivinadas.push(e),this.verificarVictoria()):(this.letrasIncorrectas.push(e),this.actualizarDibujo(),this.verificarDerrota()))}obtenerPalabraMostrada(){return this.palabra.split("").map(e=>this.letrasAdivinadas.includes(e)?e:"_").join(" ")}verificarVictoria(){return f(this,null,function*(){if([...new Set(this.palabra.split(""))].every(n=>this.letrasAdivinadas.includes(n))){switch(this.letrasIncorrectas.length){case 0:this.puntaje=200;break;case 1:this.puntaje=150;break;case 2:this.puntaje=100;break;case 3:this.puntaje=50;break;case 4:this.puntaje=10;break;case 5:this.puntaje=1;break;default:this.puntaje=0;break}this.mensaje=`\xA1Ganaste! Puntaje: ${this.puntaje}`,this.juegoTerminado=!0;let c=yield this.supabase.getSessionPuntaje(),g=c?.user_metadata?.username??"An\xF3nimo",A=c?.email??"sin@email";yield this.puntuacionService.guardarPuntaje(g,A,"Ahorcado",this.puntaje)}})}verificarDerrota(){this.letrasIncorrectas.length>=this.maxIntentos&&(this.mensaje=`Perdiste. La palabra era: ${this.palabra}`,this.juegoTerminado=!0)}reiniciarJuego(){this.iniciarJuego()}actualizarDibujo(){let e=this.letrasIncorrectas.length,t=[`
      
      
      
      
      
      =========
      `,`
      |
      |
      |
      |
      |
      =========
      `,`
      +---+
      |
      |
      |
      |
      =========
      `,`
      +---+
      |   O
      |
      |
      |
      =========
      `,`
      +---+
      |   O
      |   |
      |
      |
      =========
      `,`
      +---+
      |   O
      |  /|\\
      |
      |
      =========
      `,`
      +---+
      |   O
      |  /|\\
      |  / \\
      |
      =========
      `];this.dibujoAhorcado=t[e].split(`
`)}static \u0275fac=function(t){return new(t||i)(d(k),d(M),d(I))};static \u0275cmp=j({type:i,selectors:[["app-ahorcado"]],decls:16,vars:6,consts:[[1,"ahorcado-container"],[1,"contenido"],[1,"dibujo"],[4,"ngFor","ngForOf"],[1,"juego"],[1,"palabra"],[1,"teclado"],[3,"disabled","click",4,"ngFor","ngForOf"],[1,"mensaje"],[3,"click",4,"ngIf"],[3,"click","disabled"],[3,"click"]],template:function(t,n){t&1&&(r(0,"div",0)(1,"h2"),s(2,"Ahorcado"),a(),r(3,"div",1)(4,"div",2),p(5,y,2,1,"pre",3),a(),r(6,"div",4)(7,"p",5),s(8),a(),r(9,"div",6),p(10,S,2,2,"button",7),a(),r(11,"p"),s(12),a(),r(13,"p",8),s(14),a(),p(15,T,2,0,"button",9),a()()()),t&2&&(o(5),l("ngForOf",n.dibujoAhorcado),o(3),m(n.obtenerPalabraMostrada()),o(2),l("ngForOf",n.letras),o(2),v("Intentos restantes: ",n.maxIntentos-n.letrasIncorrectas.length,""),o(2),m(n.mensaje),o(),l("ngIf",n.juegoTerminado))},dependencies:[O,C,P],styles:["[_nghost-%COMP%]{display:flex;flex-direction:column;height:94vh;font-family:Segoe UI,sans-serif;background:linear-gradient(135deg,#0f2027,#203a43,#2c5364);color:#fff}.ahorcado-container[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;padding:2rem;min-height:93vh;background:linear-gradient(135deg,#0f2027,#203a43,#2c5364);font-family:Segoe UI,sans-serif;color:#fff;box-sizing:border-box}.ahorcado-container[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:2.8rem;margin-bottom:2rem;color:#00c6ff;text-shadow:0 0 10px rgba(0,198,255,.6)}.contenido[_ngcontent-%COMP%]{display:flex;flex-grow:1;flex-wrap:wrap;justify-content:center;align-items:stretch;gap:3rem;width:100%;max-width:1400px;padding:2rem;box-sizing:border-box}.dibujo[_ngcontent-%COMP%]{flex:30%;background:#aaa;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border-radius:1rem;box-shadow:0 0 20px #00000080;font-family:monospace;color:#000;display:flex;flex-direction:column;justify-content:center;min-height:500px;overflow:auto}.dibujo[_ngcontent-%COMP%]   pre[_ngcontent-%COMP%]{font-size:3rem;line-height:1.2;margin:0;padding:0;white-space:pre}.juego[_ngcontent-%COMP%]{flex:1 1 45%;background:#ffffff14;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border-radius:1rem;padding:2rem;box-shadow:0 0 25px #0006;display:flex;flex-direction:column;min-height:500px;gap:1rem;box-sizing:border-box}.palabra[_ngcontent-%COMP%]{padding:90px;font-size:3rem;text-align:center;letter-spacing:.8rem;color:#fff;margin-bottom:1rem}.teclado[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(auto-fill,minmax(5rem,1fr));gap:.7rem}.teclado[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{background:#00c6ff;border:none;border-radius:.4rem;padding:.7rem;font-weight:700;color:#000;cursor:pointer;transition:background .3s ease,transform .2s ease}.teclado[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover:not(:disabled){background:#fead;color:#fff;transform:scale(1.05)}.teclado[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:disabled{background:#fff3;color:#aaa;cursor:not-allowed}.juego[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:0;text-align:center}.mensaje[_ngcontent-%COMP%]{font-size:1.3rem;font-weight:700;text-align:center;color:#00ffae}.juego[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{align-self:center;background:#00ffae;color:#000;padding:.6rem 1.4rem;border-radius:.6rem;border:none;font-weight:700;cursor:pointer;transition:background .3s ease,transform .2s ease}.juego[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover{background:#00c68a;transform:scale(1.05)}"]})};export{w as AhorcadoComponent};
