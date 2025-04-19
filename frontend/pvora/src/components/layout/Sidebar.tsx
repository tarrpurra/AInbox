
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  Mail, 
  LayoutDashboard, 
  Inbox, 
  Send, 
  Archive, 
  Trash2, 
  Tag, 
  AlertCircle, 
  Calendar, 
  Settings, 
  Plus, 
  MessageSquare,
  ChevronRight,
  ChevronLeft 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { to: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/inbox", icon: <Inbox size={20} />, label: "Inbox" },
    { to: "/sent", icon: <Send size={20} />, label: "Sent" },
    { to: "/archive", icon: <Archive size={20} />, label: "Archive" },
    { to: "/trash", icon: <Trash2 size={20} />, label: "Trash" },
  ];

  const labelItems = [
    { color: "bg-red-500", label: "Urgent" },
    { color: "bg-green-500", label: "Meeting" },
    { color: "bg-blue-500", label: "Follow-up" },
    { color: "bg-amber-500", label: "Approval" },
    { color: "bg-purple-500", label: "Information" },
  ];

  return (
    <div className={cn(
      "bg-sidebar text-sidebar-foreground h-screen flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 flex items-center">
        {!collapsed && <Mail className="mr-2 text-sidebar-accent" size={24} />}
        {!collapsed && <h1 className="text-xl font-bold">MailAgent</h1>}
        {collapsed && <Mail className="mx-auto text-sidebar-accent" size={24} />}
      </div>
      
      <div className="mt-2 px-3">
        <Button 
          variant="default" 
          size="sm" 
          className={cn(
            "w-full bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-accent flex items-center justify-center",
            collapsed ? "px-2" : ""
          )}
        >
          <Plus size={16} className="mr-1" />
          {!collapsed && <span>Compose</span>}
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-3 py-2 rounded-md transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/10",
                  collapsed ? "justify-center" : ""
                )
              }
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="ml-3">{item.label}</span>}
            </NavLink>
          ))}
        </nav>
        
        {!collapsed && (
          <div className="mt-6 px-3">
            <div className="px-3 mb-2 flex items-center justify-between">
              <h3 className="text-xs uppercase text-sidebar-foreground/70 font-medium">Labels</h3>
              <Button variant="ghost" size="icon" className="h-5 w-5">
                <Plus size={12} />
              </Button>
            </div>
            <div className="space-y-1">
              {labelItems.map((item) => (
                <button
                  key={item.label}
                  className="flex items-center w-full px-3 py-2 rounded-md transition-colors hover:bg-sidebar-accent/10"
                >
                  <span className={`h-3 w-3 rounded-full ${item.color}`} />
                  <span className="ml-3 text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="p-3 border-t border-sidebar-border">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "flex items-center px-3 py-2 rounded-md transition-colors",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/10",
              collapsed ? "justify-center" : ""
            )
          }
        >
          <Settings size={20} />
          {!collapsed && <span className="ml-3">Settings</span>}
        </NavLink>
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center w-full px-3 py-2 mt-2 rounded-md transition-colors hover:bg-sidebar-accent/10"
        >
          {collapsed ? (
            <ChevronRight size={20} className="mx-auto" />
          ) : (
            <>
              <ChevronLeft size={20} />
              <span className="ml-3">Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
