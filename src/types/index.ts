export interface Service {
  name: string;
  price: number;
  duration: number; // minutes
  description?: string;
}

export interface Hours {
  [day: string]: { open: string; close: string } | null;
}

export interface Clinic {
  id: string;
  name: string;
  services: Service[];
  hours: Hours;
  location: string;
  phone: string;
}

export interface Booking {
  id: string;
  clinic_id: string;
  patient_name: string;
  patient_contact: string;
  service: string;
  starts_at: string;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
  raw_notes?: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
