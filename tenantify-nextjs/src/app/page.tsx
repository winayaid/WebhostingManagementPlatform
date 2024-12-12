"use client";

import { useState } from 'react';

import { useSession } from 'next-auth/react';

import { LoginForm } from '@/components/login-form';

export default function Home() {
  const session = useSession();
  const [logo, setLogo] = useState("");

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     try {
  //       if (window.location.hostname.split(".").length > 1) {
  //         api
  //           .get(`/tenant/check/${window.location.hostname.split(".")[0]}`)
  //           .then((res) => {
  //             setLogo(res?.data?.logo);
  //           })
  //           .catch(() => {
  //             if (session?.data?.user) {
  //               window.location.href = `/user`;
  //             } else {
  //               window.location.href = `${
  //                 window.location.hostname.split(".")[1]
  //               }`;
  //             }
  //           });
  //       }
  //     } catch (error) {
  //       window.location.href = `${window.location.hostname}`;
  //     }
  //   }
  // }, [session]);
  return (
    <div>
      <LoginForm logo={logo} />
    </div>
  );
}