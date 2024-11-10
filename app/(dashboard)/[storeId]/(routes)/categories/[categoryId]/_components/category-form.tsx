"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { storage } from "@/lib/firebase";
import { Billboards, Category } from "@/types-db";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface CategoryFormProps {
  initialData: Category;
  billboards: Billboards[];
}

const formSchema = z.object({
  name: z.string().min(1),
  billboardId: z.string().min(1),
});

export const CategoryForm = ({
  initialData,
  billboards,
}: CategoryFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();

  const title = initialData ? "ערוך קטגוריה" : "צור קטגוריה חדשה";
  const description = initialData ? "ערוך קטגוריה קיימת" : "הוסף קטגוריה חדשה";
  const toastMessage = initialData ? "הקטגוריה עודכנה" : "הקטגוריה נוצרה";
  const action = initialData ? "שמור שינויים" : "צור קטגוריה";

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      const { billboardId: formBillId } = form.getValues();
      const matchingBillboard = billboards.find(
        (item) => item.id === formBillId
      );

      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          {
            ...data,
            billboardLabel: matchingBillboard?.label,
          }
        );
      } else {
        await axios.post(`/api/${params.storeId}/categories`, {
          ...data,
          billboardLabel: matchingBillboard?.label,
        });
      }
      toast.success(toastMessage);
      router.push(`/${params.storeId}/categories`);
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
      await axios.delete(
        `/api/${params.storeId}/categories/${params.categoryId}`
      );
      toast.success("הקטגוריה הוסרה");
      router.refresh();
      router.push(`/${params.storeId}/categories`);
    } catch (error) {
      toast.error("משהו השתבש");
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  return (
    <div dir="rtl" className="w-full px-4 md:px-8">
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

      <Separator className="my-4" />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right">שם</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="שם הקטגוריה שלך..."
                      {...field}
                      className="text-right"
                    />
                  </FormControl>
                  <FormMessage className="text-right" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right">שלט</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="text-right">
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="בחר שלט"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {billboards.map((billboard) => (
                          <SelectItem
                            style={{ direction: "rtl" }}
                            key={billboard.id}
                            value={billboard.id}
                            className="text-right"
                          >
                            {billboard.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-right" />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-start">
            <Button disabled={isLoading} type="submit" size="sm">
              {action}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
