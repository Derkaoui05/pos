"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Category } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Max 50 characters"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  category?: Category | null;
}

export default function CategoryFormDialog({ open, onClose, category }: Props) {
  const qc = useQueryClient();
  const isEditing = !!category;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    reset({ name: category?.name ?? "" });
  }, [category, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      const url = isEditing ? `/api/categories/${category!.id}` : "/api/categories";
      const method = isEditing ? "PATCH" : "POST";
      return fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(async res => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        return json;
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success(isEditing ? "Category updated" : "Category created");
      onClose();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Category" : "New Category"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-4">
          <div className="space-y-1">
            <Label>Category Name *</Label>
            <Input {...register("name")} placeholder="e.g. Drinks, Food, Electronics" />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : isEditing ? "Save Changes" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}