import { useState } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import api from "@/services/api";

import { Spinner } from "../ui/spinner";

interface DeleteTenantFormProps {
  name: string;
  id: number | string;
}

export const DeleteTenantForm: React.FC<DeleteTenantFormProps> = ({
  name,
  id,
}) => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const confirmationText = `delete-${name.toLowerCase()}`;

  const handleDelete = () => {
    setIsLoading(true);
    try {
      api.delete(`/tenant/${id}`).then((response) => {
        setIsLoading(false);
        if (response.status === 200) {
          toast({
            title: "Success",
            description: "Tenant has been deleted.",
          });
          setTimeout(() => {
            router.push("/admin/tenant");
          }, 1000);
        }
      });
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" className="w-full bg-red-500">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Tenant</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2 mt-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="confirmation" className="sr-only">
              Confirmation Input
            </Label>
            <Input
              id="confirmation"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Type ${confirmationText}`}
            />
            <p className="text-sm">
              Please confirm your action by typing:{" "}
              <span className="font-bold">{confirmationText}</span>
            </p>
          </div>
        </div>
        <Button
          type="button"
          className="bg-red-500"
          disabled={inputValue !== confirmationText || isLoading}
          onClick={handleDelete}
        >
          {isLoading && <Spinner />}
          <span className={isLoading ? "ml-2" : ""}>Confirm</span>
        </Button>
      </DialogContent>
    </Dialog>
  );
};
