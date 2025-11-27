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


import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'
import { prompt3 } from './config'
import { brochurePrompt } from './aiprompt'
import { unitPrompt } from './unit3'

let apiKey = process.env.ANTHROPIC_API_KEY || "";

let a: any = null;

const extSteps = {
  details: "details",
  sub: "sub",
}

export const POST = async (r: any) => {
  try {
    const { base64Data, step, ANTHROPIC_API_KEY } = await r.json()

    if(!apiKey) apiKey = ANTHROPIC_API_KEY;

    if(apiKey) {
      a = new Anthropic({ apiKey })
    } else {
      throw new Error('Unable to set Anthropic worker.')
    }

    if(!a) throw new Error('Unable to set Anthropic worker.')

    const b = Buffer.from(base64Data, 'base64')
    if (b.length > 20 * 1024 * 1024) throw new Error('PDF_TOO_LARGE')

    // Use streaming instead of regular messages.create
    const stream = await a.messages.stream({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 50000,
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
            // { type: 'text', text: brochurePrompt }
            { type: 'text', text: step === extSteps.details ? brochurePrompt : unitPrompt }
          ]
        }
      ]
    })

    // Collect the full response
    const message = await stream.finalMessage()

    console.log('message: <><><><>>>>>>>>>>>>>>>>>>>>>>>> : ', message)


    return NextResponse.json(message)
  } catch (e: any) {
    console.log('error: <><><><>>>>>>>>>>>>>>>>>>>>>>>> : ', e?.error)

    const s =
      e.message === 'PDF_TOO_LARGE'
        ? 413
        : e?.status || e?.error?.status || 500

    const m =
      e.message === 'PDF_TOO_LARGE'
        ? 'File too large'
        : e?.error?.message ||
          e?.error?.error?.message ||
          e.message ||
          'Unexpected error'

    return NextResponse.json({ error: m }, { status: s })
  }
}