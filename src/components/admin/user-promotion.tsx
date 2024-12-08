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
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a user" />
        </SelectTrigger>
        <SelectContent className="max-h-60 overflow-y-auto">
          {users.data.map((user) => (
            <SelectItem
              key={user.id}
              value={user.id.toString()}
              className="text-sm sm:text-base"
            >
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="mr-2 max-w-[150px] truncate sm:max-w-[200px]">
                  {user.name}
                </span>
                <span className="text-xs text-muted-foreground sm:text-sm">
                  ({user.email})
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" disabled={!selectedUser} className="w-full">
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
