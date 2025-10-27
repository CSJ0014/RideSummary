import React from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default function PdfButton({targetId='ride-report', filename='ride-summary.pdf'}){
  const onClick = async ()=>{
    const node = document.getElementById(targetId)
    if(!node) return
    const canvas = await html2canvas(node, { scale: 2, useCORS: true, backgroundColor: '#ffffff' })
    const img = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p','mm','a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height)
    const w = canvas.width * ratio
    const h = canvas.height * ratio
    pdf.addImage(img, 'PNG', (pageWidth-w)/2, 10, w, h)
    pdf.save(filename)
  }
  return <button className="primary" onClick={onClick}>Download PDF</button>
}
