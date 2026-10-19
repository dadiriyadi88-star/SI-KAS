import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatRupiah } from '../utils/currency';
import { formatDate } from '../utils/dates';

/**
 * Export array of JSON objects to Excel spreadsheet (.xlsx)
 */
export function exportToExcel(data, fileName = 'laporan-keuangan', sheetName = 'Data') {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().slice(0, 10)}.xlsx`);
    return true;
  } catch (error) {
    console.error('Failed to export to Excel:', error);
    alert('Gagal mengekspor file Excel: ' + error.message);
    return false;
  }
}

/**
 * Export table data to PDF with school header
 */
export function exportToPDF({
  title,
  subtitle,
  schoolInfo,
  columns,
  data,
  fileName = 'laporan-keuangan',
  orientation = 'portrait' // 'portrait' | 'landscape'
}) {
  try {
    const doc = new jsPDF(orientation, 'pt', 'a4');
    
    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text((schoolInfo?.name || 'SIKAS SISWA - LAPORAN KEUANGAN').toUpperCase(), 40, 40);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(schoolInfo?.address || 'Sistem Informasi Kas Keuangan Siswa', 40, 55);
    doc.text(`Tahun Ajaran: ${schoolInfo?.activeAcademicYear || '2026/2027'} | Dicetak: ${new Date().toLocaleDateString('id-ID')}`, 40, 68);
    
    // Divider line
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setLineWidth(1.5);
    doc.setDrawColor(37, 99, 235); // Blue brand
    doc.line(40, 78, pageWidth - 40, 78);
    
    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text(title.toUpperCase(), 40, 100);
    
    if (subtitle) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(subtitle, 40, 115);
    }
    
    // Table
    const startY = subtitle ? 130 : 115;
    
    doc.autoTable({
      head: [columns],
      body: data,
      startY: startY,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 4,
        valign: 'middle'
      },
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      margin: { left: 40, right: 40 }
    });
    
    // Signature block at bottom
    const finalY = doc.lastAutoTable.finalY + 30;
    if (finalY + 80 < doc.internal.pageSize.getHeight()) {
      const leftCol = 60;
      const rightCol = pageWidth - 180;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      
      doc.text('Mengetahui,', leftCol, finalY);
      doc.text('Kepala Sekolah', leftCol, finalY + 12);
      doc.text(`( ${schoolInfo?.principalName || 'Dr. H. Mulyadi, M.Pd.'} )`, leftCol, finalY + 65);
      
      doc.text('Bandung, ' + formatDate(new Date(), 'long'), rightCol, finalY);
      doc.text('Bendahara Sekolah', rightCol, finalY + 12);
      doc.text(`( ${schoolInfo?.treasurerName || 'Siti Nurhaliza, S.Ak.'} )`, rightCol, finalY + 65);
    }
    
    doc.save(`${fileName}_${new Date().toISOString().slice(0, 10)}.pdf`);
    return true;
  } catch (error) {
    console.error('Failed to export to PDF:', error);
    alert('Gagal mengekspor file PDF: ' + error.message);
    return false;
  }
}
