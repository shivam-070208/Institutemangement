import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import React, { useState } from "react";
import { BottomGradient, LabelInputContainer } from "./institute/Create";
import { IconArrowLeft } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LinkIcon } from "lucide-react";

export default function Login() {
  const [usertype, setUsertype] = useState<string | null>("");
  const [submitting, setSubmitting] = useState(false);
  const [Gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const inputs = {
    Gmail: {
      label: "Email",
      placeholder: "Email",
      type: "email",
      required: true,
      autoComplete: "email",
    },
    Password: {
      label: "Password",
      placeholder: "Password",
      type: "password",
      required: true,
      pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,24}$",
      autoComplete: "current-password",
    },
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const body = JSON.stringify({ Gmail, password });
    if (usertype === "Admin") {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/institute/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body,
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          toast(data.message || "login failed");
          setSubmitting(false);
          return;
        }
        navigate("/institute/dashboard");
      } catch (err) {
        setError("An unexpected error occurred. Please try again.");
        setSubmitting(false);
      }
    } else if (usertype === "Student") {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/student/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body,
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          toast(data.message || "Login failed");
          setSubmitting(false);
          return;
        }
        navigate("/student/dashboard"); // Adjust route as necessary
      } catch (err) {
        setError("An unexpected error occurred. Please try again.");
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black absolute top-1/2 left-0 right-0 -translate-y-1/2">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Welcome to Instam
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Create your <b>UniM</b> Account, Manage your Institute.
      </p>
      <form className="py-5" onSubmit={handleSubmit}>
        {Object.entries(inputs).map(([key, value]) => {
          return (
            <LabelInputContainer key={key} className="mb-4">
              <Label htmlFor={key}>{(value as any).label}</Label>
              <Input
                id={key}
                name={key}
                {...(value as any)}
                value={key === "Gmail" ? Gmail : password}
                onChange={(e) =>
                  key === "Gmail"
                    ? setGmail(e.target.value)
                    : setPassword(e.target.value)
                }
              />
            </LabelInputContainer>
          );
        })}

        <LabelInputContainer className="mb-4">
          <Label htmlFor="usertype">User Type</Label>
          <Select
            id="usertype"
            name="usertype"
            value={usertype}
            onChange={(e) => setUsertype(e.target.value)}
            required
          >
            <option value="">Select User Type</option>
            <option value="Admin">Admin</option>
            <option value="Faculty">Faculty</option>
            <option value="Student">Student</option>
          </Select>
        </LabelInputContainer>

        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Login →"}
          <BottomGradient />
        </button>

        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
        <div className="flex flex-col space-y-4">
          <Link
            to={"/"}
            className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
            type="button"
          >
            <IconArrowLeft className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              GoBack
            </span>
            <BottomGradient />
          </Link>
          <Link
            to={"/institute/create"}
            className="group/btn relative block py-2 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]  text-center"
            type="submit"
          >
            Signup → 
            <BottomGradient />
          </Link>
        </div>
      </form>
    </div>
  );
}
