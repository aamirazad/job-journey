"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { getNonAdminUsers, promoteUser } from "@/actions/actions";
import LoadingSpinner from "@/components/loading-spinner";
import BodyMessage from "@/components/body-message";
import { toast } from "sonner";

const queryClient = new QueryClient();

function Block() {
  const [selectedUser, setSelectedUser] = useState<string | null>();
  const queryClient = useQueryClient();

  const users = useQuery({
    queryKey: ["users"],
    queryFn: getNonAdminUsers,
  });

  if (users.isLoading) {
    return <LoadingSpinner />;
  }

  if (!users.data) {
    return <BodyMessage>Error</BodyMessage>;
  }

  const handlePromoteToAdmin = async () => {
    if (!selectedUser) return;

    try {
      // Call server action to get non-admin users and promote the selected user
      const result = await promoteUser(selectedUser);

      // Handle the result (e.g., show a success toast, update UI)
      if (result.success) {
        // Optionally reset the selection or show a success message
        setSelectedUser(undefined);
        // You might want to add toast or notification here
        await queryClient.invalidateQueries({ queryKey: ["users"] });
        toast.success("User promoted successfully");
      } else {
        // Handle error (show error message)
        toast.error("Failed to promote user");
      }
    } catch {
      toast.error("Error promoting user");
    }
  };

  return (
    <form action={handlePromoteToAdmin} className="space-y-4">
      <Select value={selectedUser ?? ""} onValueChange={setSelectedUser}>
        <SelectTrigger>
          <SelectValue placeholder="Select a user" />
        </SelectTrigger>
        <SelectContent>
          {users.data.map((user) => (
            <SelectItem key={user.id} value={user.id.toString()}>
              {user.name} ({user.email})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" disabled={!selectedUser}>
        Promote to Admin
      </Button>
    </form>
  );
}

export function UserPromotionBlock() {
  return (
    <QueryClientProvider client={queryClient}>
      <Block />
    </QueryClientProvider>
  );
}
