import {useEffect,useState} from 'react'
import {Zap,ArrowRight,Check} from 'lucide-react'
import type {P} from '../App'
import {ds,fmt,hdone,toggleHabit} from '../lib'
import {Empty} from '../ui'
export function Start({d,up,go}:P){
 const [ph,setPh]=useState<'idle'|'run'|'go'|'refl'>('idle'),[end,setEnd]=useState(0),[now,setNow]=useState(Date.now())
 const [task,setTask]=useState(''),[free,setFree]=useState(''),[dl,setDl]=useState(''),[r,setR]=useState({w:'',d:'',n:''}),t=ds()
 useEffect(()=>{if(ph!=='run')return;const i=setInterval(()=>setNow(Date.now()),250);return()=>clearInterval(i)},[ph])
 useEffect(()=>{if(ph==='run'&&now>=end)setPh('go')},[now,end,ph])
 const cur=d.tasks.find(x=>x.id===task)
 if(ph==='run'||ph==='go')return <div className="focus c"><p className="mu">Just this one thing:</p><h2>{cur?.title||free}</h2><div className="timer">{fmt(ph==='run'?end-now:0)}</div>
  {ph==='go'?<div className="row" style={{justifyContent:'center'}}><button className="pr" onClick={()=>{sessionStorage.setItem('focusTask',task);go('focus')}}><ArrowRight size={16}/> Keep going in Focus Room</button><button onClick={()=>setPh('refl')}>I'm done for now</button></div>:<button onClick={()=>setPh('refl')}>Stop gently</button>}</div>
 if(ph==='refl')return <div className="focus c" style={{textAlign:'left'}}><h2>Nice. You started.</h2><form onSubmit={e=>{e.preventDefault();up(x=>{x.refl.push({date:t,...r})});setPh('idle')}}>
  {([['w','What worked?'],['d','What distracted me?'],['n',"What's next?"]] as const).map(([k,n])=><div key={k}><label>{n}</label><input maxLength={200} value={r[k]} onChange={e=>setR({...r,[k]:e.target.value})}/></div>)}
  <div className="row" style={{marginTop:14}}><button className="pr">Save reflection</button><button type="button" onClick={()=>setPh('idle')}>Skip</button></div></form></div>
 const log=d.log.filter(x=>x.date===t)
 return <><h2>JUST START</h2><p className="mu">Feeling lazy or overwhelmed? You only need two minutes.</p>
  <div className="c"><label htmlFor="jk">Pick a task</label><select id="jk" value={task} onChange={e=>setTask(e.target.value)}><option value="">—</option>{d.tasks.filter(x=>!x.doneAt).map(x=><option key={x.id} value={x.id}>{x.title}</option>)}</select>
   <label htmlFor="jf">What is the smallest useful action you can take right now?</label><input id="jf" maxLength={120} value={free} onChange={e=>setFree(e.target.value)}/><br/><br/>
   <button className="pr" onClick={()=>{if(!task&&!free.trim())return alert('Pick a task or type a tiny step');setNow(Date.now());setEnd(Date.now()+12e4);setPh('run')}}><Zap size={16}/> Start with 2 Minutes</button></div>
  <div className="g">
   <div className="c"><h3>Distraction log</h3><form className="row" onSubmit={e=>{e.preventDefault();const v=dl.trim();if(!v)return;up(x=>{x.log.push({date:t,time:new Date().toTimeString().slice(0,5),text:v})});setDl('')}}><input style={{flex:1}} aria-label="Distraction" placeholder="What interrupted me?" maxLength={120} value={dl} onChange={e=>setDl(e.target.value)}/><button>Log</button></form>
    {log.length?log.map((x,i)=><div className="it" key={i}><span className="sp">{x.text}</span><span className="mu">{x.time}</span></div>):<Empty>Nothing logged today.</Empty>}</div>
   <div className="c"><h3>Minimum Viable Day</h3><p className="mu">Choose a few small habits for hard days. Doing just these is a good day.</p>
    {d.habits.filter(h=>!h.paused).map(h=><div className="it" key={h.id}><input type="checkbox" id={'m'+h.id} checked={d.mvd.includes(h.id)} onChange={()=>up(x=>{x.mvd=x.mvd.includes(h.id)?x.mvd.filter(i=>i!==h.id):[...x.mvd,h.id]})}/><label htmlFor={'m'+h.id} className="sp" style={{margin:0,color:'var(--tx)',fontSize:14}}>{h.name}</label>
     {d.mvd.includes(h.id)&&<button className={'ck '+(hdone(h,t)?'d':'')} aria-label={`Done: ${h.name}`} onClick={()=>up(x=>toggleHabit(x,h.id))}><Check size={14}/></button>}</div>)}</div></div></>}
