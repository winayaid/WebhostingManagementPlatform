"use client";

import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";

import { Landing } from "@/components/landing";
import { LoginForm } from "@/components/login-form";
import api from "@/services/api";

export default function Home() {
  const session = useSession();
  const [logo, setLogo] = useState("");
  const [isLanding, setIsLanding] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        if (window.location.hostname.split(".").length == 2) {
          setIsLanding(true);
          return;
        }
        if (window.location.hostname.split(".").length > 3) {
          api
            .get(`/tenant/check/${window.location.hostname.split(".")[0]}`)
            .then((res) => {
              setLogo(res?.data?.logo);
            })
            .catch(() => {
              if (session?.data?.user) {
                window.location.href = `/user`;
              } else {
                window.location.href = `https://${
                  window.location.hostname.split(".")[2]
                }.${window.location.hostname.split(".")[3]}`;
              }
            });
        }
      } catch (error) {
        window.location.href = `https://${
          window.location.hostname.split(".")[2]
        }.${window.location.hostname.split(".")[3]}`;
      }
    }
  }, [session]);
  return <div>{isLanding ? <Landing /> : <LoginForm logo={logo} />}</div>;
}
