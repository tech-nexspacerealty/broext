// "use client"
// import {useState} from "react"
// import {Upload,FileText,Download,Loader2,CheckCircle,AlertCircle} from "lucide-react"
// import { dummydata, dummyData2 } from "./data"

// export default function RealEstateExtractor(){
//   const[f,sf]=useState<any>(null)
//   const[l,sl]=useState(false)
//   const[d,sd]=useState<any>(null)
//   const[e,se]=useState<string|null>(null)

//   const onF=(x:any)=>{
//     const v=x.target.files[0]
//     if(v&&v.type==="application/pdf"){sf(v);se(null);sd(null)}else se("Please select a valid PDF file")
//   }

// const extract = async () => {
//   if (!f) return
//   sl(true); se(null)

//   try {
//     const b = await new Promise((r, j) => {
//       const R = new FileReader()
//       R.onload = () => r((R.result as string).split(",")[1])
//       R.onerror = () => j(new Error("Failed to read file"))
//       R.readAsDataURL(f)
//     })

//     const fx = async (n = 0) => {
//       try {
//         const res = await fetch("/api/extract", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ base64Data: b })
//         })
//         return await res.json()
//       } catch (e) {
//         if (n >= 3) throw e
//         await new Promise(s => setTimeout(s, 500 * 2 ** n))
//         return fx(n + 1)
//       }
//     }

//     const j = await fx()

//     if (j.error) throw new Error(j.error)

//     const t = j.content
//       .filter((x: any) => x.type === "text")
//       .map((x: any) => x.text)
//       .join("\n")
//       .replace(/```json|```/g, "")
//       .trim()

//     sd(JSON.parse(t))
//   } catch (x: any) {
//     se(x.message)
//   } finally {
//     sl(false)
//   }
// }

//   const B=(k:string,v:any)=>(<div><p className="text-neutral-400 text-sm">{k}</p><p className="font-semibold break-all">{v??"-"}</p></div>)

// const onUploadInfo = async (data: any) => {
//   try {
//     if(!data) return; 
//     const r = await fetch('http://localhost:4000/api/method/nexspace.api.project.create_ns_project', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ payload: data })
//     })
//     if (!r.ok) throw new Error('REQUEST_FAILED')
//     const j = await r.json()
//     if (j.exc || j._server_messages) throw new Error('SERVER_ERROR')
//     return j
//   } catch (e) {
//     return { error: e.message || 'UNKNOWN_ERROR' }
//   }
// }


//   return(
//     <div className="min-h-screen bg-neutral-900 p-8 text-white">
//       <div className="max-w-6xl mx-auto space-y-8">

//         <div className="bg-neutral-800/70 border border-neutral-700 rounded-2xl p-8 backdrop-blur">
//           <div className="flex items-center gap-3 mb-6">
//             <FileText className="w-8 h-8 text-indigo-400"/>
//             <h1 className="text-3xl font-bold">Real Estate Brochure Extractor</h1>
//           </div>

//           <div className="border border-neutral-700 rounded-xl h-60 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-800 transition" onClick={()=>document.getElementById("f")?.click()}>
//             <Upload className="w-12 h-12 text-indigo-400 mb-4"/>
//             <p className="text-sm text-neutral-300">Click or drag PDF</p>
//             {f&&<div className="flex items-center gap-2 mt-3"><CheckCircle className="w-5 h-5 text-green-400"/><span className="text-indigo-300">{f.name}</span></div>}
//             <input id="f" type="file" className="hidden" accept=".pdf" onChange={onF}/>
//           </div>

//           <button onClick={extract} disabled={!f||l} className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
//             {l?<><Loader2 className="w-5 h-5 animate-spin"/>Extracting...</>:"Extract Data"}
//           </button>

//           {e&&<div className="mt-4 p-4 bg-red-900/40 border border-red-700 rounded-xl flex gap-3"><AlertCircle className="w-5 h-5 text-red-400"/><p>{e}</p></div>}
//         </div>

// {d && (
//   <>
//  <button onClick={() => onUploadInfo(d)} type="button" className="bg-gray-600 p-2 px-3 rounded">Upload</button> 
//   <div className="bg-neutral-800/70 p-6 rounded-xl border border-neutral-700">
//     <h2 className="text-2xl font-bold mb-4">Extracted JSON</h2>
//     <pre className="bg-neutral-900 p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap">
//       {JSON.stringify(d, null, 2)}
//     </pre>
//   </div>
//   </>
// )}


//       </div>
//     </div>
//   )
// }




"use client"
import {useState} from "react"
import {Upload,FileText,Download,Loader2,CheckCircle,AlertCircle} from "lucide-react"
import { dummydata, dummyData2, dummyData3, dummyData4 } from "./data"

export default function RealEstateExtractor(){
  const[f,sf]=useState<any>(null)
  const[l,sl]=useState(false)
  const[d,sd]=useState<any>(null)
  const[e,se]=useState<string|null>(null)

  const onF=(x:any)=>{
    const v=x.target.files[0]
    if(v&&v.type==="application/pdf"){sf(v);se(null);sd(null)}else se("Please select a valid PDF file")
  }

const extract = async () => {
  if (!f) return
  sl(true); se(null)

  try {
    const b = await new Promise((r, j) => {
      const R = new FileReader()
      R.onload = () => r((R.result as string).split(",")[1])
      R.onerror = () => j(new Error("Failed to read file"))
      R.readAsDataURL(f)
    })

    const fx = async (n = 0) => {
      try {
        const res = await fetch("/api/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64Data: b })
        })
        
        // Add check for non-OK response
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || `HTTP error! status: ${res.status}`)
        }
        
        return await res.json()
      } catch (e) {
        if (n >= 3) throw e
        await new Promise(s => setTimeout(s, 500 * 2 ** n))
        return fx(n + 1)
      }
    }

    // const j = await fx()

    const j = {
      error: null,
      content: [
        {
          type: "text",
          text: dummyData4,
        }
      ]
    }

    if (j.error) throw new Error(j.error)

    const t = j.content
      .filter((x: any) => x.type === "text")
      .map((x: any) => x.text)
      .join("\n")
      .replace(/```json|```/g, "")
      .trim()

    sd(JSON.parse(t))
  } catch (x: any) {
    se(x.message || "An error occurred while extracting data")
  } finally {
    sl(false)
  }
}

  const B=(k:string,v:any)=>(<div><p className="text-neutral-400 text-sm">{k}</p><p className="font-semibold break-all">{v??"-"}</p></div>)

const onUploadInfo = async (data: any) => {
  try {
    if(!data) return; 
    const r = await fetch('http://localhost:4000/api/method/nexspace.api.project.create_ns_project', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payload: data })
    })
    if (!r.ok) throw new Error('REQUEST_FAILED')
    const j = await r.json()
    if (j.exc || j._server_messages) throw new Error('SERVER_ERROR')
    return j
  } catch (e: any) {
    return { error: e.message || 'UNKNOWN_ERROR' }
  }
}


  return(
    <div className="min-h-screen bg-neutral-900 p-8 text-white">
      <div className="max-w-6xl mx-auto space-y-8">

        <div className="bg-neutral-800/70 border border-neutral-700 rounded-2xl p-8 backdrop-blur">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-indigo-400"/>
            <h1 className="text-3xl font-bold">Real Estate Brochure Extractor</h1>
          </div>

          <div className="border border-neutral-700 rounded-xl h-60 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-800 transition" onClick={()=>document.getElementById("f")?.click()}>
            <Upload className="w-12 h-12 text-indigo-400 mb-4"/>
            <p className="text-sm text-neutral-300">Click or drag PDF</p>
            {f&&<div className="flex items-center gap-2 mt-3"><CheckCircle className="w-5 h-5 text-green-400"/><span className="text-indigo-300">{f.name}</span></div>}
            <input id="f" type="file" className="hidden" accept=".pdf" onChange={onF}/>
          </div>

          <button onClick={extract} disabled={!f||l} className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
            {l?<><Loader2 className="w-5 h-5 animate-spin"/>Extracting... (This may take a minute)</>:"Extract Data"}
          </button>

          {e&&<div className="mt-4 p-4 bg-red-900/40 border border-red-700 rounded-xl flex gap-3"><AlertCircle className="w-5 h-5 text-red-400"/><p>{e}</p></div>}
        </div>

{d && (
  <>
 <button onClick={() => onUploadInfo(d)} type="button" className="bg-gray-600 p-2 px-3 rounded">Upload</button> 
  <div className="bg-neutral-800/70 p-6 rounded-xl border border-neutral-700">
    <h2 className="text-2xl font-bold mb-4">Extracted JSON</h2>
    <pre className="bg-neutral-900 p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap">
      {JSON.stringify(d, null, 2)}
    </pre>
  </div>
  </>
)}


      </div>
    </div>
  )
}
