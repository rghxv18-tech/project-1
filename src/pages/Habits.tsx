import {useState,type FormEvent} from 'react'
import {Plus,Pencil,Trash2,Pause,Play,Check} from 'lucide-react'
import type {P} from '../App'
import type {Habit} from '../types'
import {DAYS,addD,ds,hdone,rate,sched,streak,toggleHabit,uid} from '../lib'
import {Confirm,Empty,Modal} from '../ui'
const ICONS=['📚','🏋️','📖','💧','🌙','📝','📵','🚶','💊','✅']
const SLOTS=['morning','afternoon','evening','bedtime']
const blank=(cat:string):Habit=>({id:uid(),name:'',icon:'✅',cat,slot:'morning',days:[0,1,2,3,4,5,6],target:0,unit:'',paused:false,reminder:'',note:'',done:{}})
function Form({h,cats,onSave,onClose}:{h:Habit;cats:string[];onSave:(h:Habit)=>void;onClose:()=>void}){
 const [f,setF]=useState(h),[err,setErr]=useState('')
 const set=<K extends keyof Habit>(k:K,v:Habit[K])=>setF(p=>({...p,[k]:v}))
 const submit=(e:FormEvent)=>{e.preventDefault();if(!f.name.trim())return setErr('Name is required');if(!f.days.length)return setErr('Pick at least one day');onSave({...f,name:f.name.trim()})}
 return <Modal onClose={onClose}><form onSubmit={submit}><h3>Habit</h3>
  <label htmlFor="hn">Name</label><input id="hn" required maxLength={60} value={f.name} onChange={e=>set('name',e.target.value)} autoFocus/>
  <div className="g" style={{margin:0}}>
   <div><label>Icon</label><select value={f.icon} onChange={e=>set('icon',e.target.value)}>{ICONS.map(i=><option key={i}>{i}</option>)}</select></div>
   <div><label>Category</label><select value={f.cat} onChange={e=>set('cat',e.target.value)}>{[...new Set([...cats,f.cat])].map(c=><option key={c}>{c}</option>)}</select></div>
   <div><label>Routine</label><select value={f.slot} onChange={e=>set('slot',e.target.value)}>{SLOTS.map(c=><option key={c}>{c}</option>)}</select></div>
   <div><label>Reminder time</label><input type="time" value={f.reminder} onChange={e=>set('reminder',e.target.value)}/></div>
   <div><label>Target (optional)</label><input type="number" min={0} max={9999} value={f.target||''} onChange={e=>set('target',Math.max(0,+e.target.value||0))}/></div>
   <div><label>Unit</label><input maxLength={12} placeholder="min" value={f.unit} onChange={e=>set('unit',e.target.value)}/></div></div>
  <label>Days</label><div className="row">{DAYS.map((n,i)=><label key={n} style={{margin:0,color:'var(--tx)'}}><input type="checkbox" checked={f.days.includes(i)} onChange={()=>set('days',f.days.includes(i)?f.days.filter(x=>x!==i):[...f.days,i])}/> {n}</label>)}</div>
  <label>Notes (e.g. instructions from your healthcare professional)</label><input maxLength={160} value={f.note} onChange={e=>set('note',e.target.value)}/>
  {err&&<p role="alert" style={{color:'var(--dn)'}}>{err}</p>}
  <div className="row" style={{marginTop:16}}><button className="pr">Save</button><button type="button" onClick={onClose}>Cancel</button></div></form></Modal>}
export function Habits({d,up}:P){
 const [edit,setEdit]=useState<Habit|null>(null),[del,setDel]=useState<string|null>(null),t=ds()
 const row=(h:Habit)=>{const done=hdone(h,t),r=rate(h)
  return <div key={h.id} style={{padding:'10px 0',borderBottom:'1px solid var(--bd)',opacity:h.paused?.55:1}}>
   <div className="it" style={{border:0,padding:0}}>
    {h.target?<input type="number" min={0} max={9999} style={{width:64}} aria-label={`${h.name} progress`} value={h.done[t]||''} placeholder="0" onChange={e=>up(x=>{const v=Math.max(0,+e.target.value||0),y=x.habits.find(z=>z.id===h.id)!;if(v)y.done[t]=v;else delete y.done[t]})}/>
    :<button className={'ck '+(done?'d':'')} aria-pressed={done} aria-label={`Toggle ${h.name}`} onClick={()=>up(x=>toggleHabit(x,h.id))}>{done&&<Check size={14}/>}</button>}
    <div className="sp">{h.icon} {h.name} {h.example&&<span className="tag">example</span>}
     <div className="mu">{h.cat}{h.target?` · target ${h.target} ${h.unit}`:''} · {h.days.length===7?'daily':h.days.map(i=>DAYS[i]).join(' ')}{h.reminder&&` · ⏰${h.reminder}`} · streak {streak(h)} · week {r===null?'—':Math.round(r*100)+'%'}{sched(h,t)?'':' · off today'}</div>
     {h.note&&<div className="mu">Note: {h.note}</div>}</div>
    <button className="ic" aria-label={h.paused?'Resume':'Pause'} onClick={()=>up(x=>{const y=x.habits.find(z=>z.id===h.id)!;y.paused=!y.paused})}>{h.paused?<Play size={16}/>:<Pause size={16}/>}</button>
    <button className="ic" aria-label="Edit" onClick={()=>setEdit(h)}><Pencil size={16}/></button>
    <button className="ic dg" aria-label="Delete" onClick={()=>setDel(h.id)}><Trash2 size={16}/></button></div>
   <div className="cal">{[...Array(28)].map((_,i)=>{const x=addD(t,i-27);return <i key={x} title={x} className={hdone(h,x)?'on':''}/>})}</div></div>}
 return <>
  <div className="row"><h2 className="sp">My Habits</h2><button className="pr" onClick={()=>setEdit(blank(d.settings.cats[0]))}><Plus size={16}/> New habit</button></div>
  <p className="mu">Examples are editable and removable. Missed a day? Streaks simply restart; no shame.</p>
  <div className="c"><b>Medication:</b> <span className="mu">entries are your own reminders from your healthcare professional's instructions. This is a reminder tool, not a medical device. Never change, stop or double a dose based on this app.</span></div>
  {SLOTS.map(s=>{const l=d.habits.filter(h=>h.slot===s);return l.length?<div key={s}><h3 style={{textTransform:'capitalize',marginTop:16}}>{s}</h3><div className="c">{l.map(row)}</div></div>:null})}
  {!d.habits.length&&<Empty>No habits yet. Create one to begin.</Empty>}
  {edit&&<Form h={edit} cats={d.settings.cats} onClose={()=>setEdit(null)} onSave={h=>{up(x=>{const i=x.habits.findIndex(z=>z.id===h.id);if(i>=0)x.habits[i]=h;else x.habits.push(h)});setEdit(null)}}/>}
  {del&&<Confirm msg="Delete this habit and its history?" onClose={()=>setDel(null)} onYes={()=>up(x=>{x.habits=x.habits.filter(h=>h.id!==del);x.mvd=x.mvd.filter(i=>i!==del)})}/>}</>}
