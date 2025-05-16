export interface RegistrationFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  
  // Academic Information
  college: string;
  department: string;
  year: string;
  studentId: string;
  
  // Event Preferences
  eventsInterested: string[];
  tShirtSize: string;
  dietaryRestrictions: string[];
  
  // Additional Information
  specialRequirements?: string;
  hearAboutUs: string;
  agreeToTerms: boolean;
}

export interface EventInfo {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  registrationDeadline: string;
  logo: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}