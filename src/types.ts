export type Habit={id:string;name:string;icon:string;cat:string;slot:string;days:number[];target:number;unit:string;paused:boolean;reminder:string;note:string;done:Record<string,number>;example?:boolean}
export type Task={id:string;title:string;desc:string;pri:'low'|'medium'|'high';due:string;cat:string;est:number;created:number;doneAt:number|null;example?:boolean}
export type Session={id:string;date:string;mins:number;title:string}
export type Settings={name:string;goal:number;focus:number;short:number;long:number;theme:'dark'|'light';ws:number;cats:string[]}
export type Data={v:1;settings:Settings;habits:Habit[];tasks:Task[];sessions:Session[];log:{date:string;time:string;text:string}[];refl:{date:string;w:string;d:string;n:string}[];mvd:string[];top:Record<string,string[]>}
