import React from 'react';
import { Result, Button, Typography, Card } from 'antd';
import { CheckCircle, Download, Mail } from 'lucide-react';
import { RegistrationFormData } from '../types';

const { Paragraph, Text, Title } = Typography;

interface SuccessScreenProps {
  formData: RegistrationFormData;
  onReset: () => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ formData, onReset }) => {
  // Format events array to be more readable
  const formatEvents = (events: string[] = []) => {
    return events.map(event => 
      event.charAt(0).toUpperCase() + event.slice(1).replace('-', ' ')
    ).join(', ');
  };

  return (
    <Card className="shadow-md border-0 max-w-4xl mx-auto">
      <Result
        icon={<CheckCircle size={72} className="text-green-500" />}
        title={
          <Title level={2} className="!mt-4">Registration Successful!</Title>
        }
        subTitle={
          <Paragraph className="text-gray-600">
            Thank you for registering for TechFest 2025! We've sent a confirmation email to <Text strong>{formData.email}</Text>.
            Please check your inbox (and spam folder) for further details.
          </Paragraph>
        }
        extra={[
          <div key="info" className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4 text-left">
            <Title level={5} className="flex items-center gap-2 !mb-3">
              <Mail size={16} className="text-blue-500" />
              Registration Details
            </Title>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <Text type="secondary">Full Name:</Text>
                <div className="font-medium">{formData.firstName} {formData.lastName}</div>
              </div>
              <div>
                <Text type="secondary">Email:</Text>
                <div className="font-medium">{formData.email}</div>
              </div>
              <div>
                <Text type="secondary">Phone:</Text>
                <div className="font-medium">{formData.phone}</div>
              </div>
              <div>
                <Text type="secondary">Gender:</Text>
                <div className="font-medium">{formData.gender}</div>
              </div>
              <div>
                <Text type="secondary">College:</Text>
                <div className="font-medium">{formData.college}</div>
              </div>
              <div>
                <Text type="secondary">Department:</Text>
                <div className="font-medium">{formData.department}</div>
              </div>
              <div>
                <Text type="secondary">Year:</Text>
                <div className="font-medium">{formData.year}</div>
              </div>
              <div>
                <Text type="secondary">Student ID:</Text>
                <div className="font-medium">{formData.studentId}</div>
              </div>
              <div className="col-span-2">
                <Text type="secondary">Events Interested In:</Text>
                <div className="font-medium">{formatEvents(formData.eventsInterested)}</div>
              </div>
              <div>
                <Text type="secondary">T-Shirt Size:</Text>
                <div className="font-medium">{formData.tShirtSize}</div>
              </div>
              <div>
                <Text type="secondary">Dietary Restrictions:</Text>
                <div className="font-medium">{formatEvents(formData.dietaryRestrictions) || 'None'}</div>
              </div>
              {formData.specialRequirements && (
                <div className="col-span-2">
                  <Text type="secondary">Special Requirements:</Text>
                  <div className="font-medium">{formData.specialRequirements}</div>
                </div>
              )}
              <div>
                <Text type="secondary">Heard About Us From:</Text>
                <div className="font-medium">{formData.hearAboutUs}</div>
              </div>
            </div>
          </div>,
          <div key="buttons" className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              type="primary" 
              icon={<Download size={16} />} 
              size="large"
              className="min-w-[200px]"
            >
              Download Confirmation
            </Button>
            <Button 
              onClick={onReset} 
              size="large"
              className="min-w-[200px]"
            >
              Register Another Person
            </Button>
          </div>
        ]}
      />
    </Card>
  );
};

export default SuccessScreen;