// import Anthropic from '@anthropic-ai/sdk'
// import { NextResponse } from 'next/server'
// import { prompt3 } from './config'

// const a = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// export const POST = async (r: any) => {
//   try {
//     const { base64Data } = await r.json()
//     const b = Buffer.from(base64Data, 'base64')
//     if (b.length > 20 * 1024 * 1024) throw new Error('PDF_TOO_LARGE')

//     const m = await a.messages.create({
//       model: 'claude-sonnet-4-5-20250929', //claude-sonnet-4-20250514
//       max_tokens: 200000,

//       messages: [
//         {
//           role: 'user',
//           content: [
//             {
//               type: 'document',
//               source: {
//                 type: 'base64',
//                 media_type: 'application/pdf',
//                 data: base64Data
//               }
//             },
//             { type: 'text', text: prompt3 }
//           ]
//         }
//       ]
//     })

//     return NextResponse.json(m)
//   } catch (e: any) {

//     console.log('error: <><><><>>>>>>>>>>>>>>>>>>>>>>>> : ', e?.error);
    

//     const s =
//       e.message === 'PDF_TOO_LARGE'
//         ? 413
//         : e?.status || e?.error?.status || 500

//     const m =
//       e.message === 'PDF_TOO_LARGE'
//         ? 'File too large'
//         : e?.error?.message ||
//           e?.error?.error?.message ||
//           e.message ||
//           'Unexpected error'

//     return NextResponse.json({ error: m }, { status: s })
//   }
// }


// import Anthropic from '@anthropic-ai/sdk'
// import { NextResponse } from 'next/server'
// import { prompt3 } from './config'
// import { brochurePrompt } from './aiprompt'
// import { unitPrompt } from './unit3'

// let apiKey = process.env.ANTHROPIC_API_KEY || "";

// let a: any = null;

// const extSteps = {
//   details: "details",
//   sub: "sub",
// }

// export const POST = async (r: any) => {
//   try {
//     const { base64Data, step, ANTHROPIC_API_KEY } = await r.json()

//     if(!apiKey) apiKey = ANTHROPIC_API_KEY;

//     if(apiKey) {
//       a = new Anthropic({ apiKey })
//     } else {
//       throw new Error('Unable to set Anthropic worker.')
//     }

//     if(!a) throw new Error('Unable to set Anthropic worker.')

//     const b = Buffer.from(base64Data, 'base64')
//     if (b.length > 20 * 1024 * 1024) throw new Error('PDF_TOO_LARGE')

//     // Use streaming instead of regular messages.create
//     const stream = await a.messages.stream({
//       model: 'claude-sonnet-4-5-20250929',
//       max_tokens: 50000,
//       messages: [
//         {
//           role: 'user',
//           content: [
//             {
//               type: 'document',
//               source: {
//                 type: 'base64',
//                 media_type: 'application/pdf',
//                 data: base64Data
//               }
//             },
//             // { type: 'text', text: brochurePrompt }
//             { type: 'text', text: step === extSteps.details ? brochurePrompt : unitPrompt }
//           ]
//         }
//       ]
//     })

//     // Collect the full response
//     const message = await stream.finalMessage()

//     console.log('message: <><><><>>>>>>>>>>>>>>>>>>>>>>>> : ', message)


//     return NextResponse.json(message)
//   } catch (e: any) {
//     console.log('error: <><><><>>>>>>>>>>>>>>>>>>>>>>>> : ', e?.error)

//     const s =
//       e.message === 'PDF_TOO_LARGE'
//         ? 413
//         : e?.status || e?.error?.status || 500

//     const m =
//       e.message === 'PDF_TOO_LARGE'
//         ? 'File too large'
//         : e?.error?.message ||
//           e?.error?.error?.message ||
//           e.message ||
//           'Unexpected error'

//     return NextResponse.json({ error: m }, { status: s })
//   }
// }

import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'
import { brochurePrompt } from './aiprompt'
import { unitPrompt } from './unit3'

let apiKey = process.env.ANTHROPIC_API_KEY || ""

const extSteps = {
  details: "details",
  sub: "sub",
}

// CRITICAL: Configure route settings
export const maxDuration = 300 // 5 minutes
export const dynamic = 'force-dynamic'

export const POST = async (r: any) => {
  try {
    const { base64Data, step, ANTHROPIC_API_KEY } = await r.json()

    if (!apiKey) apiKey = ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 401 }
      )
    }

    const anthropic = new Anthropic({ apiKey })

    // Check size before processing
    const estimatedSize = (base64Data.length * 3) / 4
    if (estimatedSize > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'PDF too large. Maximum 25MB allowed.' },
        { status: 413 }
      )
    }

    console.log(`Processing PDF (${(estimatedSize / 1024 / 1024).toFixed(2)}MB)`)

    // REDUCED max_tokens to avoid huge responses
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 20000, // Much lower than 50000
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: base64Data
              }
            },
            { 
              type: 'text', 
              text: step === extSteps.details ? brochurePrompt : unitPrompt 
            }
          ]
        }
      ]
    })

    // Extract only the text content to reduce response size
    let textContent = ''
    
    if (Array.isArray(message.content)) {
      textContent = message.content
        .filter((block: any) => block.type === 'text')
        .map((block: any) => block.text)
        .join('\n')
    } else if (typeof message.content === 'string') {
      textContent = message.content
    }

    // Return minimal response
    return NextResponse.json({
      text: textContent,
      id: message.id,
      model: message.model,
      usage: message.usage
    })

  } catch (e: any) {
    console.error('API Error:', {
      message: e.message,
      status: e?.status,
      type: e?.type
    })

    // Handle specific Anthropic errors
    if (e?.status === 413 || e?.type === 'request_too_large') {
      return NextResponse.json(
        { error: 'Request too large. Try a smaller PDF or reduce prompt size.' },
        { status: 413 }
      )
    }

    if (e?.status === 529 || e?.message?.includes('overloaded')) {
      return NextResponse.json(
        { error: 'API is overloaded. Please retry in a moment.' },
        { status: 503 }
      )
    }

    const status = e?.status || 500
    const message = e?.error?.message || e.message || 'Processing failed'

    return NextResponse.json({ error: message }, { status })
  }
}