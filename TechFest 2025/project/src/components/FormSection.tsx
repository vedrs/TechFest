import React, { ReactNode } from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

interface FormSectionProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children, icon }) => {
  return (
    <Card 
      className="mb-6 shadow-sm border rounded-lg overflow-hidden"
      title={
        <div className="flex items-center gap-2">
          {icon && <span className="text-blue-500">{icon}</span>}
          <Title level={4} className="!m-0">{title}</Title>
        </div>
      }
    >
      {children}
    </Card>
  );
};

export default FormSection;