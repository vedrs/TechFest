import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Typography, Divider } from 'antd';
import { Mail, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';

const { Title, Text } = Typography;

interface AuthProps {
  onAuthSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const { error } = isLogin
        ? await supabase.auth.signInWithPassword(values)
        : await supabase.auth.signUp(values);

      if (error) throw error;
      
      message.success(isLogin ? 'Successfully logged in!' : 'Successfully signed up!');
      onAuthSuccess();
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto shadow-md">
      <Title level={3} className="text-center mb-6">
        {isLogin ? 'Login to Register' : 'Sign Up to Register'}
      </Title>

      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input 
            prefix={<Mail size={16} className="text-gray-400" />}
            placeholder="your.email@example.com"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please enter your password' },
            { min: 6, message: 'Password must be at least 6 characters' }
          ]}
        >
          <Input.Password 
            prefix={<Lock size={16} className="text-gray-400" />}
            placeholder="••••••••"
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            block
            size="large"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </Button>
        </Form.Item>
      </Form>

      <Divider>
        <Text type="secondary">or</Text>
      </Divider>

      <Button 
        block
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
      </Button>
    </Card>
  );
};

export default Auth;