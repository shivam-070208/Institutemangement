import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

//? imorting pages and component
import Departments from "./pages/institute/Departments";
import NotFound from "./pages/NotFound";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import Create from "./pages/institute/Create";
import { InstituteAuthProvider } from "./components/layout/InstituteAuthProvider";
import { Login } from "./pages";
import Faculty from "./pages/institute/Faculty";
import Course from "./pages/institute/Course";
import Student from "./pages/institute/Student";
import Dashboard from "./pages/institute/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} /> */}
          <Route path="/institute/create" element={<Create />} />
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <InstituteAuthProvider>
                <DashboardLayout />
              </InstituteAuthProvider>
            }
          >
            <Route path="/institute/dashboard" element={<Dashboard />} />
            <Route path="/institute/departments" element={<Departments />} />
            <Route path="/institute/courses" element={<Course />} />
            <Route path="/institute/faculty" element={<Faculty />} />
            <Route path="/institute/students" element={<Student />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
