"use client"
import {useState,useEffect,useRef} from "react"
import dynamic from "next/dynamic"
import {Swiper,SwiperSlide} from "swiper/react"
import "swiper/css"
import "react-pdf/dist/Page/TextLayer.css"
import "react-pdf/dist/Page/AnnotationLayer.css"
import {ChevronLeft,ChevronRight} from "lucide-react"

const Document=dynamic(()=>import("react-pdf").then(m=>m.Document),{ssr:false})
const Page=dynamic(()=>import("react-pdf").then(m=>m.Page),{ssr:false})

export default function PdfSelector(){
  const[f,sf]=useState<File|null>(null)
  const[p,sp]=useState(0)
  const[e,se]=useState<number[]>([])
  const swiperRef=useRef<any>(null)

  useEffect(()=>{
    import("react-pdf").then(m=>{
      m.pdfjs.GlobalWorkerOptions.workerSrc=`//unpkg.com/pdfjs-dist@${m.pdfjs.version}/build/pdf.worker.min.mjs`
    })
  },[])

  const onFile=(x:any)=>sf(x.target.files[0])
  const onLoad=({numPages}:any)=>sp(numPages)
  const toggle=(n:number)=>se(a=>a.includes(n)?a.filter(x=>x!==n):[...a,n])
  const submit=async()=>{
    const fd=new FormData()
    fd.append("pdf",f!)
    fd.append("exclude",JSON.stringify(e))
    await fetch("/api/process",{method:"POST",body:fd})
  }

  return(
    <div style={{padding:20,position:"relative"}}>
      <input type="file" accept="application/pdf" onChange={onFile}/>
      {f&&
        <Document file={f} onLoadSuccess={onLoad}>
          <div style={{position:"relative",width:"100%",display:"flex",justifyContent:"center"}}>
            <button
              onClick={()=>swiperRef.current?.slidePrev()}
              style={{position:"absolute",left:0,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",padding:10,zIndex:20}}
            >
              <ChevronLeft size={32}/>
            </button>
            <button
              onClick={()=>swiperRef.current?.slideNext()}
              style={{position:"absolute",right:0,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",padding:10,zIndex:20}}
            >
              <ChevronRight size={32}/>
            </button>
            <Swiper spaceBetween={20} slidesPerView={1} onSwiper={i=>swiperRef.current=i}>
              {Array.from({length:p},(_,i)=>i+1).map(n=>
                <SwiperSlide key={n}>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                    <Page pageNumber={n} width={600} renderTextLayer renderAnnotationLayer/>
                    <label style={{display:"flex",alignItems:"center",marginTop:10,fontSize:14}}>
                      <input
                        type="checkbox"
                        checked={e.includes(n)}
                        onChange={()=>toggle(n)}
                        style={{marginRight:6}}
                      />
                      Exclude Page {n}
                    </label>
                  </div>
                </SwiperSlide>
              )}
            </Swiper>
          </div>
        </Document>
      }
      {f&&<button onClick={submit} style={{marginTop:20,padding:"8px 16px"}}>Continue</button>}
    </div>
  )
}
