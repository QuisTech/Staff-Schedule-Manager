import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, WidthType } from 'docx';
import { saveAs } from 'file-saver';
import { scheduleData } from '../data';

export const exportToPDF = () => {
  const doc = new jsPDF();
  doc.text("Staff Schedule", 14, 15);
  autoTable(doc, {
    startY: 20,
    head: [['Date', 'Shift', 'Location', 'Manager', 'Staff']],
    body: scheduleData.map(row => [row.date, row.shift, row.location, row.manager, row.staff]),
  });
  doc.save('schedule.pdf');
};

export const exportReportsToPDF = (reports: any[]) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Surveillance Report Summary", 14, 20);
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);
  
  autoTable(doc, {
    startY: 35,
    head: [['Type', 'Who', 'What', 'When', 'Where', 'Why', 'How']],
    body: reports.map(r => [r.reportType, r.who, r.what, new Date(r.when).toLocaleString(), r.where, r.why, r.how]),
    theme: 'grid',
    headStyles: { fillColor: [39, 39, 42] }, // Zinc-900
    styles: { fontSize: 8, cellPadding: 2 },
  });
  doc.save('surveillance_reports.pdf');
};

export const exportToWord = async () => {
  const tableRows = scheduleData.map(row => new TableRow({
    children: [
      new TableCell({ children: [new Paragraph(row.date)] }),
      new TableCell({ children: [new Paragraph(row.shift)] }),
      new TableCell({ children: [new Paragraph(row.location)] }),
      new TableCell({ children: [new Paragraph(row.manager)] }),
      new TableCell({ children: [new Paragraph(row.staff)] }),
    ],
  }));

  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({ text: "Staff Schedule", heading: "Heading1" }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: ['Date', 'Shift', 'Location', 'Manager', 'Staff'].map(h => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: h, bold: true })] })] })),
            }),
            ...tableRows
          ],
        }),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'schedule.docx');
};
