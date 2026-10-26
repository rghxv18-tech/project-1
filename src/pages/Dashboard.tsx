import {Play} from 'lucide-react'
import type {P} from '../App'
import {dayStats,dayStreak,mins,ds} from '../lib'
import {Empty} from '../ui'
const MSG=['Small steps count. Pick one thing and begin.','Rest is part of the plan, not a break from it.','Progress, not perfection.','A short session is still a session.','Be kind to yourself and keep going gently.','Today only needs to be good enough.','Starting is the hardest part, and you can make it tiny.']
export function Dashboard({d,go}:P){
 const s=dayStats(d),t=ds(),m=mins(d,t),g=d.settings.goal,hr=new Date().getHours()
 const up=d.tasks.filter(x=>!x.doneAt&&x.due>=t).sort((a,b)=>a.due.localeCompare(b.due)).slice(0,4)
 return <>
  <h2>Good {hr<12?'morning':hr<18?'afternoon':'evening'}{d.settings.name&&`, ${d.settings.name}`}</h2>
  <p className="mu">{new Date().toLocaleDateString(undefined,{weekday:'long',year:'numeric',month:'long',day:'numeric'})} · {MSG[Math.floor(Date.now()/864e5)%MSG.length]}</p>
  <button className="pr" onClick={()=>go('focus')}><Play size={16}/> START FOCUS SESSION</button>
  <div className="g">
   <div className="c"><div className="mu">Today's progress</div><div className="big">{s.score===null?'—':s.score+'%'}</div><div className="mu">{s.dn} of {s.pl} planned items done. Score = completed ÷ planned (today's tasks + scheduled habits). A snapshot, not a judgment.</div></div>
   <div className="c"><div className="mu">Tasks</div><div className="big">{s.td}/{s.ts.length}</div><div className="mu">{s.ts.length-s.td} remaining today</div></div>
   <div className="c"><div className="mu">Habits</div><div className="big">{s.hs.length?Math.round(s.hd/s.hs.length*100)+'%':'—'}</div><div className="mu">{s.hd}/{s.hs.length} done</div></div>
   <div className="c"><div className="mu">Focus time</div><div className="big">{m}m</div><div className="bar"><i style={{width:Math.min(100,m/g*100)+'%'}}/></div><div className="mu">goal {g}m</div></div>
   <div className="c"><div className="mu">Active-day streak</div><div className="big">{dayStreak(d)}</div><div className="mu">Missed a day? Just restart today.</div></div>
  </div>
  <div className="c"><h3>Upcoming</h3>{up.length?up.map(x=><div className="it" key={x.id}><span className="sp">{x.title}</span><span className="mu">{x.due}</span></div>):<Empty>Nothing upcoming. Use Quick Capture on the Tasks page.</Empty>}</div></>}
