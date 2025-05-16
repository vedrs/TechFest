import React, { useEffect, useState } from 'react';
import { Typography, Space, Skeleton, Tag } from 'antd';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { EventInfo } from '../types';
import api from '../services/api';

const { Title, Paragraph } = Typography;

const EventHeader: React.FC = () => {
  const [eventInfo, setEventInfo] = useState<EventInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEventInfo = async () => {
      try {
        const response = await api.getEventInfo();
        if (response.success && response.data) {
          setEventInfo(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch event info:', error);
      } finally {
        setLoading(false);
      }
    };

    // For now, let's use mock data since we don't have a real backend
    setTimeout(() => {
      setEventInfo({
        name: 'TechFest 2025',
        description: 'Join us for the biggest tech event of the year! Featuring workshops, hackathons, tech talks, and networking opportunities.',
        startDate: '2025-03-15',
        endDate: '2025-03-17',
        location: 'University Tech Center',
        registrationDeadline: '2025-02-28',
        logo: 'https://via.placeholder.com/150'
      });
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="mb-8">
        <Skeleton active paragraph={{ rows: 3 }} />
      </div>
    );
  }

  if (!eventInfo) {
    return null;
  }

  // Format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const startDate = formatDate(eventInfo.startDate);
  const endDate = formatDate(eventInfo.endDate);
  const deadline = formatDate(eventInfo.registrationDeadline);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 border-l-4 border-blue-500">
      <div className="flex items-center gap-4 mb-4">
        <div className="hidden md:block">
          <img 
            src="https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=150" 
            alt="TechFest Logo" 
            className="w-16 h-16 object-cover rounded-full"
          />
        </div>
        <div>
          <Title level={2} className="!mb-0 !mt-0">{eventInfo.name}</Title>
          <Tag color="blue" className="mt-1">Registration Open</Tag>
        </div>
      </div>
      
      <Paragraph className="text-gray-600 mb-4">
        {eventInfo.description}
      </Paragraph>
      
      <Space direction="vertical" size="small" className="w-full">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-blue-500" />
          <span>{startDate} to {endDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-blue-500" />
          <span>{eventInfo.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-blue-500" />
          <span>Registration Deadline: {deadline}</span>
        </div>
      </Space>
    </div>
  );
};

export default EventHeader;