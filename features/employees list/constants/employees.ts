export interface Employee {
  id: string
  name: string
  phone: string
  email: string
  registeredAt: string // ISO date
}

export const EMPLOYEES: Employee[] = [
  { id: '1', name: 'عبدالله بن سعود القحطاني', phone: '0501234567', email: 'abdullah.q@company.sa', registeredAt: '2024-01-15' },
  { id: '2', name: 'محمد بن فهد العتيبي', phone: '0559876543', email: 'mohammed.o@company.sa', registeredAt: '2024-02-03' },
  { id: '3', name: 'سلطان بن ناصر الشهري', phone: '0562345678', email: 'sultan.s@company.sa', registeredAt: '2024-02-20' },
  { id: '4', name: 'فيصل بن عبدالعزيز الدوسري', phone: '0533456789', email: 'faisal.d@company.sa', registeredAt: '2024-03-05' },
  { id: '5', name: 'خالد بن تركي المطيري', phone: '0544567890', email: 'khalid.m@company.sa', registeredAt: '2024-03-18' },
  { id: '6', name: 'سعد بن راشد الغامدي', phone: '0575678901', email: 'saad.g@company.sa', registeredAt: '2024-04-02' },
  { id: '7', name: 'بندر بن خالد الحربي', phone: '0586789012', email: 'bandar.h@company.sa', registeredAt: '2024-04-22' },
  { id: '8', name: 'ماجد بن سلمان الزهراني', phone: '0597890123', email: 'majed.z@company.sa', registeredAt: '2024-05-10' },
  { id: '9', name: 'عبدالرحمن بن يوسف القرني', phone: '0508901234', email: 'abdulrahman.q@company.sa', registeredAt: '2024-05-28' },
  { id: '10', name: 'تركي بن عبدالله السبيعي', phone: '0519012345', email: 'turki.s@company.sa', registeredAt: '2024-06-14' },
  { id: '11', name: 'ياسر بن محمد العنزي', phone: '0520123456', email: 'yasser.a@company.sa', registeredAt: '2024-07-01' },
  { id: '12', name: 'ناصر بن فهد الشمري', phone: '0531234567', email: 'nasser.s@company.sa', registeredAt: '2024-07-19' },
]