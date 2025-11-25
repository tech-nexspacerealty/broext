// import PdfSelector from '@/components/PDF'
// import RealEstateExtractor from '@/components/RealEstateExtractor'
import RealEstateExtractor from '@/components/Exct'
import WhatsAppWidgetMock from '@/components/WhastappWidgetMock'
import WhatsAppWidget from '@/components/WhatsAppWidget'
import React from 'react'

const page = () => {
  return (
    <>
    {/* <RealEstateExtractor /> */}
    {/* <PdfSelector /> */}


<RealEstateExtractor />


    <WhatsAppWidget />
    <WhatsAppWidgetMock />
    </>
  )
}

export default page