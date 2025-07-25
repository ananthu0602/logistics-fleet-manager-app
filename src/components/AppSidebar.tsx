
import { BarChart3, Truck, Users, MapPin, Wrench } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const navigationItems = [
  { title: 'Dashboard', url: '/', icon: BarChart3, id: 'dashboard' },
  { title: 'Vehicles', url: '/?tab=vehicles', icon: Truck, id: 'vehicles' },
  { title: 'Drivers', url: '/?tab=drivers', icon: Users, id: 'drivers' },
  { title: 'Trips', url: '/?tab=trips', icon: MapPin, id: 'trips' },
  { title: 'Maintenance', url: '/?tab=maintenance', icon: Wrench, id: 'maintenance' },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentTab = new URLSearchParams(location.search).get('tab') || 'dashboard';
  const collapsed = state === 'collapsed';

  const isActive = (id: string) => {
    if (id === 'dashboard') return currentTab === 'dashboard' || !currentTab;
    return currentTab === id;
  };

  return (
    <Sidebar className={collapsed ? 'w-14' : 'w-64'} collapsible="icon">
      <SidebarContent>
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Truck className="h-6 w-6 text-blue-600" />
            {!collapsed && (
              <div>
                <h1 className="font-bold text-lg text-gray-900">Harbour Traders</h1>
                <p className="text-sm text-gray-600">Fleet Manager</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                        isActive(item.id)
                          ? 'bg-blue-100 text-blue-800 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
