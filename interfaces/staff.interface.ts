import { EmergencyContact } from ".";

export interface StaffRecord {
    name: string;
    email: string;
    dob: string;
    phone: string;
    sid: string;
    department: string;
    emergency_contacts?: EmergencyContact[] | null
}

export interface DoctorInterface extends StaffRecord {
    specialization: string
}

export interface NurseInterface extends StaffRecord {

}