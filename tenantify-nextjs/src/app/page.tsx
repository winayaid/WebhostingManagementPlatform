import { headers } from "next/headers";

import { Landing } from "@/components/landing";
import { LoginForm } from "@/components/login-form";

async function fetchTenantLogo(subdomain: string): Promise<string | null> {
  const apiUrl = `${process.env.API_URL}/tenant/check/${subdomain}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) return null;

    const data: { logo?: string } = await response.json();
    return data.logo || null;
  } catch {
    return null;
  }
}

export default async function Home() {
  const headersList = headers();
  const hostname = headersList.get("host") || ""; // Ambil hostname dari header
  const hostnameParts = hostname.split(".");
  let isLanding = false;
  let logo = "";

  if (hostnameParts.length === 2) {
    isLanding = true;
  } else if (hostnameParts.length === 3 && hostnameParts[0] != "app") {
    const redirectUrl = `https://${hostnameParts.slice(-2).join(".")}`;
    return <meta httpEquiv="refresh" content={`0; url=${redirectUrl}`} />;
  } else if (hostnameParts.length === 4 && hostnameParts[1] != "app") {
    const redirectUrl = `https://${hostnameParts.slice(-2).join(".")}`;
    return <meta httpEquiv="refresh" content={`0; url=${redirectUrl}`} />;
  } else if (hostnameParts.length === 4 && hostnameParts[1] == "app") {
    const subdomain = hostnameParts[0];
    const fetchedLogo = await fetchTenantLogo(subdomain);

    if (fetchedLogo) {
      logo = fetchedLogo;
    } else {
      const redirectUrl = `https://${hostnameParts.slice(-2).join(".")}`;
      return <meta httpEquiv="refresh" content={`0; url=${redirectUrl}`} />;
    }
  }

  return <div>{isLanding ? <Landing /> : <LoginForm logo={logo} />}</div>;
}
