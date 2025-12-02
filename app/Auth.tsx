"use client"
import {useState,useEffect} from "react"

export default function Auth({children}:{children:React.ReactNode}) {
  const[ok,setOk]=useState(false)
  useEffect(()=>{
    const u=prompt("Username")
    const p=prompt("Password")
    if(u==="admin"&&p==="admin") setOk(true)
  },[])
  return ok?children:null
}
