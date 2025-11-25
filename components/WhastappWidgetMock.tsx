// components/WhatsAppWidgetMock.tsx
'use client'

import { useState } from 'react'
import { MessageCircle } from 'lucide-react'

export default function WhatsAppWidgetMock() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 bg-green-500 p-3 rounded-full cursor-pointer shadow-lg"
      >
        <MessageCircle className="text-white w-6 h-6" />
      </div>

      {open && (
        <div className="fixed bottom-20 right-5 w-72 bg-white rounded-xl shadow-2xl p-4 border">
          <div className="font-semibold text-green-700 mb-2">WhatsApp Support</div>
          <div className="text-sm text-gray-600 mb-3">
            Hi! How can we help you?
          </div>

          <a
            href="https://wa.me/919999999999"
            target="_blank"
            className="bg-green-500 text-white px-4 py-2 rounded-md text-sm w-full flex justify-center"
          >
            Start Chat
          </a>
        </div>
      )}
    </>
  )
}
