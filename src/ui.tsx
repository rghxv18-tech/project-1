import {useEffect,type ReactNode} from 'react'
export function Modal({onClose,children}:{onClose:()=>void;children:ReactNode}){
 useEffect(()=>{const k=(e:KeyboardEvent)=>e.key==='Escape'&&onClose();addEventListener('keydown',k);return()=>removeEventListener('keydown',k)},[onClose])
 return <div className="md" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div role="dialog" aria-modal="true">{children}</div></div>}
export const Confirm=({msg,onYes,onClose}:{msg:string;onYes:()=>void;onClose:()=>void})=>
 <Modal onClose={onClose}><p>{msg}</p><div className="row"><button className="pr" autoFocus onClick={()=>{onYes();onClose()}}>Yes</button><button onClick={onClose}>Cancel</button></div></Modal>
export const Empty=({children}:{children:ReactNode})=><div className="empty">{children}</div>
