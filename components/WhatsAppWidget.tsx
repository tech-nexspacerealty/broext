// components/WhatsAppWidget.tsx
'use client'

import { useEffect } from 'react'

export default function WhatsAppWidget() {
  useEffect(() => {
    const id = 'wati-script'

    if (document.getElementById(id)) return

    const s = document.createElement('script')
    s.id = id
    s.src =
      'https://wati-integration-service.clare.ai/ShopifyWidget/shopifyWidget.js?key=YOUR_KEY'
    s.async = true

    s.onload = () => {
      const w: any = window
      if (w.CreateWhatsappChatWidget) {
        w.CreateWhatsappChatWidget({
          settings: {
            enabled: true,
            chatButtonSetting: {
              backgroundColor: '#25D366',
              ctaText: '',
              borderRadius: '50',
              marginLeft: '0',
              marginRight: '20',
              marginBottom: '20',
              ctaIconWATI: false
            },
            brandSetting: {
              brandName: 'My App',
              welcomeText: 'Hi, how can we help?',
              backgroundColor: '#ffffff',
              autoShow: true,
              phoneNumber: '919999999999'
            }
          }
        })
      }
    }

    document.body.appendChild(s)
  }, [])

  return null
}
