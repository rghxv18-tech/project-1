import {Bar,BarChart,ResponsiveContainer,Tooltip,XAxis,YAxis} from 'recharts'
import type {P} from '../App'
import {DAYS,addD,dayStats,dow,ds,mins,rate,tasksDone} from '../lib'
import {Empty} from '../ui'
export function Analytics({d}:P){
 const t=ds(),days=[...Array(7)].map((_,i)=>addD(t,i-6)).map(x=>({l:DAYS[dow(x)],m:mins(d,x),t:tasksDone(d,x)}))
 const rt=d.habits.map(h=>({h,r:rate(h,28)})).filter((x):x is {h:typeof x.h;r:number}=>x.r!==null).sort((a,b)=>b.r-a.r)
 const wm=days.reduce((a,x)=>a+x.m,0),wt=days.reduce((a,x)=>a+x.t,0),low=rt.filter(x=>x.r<.5).slice(-2)
 const chart=(k:'m'|'t',u:string)=><ResponsiveContainer width="100%" height={170}><BarChart data={days}><XAxis dataKey="l" stroke="#8b9299" fontSize={12}/><YAxis allowDecimals={false} stroke="#8b9299" fontSize={12} width={30}/><Tooltip formatter={(v:number)=>`${v} ${u}`} contentStyle={{background:'#151719',border:'1px solid #2a2e33'}}/><Bar dataKey={k} fill="#c6ff3d" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer>
 return <><h2>Analytics</h2><p className="mu">Everything here comes from your saved data.</p>
  <div className="g"><div className="c"><h3>Focus minutes (7 days)</h3>{chart('m','min')}</div><div className="c"><h3>Tasks completed (7 days)</h3>{chart('t','tasks')}</div></div>
  <div className="c"><h3>Habit consistency (12 weeks)</h3><div className="hm">{[...Array(84)].map((_,i)=>{const x=addD(t,i-83),s=dayStats(d,x),v=s.hs.length?s.hd/s.hs.length:0;return <i key={x} title={`${x}: ${s.hs.length?Math.round(v*100)+'%':'no habits'}`} style={v?{background:'var(--ac)',opacity:.25+v*.75}:{}}/>})}</div></div>
  <div className="g"><div className="c"><h3>Most consistent habits (28 days)</h3>{rt.length?rt.slice(0,5).map(x=><div className="it" key={x.h.id}><span className="sp">{x.h.name}</span><b>{Math.round(x.r*100)}%</b></div>):<Empty>No scheduled habits yet.</Empty>}</div>
   <div className="c"><h3>Weekly review</h3><p>✓ {wt} task{wt===1?'':'s'} completed, {wm} focus minutes in the last 7 days.</p>{rt[0]?.r>0&&<p>✓ Strongest habit: {rt[0].h.name}.</p>}{low.length>0&&<p className="mu">Room to grow (no pressure): {low.map(x=>x.h.name).join(', ')}. Consider making {low.length>1?'them':'it'} smaller.</p>}</div></div>
  <div className="c"><h3>Recent focus sessions</h3>{d.sessions.length?d.sessions.slice(-8).reverse().map(s=><div className="it" key={s.id}><span className="sp">{s.date} · {s.title||'No task'}</span><b>{s.mins}m</b></div>):<Empty>No sessions yet. Start one in the Focus Room.</Empty>}</div></>}
