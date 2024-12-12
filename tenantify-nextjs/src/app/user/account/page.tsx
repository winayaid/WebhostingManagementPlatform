import { AccountSettingForm } from "@/components/account-setting-form"
import { ClientLayout } from "@/components/client-layout"

export default function AccountSettingPage() {
  return (
    <ClientLayout>
      <h1 className="text-2xl font-semibold mb-5">Account Setting</h1>
      <AccountSettingForm />
    </ClientLayout>
  )
}
