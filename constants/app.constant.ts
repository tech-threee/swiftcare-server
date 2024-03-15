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
    PATIENT: 'patient',
  };
}
