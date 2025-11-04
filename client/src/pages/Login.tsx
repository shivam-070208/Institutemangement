import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import React, { useState } from "react";
import { LabelInputContainer } from "./institute/Create";


export default function Login() {
  const [usertype, setUsertype] = useState(null);
  const inputs = {
 
    Gmail: {
      label: "Email",
      placeholder: "Email",
      type: "email",
      required: true,
    },
    Password: {
      label: "Password",
      placeholder: "Password",
      type: "password",
      required: true,
      pattern:'^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,24}$'
    }
  }
  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black absolute top-1/2 left-0 right-0 -translate-y-1/2">
    <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
      Welcome to Instam
    </h2>
    <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
      Create  your <b>UniM</b> Account, Manage your Institute.
    </p>
    <form className="py-5">
    {Object.entries(inputs).map(([key, value]) => {
          if((value as any).type === "select"){
        return (
          <LabelInputContainer key={key} className="mb-4">
                <Label htmlFor={key}>{(value as any).label}</Label>
           <Select id={key} name={key} options={(value as any).options}  required={(value as any).required as boolean} />
          </LabelInputContainer>
        )
      }

      return (
          <LabelInputContainer key={key} className="mb-4">
                <Label htmlFor={key}>{(value as any).label}</Label>
            <Input id={key} name={key}  {...(value as any)} />
          </LabelInputContainer>
        )})}     
    </form>
  </div>
  );
}
