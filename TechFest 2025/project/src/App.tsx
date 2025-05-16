import React, { useEffect, useState } from 'react';
import { ConfigProvider, Layout, Typography, message, Button } from 'antd';
import RegistrationForm from './components/RegistrationForm';
import EventHeader from './components/EventHeader';
import Auth from './components/Auth';
import { supabase } from './lib/supabase';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

// Custom theme configuration
const theme = {
  token: {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#f5222d',
    borderRadius: 6,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  components: {
    Button: {
      controlHeight: 40,
      paddingContentHorizontal: 24,
    },
    Form: {
      labelFontSize: 14,
    },
  },
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      message.success('Successfully signed out');
    } catch (error) {
      message.error('Error signing out');
    }
  };

  return (
    <ConfigProvider theme={theme}>
      <Layout className="min-h-screen bg-gray-100">
        <Header className="bg-gradient-to-r from-blue-700 to-blue-900 p-4 flex items-center justify-between">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <Title level={3} className="!text-white !m-0 flex items-center">
              <span className="hidden sm:inline">TechFest 2025</span>
              <span className="sm:hidden">TF'25</span>
              <span className="text-sm font-normal ml-4 bg-blue-800 px-2 py-1 rounded-md">Registration</span>
            </Title>
            {isAuthenticated && (
              <Button type="link" onClick={handleSignOut} className="text-white hover:text-gray-200">
                Sign Out
              </Button>
            )}
          </div>
        </Header>
        
        <Content className="p-4 sm:p-6">
          <div className="container mx-auto max-w-5xl">
            <EventHeader />
            
            {!loading && (
              isAuthenticated ? <RegistrationForm /> : <Auth onAuthSuccess={() => setIsAuthenticated(true)} />
            )}
          </div>
        </Content>
        
        <Footer className="text-center bg-white border-t">
          <Text type="secondary">TechFest 2025 © All Rights Reserved</Text>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}

export default App;