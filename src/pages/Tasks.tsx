import {useState,type FormEvent} from 'react'
import {Plus,Pencil,Trash2,Check,Star,Timer} from 'lucide-react'
import type {P} from '../App'
import type {Task} from '../types'
import {ds,uid} from '../lib'
import {Confirm,Empty,Modal} from '../ui'
const CATS=['College','Study','Health','Personal','Other']
const blank=():Task=>({id:uid(),title:'',desc:'',pri:'medium',due:ds(),cat:'College',est:0,created:Date.now(),doneAt:null})
function Form({t,onSave,onClose}:{t:Task;onSave:(t:Task)=>void;onClose:()=>void}){
 const [f,setF]=useState(t),set=<K extends keyof Task>(k:K,v:Task[K])=>setF(p=>({...p,[k]:v}))
 const submit=(e:FormEvent)=>{e.preventDefault();if(f.title.trim())onSave({...f,title:f.title.trim()})}
 return <Modal onClose={onClose}><form onSubmit={submit}><h3>Task</h3>
  <label htmlFor="tt">Title</label><input id="tt" required maxLength={120} value={f.title} onChange={e=>set('title',e.target.value)} autoFocus/>
  <label>Description</label><textarea rows={2} maxLength={300} value={f.desc} onChange={e=>set('desc',e.target.value)}/>
  <div className="g" style={{margin:0}}>
   <div><label>Priority</label><select value={f.pri} onChange={e=>set('pri',e.target.value as Task['pri'])}><option>low</option><option>medium</option><option>high</option></select></div>
   <div><label>Category</label><select value={f.cat} onChange={e=>set('cat',e.target.value)}>{CATS.map(c=><option key={c}>{c}</option>)}</select></div>
   <div><label>Due date</label><input type="date" value={f.due} onChange={e=>set('due',e.target.value)}/></div>
   <div><label>Estimate (min)</label><input type="number" min={0} max={1440} value={f.est||''} onChange={e=>set('est',Math.max(0,+e.target.value||0))}/></div></div>
  <div className="row" style={{marginTop:16}}><button className="pr">Save</button><button type="button" onClick={onClose}>Cancel</button></div></form></Modal>}
export function Tasks({d,up,go}:P){
 const [view,setView]=useState('today'),[q,setQ]=useState(''),[sort,setSort]=useState('due'),[edit,setEdit]=useState<Task|null>(null),[del,setDel]=useState<string|null>(null),[cap,setCap]=useState('')
 const t=ds(),top=d.top[t]||[],PR={high:0,medium:1,low:2}
 const l=d.tasks.filter(x=>view==='all'||(view==='done'?x.doneAt:!x.doneAt&&(view==='today'?x.due<=t||top.includes(x.id):x.due>t))).filter(x=>(x.title+x.desc).toLowerCase().includes(q.toLowerCase()))
  .sort((a,b)=>sort==='pri'?PR[a.pri]-PR[b.pri]:sort==='new'?b.created-a.created:(a.due||'9').localeCompare(b.due||'9'))
 return <>
  <div className="row"><h2 className="sp">Tasks</h2><button className="pr" onClick={()=>setEdit(blank())}><Plus size={16}/> New task</button></div>
  <form className="row" style={{margin:'12px 0'}} onSubmit={e=>{e.preventDefault();const v=cap.trim();if(!v)return;up(x=>{x.tasks.push({...blank(),title:v,cat:'Other'})});setCap('')}}>
   <input style={{flex:1}} aria-label="Quick capture" placeholder="Quick capture: type a task and press Enter" maxLength={120} value={cap} onChange={e=>setCap(e.target.value)}/><button className="pr">Add</button></form>
  <div className="c"><h3>Today's top 3</h3>{top.length?top.map(i=>d.tasks.find(x=>x.id===i)).filter((x):x is Task=>!!x).map(x=><div className="it" key={x.id}><Star size={14}/><span className={x.doneAt?'dn':''}>{x.title}</span></div>):<span className="mu">Tap the star on up to three tasks to pick your most important ones.</span>}</div>
  <div className="row" style={{margin:'14px 0'}}><div className="tabs">{[['today','Today'],['upcoming','Upcoming'],['done','Completed'],['all','All']].map(([v,n])=><button key={v} className={view===v?'on':''} onClick={()=>setView(v)}>{n}</button>)}</div>
   <input style={{maxWidth:160}} aria-label="Search" placeholder="Search" value={q} onChange={e=>setQ(e.target.value)}/>
   <select aria-label="Sort" style={{width:'auto'}} value={sort} onChange={e=>setSort(e.target.value)}><option value="due">Due date</option><option value="pri">Priority</option><option value="new">Newest</option></select></div>
  <div className="c">{l.length?l.map(x=><div className="it" key={x.id}>
   <button className={'ck '+(x.doneAt?'d':'')} aria-label={`Complete ${x.title}`} onClick={()=>up(s=>{const y=s.tasks.find(z=>z.id===x.id)!;y.doneAt=y.doneAt?null:Date.now()})}>{x.doneAt&&<Check size={14}/>}</button>
   <div className="sp"><span className={x.doneAt?'dn':''}>{x.title}</span> {x.example&&<span className="tag">example</span>}<div className="mu"><span className="tag">{x.pri}</span> {x.cat}{x.due&&` · ${x.due}`}{x.est?` · ${x.est}m`:''}{x.desc&&<><br/>{x.desc}</>}</div></div>
   <button className="ic" aria-label="Top 3" aria-pressed={top.includes(x.id)} style={top.includes(x.id)?{color:'var(--ac)'}:{}} onClick={()=>up(s=>{const a=s.top[t]=s.top[t]||[];const i=a.indexOf(x.id);if(i>=0)a.splice(i,1);else if(a.length<3)a.push(x.id);else alert('Top 3 is full')})}><Star size={16}/></button>
   <button className="ic" aria-label="Focus on this" onClick={()=>{sessionStorage.setItem('focusTask',x.id);go('focus')}}><Timer size={16}/></button>
   <button className="ic" aria-label="Edit" onClick={()=>setEdit(x)}><Pencil size={16}/></button>
   <button className="ic dg" aria-label="Delete" onClick={()=>setDel(x.id)}><Trash2 size={16}/></button></div>):<Empty>No tasks here.</Empty>}</div>
  {edit&&<Form t={edit} onClose={()=>setEdit(null)} onSave={n=>{up(x=>{const i=x.tasks.findIndex(z=>z.id===n.id);if(i>=0)x.tasks[i]=n;else x.tasks.push(n)});setEdit(null)}}/>}
  {del&&<Confirm msg="Delete this task?" onClose={()=>setDel(null)} onYes={()=>up(x=>{x.tasks=x.tasks.filter(z=>z.id!==del)})}/>}</>}
