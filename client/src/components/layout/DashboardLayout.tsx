import { useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar, SidebarBody, SidebarLink } from "./Sidebar";
import { Navbar } from "./Navbar";
import { IconBuilding,  IconLayoutDashboard, IconUsers, IconBooks, IconSettings, IconChalkboardTeacher } from "@tabler/icons-react";
import { motion } from "motion/react";
export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const isInstitute = useMemo(() => location.pathname.includes("/institute"), [location.pathname]);
  const [hovered,sethovered] = useState(null)
  const instituteLinks = useMemo(() => (
    [
      { label: "DashBoard", href: "/institute/create", icon: <IconLayoutDashboard size={18} /> },
      { label: "Departments", href: "/institute/departments", icon: <IconBuilding size={18} /> },
      { label: "Faculty", href: "/institute/faculty", icon: <IconChalkboardTeacher size={18} /> },
      { label: "Students", href: "/institute/students", icon: <IconUsers size={18} /> },
      { label: "Courses", href: "/institute/courses", icon: <IconBooks size={18} /> },
      { label: "Settings", href: "/institute/settings", icon: <IconSettings size={18} /> },
    ]
  ), []);

  const defaultLinks = useMemo(() => (
    [
      { label: "Dashboard", href: "/", icon: <IconLayoutDashboard size={18} /> },
      { label: "Students", href: "/students", icon: <IconUsers size={18} /> },
      { label: "Courses", href: "/courses", icon: <IconBooks size={18} /> },
      { label: "Settings", href: "/settings", icon: <IconSettings size={18} /> },
    ]
  ), []);

  return (
    <div className="flex h-screen bg-background overflow-hidden w-screen">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}>
        <SidebarBody>
          <div className="flex flex-col gap-1" onMouseLeave={()=>sethovered(null)}>
            {isInstitute &&instituteLinks.map((link) => (
              <div  key={link.href} className="relative z-1 pl-2" onMouseEnter={()=>sethovered(link.label)}>
              {sidebarOpen&&hovered===link.label&&<motion.div animate={{scale:1.1}} layoutId="movablenavspan" className="absolute top-0 left-0 bg-neutral-200 rounded backdrop-blur-sm w-full h-full" />}
              <SidebarLink link={link as any} />
              </div>
            ))}
          </div>
        </SidebarBody>
      </Sidebar>
      
      <div className="flex-1 flex flex-col ">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 w-screen p-6  md:w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
