
import * as XLSX from 'xlsx';
import { Report, Ambulance, Employee, ScheduleEntry, ShiftType } from '../types';

export const exportReportsToExcel = (reports: Report[], ambulances: Ambulance[], employees: Employee[], lang: 'ar' | 'en') => {
  const data = reports.map(report => {
    const ambulance = ambulances.find(a => a.id === report.ambulanceId);
    const employee = employees.find(e => e.id === report.employeeId);
    
    return {
      [lang === 'ar' ? 'رقم البلاغ' : 'Report Number']: report.reportNumber,
      [lang === 'ar' ? 'التاريخ' : 'Date']: report.date,
      [lang === 'ar' ? 'الوقت' : 'Time']: report.time,
      [lang === 'ar' ? 'المستشفى' : 'Hospital']: report.hospitalName,
      [lang === 'ar' ? 'سيارة الإسعاف' : 'Ambulance']: ambulance?.plateNumber || '',
      [lang === 'ar' ? 'الموظف' : 'Employee']: lang === 'ar' ? employee?.nameAr : employee?.nameEn || '',
      [lang === 'ar' ? 'ملاحظات' : 'Notes']: report.notes || '',
      [lang === 'ar' ? 'الحالة' : 'Status']: lang === 'ar' ? 'مكتمل' : 'Completed'
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, lang === 'ar' ? 'البلاغات' : 'Reports');
  
  // Set RTL for Arabic
  if (lang === 'ar') {
    if (!ws['!views']) ws['!views'] = [];
    ws['!views'].push({ RTL: true });
  }

  XLSX.writeFile(wb, `Reports_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportAmbulancesToExcel = (ambulances: Ambulance[], lang: 'ar' | 'en') => {
  const data = ambulances.map(amb => ({
    [lang === 'ar' ? 'رقم اللوحة' : 'Plate Number']: amb.plateNumber,
    [lang === 'ar' ? 'الموديل' : 'Model']: amb.model,
    [lang === 'ar' ? 'الحالة' : 'Status']: amb.status,
    [lang === 'ar' ? 'الملاحظات/الأعطال' : 'Issues/Notes']: amb.issues.join(' | ')
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, lang === 'ar' ? 'الأسطول' : 'Fleet');

  if (lang === 'ar') {
    if (!ws['!views']) ws['!views'] = [];
    ws['!views'].push({ RTL: true });
  }

  XLSX.writeFile(wb, `Fleet_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportEmployeesToExcel = (employees: Employee[], lang: 'ar' | 'en') => {
  const data = employees.map(emp => ({
    [lang === 'ar' ? 'الاسم (عربي)' : 'Name (Ar)']: emp.nameAr,
    [lang === 'ar' ? 'الاسم (إنجليزي)' : 'Name (En)']: emp.nameEn,
    [lang === 'ar' ? 'المسمى الوظيفي' : 'Position']: emp.position,
    [lang === 'ar' ? 'رقم بطاقة التصنيف' : 'Classification Card #']: emp.classificationCard?.number || '',
    [lang === 'ar' ? 'تاريخ انتهاء البطاقة' : 'Card Expiry Date']: emp.classificationCard?.expiryDate || '',
    [lang === 'ar' ? 'الفترات المسموحة' : 'Allowed Shifts']: emp.allowedShifts.join(', ')
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, lang === 'ar' ? 'الموظفين' : 'Employees');

  if (lang === 'ar') {
    if (!ws['!views']) ws['!views'] = [];
    ws['!views'].push({ RTL: true });
  }

  XLSX.writeFile(wb, `Employees_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportScheduleToExcel = (schedule: ScheduleEntry[], employees: Employee[], weekDates: string[], lang: 'ar' | 'en') => {
  const shifts = [ShiftType.MORNING, ShiftType.EVENING, ShiftType.NIGHT];
  
  const data = weekDates.map(date => {
    const row: any = {
      [lang === 'ar' ? 'التاريخ' : 'Date']: date,
      [lang === 'ar' ? 'اليوم' : 'Day']: new Date(date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'long' })
    };

    shifts.forEach(shift => {
      const shiftLabel = shift === ShiftType.MORNING ? (lang === 'ar' ? 'صباحي' : 'Morning') : 
                         shift === ShiftType.EVENING ? (lang === 'ar' ? 'مسائي' : 'Evening') : 
                         (lang === 'ar' ? 'ليلي' : 'Night');
      
      const entries = schedule.filter(s => s.date === date && s.shift === shift);
      const names = entries.map(e => {
        const emp = employees.find(emp => emp.id === e.employeeId);
        return lang === 'ar' ? emp?.nameAr : emp?.nameEn;
      }).filter(Boolean).join(', ');

      row[shiftLabel] = names || (lang === 'ar' ? 'شاغر' : 'Empty');
    });

    return row;
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, lang === 'ar' ? 'الجدول' : 'Schedule');

  if (lang === 'ar') {
    if (!ws['!views']) ws['!views'] = [];
    ws['!views'].push({ RTL: true });
  }

  XLSX.writeFile(wb, `Schedule_${weekDates[0]}_to_${weekDates[6]}.xlsx`);
};

export const exportHospitalsToExcel = (hospitals: string[], lang: 'ar' | 'en') => {
  const data = hospitals.map(h => ({
    [lang === 'ar' ? 'اسم المستشفى' : 'Hospital Name']: h
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, lang === 'ar' ? 'المستشفيات' : 'Hospitals');

  if (lang === 'ar') {
    if (!ws['!views']) ws['!views'] = [];
    ws['!views'].push({ RTL: true });
  }

  XLSX.writeFile(wb, `Hospitals_${new Date().toISOString().split('T')[0]}.xlsx`);
};
