import { EmergencyContact } from ".";

export interface PatientInterface {
    name: string;
    email: string;
    dob: string;
    phone: string;
    pid: string;
    emergency_contacts: EmergencyContact[] | null;
    weight?: string
}


export interface MedicalRecord {
    rid: string
    patient: string;
    known_medical_conditions?: string[]
    allergies?: string[]
    physician_informations: PhysicianInformation[]

}

export interface PhysicianInformation {
    doctor: string;
    notes: string
}

export interface InsuranceInformation {

}