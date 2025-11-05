import React, { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Select } from "@/components/ui/select";
import {
  IconArrowLeft,
} from "@tabler/icons-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";


const getInputItems = (path:string)=>{
  if(path.toLowerCase() === "/institute/create"){
    return {
      uName: {
        label: "Institute Name",
        placeholder: "Institute Name",
        type: "text",
        required: true,
      },
      Address: {
        label: "Address",
        placeholder: "Address",
        type: "text",
        required: true,
      },
      Type: {
        label: "Type",
        placeholder: "Government/Private/Semi-private",
        type: "select",
        required: true,
        options: [
          { label: "Public", value: "Public" },
          { label: "Private", value: "Private" },
          { label: "Semi-private", value: "Semi-private" },
        ],
      },
      Established_Year: {
        label: "Established Year",
        placeholder: "Established Year",
        type: "text",
        required: true,
      },
      Authority: {
        label: "Authority",
        placeholder: "Authority",
        type: "text",
        required: true,
      },
      Gmail: {
        label: "Email",
        placeholder: "Email",
        type: "email",
        required: true,
      },
      Phone: {
        label: "Phone",
        placeholder: "Phone",
        type: "text",
        required: true,
      },
      Website: {
        label: "Institute Website",
        placeholder: "Institute Website",
        type: "text",
        required: true,
      },
      Admin_Position: {
        label: "Admin Position",
        placeholder: "Admin Position",
        required: true,
        type: "text",
      },
      adminname: {
        label: "Admin Name",
        placeholder: "Admin Name",
        type: "text",
        required: true,
      },
      Password: {
        label: "Password",
        placeholder: "Password",
        type: "password",
        required: true,
        pattern:'^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,24}$'
      },
      confirmPassword: {
        label: "Confirm Password",  
        placeholder: "Confirm Password",
        type: "password",
        required: true,
        pattern:'^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,24}$'
        },
    }
  }
}

export default function Create() {

  const path = useLocation().pathname;
  const inputs = useMemo<Record<string, any>>(
    () => (getInputItems(path) || {}) as Record<string, any>,
    [path],
  );
  const [formValues, setformValues] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const API_BASE = (import.meta as any).env?.VITE_SERVER_URL || "http://localhost:3000";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    console.log(name,value);
    
    setformValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
     setError(null);
    setSuccess(null);

    // basic validation
    if (inputs && "Password" in inputs && "confirmPassword" in inputs) {
      if ((formValues["Password"] || "") !== (formValues["confirmPassword"] || "")) {
        setError("Passwords do not match");
        return;
      }
    }

    const payload: Record<string, string> = {};
    Object.keys(inputs || {}).forEach((key) => {
      if (key !== "confirmPassword") {
        payload[key] = formValues[key] || "";
      }
    });

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/api/institute/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast(data.message);
      }
      toast("Signup Success");
      navigate('/institute/dashboard');
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Welcome to Instam
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Create  your <b>UniM</b> Account, Manage your Institute.
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        {error ? (
          <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : null}
        {success ? (
          <p className="mb-4 text-sm text-green-700 dark:text-green-400">{success}</p>
        ) : null}
        {Object.entries(inputs).map(([key, value]) => {
          if((value as any).type === "select"){
        return (
          <LabelInputContainer key={key} className="mb-4">
                <Label htmlFor={key}>{(value as any).label}</Label>
           <Select id={key} name={key} options={(value as any).options} onChange={handleChange} value={formValues[key] || ""} required={(value as any).required as boolean} />
          </LabelInputContainer>
        )
      }

      return (
          <LabelInputContainer key={key} className="mb-4">
                <Label htmlFor={key}>{(value as any).label}</Label>
            <Input id={key} name={key} onChange={handleChange} value={formValues[key] || ""} {...(value as any)} />
          </LabelInputContainer>
        )})}        

        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Sign up →"}
          <BottomGradient />
        </button>

        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

        <div className="flex flex-col space-y-4">
       
        
          <Link
          to={"/"}
            className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
            type="submit"
          >
            <IconArrowLeft className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              GoBack
            </span>
            <BottomGradient />
          </Link>
        </div>
      </form>
    </div>
  );
}

export const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

export const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
