import {useEffect,useState} from 'react'
import {Play,Pause,RotateCcw,CheckCircle2} from 'lucide-react'
import type {P} from '../App'
import {ds,fmt,mins,uid} from '../lib'
import {Modal} from '../ui'
type Mode='focus'|'short'|'long'
export function Focus({d,up}:P){
 const [mode,setMode]=useState<Mode>('focus'),total=d.settings[mode]*60000
 const [end,setEnd]=useState<number|null>(null),[rem,setRem]=useState(total),[now,setNow]=useState(Date.now())
 const [task,setTask]=useState(()=>sessionStorage.getItem('focusTask')||''),[doneTask,setDoneTask]=useState<string|null>(null),[fin,setFin]=useState(false)
 const left=end?end-now:rem
 useEffect(()=>{if(!end)return;const tick=()=>setNow(Date.now());const i=setInterval(tick,250);document.addEventListener('visibilitychange',tick);return()=>{clearInterval(i);document.removeEventListener('visibilitychange',tick)}},[end])
 useEffect(()=>{document.title=end?`${fmt(left)} · FOCUS MODE`:'FOCUS MODE';return()=>{document.title='FOCUS MODE'}},[end,left])
 useEffect(()=>{if(!end||left>0)return
  setEnd(null);setRem(total)
  if(mode==='focus'){const tk=d.tasks.find(x=>x.id===task);up(x=>{x.sessions.push({id:uid(),date:ds(),mins:d.settings.focus,title:tk?.title||''})});setDoneTask(tk?tk.id:null);setFin(true)}
 },[left,end])// eslint-disable-line
 const pick=(m:Mode)=>{if(end&&!confirm('Switch mode and reset the timer?'))return;setMode(m);setEnd(null);setRem(d.settings[m]*60000)}
 const tk=d.tasks.find(x=>x.id===doneTask)
 return <div className="focus c">
  <div className="tabs" style={{justifyContent:'center'}}>{([['focus','Focus'],['short','Short break'],['long','Long break']] as const).map(([m,n])=><button key={m} className={mode===m?'on':''} onClick={()=>pick(m)}>{n}</button>)}</div>
  <div className="timer" role="timer">{fmt(left)}</div>
  <label htmlFor="lt">Linked task</label><select id="lt" value={task} onChange={e=>setTask(e.target.value)}><option value="">No task</option>{d.tasks.filter(x=>!x.doneAt).map(x=><option key={x.id} value={x.id}>{x.title}</option>)}</select>
  <div className="row" style={{justifyContent:'center',marginTop:14}}>
   <button className="pr" onClick={()=>{if(end){setRem(left);setEnd(null)}else{setNow(Date.now());setEnd(Date.now()+rem)}}}>{end?<><Pause size={16}/> Pause</>:<><Play size={16}/> {rem<total?'Resume':'Start'}</>}</button>
   <button onClick={()=>{setEnd(null);setRem(total)}}><RotateCcw size={16}/> Reset</button></div>
  <p className="mu">Today: {mins(d,ds())} min focused · {d.sessions.filter(s=>s.date===ds()).length} sessions</p>
  {fin&&<Modal onClose={()=>setFin(false)}><div style={{textAlign:'center'}}><div className="pop" style={{color:'var(--ac)'}}><CheckCircle2 size={56}/></div><h2>Session complete</h2><p className="mu">{d.settings.focus} minutes recorded.</p>
   {tk&&<><p>Mark "{tk.title}" as complete?</p><button className="pr" onClick={()=>{up(x=>{const y=x.tasks.find(z=>z.id===tk.id);if(y)y.doneAt=Date.now()});setFin(false)}}>Yes, done</button> </>}<button onClick={()=>setFin(false)}>Continue</button></div></Modal>}</div>}
