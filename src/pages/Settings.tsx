import {useState,type FormEvent} from 'react'
import {Download,Trash2} from 'lucide-react'
import type {P} from '../App'
import type {Settings} from '../types'
import {DAYS} from '../lib'
import {Confirm} from '../ui'
export function SettingsPage({d,up,reset}:P){
 const [f,setF]=useState<Settings>(d.settings),[cats,setCats]=useState(d.settings.cats.join(', ')),[wipe,setWipe]=useState(false),[ok,setOk]=useState(false)
 const num=(k:'goal'|'focus'|'short'|'long',n:string,max:number)=><div><label>{n}</label><input type="number" min={1} max={max} required value={f[k]} onChange={e=>setF({...f,[k]:+e.target.value})}/></div>
 const submit=(e:FormEvent)=>{e.preventDefault();const c=cats.split(',').map(x=>x.trim()).filter(Boolean);up(x=>{x.settings={...f,name:f.name.trim(),cats:c.length?c:['Personal']}});setOk(true);setTimeout(()=>setOk(false),2000)}
 const exp=()=>{const u=URL.createObjectURL(new Blob([JSON.stringify(d,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=u;a.download='focus-mode-export.json';a.click();URL.revokeObjectURL(u)}
 return <><h2>Settings</h2>
  <form className="c" style={{marginTop:14}} onSubmit={submit}><label>Display name</label><input maxLength={40} value={f.name} onChange={e=>setF({...f,name:e.target.value})}/>
   <div className="g" style={{margin:0}}>{num('goal','Daily focus goal (min)',720)}{num('focus','Focus (min)',180)}{num('short','Short break',60)}{num('long','Long break',90)}</div>
   <label>Theme</label><select value={f.theme} onChange={e=>setF({...f,theme:e.target.value as Settings['theme']})}><option value="dark">Dark</option><option value="light">Light</option></select>
   <label>Week starts on</label><select value={f.ws} onChange={e=>setF({...f,ws:+e.target.value})}>{DAYS.map((n,i)=><option key={n} value={i}>{n}</option>)}</select>
   <label>Habit categories (comma separated)</label><input value={cats} onChange={e=>setCats(e.target.value)}/><br/><br/>
   <div className="row"><button className="pr">Save settings</button>{ok&&<span role="status" className="mu">Saved ✓</span>}</div></form>
  <div className="c"><h3>Your data</h3><p className="mu">Stored only in this browser's local storage. It is not encrypted and may be lost if browser data is cleared. Export a backup regularly.</p>
   <div className="row"><button onClick={exp}><Download size={16}/> Export JSON</button><button className="dg" onClick={()=>setWipe(true)}><Trash2 size={16}/> Clear all data</button></div></div>
  {wipe&&<Confirm msg="Permanently delete ALL your data in this browser? This cannot be undone." onClose={()=>setWipe(false)} onYes={reset}/>}</>}
