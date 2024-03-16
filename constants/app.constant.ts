export default class AppConstants {
  static readonly DEVELOPMENT = 'development';
  static readonly TEST = 'test';
  static readonly PRODUCTION = 'production';
  static readonly ROLES = {
    PATIENT: 'patient',
    STAFF: 'staff',
  };
  static readonly STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
  };
  static readonly REQUEST_TYPE = {
    BODY: 'body',
    PARAMS: 'params',
    QUERY: 'query',
  };

  static readonly MODULES = {
    SUDO: 'sudo',
    NURSE: 'nurse',
    IT: 'it',
    DOCTOR: 'doctor',
    PHARMACIST: 'pharmacist',
  };

  static readonly SPECIALITIES = {
    SURGEON: "surgery",
    DENTIST: "dental_problem",
    GENERAL_PRACTITIONER: "regular_checkup",
    OBSTETRICIAN: "manternity",
    PEDIATRICIAN: "children",
    LAB_TECHNICIAN: "lab"
  };

  static readonly BOOKING_STATUSES = {
    PENDING: "pending",
    APPROVED: "approved",
    DECLINED: "declined",
    ONGOING: "ongoing",
    RESCHEDULED: "rescheduled",
    COMPLETED: "completed"
  }
}

