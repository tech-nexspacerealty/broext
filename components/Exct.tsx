"use client"
import {useState,useEffect,useRef} from "react"
import dynamic from "next/dynamic"
import {Swiper,SwiperSlide} from "swiper/react"
import "swiper/css"
import "react-pdf/dist/Page/TextLayer.css"
import "react-pdf/dist/Page/AnnotationLayer.css"
import {Upload,FileText,Download,Loader2,CheckCircle,AlertCircle,ChevronLeft,ChevronRight,X} from "lucide-react"
import {PDFDocument} from "pdf-lib"
import { dummydata, dummyData2, dummyData3, dummyData4 } from "./data"
import { unitData1 } from "./units"
import { toast } from 'react-toastify'

const Document=dynamic(()=>import("react-pdf").then(m=>m.Document),{ssr:false})
const Page=dynamic(()=>import("react-pdf").then(m=>m.Page),{ssr:false})

const extSteps = {
  details: "details",
  sub: "sub",
}

const ANTHROPIC_API_KEY = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || "";

const baseUrl = process.env.NEXT_PUBLIC_API_URL + "nexspace.nexspace.frontend_api.brochure.project.";

const callMethods = {
  details: baseUrl + 'create_ns_project',
  subDetails: baseUrl + 'create_ns_project_subdeatils',
}

export default function RealEstateExtractor(){
  const[f,sf]=useState<File|null>(null)
  const[l,sl]=useState(false)
  const[d,sd]=useState<any>(null)
  const[subd,ssubd]=useState<any>(null)
  const[e,se]=useState<string|null>(null)
  const[p,sp]=useState(0)
  const[ex,sex]=useState<number[]>([])
  const[step,setStep]=useState<"upload"|"select"|"result">("upload")
  const swiperRef=useRef<any>(null)

  const [ upLoading, setupLoading ] = useState(false);

  useEffect(()=>{
    import("react-pdf").then(m=>{
      m.pdfjs.GlobalWorkerOptions.workerSrc=`//unpkg.com/pdfjs-dist@${m.pdfjs.version}/build/pdf.worker.min.mjs`
    })
  },[])

  const onF=(x:any)=>{
    const v=x.target.files[0]
    if(v&&v.type==="application/pdf"){
      sf(v);se(null);sd(null);ssubd(null);sex([]);setStep("select")
    }else se("Please select a valid PDF file")
  }

  const onLoad=({numPages}:any)=>sp(numPages)
  const toggle=(n:number)=>sex(a=>a.includes(n)?a.filter(x=>x!==n):[...a,n])

  const createFilteredPdf=async():Promise<string>=>{
    const arrBuf=await f!.arrayBuffer()
    const srcDoc=await PDFDocument.load(arrBuf)
    const newDoc=await PDFDocument.create()
    const pages=srcDoc.getPages()
    for(let i=0;i<pages.length;i++){
      if(!ex.includes(i+1)){
        const[cp]=await newDoc.copyPages(srcDoc,[i])
        newDoc.addPage(cp)
      }
    }
    const bytes=await newDoc.saveAsBase64()
    return bytes
  }

  const extract=async(step: string)=>{
    if(!f)return
    sl(true);se(null);setStep("result")
    try{
      const b=await createFilteredPdf()
      const fx=async(n=0):Promise<any>=>{
        try{
          const res=await fetch("/api/extract",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({base64Data:b, step, ANTHROPIC_API_KEY})
          })
          if(!res.ok){
            const err=await res.json()
            throw new Error(err.error||`HTTP error! status: ${res.status}`)
          }
          return await res.json()
        }catch(e){
          if(n>=3)throw e
          await new Promise(s=>setTimeout(s,500*2**n))
          return fx(n+1)
        }
      }
      const j=await fx()
      // const j={error:null,content:[{type:"text",text: step === extSteps.details ? dummyData4 : unitData1}]}
      if(j.error)throw new Error(j.error)
      const t=j.content.filter((x:any)=>x.type==="text").map((x:any)=>x.text).join("\n").replace(/```json|```/g,"").trim()
      return JSON.parse(t)
    }catch(x:any){
      toast.error(x?.message||'Something went wrong. Please try again.');
      se(x.message||"An error occurred while extracting data")
    }finally{
      sl(false)
    }
  }

  const onUploadInfo=async(data:any)=>{
    try{
      if(!data)return
      const r=await fetch(callMethods.details,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({payload:data})
      })
      if(!r.ok)throw new Error('REQUEST_FAILED')
      const j=await r.json()
    
      if(j.exc||j._server_messages)throw new Error('SERVER_ERROR')
      return j
    }catch(e:any){
      toast.error(e.message||'Something went wrong. Please try again.');
      return{error:e.message||'UNKNOWN_ERROR'}
    }
  }

  const onUploadSubInfo = async (data: any, proj: string) => {
    try{
      if(!data)return
      const r=await fetch(callMethods.subDetails,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({payload:{...data, proj}})
      })
      if(!r.ok)throw new Error('REQUEST_FAILED')
      const j=await r.json()

      if(j.exc||j._server_messages)throw new Error('SERVER_ERROR')
      return j
    }catch(e:any){
      toast.error(e?.message||'Something went wrong. Please try again.');
      return{error:e?.message||'UNKNOWN_ERROR'}
    }
  }

  const callExtract = async () => {
    try {
      const dt = await extract(extSteps.details);
      if(dt && !dt.error) {
        sd(dt)
        toast.success("Detail page info extracted.");
        const sdt = await extract(extSteps.sub);
        if(sdt && !sdt.error) {
          ssubd(sdt);
          toast.success("Sub Detail page info extracted.");
        }
      }
    } catch(e: any) {
      toast.error(e?.message||'Something went wrong. Please try again.');
      return{error:e.message||'UNKNOWN_ERROR'}
    }
  }

  const callUpload = async (d: any) => {
    try {
      if(!d) return;
      setupLoading(true);
      const dt = await onUploadInfo(d);
      toast.success("Detail page info uploaded.");      

      if(dt && !dt.error) {
        const proj = dt?.message?.name || "";
        const sdt = await onUploadSubInfo(subd, proj);
        if(sdt && !sdt.error) toast.success("Sub Detail page info extracted.");
      }
    } catch(e: any) {
      toast.error(e?.message||'Something went wrong. Please try again.');
      return{error:e.message||'UNKNOWN_ERROR'}
    } finally {
      setupLoading(false);
    }
  }

  const reset=()=>{sf(null);sp(0);sex([]);sd(null);ssubd(null);se(null);setStep("upload")}
  const includedPages=p-ex.length

  return(
<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-400"/>
              <h1 className="text-3xl font-bold">Real Estate Brochure Extractor</h1>
            </div>
            {f&&<button onClick={reset} className="text-gray-400 hover:text-white flex items-center gap-1 text-sm"><X className="w-4 h-4"/>Reset</button>}
          </div>

          {step==="upload"&&(
            <>
              <div className="border-2 border-dashed border-gray-600 rounded-xl h-60 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-700/30 hover:border-blue-500 transition" onClick={()=>document.getElementById("f")?.click()}>
                <Upload className="w-12 h-12 text-blue-400 mb-4"/>
                <p className="text-sm text-gray-300">Click or drag PDF</p>
                <input id="f" type="file" className="hidden" accept=".pdf" onChange={onF}/>
              </div>
              {e&&<div className="mt-4 p-4 bg-red-900/40 border border-red-700 rounded-xl flex gap-3"><AlertCircle className="w-5 h-5 text-red-400"/><p>{e}</p></div>}
            </>
          )}

          {step==="select"&&f&&(
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400"/>
                  <span className="text-blue-400">{f.name}</span>
                </div>
                <div className="text-sm text-gray-400">
                  <span className="text-blue-400 font-semibold">{includedPages}</span> of {p} pages selected
                </div>
              </div>

              <Document file={f} onLoadSuccess={onLoad}>
                <div className="relative w-full flex justify-center">
                  <button onClick={()=>swiperRef.current?.slidePrev()} className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-700 hover:bg-gray-600 rounded-full p-2 z-20 transition-colors">
                    <ChevronLeft size={24}/>
                  </button>
                  <button onClick={()=>swiperRef.current?.slideNext()} className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-700 hover:bg-gray-600 rounded-full p-2 z-20 transition-colors">
                    <ChevronRight size={24}/>
                  </button>
                  <Swiper spaceBetween={20} slidesPerView={1} onSwiper={i=>swiperRef.current=i} className="w-full max-w-2xl">
                    {Array.from({length:p},(_,i)=>i+1).map(n=>
                      <SwiperSlide key={n}>
                        <div className="flex flex-col items-center">
                          <div className={`border-4 rounded-lg overflow-hidden ${ex.includes(n)?"border-red-500/50 opacity-50":"border-transparent"}`}>
                            <Page pageNumber={n} width={500} renderTextLayer renderAnnotationLayer/>
                          </div>
                          <label className="flex items-center mt-4 text-sm cursor-pointer select-none">
                            <input type="checkbox" checked={ex.includes(n)} onChange={()=>toggle(n)} className="w-4 h-4 mr-2 accent-red-500"/>
                            <span className={ex.includes(n)?"text-red-400":"text-gray-300"}>
                              {ex.includes(n)?"Page "+n+" excluded":"Exclude Page "+n}
                            </span>
                          </label>
                        </div>
                      </SwiperSlide>
                    )}
                  </Swiper>
                </div>
              </Document>

              {ex.length>0&&(
                <div className="bg-gray-700/50 rounded-lg p-3 text-sm">
                  <span className="text-gray-400">Excluded pages: </span>
                  <span className="text-red-400">{ex.sort((a,b)=>a-b).join(", ")}</span>
                </div>
              )}

              <button onClick={callExtract} disabled={includedPages===0} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors">
                Extract Data from {includedPages} Page{includedPages!==1?"s":""}
              </button>
            </div>
          )}

          {step==="result"&&(
            <>
              {l&&(
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-400 mb-4"/>
                  <p className="text-gray-300">Extracting data from {includedPages} pages... (This may take a minute)</p>
                </div>
              )}
              {e&&<div className="mt-4 p-4 bg-red-900/40 border border-red-700 rounded-xl flex gap-3"><AlertCircle className="w-5 h-5 text-red-400"/><p>{e}</p></div>}
            </>
          )}
        </div>

        {d && subd &&(
          <>
            <div className="flex gap-3">
<button
  disabled={upLoading}
  onClick={() => callUpload(d)}
  type="button"
  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 p-2 px-4 rounded-lg font-semibold transition-colors"
>
  {upLoading ? 'Uploading' : 'Upload to Server'}
</button>

<button
  disabled={upLoading}
  onClick={() => setStep('select')}
  type="button"
  className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-400 p-2 px-4 rounded-lg transition-colors"
>
  Back to Selection
</button>

            </div>
            <div className="flex flex-row gap-2">
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 w-1/2">
                <h2 className="text-2xl font-bold mb-4">Extracted Detail JSON</h2>
                <pre className="bg-gray-900 p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap">{JSON.stringify(d,null,2)}</pre>
              </div>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 w-1/2">
                <h2 className="text-2xl font-bold mb-4">Extracted Sub Detail JSON</h2>
                <pre className="bg-gray-900 p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap">{JSON.stringify(subd,null,2)}</pre>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  )
}