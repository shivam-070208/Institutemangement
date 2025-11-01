import { NavLink } from "react-router-dom";
import { 
  Home, 
  Info, 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Building2, 
  ClipboardList, 
  Award,
  UserCircle,
  Settings,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Info, label: "About", path: "/about" },
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Students", path: "/students" },
  { icon: GraduationCap, label: "Faculty", path: "/faculty" },
  { icon: BookOpen, label: "Courses", path: "/courses" },
  { icon: Building2, label: "Departments", path: "/departments" },
  { icon: ClipboardList, label: "Enrollments", path: "/enrollments" },
  { icon: Award, label: "Grades", path: "/grades" },
  { icon: UserCircle, label: "Profile", path: "/profile" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  return (
    <aside
      className={cn(
        "bg-card border-r border-border transition-all duration-300 ease-in-out flex flex-col relative",
        isOpen ? "w-64" : "w-20"
      )}
    >
      <div className="p-6 flex items-center justify-between border-b border-border">
        {isOpen && (
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            UniManage
          </h1>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-accent rounded-lg transition-colors ml-auto"
        >
          <ChevronLeft
            className={cn(
              "w-5 h-5 transition-transform",
              !isOpen && "rotate-180"
            )}
          />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-primary"
                      : "text-foreground"
                  )
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {isOpen && (
                  <span className="font-medium truncate">{item.label}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
