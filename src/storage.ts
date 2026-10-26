import type {Data,Habit} from './types'
import {uid,ds} from './lib'
const K='focusmode.v1'
// Single persistence boundary: replace with an API/DB later.
export const storage={
 load():Data|null{try{const r=JSON.parse(localStorage.getItem(K)||'null');return r&&r.v===1?r:null}catch{return null}},
 save(d:Data){try{localStorage.setItem(K,JSON.stringify(d))}catch{alert('Could not save: browser storage is unavailable or full.')}},
 clear(){try{localStorage.removeItem(K)}catch{/* ignore */}}}
const H=(name:string,icon:string,cat:string,slot:string,o:Partial<Habit>={}):Habit=>({id:uid(),name,icon,cat,slot,days:[0,1,2,3,4,5,6],target:0,unit:'',paused:false,reminder:'',note:'',done:{},example:true,...o})
export const seed=():Data=>({v:1,settings:{name:'',goal:90,focus:25,short:5,long:15,theme:'dark',ws:1,cats:['Health','Study','Personal','Routine']},
 habits:[H('Study / attend lectures','📚','Study','morning',{target:45,unit:'min'}),H('Exercise','🏋️','Health','afternoon',{target:20,unit:'min'}),H('Read a book','📖','Personal','evening',{target:15,unit:'min'}),H('Drink water','💧','Health','morning',{target:6,unit:'glasses'}),H('Revise college notes','📝','Study','afternoon'),H('Plan tomorrow','📝','Routine','evening'),H('Sleep on time','🌙','Routine','bedtime'),H('Less social media','📵','Personal','afternoon'),H('Medication (add your own instructions)','💊','Health','morning',{paused:true})],
 tasks:[{id:uid(),title:'Example: review one lecture',desc:'Edit or delete me',pri:'medium',due:ds(),cat:'College',est:30,created:Date.now(),doneAt:null,example:true}],
 sessions:[],log:[],refl:[],mvd:[],top:{}})
