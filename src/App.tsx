
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShiftType, 
  Employee, 
  ScheduleEntry, 
  Ambulance, 
  VehicleStatus, 
  AppUser, 
  UserRole,
  Report,
  HOSPITALS,
  Permission,
  CustomRole,
  LeaveRequest
} from './types';
import { dbService } from './dbService';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  Users, 
  Calendar, 
  Plus, 
  Trash2, 
  Sun, 
  Moon, 
  Sunset,
  ChevronRight,
  ChevronLeft,
  Truck,
  ShieldAlert,
  UserPlus,
  Settings,
  LayoutDashboard,
  Wrench,
  Activity,
  Printer,
  LogOut,
  UserCircle,
  Lock,
  X,
  Save,
  CheckCircle2,
  CheckCircle,
  AlertTriangle,
  Database,
  ClipboardList,
  FileText,
  Clock,
  MapPin,
  Edit2,
  Globe,
  User,
  Search,
  FileSpreadsheet,
  Download,
  Upload,
  Menu
} from 'lucide-react';
import { 
  exportReportsToExcel, 
  exportAmbulancesToExcel, 
  exportEmployeesToExcel, 
  exportScheduleToExcel,
  exportHospitalsToExcel
} from './utils/excelExport';

const App: React.FC = () => {
  // --- Language State ---
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const t = {
    ar: {
      appName: 'النقل الإسعافي',
      dashboard: 'الرئيسية',
      schedule: 'الجدول',
      reports: 'البلاغات',
      employees: 'الموظفين',
      ambulances: 'الأسطول',
      users: 'المستخدمين',
      login: 'دخول للنظام',
      username: 'اسم المستخدم',
      password: 'كلمة المرور',
      logout: 'خروج',
      save: 'حفظ التغييرات',
      print: 'طباعة',
      totalStaff: 'إجمالي الكادر',
      readyVehicles: 'مركبات جاهزة',
      inMaintenance: 'في الصيانة',
      outOfService: 'خارج الخدمة',
      totalReports: 'إجمالي البلاغات',
      activeVehicles: 'المركبات النشطة',
      underMaintenance: 'تحت الصيانة',
      outOfServiceTitle: 'خارج الخدمة (أعطال)',
      todayShifts: 'ورديات اليوم',
      dbStatus: 'حالة قاعدة البيانات',
      connected: 'متصل - مزود MySQL Ready نشط',
      goToSchedule: 'الانتقال لجدول الأسبوع التفصيلي',
      addEmployee: 'إضافة موظف',
      addAmbulance: 'إضافة سيارة إسعاف',
      addUser: 'إضافة مستخدم جديد',
      addReport: 'إضافة بلاغ جديد',
      editReport: 'تعديل البلاغ',
      reportNumber: 'رقم البلاغ',
      hospital: 'المستشفى المحول له',
      notes: 'ملاحظات',
      saveReport: 'حفظ البلاغ',
      cancel: 'إلغاء',
      completed: 'مكتمل',
      noReports: 'لا توجد بلاغات مسجلة حالياً',
      technicalNote: 'الملاحظة الفنية:',
      allowedShifts: 'الفترات المسموحة',
      plateNumber: 'رقم اللوحة',
      model: 'الموديل',
      status: 'الحالة',
      actions: 'الإجراءات',
      active: 'نشط',
      disabled: 'معطل',
      role: 'الدور الوظيفي',
      user: 'المستخدم',
      createAccount: 'إنشاء حساب مستخدم',
      saveSuccess: 'تم تنفيذ العملية وحفظ التغييرات في قاعدة البيانات',
      shiftM: 'M',
      shiftE: 'E',
      shiftN: 'N',
      hospitals: 'المستشفيات',
      addHospital: 'إضافة مستشفى جديد',
      hospitalName: 'اسم المستشفى',
      noHospitals: 'لا توجد مستشفيات مسجلة حالياً',
      classificationCard: 'بطاقة التصنيف',
      expiryDate: 'تاريخ الانتهاء',
      expired: 'منتهية',
      expiresSoon: 'تنتهي قريباً',
      valid: 'صالحة',
      cardNumber: 'رقم البطاقة',
      expiryAlerts: 'تنبيهات انتهاء الصلاحية',
      noAlerts: 'لا توجد تنبيهات حالياً',
      exportExcel: 'تصدير إكسل',
      backupData: 'نسخ احتياطي (JSON)',
      restoreData: 'استعادة البيانات',
      employeeNotes: 'ملاحظات الموظف',
      roleAdmin: 'مدير نظام',
      roleSupervisor: 'مشرف',
      roleStaff: 'موظف',
      roleCustom: 'دور مخصص',
      statusActive: 'نشط',
      statusMaintenance: 'صيانة',
      statusOutOfService: 'خارج الخدمة',
      can_view_dashboard: 'عرض لوحة التحكم',
      can_view_schedule: 'عرض الجدول',
      can_manage_schedule: 'إدارة الجدول',
      can_view_reports: 'عرض التقارير',
      can_manage_reports: 'إدارة التقارير',
      can_view_employees: 'عرض الموظفين',
      can_manage_employees: 'إدارة الموظفين',
      can_view_ambulances: 'عرض سيارات الإسعاف',
      can_manage_ambulances: 'إدارة سيارات الإسعاف',
      can_view_hospitals: 'عرض المستشفيات',
      can_manage_hospitals: 'إدارة المستشفيات',
      can_view_users: 'عرض المستخدمين',
      can_manage_users: 'إدارة المستخدمين',
      can_manage_roles: 'إدارة الأدوار',
      leaveRequests: 'طلبات الإجازات',
      addLeaveRequest: 'طلب إجازة جديد',
      leaveStartDate: 'بداية الإجازة',
      leaveEndDate: 'نهاية الإجازة',
      lastLeaveStartDate: 'تاريخ آخر إجازة',
      lastLeaveDuration: 'مدة آخر إجازة',
      employeeName: 'اسم الموظف',
    },
    en: {
      appName: 'Ambulance Transport',
      dashboard: 'Dashboard',
      schedule: 'Schedule',
      reports: 'Reports',
      employees: 'Employees',
      ambulances: 'Fleet',
      users: 'Users',
      login: 'Login to System',
      username: 'Username',
      password: 'Password',
      logout: 'Logout',
      save: 'Save Changes',
      print: 'Print',
      totalStaff: 'Total Staff',
      readyVehicles: 'Ready Vehicles',
      inMaintenance: 'In Maintenance',
      outOfService: 'Out of Service',
      totalReports: 'Total Reports',
      activeVehicles: 'Active Vehicles',
      underMaintenance: 'Under Maintenance',
      outOfServiceTitle: 'Out of Service (Faults)',
      todayShifts: 'Today\'s Shifts',
      dbStatus: 'Database Status',
      connected: 'Connected - MySQL Ready Provider Active',
      goToSchedule: 'Go to Detailed Weekly Schedule',
      addEmployee: 'Add Employee',
      addAmbulance: 'Add Ambulance',
      addUser: 'Add New User',
      addReport: 'Add New Report',
      editReport: 'Edit Report',
      reportNumber: 'Report Number',
      hospital: 'Destination Hospital',
      notes: 'Notes',
      saveReport: 'Save Report',
      cancel: 'Cancel',
      completed: 'Completed',
      noReports: 'No reports registered currently',
      technicalNote: 'Technical Note:',
      allowedShifts: 'Allowed Shifts',
      plateNumber: 'Plate Number',
      model: 'Model',
      status: 'Status',
      actions: 'Actions',
      active: 'Active',
      disabled: 'Disabled',
      role: 'Role',
      user: 'User',
      createAccount: 'Create User Account',
      saveSuccess: 'Operation executed and changes saved to database',
      shiftM: 'M',
      shiftE: 'E',
      shiftN: 'N',
      hospitals: 'Hospitals',
      addHospital: 'Add New Hospital',
      hospitalName: 'Hospital Name',
      noHospitals: 'No hospitals registered currently',
      classificationCard: 'Classification Card',
      expiryDate: 'Expiry Date',
      expired: 'Expired',
      expiresSoon: 'Expires Soon',
      valid: 'Valid',
      cardNumber: 'Card Number',
      expiryAlerts: 'Expiry Alerts',
      noAlerts: 'No alerts currently',
      exportExcel: 'Export Excel',
      backupData: 'Backup Data (JSON)',
      restoreData: 'Restore Data',
      employeeNotes: 'Employee Notes',
      roleAdmin: 'Admin',
      roleSupervisor: 'Supervisor',
      roleStaff: 'Staff',
      roleCustom: 'Custom Role',
      statusActive: 'Active',
      statusMaintenance: 'Maintenance',
      statusOutOfService: 'Out of Service',
      can_view_dashboard: 'View Dashboard',
      can_view_schedule: 'View Schedule',
      can_manage_schedule: 'Manage Schedule',
      can_view_reports: 'View Reports',
      can_manage_reports: 'Manage Reports',
      can_view_employees: 'View Employees',
      can_manage_employees: 'Manage Employees',
      can_view_ambulances: 'View Ambulances',
      can_manage_ambulances: 'Manage Ambulances',
      can_view_hospitals: 'View Hospitals',
      can_manage_hospitals: 'Manage Hospitals',
      can_view_users: 'View Users',
      can_manage_users: 'Manage Users',
      can_manage_roles: 'Manage Roles',
      leaveRequests: 'Leave Requests',
      addLeaveRequest: 'New Leave Request',
      leaveStartDate: 'Leave Start Date',
      leaveEndDate: 'Leave End Date',
      lastLeaveStartDate: 'Last Leave Start Date',
      lastLeaveDuration: 'Last Leave Duration',
      employeeName: 'Employee Name',
    }
  }[lang];

  const getShiftLabel = (s: ShiftType) => {
    if (s === ShiftType.MORNING) return t.shiftM;
    if (s === ShiftType.EVENING) return t.shiftE;
    if (s === ShiftType.NIGHT) return t.shiftN;
    return s;
  };

  const getRoleLabel = (role: UserRole, customRoleId?: string) => {
    if (role === UserRole.ADMIN) return t.roleAdmin;
    if (role === UserRole.SUPERVISOR) return t.roleSupervisor;
    if (role === UserRole.STAFF) return t.roleStaff;
    if (role === UserRole.CUSTOM) return customRoles.find(r => r.id === customRoleId)?.name || t.roleCustom;
    return role;
  };

  const getStatusLabel = (status: VehicleStatus) => {
    if (status === VehicleStatus.ACTIVE) return t.statusActive;
    if (status === VehicleStatus.MAINTENANCE) return t.statusMaintenance;
    if (status === VehicleStatus.OUT_OF_SERVICE) return t.statusOutOfService;
    return status;
  };

  // --- Auth State ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // --- App State ---
  const [activeTab, setActiveTab] = useState<'dashboard' | 'schedule' | 'employees' | 'ambulances' | 'users' | 'reports' | 'hospitals' | 'roles' | 'leaves'>('dashboard');
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [hospitals, setHospitals] = useState<string[]>(HOSPITALS);
  const [customRoles, setCustomRoles] = useState<CustomRole[]>([]);
  const [users, setUsers] = useState<AppUser[]>([
    { id: 'u1', username: 'admin', password: '123', role: UserRole.ADMIN, isActive: true },
    { id: 'u2', username: 'super', password: '123', role: UserRole.SUPERVISOR, isActive: true }
  ]);

  const [currentUser, setCurrentUser] = useState<AppUser>(users[0]);
  const [showAddAmbModal, setShowAddAmbModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showAddReportModal, setShowAddReportModal] = useState(false);
  const [showAddLeaveModal, setShowAddLeaveModal] = useState(false);
  const [editingReportId, setEditingReportId] = useState<string | null>(null);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [newAmbPlate, setNewAmbPlate] = useState('');
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [newHospitalName, setNewHospitalName] = useState('');
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const [newRoleName, setNewRoleName] = useState('');
  const [newRolePermissions, setNewRolePermissions] = useState<Permission[]>([]);

  const [newReportNumber, setNewReportNumber] = useState('');
  const [newReportHospital, setNewReportHospital] = useState('');
  const [newReportNotes, setNewReportNotes] = useState('');
  const [newReportAmbulanceId, setNewReportAmbulanceId] = useState('');
  const [newReportEmployeeId, setNewReportEmployeeId] = useState('');
  const [newReportDate, setNewReportDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Leave Request Form State
  const [newLeaveEmployeeId, setNewLeaveEmployeeId] = useState('');
  const [newLeaveStartDate, setNewLeaveStartDate] = useState('');
  const [newLeaveEndDate, setNewLeaveEndDate] = useState('');
  const [newLeaveLastStartDate, setNewLeaveLastStartDate] = useState('');
  const [newLeaveLastDuration, setNewLeaveLastDuration] = useState('');

  const [reportSearch, setReportSearch] = useState('');
  const [reportStartDate, setReportStartDate] = useState('');
  const [reportEndDate, setReportEndDate] = useState('');
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [ambulanceSearch, setAmbulanceSearch] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (hospitals.length > 0 && !newReportHospital) {
      setNewReportHospital(hospitals[0]);
    }
  }, [hospitals, newReportHospital]);
  
  const [noteInputs, setNoteInputs] = useState<{[key: string]: string}>({});

  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>(UserRole.STAFF);
  const [newUserCustomRoleId, setNewUserCustomRoleId] = useState<string>('');

  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // --- Initialize from Database Service ---
  useEffect(() => {
    const initData = async () => {
      let data = await dbService.getAllData();
      
      // Migration: If server is empty but local storage has data, migrate it
      const localDataRaw = localStorage.getItem('ambulance_transport_data');
      if (localDataRaw && (!data.employees || data.employees.length === 0)) {
        try {
          const localData = JSON.parse(localDataRaw);
          if (localData.employees && localData.employees.length > 0) {
            console.log('Migrating local data to server...');
            await dbService.saveAllData(localData);
            data = localData;
            // Clear local storage after successful migration to avoid repeated prompts/logic
            localStorage.removeItem('ambulance_transport_data');
          }
        } catch (e) {
          console.error('Migration failed', e);
        }
      }

      // Data Migration for ShiftType and Employee Names
      const migrateShift = (s: string): ShiftType => {
        if (s === 'صباحي') return ShiftType.MORNING;
        if (s === 'مسائي') return ShiftType.EVENING;
        if (s === 'ليلي') return ShiftType.NIGHT;
        return s as ShiftType;
      };

      if (data.employees.length > 0) {
        setEmployees(data.employees.map(emp => ({
          ...emp,
          nameAr: emp.nameAr || (emp as any).name || '',
          nameEn: emp.nameEn || (emp as any).name || '',
          allowedShifts: emp.allowedShifts.map(migrateShift)
        })));
      } else {
        setEmployees([
          { id: 'e1', nameAr: 'تركي المطيري', nameEn: 'Turki Al-Mutairi', position: 'فني طوارئ', allowedShifts: [ShiftType.MORNING, ShiftType.EVENING, ShiftType.NIGHT], classificationCard: { number: '10001', expiryDate: '2026-02-15' } },
          { id: 'e2', nameAr: 'عبدالرحمن الفوزان', nameEn: 'Abdulrahman Al-Fowzan', position: 'فني طوارئ', allowedShifts: [ShiftType.MORNING, ShiftType.EVENING, ShiftType.NIGHT], classificationCard: { number: '10002', expiryDate: '2026-03-10' } },
          { id: 'e3', nameAr: 'امين الشقير', nameEn: 'Amin Al-Shuqair', position: 'فني طوارئ', allowedShifts: [ShiftType.MORNING, ShiftType.EVENING, ShiftType.NIGHT], classificationCard: { number: '10003', expiryDate: '2027-01-01' } },
          { id: 'e4', nameAr: 'محمد مسفر', nameEn: 'Mohammed Mesfer', position: 'فني طوارئ', allowedShifts: [ShiftType.MORNING, ShiftType.EVENING, ShiftType.NIGHT], classificationCard: { number: '10004', expiryDate: '2026-03-25' } },
          { id: 'e5', nameAr: 'سلطان الرويس', nameEn: 'Sultan Al-Ruwaiss', position: 'فني طوارئ', allowedShifts: [ShiftType.MORNING, ShiftType.EVENING, ShiftType.NIGHT], classificationCard: { number: '10005', expiryDate: '2025-12-30' } },
          { id: 'e6', nameAr: 'ناصر مسفر', nameEn: 'Nasser Mesfer', position: 'فني طوارئ', allowedShifts: [ShiftType.MORNING, ShiftType.EVENING, ShiftType.NIGHT] },
          { id: 'e7', nameAr: 'عبدالرحمن الحربي', nameEn: 'Abdulrahman Al-Harbi', position: 'فني طوارئ', allowedShifts: [ShiftType.MORNING, ShiftType.EVENING, ShiftType.NIGHT] },
          { id: 'e8', nameAr: 'فهد عايض', nameEn: 'Fahad Ayed', position: 'فني طوارئ', allowedShifts: [ShiftType.MORNING, ShiftType.EVENING, ShiftType.NIGHT] },
          { id: 'e9', nameAr: 'مهند الهويمل', nameEn: 'Muhannad Al-Huwaymil', position: 'فني طوارئ', allowedShifts: [ShiftType.MORNING, ShiftType.EVENING, ShiftType.NIGHT] },
          { id: 'e10', nameAr: 'عبدالله الهويمل', nameEn: 'Abdullah Al-Huwaymil', position: 'فني طوارئ', allowedShifts: [ShiftType.MORNING, ShiftType.EVENING, ShiftType.NIGHT] },
          { id: 'e11', nameAr: 'محمد البداح', nameEn: 'Mohammed Al-Baddah', position: 'فني طوارئ', allowedShifts: [ShiftType.MORNING, ShiftType.EVENING, ShiftType.NIGHT] },
          { id: 'e12', nameAr: 'عبدالهادي', nameEn: 'Abdulhadi', position: 'فني طوارئ', allowedShifts: [ShiftType.MORNING, ShiftType.EVENING, ShiftType.NIGHT] },
          { id: 'e13', nameAr: 'فهد دخين', nameEn: 'Fahad Dukheen', position: 'فني طوارئ', allowedShifts: [ShiftType.MORNING, ShiftType.EVENING, ShiftType.NIGHT] }
        ]);
      }

      if (data.ambulances.length > 0) setAmbulances(data.ambulances);
      else setAmbulances([
        { id: 'v1', plateNumber: 'أ ب ج 123', model: 'GMC Savana 2023', status: VehicleStatus.ACTIVE, issues: [] },
        { id: 'v2', plateNumber: 'ر س ط 555', model: 'Ford Transit 2022', status: VehicleStatus.MAINTENANCE, issues: ['صيانة دورية - 50,000 كم'] },
        { id: 'v3', plateNumber: 'ق ر ش 789', model: 'Mercedes Sprinter', status: VehicleStatus.OUT_OF_SERVICE, issues: ['عطل في المحرك'] }
      ]);

      if (data.users.length > 0) setUsers(data.users);
      
      if (data.schedule.length > 0) {
        setSchedule(data.schedule.map(entry => ({
          ...entry,
          shift: migrateShift(entry.shift)
        })));
      }

      if (data.reports.length > 0) setReports(data.reports);
      if (data.hospitals.length > 0) setHospitals(data.hospitals);
      if (data.customRoles && data.customRoles.length > 0) setCustomRoles(data.customRoles);
      setIsDataLoaded(true);
    };
    initData();
  }, []);

  // --- Automatic Saving ---
  useEffect(() => {
    if (!isDataLoaded) return;

    const saveData = async () => {
      setIsSyncing(true);
      try {
        await dbService.saveAllData({
          employees,
          ambulances,
          users,
          schedule,
          reports,
          hospitals,
          customRoles
        });
      } catch (error) {
        console.error('Auto-save failed', error);
      } finally {
        setTimeout(() => setIsSyncing(false), 1000);
      }
    };

    const timeoutId = setTimeout(saveData, 2000); // Debounce save
    return () => clearTimeout(timeoutId);
  }, [employees, ambulances, users, schedule, reports, hospitals, customRoles, isDataLoaded]);

  const handleSaveAll = async () => {
    await dbService.saveAllData({
      employees,
      ambulances,
      users,
      schedule,
      reports,
      hospitals,
      customRoles
    });
    
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);
  };

  const handleBackupData = () => {
    const data = {
      employees,
      ambulances,
      users,
      schedule,
      reports,
      hospitals,
      customRoles
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Ambulance_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRestoreData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.employees) setEmployees(data.employees);
        if (data.ambulances) setAmbulances(data.ambulances);
        if (data.users) setUsers(data.users);
        if (data.schedule) setSchedule(data.schedule);
        if (data.reports) setReports(data.reports);
        if (data.hospitals) setHospitals(data.hospitals);
        if (data.customRoles) setCustomRoles(data.customRoles);
        
        await dbService.saveAllData(data);
        alert(lang === 'ar' ? 'تم استعادة البيانات بنجاح' : 'Data restored successfully');
        window.location.reload();
      } catch (err) {
        alert(lang === 'ar' ? 'خطأ في ملف النسخ الاحتياطي' : 'Invalid backup file');
      }
    };
    reader.readAsText(file);
  };

  const hasPermission = (permission: Permission): boolean => {
    if (currentUser.role === UserRole.ADMIN) return true;
    if (currentUser.role === UserRole.CUSTOM && currentUser.customRoleId) {
      const role = customRoles.find(r => r.id === currentUser.customRoleId);
      return role?.permissions.includes(permission) || false;
    }
    
    // Default permissions for predefined roles
    const supervisorPermissions: Permission[] = [
      'can_view_dashboard', 'can_view_schedule', 'can_manage_schedule',
      'can_view_reports', 'can_manage_reports', 'can_view_employees',
      'can_manage_employees', 'can_view_ambulances', 'can_manage_ambulances',
      'can_view_hospitals', 'can_manage_hospitals'
    ];
    const staffPermissions: Permission[] = [
      'can_view_dashboard', 'can_view_schedule', 'can_view_reports', 'can_manage_reports'
    ];

    if (currentUser.role === UserRole.SUPERVISOR) return supervisorPermissions.includes(permission);
    if (currentUser.role === UserRole.STAFF) return staffPermissions.includes(permission);
    
    return false;
  };

  const canManageUsers = hasPermission('can_manage_users');
  const canManageStaff = hasPermission('can_manage_employees');
  const isReadOnly = !hasPermission('can_manage_schedule') && !hasPermission('can_manage_employees') && !hasPermission('can_manage_ambulances');

  const checkExpiryStatus = (dateStr: string | undefined) => {
    if (!dateStr) return { status: 'none', color: 'text-slate-300', label: '' };
    const expiryDate = new Date(dateStr);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { status: 'expired', color: 'text-red-500', label: t.expired };
    if (diffDays <= 30) return { status: 'warning', color: 'text-amber-500', label: t.expiresSoon };
    return { status: 'valid', color: 'text-green-500', label: t.valid };
  };

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t.dashboard, allowed: true },
    { id: 'schedule', icon: Calendar, label: t.schedule, allowed: true },
    { id: 'reports', icon: ClipboardList, label: t.reports, allowed: true },
    { id: 'employees', icon: Users, label: t.employees, allowed: canManageStaff },
    { id: 'ambulances', icon: Truck, label: t.ambulances, allowed: hasPermission('can_view_ambulances') },
    { id: 'leaves', icon: Clock, label: t.leaveRequests, allowed: true },
    { id: 'hospitals', icon: MapPin, label: t.hospitals, allowed: hasPermission('can_view_hospitals') },
    { id: 'roles', icon: ShieldAlert, label: lang === 'ar' ? 'الأدوار' : 'Roles', allowed: hasPermission('can_manage_roles') },
    { id: 'users', icon: Settings, label: t.users, allowed: canManageUsers }
  ];

  const weekDates = useMemo(() => {
    const dates = [];
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay()); 
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  }, [currentDate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === loginUsername && u.password === loginPassword);
    if (user) {
      if (!user.isActive) return setLoginError('هذا الحساب معطل');
      setCurrentUser(user);
      setIsLoggedIn(true);
      setLoginError('');
      setActiveTab('dashboard');
    } else {
      setLoginError('خطأ في اسم المستخدم أو كلمة المرور');
    }
  };

  const addEmployee = () => {
    if (!newEmployeeName.trim() || isReadOnly) return;
    setEmployees(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      nameAr: newEmployeeName,
      nameEn: newEmployeeName,
      position: 'موظف',
      allowedShifts: [ShiftType.MORNING, ShiftType.EVENING, ShiftType.NIGHT],
      notes: ''
    }]);
    setNewEmployeeName('');
  };

  const addAmbulance = () => {
    if (!newAmbPlate.trim() || isReadOnly) return;
    setAmbulances(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      plateNumber: newAmbPlate,
      model: 'GMC Savana',
      status: VehicleStatus.ACTIVE,
      issues: []
    }]);
    setNewAmbPlate('');
    setShowAddAmbModal(false);
  };

  const addNewUser = () => {
    if (!newUserUsername.trim() || !newUserPassword.trim()) return;
    setUsers(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      username: newUserUsername,
      password: newUserPassword,
      role: newUserRole,
      customRoleId: newUserRole === UserRole.CUSTOM ? newUserCustomRoleId : undefined,
      isActive: true
    }]);
    setNewUserUsername('');
    setNewUserPassword('');
    setNewUserCustomRoleId('');
    setShowAddUserModal(false);
  };

  const addCustomRole = () => {
    if (!newRoleName.trim()) return;
    if (editingRoleId) {
      setCustomRoles(prev => prev.map(r => r.id === editingRoleId ? { ...r, name: newRoleName, permissions: newRolePermissions } : r));
      setEditingRoleId(null);
    } else {
      setCustomRoles(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        name: newRoleName,
        permissions: newRolePermissions
      }]);
    }
    setNewRoleName('');
    setNewRolePermissions([]);
    setShowAddRoleModal(false);
  };

  const startEditRole = (role: CustomRole) => {
    setEditingRoleId(role.id);
    setNewRoleName(role.name);
    setNewRolePermissions(role.permissions);
    setShowAddRoleModal(true);
  };

  const addReport = () => {
    if (!newReportNumber.trim()) return;
    
    if (editingReportId) {
      setReports(prev => prev.map(r => r.id === editingReportId ? {
        ...r,
        reportNumber: newReportNumber,
        hospitalName: newReportHospital,
        notes: newReportNotes,
        ambulanceId: newReportAmbulanceId,
        employeeId: newReportEmployeeId,
        date: newReportDate
      } : r));
      setEditingReportId(null);
    } else {
      const now = new Date();
      setReports(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        reportNumber: newReportNumber,
        hospitalName: newReportHospital,
        date: newReportDate,
        time: now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        status: 'completed',
        notes: newReportNotes,
        ambulanceId: newReportAmbulanceId,
        employeeId: newReportEmployeeId
      }]);
    }
    
    setNewReportNumber('');
    setNewReportHospital(hospitals[0] || HOSPITALS[0]);
    setNewReportNotes('');
    setNewReportAmbulanceId('');
    setNewReportEmployeeId('');
    setNewReportDate(new Date().toISOString().split('T')[0]);
    setShowAddReportModal(false);
  };

  const addNewLeaveRequest = () => {
    if (!newLeaveEmployeeId || !newLeaveStartDate || !newLeaveEndDate) return;
    
    const employee = employees.find(e => e.id === newLeaveEmployeeId);
    if (!employee) return;

    const newRequest: LeaveRequest = {
      id: Math.random().toString(36).substr(2, 9),
      employeeId: newLeaveEmployeeId,
      employeeName: lang === 'ar' ? employee.nameAr : employee.nameEn,
      startDate: newLeaveStartDate,
      endDate: newLeaveEndDate,
      lastLeaveStartDate: newLeaveLastStartDate,
      lastLeaveDuration: newLeaveLastDuration,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setLeaveRequests(prev => [...prev, newRequest]);
    setShowAddLeaveModal(false);
    
    // Reset form
    setNewLeaveEmployeeId('');
    setNewLeaveStartDate('');
    setNewLeaveEndDate('');
    setNewLeaveLastStartDate('');
    setNewLeaveLastDuration('');
    
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);
  };

  const startEditReport = (report: Report) => {
    setEditingReportId(report.id);
    setNewReportNumber(report.reportNumber);
    setNewReportHospital(report.hospitalName);
    setNewReportNotes(report.notes || '');
    setNewReportAmbulanceId(report.ambulanceId || '');
    setNewReportEmployeeId(report.employeeId || '');
    setNewReportDate(report.date);
    setShowAddReportModal(true);
  };

  const addNote = (ambId: string) => {
    const note = noteInputs[ambId];
    if (!note || !note.trim() || isReadOnly) return;
    setAmbulances(prev => prev.map(a => a.id === ambId ? { ...a, issues: [...a.issues, note.trim()] } : a));
    setNoteInputs(prev => ({ ...prev, [ambId]: '' }));
  };

  const addShiftEntry = (date: string, shift: ShiftType, empId: string) => {
    if (!empId || isReadOnly) return;
    if (schedule.some(s => s.date === date && s.shift === shift && s.employeeId === empId)) return;
    setSchedule(prev => [...prev, { date, shift, employeeId: empId }]);
  };

  const removeShiftEntry = (date: string, shift: ShiftType, empId: string) => {
    if (isReadOnly) return;
    setSchedule(prev => prev.filter(s => !(s.date === date && s.shift === shift && s.employeeId === empId)));
  };

  const addHospital = () => {
    if (!newHospitalName.trim() || isReadOnly) return;
    if (hospitals.includes(newHospitalName.trim())) return;
    setHospitals(prev => [...prev, newHospitalName.trim()]);
    setNewHospitalName('');
  };

  const removeHospital = (name: string) => {
    if (isReadOnly) return;
    setHospitals(prev => prev.filter(h => h !== name));
  };

  const renderHospitals = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4">
      {hospitals.map(h => (
        <div key={h} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-lg transition-all group">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
              <MapPin className="w-6 h-6" />
            </div>
            <span className="font-black text-slate-800">{h}</span>
          </div>
          {!isReadOnly && (
            <button onClick={() => removeHospital(h)} className="text-slate-300 hover:text-red-500 transition-colors p-2">
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      ))}
      {!isReadOnly && (
        <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-6 flex flex-col gap-4 hover:border-blue-400 transition-all">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-slate-400" />
            <span className="text-sm font-black text-slate-400">{t.addHospital}</span>
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={newHospitalName} 
              onChange={e => setNewHospitalName(e.target.value)} 
              placeholder={t.hospitalName} 
              className="flex-1 p-3 bg-slate-50 rounded-xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500" 
              onKeyPress={e => e.key === 'Enter' && addHospital()}
            />
            <button onClick={addHospital} className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderReports = () => {
    const filteredReports = reports.filter(report => {
      const matchesSearch = 
        report.reportNumber.toLowerCase().includes(reportSearch.toLowerCase()) ||
        report.hospitalName.toLowerCase().includes(reportSearch.toLowerCase()) ||
        (report.notes || '').toLowerCase().includes(reportSearch.toLowerCase()) ||
        ambulances.find(a => a.id === report.ambulanceId)?.plateNumber.toLowerCase().includes(reportSearch.toLowerCase()) ||
        employees.find(e => e.id === report.employeeId)?.nameAr.toLowerCase().includes(reportSearch.toLowerCase()) ||
        employees.find(e => e.id === report.employeeId)?.nameEn.toLowerCase().includes(reportSearch.toLowerCase());
      
      const matchesDate = 
        (!reportStartDate || report.date >= reportStartDate) &&
        (!reportEndDate || report.date <= reportEndDate);
        
      return matchesSearch && matchesDate;
    }).sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));

    const totalReports = reports.length;
    const todayReports = reports.filter(r => r.date === new Date().toISOString().split('T')[0]).length;

    const hospitalData = hospitals.map(h => ({
      name: h,
      count: reports.filter(r => r.hospitalName === h).length
    })).filter(d => d.count > 0);

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
            <ClipboardList className="w-7 h-7 text-blue-600" /> {lang === 'ar' ? 'سجل البلاغات' : 'Reports Log'}
          </h3>
          <button 
            onClick={() => setShowAddReportModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all active:scale-95 no-print"
          >
            <Plus className="w-5 h-5" /> {lang === 'ar' ? 'إضافة بلاغ جديد' : 'Add New Report'}
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase">{lang === 'ar' ? 'إجمالي البلاغات' : 'Total Reports'}</p>
              <p className="text-2xl font-black text-slate-800">{totalReports}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase">{lang === 'ar' ? 'بلاغات اليوم' : 'Today\'s Reports'}</p>
              <p className="text-2xl font-black text-slate-800">{todayReports}</p>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        {hospitalData.length > 0 && (
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm no-print">
            <h4 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-tighter">
              <Activity className="w-4 h-4 text-blue-500" /> {lang === 'ar' ? 'توزيع البلاغات حسب المستشفى' : 'Reports Distribution by Hospital'}
            </h4>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hospitalData} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={150} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 800, fontSize: '12px' }}
                  />
                  <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={20}>
                    {hospitalData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4 no-print">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder={lang === 'ar' ? 'بحث برقم البلاغ، المستشفى، الموظف، أو رقم اللوحة...' : 'Search by report #, hospital, employee, or plate...'}
              value={reportSearch}
              onChange={e => setReportSearch(e.target.value)}
              className="w-full pr-12 pl-4 py-4 bg-slate-50 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            {(reportSearch || reportStartDate || reportEndDate) && (
              <button 
                onClick={() => { setReportSearch(''); setReportStartDate(''); setReportEndDate(''); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-red-500 hover:text-red-700 transition-colors"
              >
                {lang === 'ar' ? 'مسح التصفية' : 'Clear Filters'}
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-400 whitespace-nowrap">{lang === 'ar' ? 'من تاريخ:' : 'From:'}</span>
              <input 
                type="date" 
                value={reportStartDate}
                onChange={e => setReportStartDate(e.target.value)}
                className="flex-1 p-3 bg-slate-50 rounded-xl border-none font-bold text-xs outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-400 whitespace-nowrap">{lang === 'ar' ? 'إلى تاريخ:' : 'To:'}</span>
              <input 
                type="date" 
                value={reportEndDate}
                onChange={e => setReportEndDate(e.target.value)}
                className="flex-1 p-3 bg-slate-50 rounded-xl border-none font-bold text-xs outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.length === 0 ? (
            <div className="col-span-full bg-white p-20 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
              <ClipboardList className="w-16 h-16 mb-4 opacity-20" />
              <p className="font-bold">{lang === 'ar' ? 'لا توجد نتائج تطابق بحثك' : 'No results matching your search'}</p>
            </div>
          ) : (
            filteredReports.map(report => (
              <div key={report.id} id={`report-${report.id}`} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col gap-4 relative group">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800">بلاغ رقم: {report.reportNumber}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{report.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 no-print opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {
                        try {
                          window.print();
                        } catch (e) {
                          alert(lang === 'ar' ? 'يرجى استخدام Ctrl+P للطباعة' : 'Please use Ctrl+P to print');
                        }
                      }}
                      className="text-slate-300 hover:text-slate-800 transition-colors"
                      title={lang === 'ar' ? 'طباعة' : 'Print'}
                    >
                      <Printer className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => startEditReport(report)}
                      className="text-slate-300 hover:text-blue-500 transition-colors"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setReports(prev => prev.filter(r => r.id !== report.id))}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold">{report.hospitalName}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold">{report.time}</span>
                  </div>
                  {report.ambulanceId && (
                    <div className="flex items-center gap-3 text-slate-600">
                      <Truck className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-bold">{ambulances.find(a => a.id === report.ambulanceId)?.plateNumber || 'سيارة غير معروفة'}</span>
                    </div>
                  )}
                  {report.employeeId && (
                    <div className="flex items-center gap-3 text-slate-600">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-bold">{lang === 'ar' ? employees.find(e => e.id === report.employeeId)?.nameAr : employees.find(e => e.id === report.employeeId)?.nameEn || 'موظف غير معروف'}</span>
                    </div>
                  )}
                </div>

                {report.notes && (
                  <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-100 italic text-[11px] text-slate-500 font-medium">
                    {report.notes}
                  </div>
                )}

                <div className="mt-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-[10px] font-black text-green-600 uppercase">مكتمل</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderRoles = () => (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
          <ShieldAlert className="w-7 h-7 text-blue-600" /> {lang === 'ar' ? 'إدارة الأدوار المخصصة' : 'Custom Roles Management'}
        </h3>
        <button 
          onClick={() => { setShowAddRoleModal(true); setEditingRoleId(null); setNewRoleName(''); setNewRolePermissions([]); }}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" /> {lang === 'ar' ? 'إضافة دور جديد' : 'Add New Role'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customRoles.length === 0 ? (
          <div className="col-span-full bg-white p-20 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
            <ShieldAlert className="w-16 h-16 mb-4 opacity-20" />
            <p className="font-bold">{lang === 'ar' ? 'لا توجد أدوار مخصصة حالياً' : 'No custom roles defined yet'}</p>
          </div>
        ) : (
          customRoles.map(role => (
            <div key={role.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col gap-4 relative group">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800">{role.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{role.permissions.length} {lang === 'ar' ? 'صلاحيات' : 'Permissions'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => startEditRole(role)}
                    className="text-slate-300 hover:text-blue-500 transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setCustomRoles(prev => prev.filter(r => r.id !== role.id))}
                    className="text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {role.permissions.slice(0, 5).map(p => (
                  <span key={p} className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                    {p.replace('can_', '').replace(/_/g, ' ')}
                  </span>
                ))}
                {role.permissions.length > 5 && (
                  <span className="text-[9px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">
                    +{role.permissions.length - 5}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderLeaves = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center no-print">
        <h3 className="text-xl font-black text-slate-800">{t.leaveRequests}</h3>
        {!isReadOnly && (
          <button 
            onClick={() => setShowAddLeaveModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-black hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-5 h-5" /> {t.addLeaveRequest}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leaveRequests.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-[3rem] border border-slate-100 text-center">
            <Clock className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-bold">{lang === 'ar' ? 'لا توجد طلبات إجازات حالياً' : 'No leave requests currently'}</p>
          </div>
        ) : (
          leaveRequests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(req => (
            <div key={req.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800">{req.employeeName}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{lang === 'ar' ? 'طلب إجازة' : 'Leave Request'}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                  req.status === 'approved' ? 'bg-green-100 text-green-600' : 
                  req.status === 'rejected' ? 'bg-red-100 text-red-600' : 
                  'bg-amber-100 text-amber-600'
                }`}>
                  {req.status === 'approved' ? (lang === 'ar' ? 'مقبول' : 'Approved') : 
                   req.status === 'rejected' ? (lang === 'ar' ? 'مرفوض' : 'Rejected') : 
                   (lang === 'ar' ? 'قيد الانتظار' : 'Pending')}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{t.leaveStartDate}</p>
                  <p className="text-xs font-bold text-slate-700">{req.startDate}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{t.leaveEndDate}</p>
                  <p className="text-xs font-bold text-slate-700">{req.endDate}</p>
                </div>
              </div>

              {(req.lastLeaveStartDate || req.lastLeaveDuration) && (
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2">{lang === 'ar' ? 'معلومات آخر إجازة' : 'Last Leave Info'}</p>
                  <div className="flex justify-between text-[11px] font-bold text-slate-600">
                    <span>{t.lastLeaveStartDate}: {req.lastLeaveStartDate || '-'}</span>
                    <span>{t.lastLeaveDuration}: {req.lastLeaveDuration || '-'}</span>
                  </div>
                </div>
              )}

              {!isReadOnly && req.status === 'pending' && (
                <div className="flex gap-2 mt-2 no-print">
                  <button 
                    onClick={() => setLeaveRequests(prev => prev.map(r => r.id === req.id ? {...r, status: 'approved'} : r))}
                    className="flex-1 bg-green-600 text-white py-2 rounded-xl text-xs font-black hover:bg-green-700 transition-all"
                  >
                    {lang === 'ar' ? 'قبول' : 'Approve'}
                  </button>
                  <button 
                    onClick={() => setLeaveRequests(prev => prev.map(r => r.id === req.id ? {...r, status: 'rejected'} : r))}
                    className="flex-1 bg-red-600 text-white py-2 rounded-xl text-xs font-black hover:bg-red-700 transition-all"
                  >
                    {lang === 'ar' ? 'رفض' : 'Reject'}
                  </button>
                </div>
              )}
              
              {!isReadOnly && (
                <button 
                  onClick={() => setLeaveRequests(prev => prev.filter(r => r.id !== req.id))}
                  className="text-[10px] font-bold text-slate-300 hover:text-red-500 transition-colors mt-2 self-center no-print"
                >
                  {lang === 'ar' ? 'حذف الطلب' : 'Delete Request'}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderDashboard = () => {
    const activeVehicles = ambulances.filter(a => a.status === VehicleStatus.ACTIVE);
    const maintenanceVehicles = ambulances.filter(a => a.status === VehicleStatus.MAINTENANCE);
    const outOfServiceVehicles = ambulances.filter(a => a.status === VehicleStatus.OUT_OF_SERVICE);
    const expiredEmployees = employees.filter(e => e.classificationCard?.expiryDate && checkExpiryStatus(e.classificationCard.expiryDate).status === 'expired');
    const warningEmployees = employees.filter(e => e.classificationCard?.expiryDate && checkExpiryStatus(e.classificationCard.expiryDate).status === 'warning');

    return (
      <div className="space-y-10 animate-in fade-in duration-700 no-print">
        {/* Today's Shifts Section - Moved to Top */}
        <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500"></div>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="w-full lg:w-1/3">
              <h3 className="text-2xl font-black mb-4">{t.todayShifts}</h3>
              <p className="text-slate-400 text-sm font-bold mb-8 uppercase tracking-widest">{new Date().toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
              <div className="space-y-6">
                {[ShiftType.MORNING, ShiftType.EVENING, ShiftType.NIGHT].map(s => {
                  const todayStr = new Date().toISOString().split('T')[0];
                  const shiftEntries = schedule.filter(e => e.date === todayStr && e.shift === s);
                  const count = shiftEntries.length;
                  
                  return (
                    <div key={s} className="flex flex-col gap-3 group border-b border-white/5 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-xl transition-all ${s === ShiftType.MORNING ? 'bg-amber-500/20 text-amber-500' : s === ShiftType.EVENING ? 'bg-orange-500/20 text-orange-500' : 'bg-indigo-500/20 text-indigo-500'}`}>
                            {s === ShiftType.MORNING ? <Sun className="w-5 h-5" /> : s === ShiftType.EVENING ? <Sunset className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                          </div>
                          <span className="font-bold text-lg">{getShiftLabel(s)}</span>
                        </div>
                        <span className="text-xs font-black px-4 py-1 bg-white/5 rounded-full border border-white/10 group-hover:bg-blue-600 transition-colors">
                          {count} {lang === 'ar' ? 'موظف' : 'Staff'}
                        </span>
                      </div>
                      
                      {/* Display Employee Names */}
                      <div className="flex flex-wrap gap-2 pr-14">
                        {shiftEntries.length > 0 ? (
                          shiftEntries.map(entry => {
                            const emp = employees.find(e => e.id === entry.employeeId);
                            return emp ? (
                              <div key={emp.id} className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                <span className="text-xs font-bold text-slate-300">{lang === 'ar' ? emp.nameAr : emp.nameEn}</span>
                              </div>
                            ) : null;
                          })
                        ) : (
                          <span className="text-[10px] text-slate-600 italic font-medium pr-2">
                            {lang === 'ar' ? 'لا يوجد موظفين مسجلين لهذه الفترة' : 'No staff assigned for this shift'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="w-full lg:w-1/2 flex flex-col gap-4">
               {!isReadOnly && (
                 <div className="p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
                   <h4 className="font-black text-blue-400 text-sm mb-4 uppercase tracking-tighter">{t.dbStatus}</h4>
                   <div className="flex items-center gap-3 text-green-400">
                      <Database className="w-5 h-5" />
                      <span className="text-xs font-bold">{t.connected}</span>
                   </div>
                 </div>
               )}
               <button onClick={() => setActiveTab('schedule')} className="w-full bg-blue-600 p-5 rounded-[2rem] font-black hover:bg-blue-500 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/20 active:scale-95">
                 <Calendar className="w-6 h-6" /> {t.goToSchedule}
               </button>
            </div>
          </div>
        </div>

        {/* Stats Cards Grid - Reordered */}
        <div className={`grid grid-cols-1 md:grid-cols-2 ${isReadOnly ? 'lg:grid-cols-4' : 'lg:grid-cols-5'} gap-6`}>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between border-b-4 border-b-indigo-500">
            <ClipboardList className="w-8 h-8 text-indigo-500 mb-2" />
            <span className="text-3xl font-black text-slate-800">{reports.length}</span>
            <span className="text-sm font-bold text-slate-500">{t.totalReports}</span>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between border-b-4 border-b-green-500">
            <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
            <span className="text-3xl font-black text-slate-800">{activeVehicles.length}</span>
            <span className="text-sm font-bold text-slate-500">{t.readyVehicles}</span>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between border-b-4 border-b-amber-500">
            <Wrench className="w-8 h-8 text-amber-500 mb-2" />
            <span className="text-3xl font-black text-slate-800">{maintenanceVehicles.length}</span>
            <span className="text-sm font-bold text-slate-500">{t.inMaintenance}</span>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between border-b-4 border-b-red-500">
            <ShieldAlert className="w-8 h-8 text-red-500 mb-2" />
            <span className="text-3xl font-black text-slate-800">{outOfServiceVehicles.length}</span>
            <span className="text-sm font-bold text-slate-500">{t.outOfService}</span>
          </div>
          {!isReadOnly && (
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between border-b-4 border-b-blue-500">
              <Users className="w-8 h-8 text-blue-500 mb-2" />
              <span className="text-3xl font-black text-slate-800">{employees.length}</span>
              <span className="text-sm font-bold text-slate-500">{t.totalStaff}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col h-full">
            <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-500" /> {t.activeVehicles}
            </h3>
            <div className="space-y-4 overflow-y-auto max-h-[400px] custom-scrollbar pr-2">
              {activeVehicles.length === 0 ? (
                <p className="text-slate-400 italic text-center py-6 text-sm">لا توجد مركبات نشطة حالياً</p>
              ) : (
                activeVehicles.map(a => (
                  <div key={a.id} className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl border border-green-100">
                    <div className="p-2 bg-green-500 text-white rounded-xl"><Truck className="w-5 h-5" /></div>
                    <div>
                      <p className="font-black text-slate-800 text-sm">{a.plateNumber}</p>
                      <p className="text-[10px] text-slate-500 font-bold">{a.model}</p>
                    </div>
                    <div className="mr-auto text-[10px] font-black text-green-600 bg-white px-3 py-1 rounded-full border border-green-200 uppercase">{getStatusLabel(a.status)}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col h-full">
            <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
              <Wrench className="w-6 h-6 text-amber-500" /> {t.underMaintenance}
            </h3>
            <div className="space-y-4 overflow-y-auto max-h-[400px] custom-scrollbar pr-2">
              {maintenanceVehicles.length === 0 ? (
                <p className="text-slate-400 italic text-center py-6 text-sm">لا توجد مركبات في الصيانة حالياً</p>
              ) : (
                maintenanceVehicles.map(a => (
                  <div key={a.id} className="flex flex-col gap-2 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-amber-500 text-white rounded-xl"><Wrench className="w-5 h-5" /></div>
                      <div>
                        <p className="font-black text-slate-800 text-sm">{a.plateNumber}</p>
                        <p className="text-[10px] text-slate-500 font-bold">{a.model}</p>
                      </div>
                      <div className="mr-auto text-[10px] font-black text-amber-600 bg-white px-3 py-1 rounded-full border border-amber-200 uppercase">{getStatusLabel(a.status)}</div>
                    </div>
                    {a.issues.length > 0 && (
                      <p className="text-[10px] text-amber-700 bg-white/50 p-2 rounded-lg font-bold border border-amber-200">
                        {a.issues[a.issues.length - 1]}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col h-full">
            <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-red-500" /> {t.outOfServiceTitle}
            </h3>
            <div className="space-y-4 overflow-y-auto max-h-[400px] custom-scrollbar pr-2">
              {outOfServiceVehicles.length === 0 ? (
                <p className="text-slate-400 italic text-center py-6 text-sm">لا توجد مركبات خارج الخدمة</p>
              ) : (
                outOfServiceVehicles.map(a => (
                  <div key={a.id} className="flex flex-col gap-2 p-4 bg-red-50 rounded-2xl border border-red-100">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-red-500 text-white rounded-xl"><ShieldAlert className="w-5 h-5" /></div>
                      <div>
                        <p className="font-black text-slate-800 text-sm">{a.plateNumber}</p>
                        <p className="text-[10px] text-slate-500 font-bold">{a.model}</p>
                      </div>
                      <div className="mr-auto text-[10px] font-black text-red-600 bg-white px-3 py-1 rounded-full border border-red-200 uppercase">{getStatusLabel(a.status)}</div>
                    </div>
                    <div className="bg-white/50 p-2 rounded-lg border border-red-200">
                      <p className="text-[9px] font-black text-red-400 uppercase mb-1">الملاحظة الفنية:</p>
                      <p className="text-[10px] text-red-700 font-bold italic">{a.issues[a.issues.length - 1] || 'بانتظار تقرير الفني'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col h-full">
            <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-500" /> {t.expiryAlerts}
            </h3>
            <div className="space-y-4 overflow-y-auto max-h-[400px] custom-scrollbar pr-2">
              {[...expiredEmployees, ...warningEmployees].length === 0 ? (
                <p className="text-slate-400 italic text-center py-6 text-sm">{t.noAlerts}</p>
              ) : (
                [...expiredEmployees, ...warningEmployees].map(e => {
                  const status = checkExpiryStatus(e.classificationCard?.expiryDate);
                  return (
                    <div key={e.id} className={`flex flex-col gap-2 p-4 rounded-2xl border ${status.status === 'expired' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl text-white ${status.status === 'expired' ? 'bg-red-500' : 'bg-amber-500'}`}>
                            <Users className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-black text-slate-800 text-sm">{lang === 'ar' ? e.nameAr : e.nameEn}</p>
                            <p className="text-[10px] text-slate-500 font-bold">{t.classificationCard}</p>
                          </div>
                        </div>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full bg-white border ${status.color.replace('text-', 'border-').replace('500', '200')} ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-600 bg-white/50 p-2 rounded-lg border border-slate-200">
                        {t.expiryDate}: {e.classificationCard?.expiryDate}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>
    );
  };

  const renderSchedule = () => (
    <div className="space-y-6">
      <div className="print-title">جدول مناوبات الأسبوع - يبدأ من {weekDates[0]}</div>
      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div className="grid grid-cols-7 gap-4 min-w-[1200px] print:min-w-0 schedule-grid">
          {weekDates.map(date => {
            const isToday = new Date().toISOString().split('T')[0] === date;
            return (
              <div key={date} className={`flex flex-col gap-4 rounded-3xl p-5 bg-white border border-slate-100 ${isToday ? 'ring-2 ring-blue-500 shadow-xl' : 'shadow-sm'}`}>
                <div className="text-center border-b pb-4">
                  <p className="text-xs font-bold text-slate-400">{new Date(date).toLocaleDateString('ar-SA', { weekday: 'long' })}</p>
                  <p className="text-xl font-black text-slate-800">{date.split('-')[2]}</p>
                </div>
                {[ShiftType.MORNING, ShiftType.EVENING, ShiftType.NIGHT].map(s => {
                  const entries = schedule.filter(x => x.date === date && x.shift === s);
                  return (
                    <div key={s} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-[10px] font-black text-slate-500 flex items-center gap-1 uppercase">
                          {s === ShiftType.MORNING ? <Sun className="w-3 h-3 text-amber-500" /> : s === ShiftType.EVENING ? <Sunset className="w-3 h-3 text-orange-500" /> : <Moon className="w-3 h-3 text-indigo-500" />}
                          {getShiftLabel(s)}
                        </p>
                        <span className="text-[9px] font-bold text-slate-400">({entries.length})</span>
                      </div>
                      <div className="space-y-1">
                        {entries.map(e => {
                          const emp = employees.find(emp => emp.id === e.employeeId);
                          return (
                            <div key={e.employeeId} className="flex items-center justify-between p-2 bg-blue-50 text-blue-900 rounded-xl text-[11px] font-black group">
                              <span className="truncate">{lang === 'ar' ? emp?.nameAr : emp?.nameEn}</span>
                              {!isReadOnly && (
                                <button onClick={() => removeShiftEntry(date, s, e.employeeId)} className="no-print opacity-0 group-hover:opacity-100 hover:text-red-500">
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          );
                        })}
                        {!isReadOnly && (
                          <div className="no-print mt-2">
                            <select 
                              value=""
                              onChange={e => addShiftEntry(date, s, e.target.value)}
                              className="w-full bg-slate-50 border-none p-2 text-[10px] rounded-lg font-bold cursor-pointer hover:bg-slate-100"
                            >
                              <option value="">+ إضافة موظف</option>
                              {employees.map(emp => (
                                <option key={emp.id} value={emp.id} disabled={!emp.allowedShifts.includes(s)}>{lang === 'ar' ? emp.nameAr : emp.nameEn}</option>
                              ))}
                            </select>
                          </div>
                        )}
                        {entries.length === 0 && <div className="text-[10px] italic text-slate-300 text-center py-2">شاغر</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
          <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 md:p-12 shadow-2xl">
            <div className="text-center mb-10">
              <div className="inline-flex p-4 bg-blue-500/10 rounded-2xl mb-4"><ShieldAlert className="w-12 h-12 text-blue-500" /></div>
              <h1 className="text-2xl font-black text-white">نظام جدولة المناوبات</h1>
              <p className="text-slate-500 text-sm mt-2 font-bold uppercase tracking-widest">تسجيل دخول الموظفين</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <UserCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input type="text" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} placeholder="اسم المستخدم" className="w-full bg-slate-950 border-2 border-slate-800 text-white p-4 pr-12 rounded-2xl focus:border-blue-500 outline-none font-bold" />
              </div>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="كلمة المرور" className="w-full bg-slate-950 border-2 border-slate-800 text-white p-4 pr-12 rounded-2xl focus:border-blue-500 outline-none font-bold" />
              </div>
              {loginError && <p className="text-red-500 text-xs font-bold px-2 flex items-center gap-2"><Activity className="w-3 h-3" /> {loginError}</p>}
              <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95">دخول للنظام</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (!isDataLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 font-sans">
        <Activity className="w-16 h-16 text-blue-500 animate-pulse mb-6" />
        <h2 className="text-white font-black text-xl mb-2">{lang === 'ar' ? 'جاري تحميل البيانات...' : 'Loading Data...'}</h2>
        <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 animate-[loading_1.5s_ease-in-out_infinite]" style={{ width: '30%' }}></div>
        </div>
        <style>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(400%); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Save Toast */}
      {showSaveToast && (
        <div className={`fixed top-8 ${lang === 'ar' ? 'left-1/2 -translate-x-1/2' : 'right-8'} z-[300] bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-black animate-in slide-in-from-top-4 duration-500`}>
          <CheckCircle2 className="w-6 h-6" /> {t.saveSuccess}
        </div>
      )}

      {/* Modals */}
      {showAddAmbModal && (
        <div className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 no-print">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-xl font-black mb-6">إضافة سيارة إسعاف</h2>
            <div className="space-y-4">
              <input type="text" value={newAmbPlate} onChange={e => setNewAmbPlate(e.target.value)} placeholder="رقم اللوحة" className="w-full p-4 bg-slate-100 rounded-2xl border-none font-bold outline-none" />
              <div className="flex gap-3">
                <button onClick={addAmbulance} className="flex-1 bg-blue-600 text-white p-4 rounded-2xl font-black">حفظ</button>
                <button onClick={() => setShowAddAmbModal(false)} className="px-6 bg-slate-100 text-slate-600 rounded-2xl font-bold">إلغاء</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddUserModal && (
        <div className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 no-print">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-xl font-black mb-6">إضافة مستخدم جديد</h2>
            <div className="space-y-4">
              <input type="text" value={newUserUsername} onChange={e => setNewUserUsername(e.target.value)} placeholder="اسم المستخدم" className="w-full p-4 bg-slate-100 rounded-2xl border-none font-bold outline-none" />
              <input type="password" value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} placeholder="كلمة المرور" className="w-full p-4 bg-slate-100 rounded-2xl border-none font-bold outline-none" />
              <select value={newUserRole} onChange={e => setNewUserRole(e.target.value as UserRole)} className="w-full p-4 bg-slate-100 rounded-2xl border-none font-bold outline-none">
                <option value={UserRole.STAFF}>{t.roleStaff}</option>
                <option value={UserRole.SUPERVISOR}>{t.roleSupervisor}</option>
                <option value={UserRole.ADMIN}>{t.roleAdmin}</option>
                <option value={UserRole.CUSTOM}>{t.roleCustom}</option>
              </select>
              {newUserRole === UserRole.CUSTOM && (
                <select 
                  value={newUserCustomRoleId} 
                  onChange={e => setNewUserCustomRoleId(e.target.value)} 
                  className="w-full p-4 bg-slate-100 rounded-2xl border-none font-bold outline-none"
                >
                  <option value="">{lang === 'ar' ? 'اختر الدور المخصص' : 'Select Custom Role'}</option>
                  {customRoles.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              )}
              <div className="flex gap-3 pt-4">
                <button onClick={addNewUser} className="flex-1 bg-blue-600 text-white p-4 rounded-2xl font-black">إضافة المستخدم</button>
                <button onClick={() => setShowAddUserModal(false)} className="px-6 bg-slate-100 text-slate-600 rounded-2xl font-bold">إلغاء</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddRoleModal && (
        <div className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 no-print">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl p-10 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-xl font-black mb-6">{editingRoleId ? (lang === 'ar' ? 'تعديل الدور' : 'Edit Role') : (lang === 'ar' ? 'إضافة دور جديد' : 'Add New Role')}</h2>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block px-2">{lang === 'ar' ? 'اسم الدور' : 'Role Name'}</label>
                <input 
                  type="text" 
                  value={newRoleName} 
                  onChange={e => setNewRoleName(e.target.value)} 
                  placeholder={lang === 'ar' ? 'مثال: مدير تقارير' : 'e.g. Reports Manager'} 
                  className="w-full p-4 bg-slate-100 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                />
              </div>
              
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block px-2">{lang === 'ar' ? 'الصلاحيات' : 'Permissions'}</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    'can_view_dashboard', 'can_view_schedule', 'can_manage_schedule',
                    'can_view_reports', 'can_manage_reports', 'can_view_employees',
                    'can_manage_employees', 'can_view_ambulances', 'can_manage_ambulances',
                    'can_view_hospitals', 'can_manage_hospitals', 'can_view_users',
                    'can_manage_users', 'can_manage_roles'
                  ].map((p: any) => (
                    <label key={p} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={newRolePermissions.includes(p as Permission)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewRolePermissions(prev => [...prev, p as Permission]);
                          } else {
                            setNewRolePermissions(prev => prev.filter(item => item !== p));
                          }
                        }}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs font-bold text-slate-700">{(t as any)[p] || p.replace('can_', '').replace(/_/g, ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={addCustomRole} className="flex-1 bg-blue-600 text-white p-4 rounded-2xl font-black hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">{t.save}</button>
                <button onClick={() => { setShowAddRoleModal(false); setEditingRoleId(null); setNewRoleName(''); setNewRolePermissions([]); }} className="px-6 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">{t.cancel}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddLeaveModal && (
        <div className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 no-print">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-xl font-black mb-6">{t.addLeaveRequest}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block px-2">{t.employeeName}</label>
                <select 
                  value={newLeaveEmployeeId} 
                  onChange={e => setNewLeaveEmployeeId(e.target.value)} 
                  className="w-full p-4 bg-slate-100 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="">{lang === 'ar' ? 'اختر الموظف' : 'Select Employee'}</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{lang === 'ar' ? emp.nameAr : emp.nameEn}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block px-2">{t.leaveStartDate}</label>
                  <input 
                    type="date" 
                    value={newLeaveStartDate} 
                    onChange={e => setNewLeaveStartDate(e.target.value)} 
                    className="w-full p-4 bg-slate-100 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block px-2">{t.leaveEndDate}</label>
                  <input 
                    type="date" 
                    value={newLeaveEndDate} 
                    onChange={e => setNewLeaveEndDate(e.target.value)} 
                    className="w-full p-4 bg-slate-100 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-4">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-4 px-2">{lang === 'ar' ? 'معلومات آخر إجازة (اختياري)' : 'Last Leave Info (Optional)'}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block px-2">{t.lastLeaveStartDate}</label>
                    <input 
                      type="date" 
                      value={newLeaveLastStartDate} 
                      onChange={e => setNewLeaveLastStartDate(e.target.value)} 
                      className="w-full p-4 bg-slate-100 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block px-2">{t.lastLeaveDuration}</label>
                    <input 
                      type="text" 
                      value={newLeaveLastDuration} 
                      onChange={e => setNewLeaveLastDuration(e.target.value)} 
                      placeholder={lang === 'ar' ? 'مثال: 5 أيام' : 'e.g. 5 days'}
                      className="w-full p-4 bg-slate-100 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <button onClick={addNewLeaveRequest} className="flex-1 bg-blue-600 text-white p-4 rounded-2xl font-black hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">{lang === 'ar' ? 'إرسال الطلب' : 'Submit Request'}</button>
                <button onClick={() => setShowAddLeaveModal(false)} className="px-6 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">{t.cancel}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddReportModal && (
        <div className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 no-print">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-xl font-black mb-6">{editingReportId ? t.editReport : t.addReport}</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block px-2">{t.reportNumber}</label>
                  <input 
                    type="text" 
                    value={newReportNumber} 
                    onChange={e => setNewReportNumber(e.target.value)} 
                    placeholder="مثال: 123456" 
                    className="w-full p-4 bg-slate-100 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block px-2">{lang === 'ar' ? 'تاريخ البلاغ' : 'Report Date'}</label>
                  <input 
                    type="date" 
                    value={newReportDate} 
                    onChange={e => setNewReportDate(e.target.value)} 
                    className="w-full p-4 bg-slate-100 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block px-2">{t.hospital}</label>
                  <select 
                    value={newReportHospital} 
                    onChange={e => setNewReportHospital(e.target.value)} 
                    className="w-full p-4 bg-slate-100 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    {hospitals.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block px-2">{lang === 'ar' ? 'سيارة الإسعاف' : 'Ambulance'}</label>
                  <select 
                    value={newReportAmbulanceId} 
                    onChange={e => setNewReportAmbulanceId(e.target.value)} 
                    className="w-full p-4 bg-slate-100 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="">{lang === 'ar' ? 'اختر السيارة' : 'Select Vehicle'}</option>
                    {ambulances.map(a => (
                      <option key={a.id} value={a.id}>{a.plateNumber} - {a.model}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block px-2">{lang === 'ar' ? 'الموظف المسؤول' : 'Responsible Employee'}</label>
                <select 
                  value={newReportEmployeeId} 
                  onChange={e => setNewReportEmployeeId(e.target.value)} 
                  className="w-full p-4 bg-slate-100 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="">{lang === 'ar' ? 'اختر الموظف' : 'Select Employee'}</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{lang === 'ar' ? emp.nameAr : emp.nameEn}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block px-2">{t.notes}</label>
                <textarea 
                  value={newReportNotes} 
                  onChange={e => setNewReportNotes(e.target.value)} 
                  placeholder="..." 
                  className="w-full p-4 bg-slate-100 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all h-24 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={addReport} className="flex-1 bg-blue-600 text-white p-4 rounded-2xl font-black hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">{t.saveReport}</button>
                <button onClick={() => { setShowAddReportModal(false); setEditingReportId(null); setNewReportNumber(''); setNewReportAmbulanceId(''); setNewReportEmployeeId(''); }} className="px-6 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">{t.cancel}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Header */}
      <div className="md:hidden bg-slate-950 text-white p-4 flex items-center justify-between no-print sticky top-0 z-50">
        <div className="flex items-center gap-2 text-blue-500 font-black">
          <Activity className="w-6 h-6" />
          <span className="text-sm">{t.appName}</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-slate-900 rounded-lg text-slate-400"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-0 z-40 bg-slate-950 text-white p-8 flex flex-col gap-8 shadow-2xl no-print transition-transform duration-300
        md:relative md:translate-x-0 md:w-[280px] md:flex
        ${isMobileMenuOpen ? 'translate-x-0' : (lang === 'ar' ? 'translate-x-full' : '-translate-x-full')}
      `}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-blue-500 font-black text-xl">
            <Activity className="w-8 h-8" />
            <span>{t.appName}</span>
          </div>
          <button 
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="p-2 bg-slate-900 rounded-xl hover:bg-blue-600 transition-all text-slate-400 hover:text-white"
            title={lang === 'ar' ? 'Switch to English' : 'تغيير للغة العربية'}
          >
            <Globe className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-2 overflow-y-auto">
          {navItems.filter(i => i.allowed).map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as any);
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
                activeTab === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'text-slate-500 hover:text-white hover:bg-slate-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-bold">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto p-4 bg-slate-900 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-black text-sm">{currentUser.username[0].toUpperCase()}</div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-black truncate">{currentUser.username}</p>
              <p className="text-[9px] text-slate-500 uppercase font-bold">{currentUser.role}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/50 border border-slate-800/50 mb-4">
            <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
            <span className="text-[10px] font-bold text-slate-400">
              {isSyncing ? (lang === 'ar' ? 'جاري المزامنة...' : 'Syncing...') : (lang === 'ar' ? 'متصل بالسحابة' : 'Cloud Synced')}
            </span>
          </div>
          <button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><LogOut className="w-4 h-4" /> خروج</button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-12 overflow-y-auto">
        <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8 md:mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight">
              {navItems.find(n => n.id === activeTab)?.label}
            </h2>
            <p className="text-slate-400 text-xs md:text-sm font-bold mt-1">{lang === 'ar' ? 'المكتب الفني للخدمات الطبية' : 'Technical Office for Medical Services'}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-3 no-print w-full lg:w-auto">
            {!isReadOnly && (
              <button 
                onClick={handleSaveAll}
                className="flex items-center gap-2 bg-green-600 text-white px-4 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl font-black text-xs md:text-sm hover:bg-green-700 transition-all shadow-lg shadow-green-600/20"
              >
                <Save className="w-4 h-4" /> <span className="hidden sm:inline">{t.save}</span>
              </button>
            )}
            {activeTab !== 'users' && (
              <button 
                onClick={() => {
                  try {
                    window.print();
                  } catch (e) {
                    console.error('Print failed', e);
                    alert(lang === 'ar' ? 'حدث خطأ أثناء محاولة الطباعة. يرجى استخدام Ctrl+P' : 'Error trying to print. Please use Ctrl+P');
                  }
                }} 
                className="flex items-center gap-2 bg-slate-800 text-white px-4 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl font-black text-xs md:text-sm hover:bg-black transition-all no-print"
              >
                <Printer className="w-4 h-4" /> <span className="hidden sm:inline">{t.print}</span>
              </button>
            )}
            {currentUser.role === UserRole.ADMIN && (
              <div className="flex items-center gap-2 no-print">
                <button 
                  onClick={handleBackupData}
                  className="flex items-center gap-2 bg-slate-700 text-white px-4 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl font-black text-xs md:text-sm hover:bg-slate-800 transition-all shadow-lg"
                  title={t.backupData}
                >
                  <Download className="w-4 h-4" />
                </button>
                <label className="flex items-center gap-2 bg-slate-700 text-white px-4 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl font-black text-xs md:text-sm hover:bg-slate-800 transition-all shadow-lg cursor-pointer" title={t.restoreData}>
                  <Upload className="w-4 h-4" />
                  <input type="file" accept=".json" onChange={handleRestoreData} className="hidden" />
                </label>
              </div>
            )}
            {['schedule', 'reports', 'employees', 'ambulances', 'hospitals'].includes(activeTab) && (
              <button 
                onClick={() => {
                  if (activeTab === 'schedule') exportScheduleToExcel(schedule, employees, weekDates, lang);
                  else if (activeTab === 'reports') exportReportsToExcel(reports, ambulances, employees, lang);
                  else if (activeTab === 'employees') exportEmployeesToExcel(employees, lang);
                  else if (activeTab === 'ambulances') exportAmbulancesToExcel(ambulances, lang);
                  else if (activeTab === 'hospitals') exportHospitalsToExcel(hospitals, lang);
                }} 
                className="flex items-center gap-2 bg-emerald-600 text-white px-4 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl font-black text-xs md:text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 no-print"
              >
                <FileSpreadsheet className="w-4 h-4" /> <span className="hidden sm:inline">{t.exportExcel}</span>
              </button>
            )}
            {activeTab === 'schedule' && (
              <div className="flex items-center gap-2 bg-white p-1 md:p-2 rounded-xl md:rounded-2xl shadow-sm border border-slate-200">
                <button onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)))} className="p-1 md:p-2 hover:bg-slate-50 rounded-lg md:rounded-xl"><ChevronRight className="w-4 h-4" /></button>
                <span className="font-black text-[10px] md:text-xs px-1 md:px-2 whitespace-nowrap">{weekDates[0]}</span>
                <button onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)))} className="p-1 md:p-2 hover:bg-slate-50 rounded-lg md:rounded-xl"><ChevronLeft className="w-4 h-4" /></button>
              </div>
            )}
            {activeTab === 'employees' && !isReadOnly && (
              <div className="flex bg-white p-1 rounded-xl md:rounded-2xl shadow-sm border">
                <input type="text" value={newEmployeeName} onChange={e => setNewEmployeeName(e.target.value)} placeholder={lang === 'ar' ? 'اسم...' : 'Name...'} className="px-2 md:px-4 py-1 md:py-2 border-none bg-transparent text-xs md:text-sm font-bold w-24 md:w-40 outline-none" />
                <button onClick={addEmployee} className="p-2 md:p-3 bg-blue-600 text-white rounded-lg md:rounded-xl"><Plus className="w-4 h-4 md:w-5 h-5" /></button>
              </div>
            )}
          </div>
        </header>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'schedule' && renderSchedule()}
        {activeTab === 'reports' && renderReports()}
        {activeTab === 'leaves' && renderLeaves()}
        {activeTab === 'hospitals' && renderHospitals()}
        {activeTab === 'roles' && renderRoles()}
        {activeTab === 'employees' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm no-print">
              <div className="relative">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder={lang === 'ar' ? 'بحث باسم الموظف أو رقم البطاقة...' : 'Search by employee name or card number...'}
                  value={employeeSearch}
                  onChange={e => setEmployeeSearch(e.target.value)}
                  className="w-full pr-12 pl-4 py-4 bg-slate-50 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 no-print">
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center"><AlertTriangle className="w-5 h-5" /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">{t.expired}</p>
                  <p className="text-xl font-black text-slate-800">{employees.filter(e => checkExpiryStatus(e.classificationCard?.expiryDate).status === 'expired').length}</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center"><Clock className="w-5 h-5" /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">{t.expiresSoon}</p>
                  <p className="text-xl font-black text-slate-800">{employees.filter(e => checkExpiryStatus(e.classificationCard?.expiryDate).status === 'warning').length}</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center"><CheckCircle className="w-5 h-5" /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">{t.valid}</p>
                  <p className="text-xl font-black text-slate-800">{employees.filter(e => checkExpiryStatus(e.classificationCard?.expiryDate).status === 'valid').length}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
              {employees.filter(e => 
                e.nameAr.toLowerCase().includes(employeeSearch.toLowerCase()) || 
                e.nameEn.toLowerCase().includes(employeeSearch.toLowerCase()) ||
                (e.classificationCard?.number || '').includes(employeeSearch)
              ).map(emp => (
              <div key={emp.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all flex flex-col gap-5">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center"><Users className="w-6 h-6" /></div>
                    <div>
                      <h3 className="font-black text-slate-800">{lang === 'ar' ? emp.nameAr : emp.nameEn}</h3>
                      <p className="text-xs text-slate-400 font-bold">{emp.position}</p>
                    </div>
                  </div>
                  {!isReadOnly && <button onClick={() => setEmployees(prev => prev.filter(e => e.id !== emp.id))} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>}
                </div>

                {/* Classification Card Section */}
                <div className="p-4 bg-slate-50 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.classificationCard}</p>
                    {emp.classificationCard?.expiryDate && (
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full bg-white border ${checkExpiryStatus(emp.classificationCard.expiryDate).color.replace('text-', 'border-').replace('500', '200')} ${checkExpiryStatus(emp.classificationCard.expiryDate).color}`}>
                        {checkExpiryStatus(emp.classificationCard.expiryDate).label}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 px-1">{t.cardNumber}</label>
                      <input 
                        type="text" 
                        disabled={isReadOnly}
                        value={emp.classificationCard?.number || ''} 
                        onChange={e => setEmployees(prev => prev.map(ex => ex.id === emp.id ? {...ex, classificationCard: {...(ex.classificationCard || {number: '', expiryDate: ''}), number: e.target.value}} : ex))}
                        className="w-full bg-white border-none p-2 text-[11px] font-bold rounded-lg shadow-inner outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 px-1">{t.expiryDate}</label>
                      <input 
                        type="date" 
                        disabled={isReadOnly}
                        value={emp.classificationCard?.expiryDate || ''} 
                        onChange={e => setEmployees(prev => prev.map(ex => ex.id === emp.id ? {...ex, classificationCard: {...(ex.classificationCard || {number: '', expiryDate: ''}), expiryDate: e.target.value}} : ex))}
                        className={`w-full bg-white border-none p-2 text-[11px] font-bold rounded-lg shadow-inner outline-none focus:ring-1 focus:ring-blue-500 ${checkExpiryStatus(emp.classificationCard?.expiryDate).color}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الفترات المسموحة</p>
                        <div className="flex gap-2">
                        {[ShiftType.MORNING, ShiftType.EVENING, ShiftType.NIGHT].map(s => (
                          <button 
                            key={s} 
                            disabled={isReadOnly}
                            onClick={() => setEmployees(prev => prev.map(e => e.id === emp.id ? {...e, allowedShifts: e.allowedShifts.includes(s) ? e.allowedShifts.filter(sh => sh !== s) : [...e.allowedShifts, s]} : e))}
                            className={`flex-1 py-2 rounded-xl text-[10px] font-black border transition-all ${emp.allowedShifts.includes(s) ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-100 text-slate-300 hover:border-blue-200'}`}
                          >
                            {getShiftLabel(s)}
                          </button>
                        ))}
                      </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t.employeeNotes}</p>
                  <textarea 
                    disabled={isReadOnly}
                    value={emp.notes || ''} 
                    onChange={e => setEmployees(prev => prev.map(ex => ex.id === emp.id ? {...ex, notes: e.target.value} : ex))}
                    placeholder="..."
                    className="w-full bg-slate-50 border-none p-3 text-[11px] font-bold rounded-2xl shadow-inner outline-none focus:ring-1 focus:ring-blue-500 h-20 resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {activeTab === 'ambulances' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm no-print">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder={lang === 'ar' ? 'بحث برقم اللوحة أو الموديل...' : 'Search by plate number or model...'}
                value={ambulanceSearch}
                onChange={e => setAmbulanceSearch(e.target.value)}
                className="w-full pr-12 pl-4 py-4 bg-slate-50 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ambulances.filter(a => 
              a.plateNumber.toLowerCase().includes(ambulanceSearch.toLowerCase()) || 
              a.model.toLowerCase().includes(ambulanceSearch.toLowerCase())
            ).map(amb => (
              <div key={amb.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${amb.status === VehicleStatus.ACTIVE ? 'bg-green-100 text-green-600' : amb.status === VehicleStatus.MAINTENANCE ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>
                      <Truck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800">{amb.plateNumber}</h3>
                      <p className="text-xs text-slate-400 font-bold">{amb.model}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 no-print">
                    {!isReadOnly && (
                      <button 
                        onClick={() => setAmbulances(prev => prev.filter(a => a.id !== amb.id))}
                        className="text-slate-300 hover:text-red-500 transition-colors"
                        title={lang === 'ar' ? 'حذف السيارة' : 'Delete Vehicle'}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                    <select 
                      disabled={isReadOnly}
                      value={amb.status} 
                      onChange={e => setAmbulances(prev => prev.map(a => a.id === amb.id ? {...a, status: e.target.value as VehicleStatus} : a))}
                      className="text-[10px] font-black border-none bg-slate-100 rounded-lg p-1 outline-none"
                    >
                      <option value={VehicleStatus.ACTIVE}>{t.statusActive}</option>
                      <option value={VehicleStatus.MAINTENANCE}>{t.statusMaintenance}</option>
                      <option value={VehicleStatus.OUT_OF_SERVICE}>{t.statusOutOfService}</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">سجل الملاحظات الفنية</p>
                  <div className="space-y-1">
                    {amb.issues.map((i, idx) => (
                      <div key={idx} className="text-[11px] font-bold text-slate-600 bg-slate-50 p-2 rounded-lg flex justify-between group">
                        <span>• {i}</span>
                        {!isReadOnly && <button onClick={() => setAmbulances(prev => prev.map(a => a.id === amb.id ? {...a, issues: a.issues.filter((_, x) => x !== idx)} : a))} className="no-print opacity-0 group-hover:opacity-100 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>}
                      </div>
                    ))}
                    {!isReadOnly && (
                      <div className="flex gap-1 mt-2 no-print">
                        <input 
                          type="text" 
                          value={noteInputs[amb.id] || ''} 
                          onChange={e => setNoteInputs(prev => ({ ...prev, [amb.id]: e.target.value }))}
                          onKeyDown={e => e.key === 'Enter' && addNote(amb.id)}
                          placeholder="أدخل ملاحظة فنية..." 
                          className="flex-1 bg-slate-50 border border-slate-200 text-[10px] font-bold p-2 rounded-xl outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button 
                          onClick={() => addNote(amb.id)}
                          className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {!isReadOnly && (
              <button onClick={() => setShowAddAmbModal(true)} className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-400 transition-all no-print">
                <Plus className="w-10 h-10 mb-2" />
                <span className="font-black">إضافة سيارة جديدة</span>
              </button>
            )}
          </div>
        </div>
      )}
        {activeTab === 'users' && canManageUsers && (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase">
                  <th className="p-6">المستخدم</th>
                  <th className="p-6">كلمة المرور</th>
                  <th className="p-6">الدور الوظيفي</th>
                  <th className="p-6">الحالة</th>
                  <th className="p-6 text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-6 font-black text-slate-800">{u.username}</td>
                    <td className="p-6">
                      <input 
                        type="text" 
                        value={u.password} 
                        onChange={e => setUsers(prev => prev.map(us => us.id === u.id ? {...us, password: e.target.value} : us))}
                        className="bg-slate-100 border-none rounded-lg p-2 text-xs font-bold w-24 outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 no-print"
                      />
                    </td>
                    <td className="p-6 font-bold text-xs text-slate-500 uppercase">
                      {getRoleLabel(u.role, u.customRoleId)}
                    </td>
                    <td className="p-6">
                      <button onClick={() => setUsers(prev => prev.map(us => us.id === u.id ? {...us, isActive: !us.isActive} : us))} className={`px-4 py-2 rounded-full text-[10px] font-black transition-all ${u.isActive ? 'bg-green-100 text-green-700 shadow-sm' : 'bg-slate-100 text-slate-500'}`}>{u.isActive ? 'نشط' : 'معطل'}</button>
                    </td>
                    <td className="p-6 text-left">
                      {u.username !== 'admin' && <button onClick={() => setUsers(prev => prev.filter(us => us.id !== u.id))} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-6 border-t bg-slate-50 flex justify-end no-print">
              <button onClick={() => setShowAddUserModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/10"><UserPlus className="w-5 h-5" /> إنشاء حساب مستخدم</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
