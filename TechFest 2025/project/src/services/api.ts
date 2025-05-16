import { RegistrationFormData, ApiResponse } from '../types';
import { supabase } from '../lib/supabase';

const api = {
  submitRegistration: async (formData: RegistrationFormData): Promise<ApiResponse> => {
    try {
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('Authentication required');
      }

      const { data, error } = await supabase
        .from('registrations')
        .insert([{
          user_id: user.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          gender: formData.gender,
          college: formData.college,
          department: formData.department,
          year: formData.year,
          student_id: formData.studentId,
          events_interested: formData.eventsInterested,
          t_shirt_size: formData.tShirtSize,
          dietary_restrictions: formData.dietaryRestrictions,
          special_requirements: formData.specialRequirements,
          hear_about_us: formData.hearAboutUs
        }])
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        message: 'Registration successful!',
        data
      };
    } catch (error) {
      console.error('Registration submission error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to submit registration'
      };
    }
  },

  getRegistrations: async (): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('Fetched registrations:', data); // This will help debug if data is being retrieved

      return {
        success: true,
        message: 'Registrations retrieved successfully',
        data
      };
    } catch (error) {
      console.error('Error fetching registrations:', error);
      return {
        success: false,
        message: 'Failed to load registrations'
      };
    }
  },

  getEventInfo: async (): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('event_info')
        .select('*')
        .single();

      if (error) throw error;

      return {
        success: true,
        message: 'Event information retrieved successfully',
        data
      };
    } catch (error) {
      console.error('Error fetching event info:', error);
      return {
        success: false,
        message: 'Failed to load event information'
      };
    }
  }
};

export default api;