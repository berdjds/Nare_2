"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users,
  Share2,
  Phone,
  Image as ImageIcon,
  LogOut,
  Mountain,
  Camera,
  Home,
  Settings,
  Languages,
  Plane,
  Ticket,
  Layout,
  Shield,
  MessageSquare,
  Mail,
  Newspaper,
  Zap
} from 'lucide-react';
import HeroSlidesManager from '@/components/admin/hero-slides-manager';
import TourPackagesManager from '@/components/admin/tour-packages-manager';
import TeamMembersManager from '@/components/admin/team-members-manager';
import OutgoingPackagesManager from '@/components/admin/outgoing-packages-manager';
import AirTicketsManager from '@/components/admin/air-tickets-manager';
import PageBannersManager from '@/components/admin/page-banners-manager';
import ContactInfoManager from '@/components/admin/contact-info-manager';
import SocialLinksManager from '@/components/admin/social-links-manager';
import SettingsManager from '@/components/admin/settings-manager';
import TranslationsManager from '@/components/admin/translations-manager';
import UsersManager from '@/components/admin/users-manager';
import InquiriesManager from '@/components/admin/inquiries-manager';
import EmailSettings from '@/components/admin/email-settings';
import ArticlesManager from '@/components/admin/articles-manager';
import HotNewsManager from '@/components/admin/hot-news-manager';
import { getCurrentUser, canAccessConfiguration } from '@/lib/admin-users';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('hero');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [canAccessConfig, setCanAccessConfig] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/admin/login');
      return;
    }
    setCurrentUser(user);
    setCanAccessConfig(canAccessConfiguration(user.role));
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Corporate Branding */}
      <header className="bg-gradient-to-r from-orange-500 via-orange-600 to-blue-600 border-b border-orange-700/20 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg">
              <Home className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white drop-shadow-md">Admin Dashboard</h1>
              <p className="text-sm text-white/90 font-medium">
                {currentUser?.username} • {currentUser?.role === 'super_admin' ? '👑 Super Admin' : '✏️ Contributor'}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:text-white shadow-md"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Enhanced Navigation with Corporate Colors */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30">
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Content Management Group */}
                <div>
                  <div className="flex items-center gap-2 mb-4 px-2">
                    <div className="h-1 w-8 bg-gradient-to-r from-orange-500 to-blue-600 rounded-full"></div>
                    <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Content Management</p>
                  </div>
                  <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3 h-auto bg-transparent p-0">
                    <TabsTrigger 
                      value="hero" 
                      className="flex flex-col items-center gap-2 py-4 px-4 rounded-xl border-2 border-gray-200 bg-white data-[state=active]:border-orange-500 data-[state=active]:bg-gradient-to-br data-[state=active]:from-orange-50 data-[state=active]:to-blue-50 data-[state=active]:text-orange-700 data-[state=active]:shadow-md hover:border-orange-300 hover:shadow-sm transition-all duration-200"
                    >
                      <ImageIcon className="h-6 w-6" />
                      <span className="text-xs font-semibold">Hero Slides</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="tours" 
                      className="flex flex-col items-center gap-2 py-4 px-4 rounded-xl border-2 border-gray-200 bg-white data-[state=active]:border-orange-500 data-[state=active]:bg-gradient-to-br data-[state=active]:from-orange-50 data-[state=active]:to-blue-50 data-[state=active]:text-orange-700 data-[state=active]:shadow-md hover:border-orange-300 hover:shadow-sm transition-all duration-200"
                    >
                      <Mountain className="h-6 w-6" />
                      <span className="text-xs font-semibold">Tour Packages</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="team" 
                      className="flex flex-col items-center gap-2 py-4 px-4 rounded-xl border-2 border-gray-200 bg-white data-[state=active]:border-orange-500 data-[state=active]:bg-gradient-to-br data-[state=active]:from-orange-50 data-[state=active]:to-blue-50 data-[state=active]:text-orange-700 data-[state=active]:shadow-md hover:border-orange-300 hover:shadow-sm transition-all duration-200"
                    >
                      <Users className="h-6 w-6" />
                      <span className="text-xs font-semibold">Team Members</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="outgoing" 
                      className="flex flex-col items-center gap-2 py-4 px-4 rounded-xl border-2 border-gray-200 bg-white data-[state=active]:border-orange-500 data-[state=active]:bg-gradient-to-br data-[state=active]:from-orange-50 data-[state=active]:to-blue-50 data-[state=active]:text-orange-700 data-[state=active]:shadow-md hover:border-orange-300 hover:shadow-sm transition-all duration-200"
                    >
                      <Plane className="h-6 w-6" />
                      <span className="text-xs font-semibold">Outgoing Packages</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="airtickets" 
                      className="flex flex-col items-center gap-2 py-4 px-4 rounded-xl border-2 border-gray-200 bg-white data-[state=active]:border-orange-500 data-[state=active]:bg-gradient-to-br data-[state=active]:from-orange-50 data-[state=active]:to-blue-50 data-[state=active]:text-orange-700 data-[state=active]:shadow-md hover:border-orange-300 hover:shadow-sm transition-all duration-200"
                    >
                      <Ticket className="h-6 w-6" />
                      <span className="text-xs font-semibold">Air Tickets</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="banners" 
                      className="flex flex-col items-center gap-2 py-4 px-4 rounded-xl border-2 border-gray-200 bg-white data-[state=active]:border-orange-500 data-[state=active]:bg-gradient-to-br data-[state=active]:from-orange-50 data-[state=active]:to-blue-50 data-[state=active]:text-orange-700 data-[state=active]:shadow-md hover:border-orange-300 hover:shadow-sm transition-all duration-200"
                    >
                      <Layout className="h-6 w-6" />
                      <span className="text-xs font-semibold">Page Banners</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="hotnews" 
                      className="flex flex-col items-center gap-2 py-4 px-4 rounded-xl border-2 border-gray-200 bg-white data-[state=active]:border-orange-500 data-[state=active]:bg-gradient-to-br data-[state=active]:from-orange-50 data-[state=active]:to-blue-50 data-[state=active]:text-orange-700 data-[state=active]:shadow-md hover:border-orange-300 hover:shadow-sm transition-all duration-200"
                    >
                      <Zap className="h-6 w-6" />
                      <span className="text-xs font-semibold">Hot News</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="inquiries" 
                      className="flex flex-col items-center gap-2 py-4 px-4 rounded-xl border-2 border-gray-200 bg-white data-[state=active]:border-orange-500 data-[state=active]:bg-gradient-to-br data-[state=active]:from-orange-50 data-[state=active]:to-blue-50 data-[state=active]:text-orange-700 data-[state=active]:shadow-md hover:border-orange-300 hover:shadow-sm transition-all duration-200"
                    >
                      <MessageSquare className="h-6 w-6" />
                      <span className="text-xs font-semibold">Inquiries</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="articles" 
                      className="flex flex-col items-center gap-2 py-4 px-4 rounded-xl border-2 border-gray-200 bg-white data-[state=active]:border-orange-500 data-[state=active]:bg-gradient-to-br data-[state=active]:from-orange-50 data-[state=active]:to-blue-50 data-[state=active]:text-orange-700 data-[state=active]:shadow-md hover:border-orange-300 hover:shadow-sm transition-all duration-200"
                    >
                      <Newspaper className="h-6 w-6" />
                      <span className="text-xs font-semibold">Travel Insights</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Configuration Group - Only for Super Admins */}
                {canAccessConfig && (
                  <div>
                    <div className="flex items-center gap-2 mb-4 px-2">
                      <div className="h-1 w-8 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full"></div>
                      <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Configuration</p>
                      <Shield className="h-4 w-4 text-orange-600" />
                    </div>
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 gap-3 h-auto bg-transparent p-0">
                      <TabsTrigger 
                        value="users" 
                        className="flex flex-col items-center gap-2 py-4 px-4 rounded-xl border-2 border-gray-200 bg-white data-[state=active]:border-blue-600 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-50 data-[state=active]:to-orange-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-md hover:border-blue-400 hover:shadow-sm transition-all duration-200"
                      >
                        <Shield className="h-6 w-6" />
                        <span className="text-xs font-semibold">Users</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="contact" 
                        className="flex flex-col items-center gap-2 py-4 px-4 rounded-xl border-2 border-gray-200 bg-white data-[state=active]:border-blue-600 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-50 data-[state=active]:to-orange-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-md hover:border-blue-400 hover:shadow-sm transition-all duration-200"
                      >
                        <Phone className="h-6 w-6" />
                        <span className="text-xs font-semibold">Contact Info</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="social" 
                        className="flex flex-col items-center gap-2 py-4 px-4 rounded-xl border-2 border-gray-200 bg-white data-[state=active]:border-blue-600 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-50 data-[state=active]:to-orange-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-md hover:border-blue-400 hover:shadow-sm transition-all duration-200"
                      >
                        <Share2 className="h-6 w-6" />
                        <span className="text-xs font-semibold">Social Links</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="translations" 
                        className="flex flex-col items-center gap-2 py-4 px-4 rounded-xl border-2 border-gray-200 bg-white data-[state=active]:border-blue-600 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-50 data-[state=active]:to-orange-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-md hover:border-blue-400 hover:shadow-sm transition-all duration-200"
                      >
                        <Languages className="h-6 w-6" />
                        <span className="text-xs font-semibold">Translations</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="settings" 
                        className="flex flex-col items-center gap-2 py-4 px-4 rounded-xl border-2 border-gray-200 bg-white data-[state=active]:border-blue-600 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-50 data-[state=active]:to-orange-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-md hover:border-blue-400 hover:shadow-sm transition-all duration-200"
                      >
                        <Settings className="h-6 w-6" />
                        <span className="text-xs font-semibold">Settings</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="email" 
                        className="flex flex-col items-center gap-2 py-4 px-4 rounded-xl border-2 border-gray-200 bg-white data-[state=active]:border-blue-600 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-50 data-[state=active]:to-orange-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-md hover:border-blue-400 hover:shadow-sm transition-all duration-200"
                      >
                        <Mail className="h-6 w-6" />
                        <span className="text-xs font-semibold">Email</span>
                      </TabsTrigger>
                    </TabsList>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <TabsContent value="hero">
            <HeroSlidesManager />
          </TabsContent>

          <TabsContent value="tours">
            <TourPackagesManager />
          </TabsContent>

          <TabsContent value="team">
            <TeamMembersManager />
          </TabsContent>

          <TabsContent value="outgoing">
            <OutgoingPackagesManager />
          </TabsContent>

          <TabsContent value="airtickets">
            <AirTicketsManager />
          </TabsContent>

          <TabsContent value="banners">
            <PageBannersManager />
          </TabsContent>

          <TabsContent value="hotnews">
            <HotNewsManager />
          </TabsContent>

          <TabsContent value="inquiries">
            <InquiriesManager />
          </TabsContent>

          <TabsContent value="articles">
            <ArticlesManager />
          </TabsContent>

          {canAccessConfig && (
            <TabsContent value="users">
              <UsersManager />
            </TabsContent>
          )}

          {canAccessConfig && (
            <TabsContent value="contact">
              <ContactInfoManager />
            </TabsContent>
          )}

          {canAccessConfig && (
            <TabsContent value="social">
              <SocialLinksManager />
            </TabsContent>
          )}

          {canAccessConfig && (
            <TabsContent value="translations">
              <TranslationsManager />
            </TabsContent>
          )}

          {canAccessConfig && (
            <TabsContent value="settings">
              <SettingsManager />
            </TabsContent>
          )}

          {canAccessConfig && (
            <TabsContent value="email">
              <EmailSettings />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
