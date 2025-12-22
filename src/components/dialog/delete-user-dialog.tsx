import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import type { User } from "@/types/user"
import { deleteUser } from "@/services/api/users/actions"
import { DropdownMenuItem } from "../ui/dropdown-menu";

export function DeleteUserDialog({ user, onSuccess }: {
  user: User;
  onSuccess?: () => void;
}) {
  const handleDelete = async () => {
    try {
      await deleteUser(user.id);
      toast.success(`User ${user.name} was successfully deleted`);
      onSuccess?.();
    } catch (err) {
      toast.error("Failed to delete user");
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem variant="destructive" onSelect={e => e.preventDefault()}>
          Delete
        </DropdownMenuItem>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus user?</AlertDialogTitle>
          <AlertDialogDescription>
            User {user.name} akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleDelete}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
