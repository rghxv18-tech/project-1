import {useCallback,useEffect,useState} from 'react'
import {LayoutDashboard,Repeat,ListChecks,Timer,Zap,BarChart3,Settings as Cog} from 'lucide-react'
import type {Data} from './types'
import {storage,seed} from './storage'
import {Dashboard} from './pages/Dashboard'
import {Habits} from './pages/Habits'
import {Tasks} from './pages/Tasks'
import {Focus} from './pages/Focus'
import {Start} from './pages/Start'
import {Analytics} from './pages/Analytics'
import {SettingsPage} from './pages/Settings'
export type P={d:Data;up:(f:(x:Data)=>void)=>void;go:(p:string)=>void;reset:()=>void}
const NAV=[['dashboard',LayoutDashboard,'Dashboard'],['habits',Repeat,'My Habits'],['tasks',ListChecks,'Tasks'],['focus',Timer,'Focus Room'],['start',Zap,'Just Start'],['analytics',BarChart3,'Analytics'],['settings',Cog,'Settings']] as const
const PAGES:Record<string,(p:P)=>JSX.Element>={dashboard:Dashboard,habits:Habits,tasks:Tasks,focus:Focus,start:Start,analytics:Analytics,settings:SettingsPage}
const read=()=>{const p=location.hash.slice(1);return p in PAGES?p:'dashboard'}
export default function App(){
 const [d,setD]=useState<Data>(()=>storage.load()??seed())
 const [page,setPage]=useState(read)
 useEffect(()=>{storage.save(d);document.documentElement.dataset.theme=d.settings.theme},[d])
 useEffect(()=>{const h=()=>setPage(read());addEventListener('hashchange',h);return()=>removeEventListener('hashchange',h)},[])
 const up=useCallback((f:(x:Data)=>void)=>setD(p=>{const n=structuredClone(p);f(n);return n}),[])
 const go=(p:string)=>{location.hash=p}
 const reset=()=>{storage.clear();setD(seed())}
 const Page=PAGES[page]
 return <>
  <nav aria-label="Main"><h1>FOCUS MODE</h1>{NAV.map(([id,I,l])=><button key={id} className={id===page?'on':''} onClick={()=>go(id)} aria-label={l} aria-current={id===page?'page':undefined}><I size={18}/><span>{l}</span></button>)}</nav>
  <main><Page d={d} up={up} go={go} reset={reset}/></main></>}
