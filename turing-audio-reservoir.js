/*
 * Turing Audio Reservoir — browser implementation derived from today's
 * Turing Reservoir experiments.
 *
 * Fixed 96x96 Gray–Scott dynamics. No learned weights.
 * Audio bands are encoded as spatial perturbations; the evolving U/V field
 * carries short temporal history. The visualizer reads only compact state
 * statistics from this hidden reservoir.
 */
(function(global){
  'use strict';

  class TuringAudioReservoir {
    constructor(opts={}){
      this.n = opts.n || 96;
      this.du = opts.du ?? 0.16;
      this.dv = opts.dv ?? 0.08;
      this.feed = opts.feed ?? 0.060;
      this.kill = opts.kill ?? 0.062;
      this.dt = opts.dt ?? 1.0;
      this.radius = opts.injectRadius ?? 2;
      this.injectV = opts.injectV ?? 0.13;
      this.injectU = opts.injectU ?? 0.065;
      this.seed = (opts.seed ?? 41071) >>> 0;
      this.len = this.n * this.n;
      this.u = new Float32Array(this.len);
      this.v = new Float32Array(this.len);
      this.u2 = new Float32Array(this.len);
      this.v2 = new Float32Array(this.len);
      this.prevV = new Float32Array(this.len);
      this._rngState = this.seed || 1;
      this.channels = this._buildBalancedPoints(['low','mid','high','onset']);
      this.norm = {};
      for (const k of ['low','mid','high','onset','motion','meanV','stdV']) {
        this.norm[k] = {mean:0, var:1e-4, ready:false};
      }
      this.reset();
    }

    _rand(){
      // xorshift32: deterministic; only for tiny initial perturbation.
      let x = this._rngState >>> 0;
      x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
      this._rngState = x >>> 0;
      return (this._rngState >>> 0) / 4294967296;
    }

    reset(){
      this._rngState = this.seed || 1;
      for(let i=0;i<this.len;i++){
        const noise = (this._rand() + this._rand() + this._rand() - 1.5) * 0.0022;
        this.u[i] = Math.min(1, Math.max(0, 1 + noise));
        this.v[i] = Math.min(1, Math.max(0, -noise));
        this.prevV[i] = this.v[i];
      }
      for (const k of Object.keys(this.norm)) {
        this.norm[k] = {mean:0, var:1e-4, ready:false};
      }
    }

    _buildBalancedPoints(names){
      // Same geometry idea as the balanced encoder from Turing Reservoir P0.1.5:
      // one non-overlapping point per quadrant for every symbol/channel.
      const params = [[1,0],[5,7],[9,13],[13,29]];
      const bases = [[0,0],[0,48],[48,0],[48,48]];
      const out = {};
      names.forEach((name,j)=>{
        const pts=[];
        for(let q=0;q<4;q++){
          const [a,b]=params[q], [bx,by]=bases[q];
          const idx=(a*j+b)%64;
          const row=Math.floor(idx/8), col=idx%8;
          pts.push([bx+3+6*row, by+3+6*col]);
        }
        out[name]=pts;
      });
      return out;
    }

    inject(channel, value){
      const pts = this.channels[channel];
      if(!pts) return;
      // compress very loud material but keep quiet passages alive
      const amp = Math.max(0, Math.min(1, Math.sqrt(Math.max(0,value))));
      if(amp < 0.006) return;
      const r=this.radius, rr=Math.max(1,r*r);
      for(const [cx,cy] of pts){
        for(let oy=-r;oy<=r;oy++){
          const yy=(cy+oy+this.n)%this.n;
          for(let ox=-r;ox<=r;ox++){
            const d2=ox*ox+oy*oy;
            if(d2>rr) continue;
            const xx=(cx+ox+this.n)%this.n;
            const w=Math.exp(-d2/rr)*0.86*amp;
            const i=yy*this.n+xx;
            this.v[i]=Math.min(1.2,this.v[i]+this.injectV*w);
            this.u[i]=Math.max(0,this.u[i]-this.injectU*w);
          }
        }
      }
    }

    evolve(steps=4){
      const n=this.n, len=this.len;
      const duC=this.du, dvC=this.dv, f=this.feed, k=this.kill, dt=this.dt;
      for(let s=0;s<steps;s++){
        const u=this.u, v=this.v, u2=this.u2, v2=this.v2;
        for(let y=0;y<n;y++){
          const ym=(y+n-1)%n, yp=(y+1)%n;
          const row=y*n, rowm=ym*n, rowp=yp*n;
          for(let x=0;x<n;x++){
            const xm=(x+n-1)%n, xp=(x+1)%n;
            const i=row+x;
            const uc=u[i], vc=v[i];
            // 9-point Laplacian used in the Turing Reservoir research code.
            const lu = -uc
              + 0.20*(u[row+xm]+u[row+xp]+u[rowm+x]+u[rowp+x])
              + 0.05*(u[rowm+xm]+u[rowm+xp]+u[rowp+xm]+u[rowp+xp]);
            const lv = -vc
              + 0.20*(v[row+xm]+v[row+xp]+v[rowm+x]+v[rowp+x])
              + 0.05*(v[rowm+xm]+v[rowm+xp]+v[rowp+xm]+v[rowp+xp]);
            const uvv=uc*vc*vc;
            let un=uc+(duC*lu-uvv+f*(1-uc))*dt;
            let vn=vc+(dvC*lv+uvv-(f+k)*vc)*dt;
            if(un<0)un=0; else if(un>1.2)un=1.2;
            if(vn<0)vn=0; else if(vn>1.2)vn=1.2;
            u2[i]=un; v2[i]=vn;
          }
        }
        this.u=u2; this.u2=u;
        this.v=v2; this.v2=v;
      }
    }

    _channelRead(name){
      const pts=this.channels[name];
      let sum=0, count=0;
      for(const [cx,cy] of pts){
        for(let oy=-2;oy<=2;oy++){
          const yy=(cy+oy+this.n)%this.n;
          for(let ox=-2;ox<=2;ox++){
            const xx=(cx+ox+this.n)%this.n;
            sum += this.v[yy*this.n+xx]; count++;
          }
        }
      }
      return count?sum/count:0;
    }

    _adapt(key, value){
      const n=this.norm[key];
      if(!n.ready){ n.mean=value; n.var=1e-4; n.ready=true; return 0.5; }
      const d=value-n.mean;
      // Slow baseline, quicker variance. We want history, not frame jitter.
      n.mean += d*0.008;
      n.var += ((d*d)-n.var)*0.018;
      const z=(value-n.mean)/Math.sqrt(Math.max(1e-6,n.var));
      return 0.5 + 0.46*Math.tanh(z*0.42);
    }

    read(){
      const v=this.v, n=this.n, len=this.len;
      let sum=0,sum2=0,motion=0,wx=0,wy=0,w=0;
      for(let y=0;y<n;y++){
        const sy=Math.sin((y/n)*Math.PI*2), cy=Math.cos((y/n)*Math.PI*2);
        for(let x=0;x<n;x++){
          const i=y*n+x, z=v[i];
          sum+=z; sum2+=z*z;
          motion+=Math.abs(z-this.prevV[i]);
          this.prevV[i]=z;
          if(z>0.002){
            const sx=Math.sin((x/n)*Math.PI*2), cx=Math.cos((x/n)*Math.PI*2);
            wx += sx*z; wy += sy*z; w += z;
            // cos values are folded into the phase via a small offset below
            wx += cx*z*0.27; wy += cy*z*0.27;
          }
        }
      }
      const meanV=sum/len;
      const stdV=Math.sqrt(Math.max(0,sum2/len-meanV*meanV));
      const mot=motion/len;
      const raw={
        low:this._channelRead('low'),
        mid:this._channelRead('mid'),
        high:this._channelRead('high'),
        onset:this._channelRead('onset'),
        motion:mot, meanV, stdV
      };
      const out={};
      for(const k of Object.keys(raw)) out[k]=this._adapt(k,raw[k]);
      const phaseX=w>1e-9?wx/w:0, phaseY=w>1e-9?wy/w:0;
      out.x=0.5+0.42*Math.tanh(phaseX*1.8);
      out.y=0.5+0.42*Math.tanh(phaseY*1.8);
      out.raw=raw;
      return out;
    }

    process(frame, steps=4){
      this.inject('low', frame.low||0);
      this.inject('mid', frame.mid||0);
      this.inject('high', frame.high||0);
      this.inject('onset', frame.onset||0);
      this.evolve(steps);
      return this.read();
    }
  }

  global.TuringAudioReservoir=TuringAudioReservoir;
  if(typeof module!=='undefined' && module.exports) module.exports={TuringAudioReservoir};
})(typeof window!=='undefined'?window:globalThis);
