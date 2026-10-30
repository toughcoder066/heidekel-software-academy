import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { 
  ENROLLMENTS, ORDERS, PAYMENTS, USERS,
  type Enrollment, type Order, type Payment, type User 
} from '../store';

// ============ TYPES ============

export interface CreateOrderInput {
  student_id: string;
  cohort_id: string;
  amount: number;
  currency: string;
}

export interface CreatePaymentInput {
  order_id: string;
  provider: string;
  provider_reference: string;
  amount: number;
  currency: string;
}

export interface AttendanceRecord {
  id: string;
  session_id: string;
  student_id: string;
  cohort_id: string;
  status: 'present' | 'absent' | 'excused' | 'late';
  recorded_at: string;
}

interface EnrollmentContextType {
  // Enrollments
  enrollments: Enrollment[];
  getStudentEnrollments: (studentId: string) => Enrollment[];
  getEnrollmentByStudentAndCohort: (studentId: string, cohortId: string) => Enrollment | undefined;
  isStudentEnrolled: (studentId: string, cohortId: string) => boolean;
  createEnrollment: (studentId: string, cohortId: string, orderId: string) => Enrollment;
  
  // Orders
  orders: Order[];
  getStudentOrders: (studentId: string) => Order[];
  getOrder: (id: string) => Order | undefined;
  createOrder: (input: CreateOrderInput) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  
  // Payments
  payments: Payment[];
  getPaymentByReference: (reference: string) => Payment | undefined;
  getStudentPayments: (studentId: string) => Payment[];
  createPayment: (input: CreatePaymentInput) => Payment;
  markPaymentSuccessful: (paymentId: string) => void;
  
  // Attendance
  attendance: AttendanceRecord[];
  getSessionAttendance: (sessionId: string) => AttendanceRecord[];
  getStudentAttendance: (studentId: string, cohortId: string) => AttendanceRecord[];
  recordAttendance: (sessionId: string, studentId: string, cohortId: string, status: AttendanceRecord['status']) => void;
  bulkRecordAttendance: (sessionId: string, cohortId: string, records: { studentId: string; status: AttendanceRecord['status'] }[]) => void;
  
  // Stats
  getEnrolledCount: (cohortId: string) => number;
  getAttendanceRate: (studentId: string, cohortId: string) => number;
}

const EnrollmentContext = createContext<EnrollmentContextType | null>(null);

// ============ PROVIDER ============

export function EnrollmentProvider({ children }: { children: ReactNode }) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([...ENROLLMENTS]);
  const [orders, setOrders] = useState<Order[]>([...ORDERS]);
  const [payments, setPayments] = useState<Payment[]>([...PAYMENTS]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  // ---- Enrollments ----

  const getStudentEnrollments = useCallback((studentId: string) => {
    return enrollments.filter(e => e.student_id === studentId);
  }, [enrollments]);

  const getEnrollmentByStudentAndCohort = useCallback((studentId: string, cohortId: string) => {
    return enrollments.find(e => e.student_id === studentId && e.cohort_id === cohortId);
  }, [enrollments]);

  const isStudentEnrolled = useCallback((studentId: string, cohortId: string) => {
    return enrollments.some(e => e.student_id === studentId && e.cohort_id === cohortId && e.status === 'active');
  }, [enrollments]);

  const createEnrollment = useCallback((studentId: string, cohortId: string, orderId: string): Enrollment => {
    // Check for duplicate
    const existing = enrollments.find(e => e.student_id === studentId && e.cohort_id === cohortId);
    if (existing) {
      return existing;
    }

    const newEnrollment: Enrollment = {
      id: `enr-${Date.now()}`,
      student_id: studentId,
      cohort_id: cohortId,
      order_id: orderId,
      status: 'active',
      enrolled_at: new Date().toISOString(),
    };
    setEnrollments(prev => [...prev, newEnrollment]);
    return newEnrollment;
  }, [enrollments]);

  // ---- Orders ----

  const getStudentOrders = useCallback((studentId: string) => {
    return orders.filter(o => o.student_id === studentId);
  }, [orders]);

  const getOrder = useCallback((id: string) => {
    return orders.find(o => o.id === id);
  }, [orders]);

  const createOrder = useCallback((input: CreateOrderInput): Order => {
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      student_id: input.student_id,
      cohort_id: input.cohort_id,
      amount: input.amount,
      currency: input.currency,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    setOrders(prev => [...prev, newOrder]);
    return newOrder;
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  }, []);

  // ---- Payments ----

  const getPaymentByReference = useCallback((reference: string) => {
    return payments.find(p => p.provider_reference === reference);
  }, [payments]);

  const getStudentPayments = useCallback((studentId: string) => {
    const studentOrders = orders.filter(o => o.student_id === studentId).map(o => o.id);
    return payments.filter(p => studentOrders.includes(p.order_id));
  }, [payments, orders]);

  const createPayment = useCallback((input: CreatePaymentInput): Payment => {
    // Idempotency: check if payment with this reference already exists
    const existing = payments.find(p => p.provider_reference === input.provider_reference);
    if (existing) {
      return existing;
    }

    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      order_id: input.order_id,
      provider: input.provider,
      provider_reference: input.provider_reference,
      amount: input.amount,
      currency: input.currency,
      status: 'pending',
      paid_at: null,
      created_at: new Date().toISOString(),
    };
    setPayments(prev => [...prev, newPayment]);
    return newPayment;
  }, [payments]);

  const markPaymentSuccessful = useCallback((paymentId: string) => {
    setPayments(prev => prev.map(p => {
      if (p.id === paymentId && p.status !== 'success') {
        return { ...p, status: 'success' as const, paid_at: new Date().toISOString() };
      }
      return p;
    }));
  }, []);

  // ---- Attendance ----

  const getSessionAttendance = useCallback((sessionId: string) => {
    return attendance.filter(a => a.session_id === sessionId);
  }, [attendance]);

  const getStudentAttendance = useCallback((studentId: string, cohortId: string) => {
    return attendance.filter(a => a.student_id === studentId && a.cohort_id === cohortId);
  }, [attendance]);

  const recordAttendance = useCallback((sessionId: string, studentId: string, cohortId: string, status: AttendanceRecord['status']) => {
    setAttendance(prev => {
      // Update existing or create new
      const existing = prev.find(a => a.session_id === sessionId && a.student_id === studentId);
      if (existing) {
        return prev.map(a => a.id === existing.id ? { ...a, status } : a);
      }
      return [...prev, {
        id: `att-${Date.now()}-${studentId}`,
        session_id: sessionId,
        student_id: studentId,
        cohort_id: cohortId,
        status,
        recorded_at: new Date().toISOString(),
      }];
    });
  }, []);

  const bulkRecordAttendance = useCallback((sessionId: string, cohortId: string, records: { studentId: string; status: AttendanceRecord['status'] }[]) => {
    setAttendance(prev => {
      const newRecords = records.map(r => {
        const existing = prev.find(a => a.session_id === sessionId && a.student_id === r.studentId);
        if (existing) {
          return { ...existing, status: r.status };
        }
        return {
          id: `att-${Date.now()}-${r.studentId}`,
          session_id: sessionId,
          student_id: r.studentId,
          cohort_id: cohortId,
          status: r.status,
          recorded_at: new Date().toISOString(),
        };
      });
      
      // Merge: replace existing records for this session, add new ones
      const otherRecords = prev.filter(a => a.session_id !== sessionId);
      return [...otherRecords, ...newRecords];
    });
  }, []);

  // ---- Stats ----

  const getEnrolledCount = useCallback((cohortId: string) => {
    return enrollments.filter(e => e.cohort_id === cohortId && e.status === 'active').length;
  }, [enrollments]);

  const getAttendanceRate = useCallback((studentId: string, cohortId: string) => {
    const studentAttendance = attendance.filter(a => a.student_id === studentId && a.cohort_id === cohortId);
    if (studentAttendance.length === 0) return 0;
    const present = studentAttendance.filter(a => a.status === 'present' || a.status === 'late').length;
    return (present / studentAttendance.length) * 100;
  }, [attendance]);

  return (
    <EnrollmentContext.Provider value={{
      enrollments,
      getStudentEnrollments,
      getEnrollmentByStudentAndCohort,
      isStudentEnrolled,
      createEnrollment,
      orders,
      getStudentOrders,
      getOrder,
      createOrder,
      updateOrderStatus,
      payments,
      getPaymentByReference,
      getStudentPayments,
      createPayment,
      markPaymentSuccessful,
      attendance,
      getSessionAttendance,
      getStudentAttendance,
      recordAttendance,
      bulkRecordAttendance,
      getEnrolledCount,
      getAttendanceRate,
    }}>
      {children}
    </EnrollmentContext.Provider>
  );
}

export function useEnrollments() {
  const context = useContext(EnrollmentContext);
  if (!context) {
    throw new Error('useEnrollments must be used within an EnrollmentProvider');
  }
  return context;
}
