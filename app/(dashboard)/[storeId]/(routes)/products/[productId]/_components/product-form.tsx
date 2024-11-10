"use client";

import { Heading } from "@/components/heading";
import ImagesUpload from "@/components/images-upload";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Category, Product } from "@/types-db";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface ProductFormProps {
  initialData: Product;
  categories: Category[];
}

const formSchema = z.object({
  name: z.string().min(1),
  price: z.coerce.number().min(1),
  images: z.object({ url: z.string() }).array(),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  category: z.string().min(1),
});

export const ProductForm = ({ initialData, categories }: ProductFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      price: 0,
      images: [],
      isFeatured: false,
      isArchived: false,
      category: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();

  const title = initialData ? "ערוך מוצר" : "צור מוצר חדש";
  const description = initialData ? "ערוך מוצר קיים" : "הוסף מוצר חדש";
  const toastMessage = initialData ? "המוצר עודכן" : "המוצר נוצר";
  const action = initialData ? "שמור שינויים" : "צור מוצר";

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/products/${params.productId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/products`, data);
      }
      toast.success(toastMessage);
      router.push(`/${params.storeId}/products`);
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
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      toast.success("המוצר הוסר");
      location.reload();
      router.push(`/${params.storeId}/products`);
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
          {/* תמונות */}
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>תמונות המוצר</FormLabel>
                <FormControl>
                  <ImagesUpload
                    value={field.value.map((image) => image.url)}
                    onChange={(urls) => {
                      field.onChange(urls.map((url) => ({ url })));
                    }}
                    onRemove={(url) =>
                      field.onChange(
                        field.value.filter((current) => current.url !== url)
                      )
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {/* שם */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>שם</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="שם המוצר..."
                      {...field}
                      className="text-right"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* מחיר */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>מחיר</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={isLoading}
                      placeholder="0"
                      {...field}
                      className="text-right"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* קטגוריה */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>קטגוריה</FormLabel>
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
                          placeholder="בחר קטגוריה"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.name}
                          className="text-right"
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* מוצר מומלץ */}
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex justify-between items-start gap-3 rounded-md border p-4">
                  <div className="space-y-1 text-right">
                    <FormLabel>מוצר מומלץ</FormLabel>
                    <FormDescription>
                      מוצר זה יופיע במסך הבית תחת מוצרים מומלצים
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* מוצר בארכיון */}
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex justify-between items-start gap-3 rounded-md border p-4">
                  <div className="space-y-1 text-right">
                    <FormLabel>בארכיון</FormLabel>
                    <FormDescription>
                      מוצר זה לא יוצג בשום מקום בחנות
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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
