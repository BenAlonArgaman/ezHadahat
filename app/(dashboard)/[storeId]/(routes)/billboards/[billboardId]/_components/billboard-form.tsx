"use client";
import React, { useState } from "react";
import { Heading } from "@/components/heading";
import ImageUpload from "@/components/image-upload";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { storage } from "@/lib/firebase";
import { Billboards } from "@/types-db";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { deleteObject, ref } from "firebase/storage";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
});

interface BillboardFormProps {
  initialData: Billboards;
}

export const BillboardForm = ({ initialData }: BillboardFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();

  const title = initialData ? "ערוך שלט" : "צור שלט חדש";
  const description = initialData ? "ערוך שלט קיים" : "הוסף שלט חדש";
  const toastMessage = initialData ? "השלט עודכן" : "השלט נוצר";
  const action = initialData ? "שמור שינויים" : "צור שלט";

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, data);
      }
      toast.success(toastMessage);
      router.push(`/${params.storeId}/billboards`);
    } catch (error) {
      toast.error("משהו השתבש");
    } finally {
      router.refresh();
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      const { imageUrl } = form.getValues();
      await deleteObject(ref(storage, imageUrl)).then(async () => {
        await axios.delete(
          `/api/${params.storeId}/billboards/${params.billboardId}`
        );
      });
      toast.success("השלט הוסר");
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
    } catch (error) {
      toast.error("משהו השתבש");
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  return (
    <div dir="rtl">
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isLoading}
      />
      <div className="flex items-center justify-between mb-4">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={isLoading}
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
            className="mr-4"
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8 mt-4"
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>תמונת שלט</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={isLoading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>שם</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="שם השלט שלך..."
                      {...field}
                      className="text-right"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={isLoading} type="submit" size="sm">
            {action}
          </Button>
        </form>
      </Form>
    </div>
  );
};
