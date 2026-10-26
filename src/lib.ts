import type {Habit,Data} from './types'
export const uid=()=>Math.random().toString(36).slice(2,10)
export const ds=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
export const addD=(s:string,n:number)=>{const d=new Date(s+'T12:00:00');d.setDate(d.getDate()+n);return ds(d)}
export const dow=(s:string)=>new Date(s+'T12:00:00').getDay()
export const DAYS=['Su','Mo','Tu','We','Th','Fr','Sa']
export const fmt=(ms:number)=>{const s=Math.ceil(Math.max(0,ms)/1000);return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`}
export const sched=(h:Habit,d:string)=>!h.paused&&h.days.includes(dow(d))
export const hdone=(h:Habit,d:string)=>(h.done[d]||0)>=(h.target||1)
export function streak(h:Habit){let n=0,d=ds();for(let i=0;i<400;i++,d=addD(d,-1)){if(!h.days.includes(dow(d)))continue;if(hdone(h,d))n++;else if(i>0)break}return n}
export function rate(h:Habit,days=7){let s=0,c=0,d=ds();for(let i=0;i<days;i++,d=addD(d,-1))if(h.days.includes(dow(d))){s++;if(hdone(h,d))c++}return s?c/s:null}
export const mins=(x:Data,d:string)=>x.sessions.filter(s=>s.date===d).reduce((a,s)=>a+s.mins,0)
export const tasksDone=(x:Data,d:string)=>x.tasks.filter(t=>t.doneAt&&ds(new Date(t.doneAt))===d).length
export function toggleHabit(x:Data,id:string,d=ds()){const h=x.habits.find(h=>h.id===id);if(!h)return;if(hdone(h,d))delete h.done[d];else h.done[d]=h.target||1}
export function dayStats(x:Data,d=ds()){
 const hs=x.habits.filter(h=>sched(h,d)),hd=hs.filter(h=>hdone(h,d)).length
 const ts=x.tasks.filter(t=>(t.due===d||(x.top[d]||[]).includes(t.id))&&(!t.doneAt||ds(new Date(t.doneAt))===d)),td=ts.filter(t=>t.doneAt).length
 const pl=hs.length+ts.length,dn=hd+td
 return{hs,hd,ts,td,pl,dn,score:pl?Math.round(dn/pl*100):null}}
export function dayStreak(x:Data){let n=0,d=ds();for(let i=0;i<400;i++,d=addD(d,-1)){const a=x.habits.some(h=>h.done[d])||tasksDone(x,d)>0||mins(x,d)>0;if(a)n++;else if(i>0)break}return n}
