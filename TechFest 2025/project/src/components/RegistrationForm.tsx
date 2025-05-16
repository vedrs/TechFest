import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Select, 
  Checkbox, 
  Button, 
  Radio, 
  message, 
  Steps,
  Spin,
  Divider
} from 'antd';
import { 
  User, 
  School, 
  Calendar, 
  Info,
  ChevronRight, 
  ChevronLeft,
  Send
} from 'lucide-react';
import { RegistrationFormData } from '../types';
import FormSection from './FormSection';
import SuccessScreen from './SuccessScreen';
import { supabase } from '../lib/supabase';

const { Option } = Select;
const { TextArea } = Input;

const initialFormData: RegistrationFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  gender: '',
  college: '',
  department: '',
  year: '',
  studentId: '',
  eventsInterested: [],
  tShirtSize: '',
  dietaryRestrictions: [],
  specialRequirements: '',
  hearAboutUs: '',
  agreeToTerms: false
};

const RegistrationForm: React.FC = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [formData, setFormData] = useState<RegistrationFormData>(initialFormData);

  const validateAndProceed = async () => {
    try {
      let fieldsToValidate: string[] = [];
      
      switch (currentStep) {
        case 0:
          fieldsToValidate = ['firstName', 'lastName', 'email', 'phone', 'gender'];
          break;
        case 1:
          fieldsToValidate = ['college', 'department', 'year', 'studentId'];
          break;
        case 2:
          fieldsToValidate = ['eventsInterested', 'tShirtSize'];
          break;
        default:
          break;
      }
      
      const values = await form.validateFields(fieldsToValidate);
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const resetForm = () => {
    form.resetFields();
    setCurrentStep(0);
    setRegistrationComplete(false);
    setFormData(initialFormData);
  };

  const handleFormSubmit = async (values: RegistrationFormData) => {
    try {
      setSubmitting(true);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Store the form data for the success screen
      setFormData(values);

      const { error } = await supabase
        .from('registrations')
        .insert([{
          user_id: user.id,
          first_name: values.firstName?.trim() ?? '',
          last_name: values.lastName?.trim() ?? '',
          email: values.email?.trim() ?? '',
          phone: values.phone?.trim() ?? '',
          gender: values.gender ?? '',
          college: values.college?.trim() ?? '',
          department: values.department?.trim() ?? '',
          year: values.year ?? '',
          student_id: values.studentId?.trim() ?? '',
          events_interested: values.eventsInterested ?? [],
          t_shirt_size: values.tShirtSize ?? '',
          dietary_restrictions: values.dietaryRestrictions ?? [],
          special_requirements: values.specialRequirements?.trim() ?? null,
          hear_about_us: values.hearAboutUs ?? ''
        }]);

      if (error) {
        throw error;
      }

      message.success('Registration submitted successfully!');
      setRegistrationComplete(true);
    } catch (error) {
      console.error('Registration error:', error);
      message.error(error instanceof Error ? error.message : 'Failed to submit registration');
    } finally {
      setSubmitting(false);
    }
  };

  const renderPersonalInfo = () => (
    <FormSection title="Personal Information" icon={<User />}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[{ required: true, message: 'Please enter your first name' }]}
        >
          <Input placeholder="John" />
        </Form.Item>
        
        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[{ required: true, message: 'Please enter your last name' }]}
        >
          <Input placeholder="Doe" />
        </Form.Item>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input placeholder="john.doe@example.com" />
        </Form.Item>
        
        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            { required: true, message: 'Please enter your phone number' },
            { pattern: /^\d{10}$/, message: 'Please enter a valid 10-digit phone number' }
          ]}
        >
          <Input placeholder="1234567890" />
        </Form.Item>
      </div>
      
      <Form.Item
        name="gender"
        label="Gender"
        rules={[{ required: true, message: 'Please select your gender' }]}
      >
        <Radio.Group>
          <Radio value="male">Male</Radio>
          <Radio value="female">Female</Radio>
          <Radio value="other">Other</Radio>
          <Radio value="prefer-not-to-say">Prefer not to say</Radio>
        </Radio.Group>
      </Form.Item>
    </FormSection>
  );
  
  const renderAcademicInfo = () => (
    <FormSection title="Academic Information" icon={<School />}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="college"
          label="College/University"
          rules={[{ required: true, message: 'Please enter your college name' }]}
        >
          <Input placeholder="University of Technology" />
        </Form.Item>
        
        <Form.Item
          name="department"
          label="Department/Major"
          rules={[{ required: true, message: 'Please enter your department' }]}
        >
          <Input placeholder="Computer Science" />
        </Form.Item>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="year"
          label="Year of Study"
          rules={[{ required: true, message: 'Please select your year of study' }]}
        >
          <Select placeholder="Select year">
            <Option value="1">First Year</Option>
            <Option value="2">Second Year</Option>
            <Option value="3">Third Year</Option>
            <Option value="4">Fourth Year</Option>
            <Option value="5">Fifth Year</Option>
            <Option value="graduate">Graduate Student</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="studentId"
          label="Student ID"
          rules={[{ required: true, message: 'Please enter your student ID' }]}
        >
          <Input placeholder="ST12345" />
        </Form.Item>
      </div>
    </FormSection>
  );
  
  const renderEventPreferences = () => (
    <FormSection title="Event Preferences" icon={<Calendar />}>
      <Form.Item
        name="eventsInterested"
        label="Events Interested In"
        rules={[{ required: true, message: 'Please select at least one event' }]}
      >
        <Checkbox.Group className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Checkbox value="hackathon">Hackathon</Checkbox>
          <Checkbox value="workshops">Technical Workshops</Checkbox>
          <Checkbox value="talks">Tech Talks</Checkbox>
          <Checkbox value="networking">Networking Events</Checkbox>
          <Checkbox value="competition">Coding Competition</Checkbox>
          <Checkbox value="gaming">Gaming Tournament</Checkbox>
          <Checkbox value="project">Project Exhibition</Checkbox>
          <Checkbox value="career">Career Fair</Checkbox>
        </Checkbox.Group>
      </Form.Item>
      
      <Form.Item
        name="tShirtSize"
        label="T-Shirt Size"
        rules={[{ required: true, message: 'Please select your T-shirt size' }]}
      >
        <Radio.Group>
          <Radio value="XS">XS</Radio>
          <Radio value="S">S</Radio>
          <Radio value="M">M</Radio>
          <Radio value="L">L</Radio>
          <Radio value="XL">XL</Radio>
          <Radio value="XXL">XXL</Radio>
        </Radio.Group>
      </Form.Item>
      
      <Form.Item
        name="dietaryRestrictions"
        label="Dietary Restrictions"
      >
        <Checkbox.Group>
          <Checkbox value="vegetarian">Vegetarian</Checkbox>
          <Checkbox value="vegan">Vegan</Checkbox>
          <Checkbox value="gluten-free">Gluten-Free</Checkbox>
          <Checkbox value="dairy-free">Dairy-Free</Checkbox>
          <Checkbox value="none">None</Checkbox>
        </Checkbox.Group>
      </Form.Item>
    </FormSection>
  );
  
  const renderAdditionalInfo = () => (
    <FormSection title="Additional Information" icon={<Info />}>
      <Form.Item
        name="specialRequirements"
        label="Special Requirements or Accommodations"
      >
        <TextArea 
          rows={4} 
          placeholder="Let us know if you have any special requirements or need any accommodations"
        />
      </Form.Item>
      
      <Form.Item
        name="hearAboutUs"
        label="How did you hear about this event?"
        rules={[{ required: true, message: 'Please select an option' }]}
      >
        <Select placeholder="Select option">
          <Option value="social">Social Media</Option>
          <Option value="email">Email</Option>
          <Option value="friend">Friend or Colleague</Option>
          <Option value="college">College Notice Board</Option>
          <Option value="website">Website</Option>
          <Option value="other">Other</Option>
        </Select>
      </Form.Item>
      
      <Form.Item
        name="agreeToTerms"
        valuePropName="checked"
        rules={[
          { 
            validator: (_, value) => 
              value ? Promise.resolve() : Promise.reject(new Error('You must agree to the terms and conditions')) 
          }
        ]}
      >
        <Checkbox>
          I agree to the <a href="#" className="text-blue-500 hover:underline">Terms and Conditions</a> and 
          <a href="#" className="text-blue-500 hover:underline"> Privacy Policy</a>
        </Checkbox>
      </Form.Item>
    </FormSection>
  );

  const steps = [
    {
      title: 'Personal',
      content: renderPersonalInfo(),
    },
    {
      title: 'Academic',
      content: renderAcademicInfo(),
    },
    {
      title: 'Events',
      content: renderEventPreferences(),
    },
    {
      title: 'Additional',
      content: renderAdditionalInfo(),
    },
  ];

  if (registrationComplete) {
    return <SuccessScreen formData={formData} onReset={resetForm} />;
  }

  return (
    <Spin spinning={submitting} tip="Submitting registration...">
      <div className="mb-6">
        <Steps
          current={currentStep}
          items={steps.map((step) => ({ title: step.title }))}
          responsive
          className="custom-steps"
        />
      </div>
      
      <Form
        form={form}
        layout="vertical"
        initialValues={initialFormData}
        onFinish={handleFormSubmit}
        className="registration-form"
        requiredMark={false}
      >
        {steps[currentStep].content}
        
        <Divider />
        
        <div className="flex justify-between mt-4">
          {currentStep > 0 && (
            <Button 
              onClick={handlePrevStep}
              className="flex items-center"
              size="large"
            >
              <ChevronLeft size={16} /> Back
            </Button>
          )}
          
          <div className={`${currentStep === 0 ? 'ml-auto' : ''}`}>
            {currentStep < steps.length - 1 && (
              <Button 
                type="primary" 
                onClick={validateAndProceed}
                className="flex items-center"
                size="large"
              >
                Next <ChevronRight size={16} />
              </Button>
            )}
            
            {currentStep === steps.length - 1 && (
              <Button 
                type="primary"
                htmlType="submit"
                className="flex items-center"
                size="large"
              >
                Submit Registration <Send size={16} className="ml-1" />
              </Button>
            )}
          </div>
        </div>
      </Form>
    </Spin>
  );
};

export default RegistrationForm;