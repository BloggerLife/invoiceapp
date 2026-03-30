"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Store,
  Mail,
  Phone,
  MapPin,
  Palette,
  FileText,
  CreditCard,
  Heart,
  Calculator,
  Save,
  Building2,
  Sliders,
} from "lucide-react";
import toast from "react-hot-toast";

import { updateBrand, type BrandProfile } from "@/actions/brand";
import LogoUploader from "../FormInputs/LogoUploader";

const brandSchema = z.object({
  name: z.string().min(2, "Brand name must be at least 2 characters"),
  logo: z.string().optional(),

  phone: z.string().optional(),
  currency: z.string().optional(),
  address: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  brandColor: z.string().default("#000000"),
  template: z
    .enum(["MINIMAL", "PROFESSIONAL", "MODERN", "CREATIVE"])
    .default("PROFESSIONAL"),
  paymentInfo: z.string().optional(),
  contactInfo: z.string().optional(),
  thankYouMsg: z.string().optional(),
  taxRate: z.number().min(0).max(100).optional().or(z.nan()),
  salesTax: z.number().min(0).optional().or(z.nan()),
  otherCharges: z.number().min(0).optional().or(z.nan()),
});

type BrandFormValues = z.infer<typeof brandSchema>;

interface BrandSettingsFormProps {
  currentBrand?: BrandProfile;
  userId: string;
}

export default function BrandSettingsForm({
  currentBrand,
  userId,
}: BrandSettingsFormProps) {
  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: currentBrand?.name || "",
      logo: currentBrand?.logo || "",
      currency: currentBrand?.currency || "$",
      phone: currentBrand?.phone || "",
      address: currentBrand?.address || "",
      email: currentBrand?.email || "",
      brandColor: currentBrand?.brandColor || "#000000",
      template: currentBrand?.template || "PROFESSIONAL",
      paymentInfo: currentBrand?.paymentInfo || "",
      contactInfo: currentBrand?.contactInfo || "",
      thankYouMsg: currentBrand?.thankYouMsg || "",
      taxRate: currentBrand?.taxRate || undefined,
      salesTax: currentBrand?.salesTax || undefined,
      otherCharges: currentBrand?.otherCharges || undefined,
    },
  });

  const [loading, setLoading] = useState(false);
  const initialImage = currentBrand?.logo || "/placeholder.svg";
  const [imageUrl, setImageUrl] = useState(initialImage);

  async function onSubmit(data: BrandFormValues) {
    setLoading(true);
    data.logo = imageUrl;

    try {
      let result;

      if (currentBrand) {
        // Update existing brand
        result = await updateBrand(currentBrand.id, data);
      }

      toast.success(
        currentBrand
          ? "Brand updated successfully"
          : "Brand created successfully"
      );
    } catch (error) {
      console.error("Error saving brand:", error);
      toast.error("Failed to save brand settings");
    } finally {
      setLoading(false);
    }
  }

  const templateOptions = [
    {
      value: "MINIMAL",
      label: "Minimal",
      description: "Clean and simple design",
    },
    {
      value: "PROFESSIONAL",
      label: "Professional",
      description: "Corporate and polished",
    },
    {
      value: "MODERN",
      label: "Modern",
      description: "Contemporary and stylish",
    },
    {
      value: "CREATIVE",
      label: "Creative",
      description: "Artistic and unique",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20 relative overflow-hidden">
      {/* Premium background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(147,51,234,0.08),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(236,72,153,0.06),transparent_50%)]"></div>

      {/* Floating geometric shapes */}
      <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-gradient-to-br from-purple-200/20 to-pink-200/20 blur-xl"></div>
      <div className="absolute bottom-20 left-20 w-48 h-48 rounded-full bg-gradient-to-tl from-indigo-200/15 to-purple-200/15 blur-2xl"></div>

      <div className="relative z-10 p-6 lg:p-8">
        {/* Premium Header */}
        <div className="text-center mb-8 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/25 mb-4">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-purple-700 to-pink-800 bg-clip-text text-transparent">
            Brand Settings
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Customize your brand identity and invoice templates with
            professional styling
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-12 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-8 col-span-full space-y-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Brand Information Card */}
                  <Card className="border-0 shadow-2xl shadow-slate-900/5 bg-white/80 backdrop-blur-xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-200/30 via-transparent to-pink-200/20 p-[1px] rounded-xl">
                      <div className="rounded-xl bg-white/90 backdrop-blur-sm h-full w-full"></div>
                    </div>

                    <div className="relative">
                      <CardHeader className="bg-gradient-to-r from-slate-50/80 to-purple-50/40 border-b border-slate-200/50">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-md">
                            <Building2 className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-xl font-semibold text-slate-800">
                              Brand Information
                            </CardTitle>
                            <CardDescription className="text-slate-600">
                              Set up your brand identity and contact details
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="p-8 space-y-6">
                        {/* Brand Name */}

                        <div className="grid gap-6 sm:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                                  <Store className="w-4 h-4 text-slate-500" />
                                  <span>Brand Name</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Your Business Name"
                                    {...field}
                                    className="h-12 px-4 bg-slate-50/50 border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
                                  />
                                </FormControl>
                                <FormMessage className="text-red-500 text-xs" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="currency"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                                  <Store className="w-4 h-4 text-slate-500" />
                                  <span>Currency Symbol</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="$"
                                    {...field}
                                    className="h-12 px-4 bg-slate-50/50 border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
                                  />
                                </FormControl>
                                <FormMessage className="text-red-500 text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                        {/* Contact Information */}
                        <div className="grid gap-6 sm:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                                  <Mail className="w-4 h-4 text-slate-500" />
                                  <span>Business Email</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="business@example.com"
                                    {...field}
                                    className="h-12 px-4 bg-slate-50/50 border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
                                  />
                                </FormControl>
                                <FormMessage className="text-red-500 text-xs" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                                  <Phone className="w-4 h-4 text-slate-500" />
                                  <span>Business Phone</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="tel"
                                    placeholder="+1 (555) 123-4567"
                                    {...field}
                                    className="h-12 px-4 bg-slate-50/50 border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
                                  />
                                </FormControl>
                                <FormMessage className="text-red-500 text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Address */}
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                                <MapPin className="w-4 h-4 text-slate-500" />
                                <span>Business Address</span>
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="123 Business St, City, State 12345"
                                  {...field}
                                  className="min-h-[80px] px-4 py-3 bg-slate-50/50 border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200 resize-none"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500 text-xs" />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </div>
                  </Card>

                  {/* Design & Template Card */}
                  <Card className="border-0 shadow-2xl shadow-slate-900/5 bg-white/80 backdrop-blur-xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-200/30 via-transparent to-pink-200/20 p-[1px] rounded-xl">
                      <div className="rounded-xl bg-white/90 backdrop-blur-sm h-full w-full"></div>
                    </div>

                    <div className="relative">
                      <CardHeader className="bg-gradient-to-r from-slate-50/80 to-purple-50/40 border-b border-slate-200/50">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 flex-shrink-0 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-md">
                            <Palette className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-xl font-semibold text-slate-800">
                              Design & Templates
                            </CardTitle>
                            <CardDescription className="text-slate-600">
                              Customize your brand colors and invoice templates.
                              To get Good colors visit{" "}
                              <a
                                className="font-bold text-blue-500 underline"
                                href="https://v3.tailwindcss.com/docs/customizing-colors"
                                target="_blank"
                              >
                                Tailwind
                              </a>{" "}
                              Your brand color should be dark ranging from
                              shades of 600 and above
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="p-8 space-y-6">
                        <div className="grid gap-6 sm:grid-cols-2">
                          {/* Brand Color */}
                          <FormField
                            control={form.control}
                            name="brandColor"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                                  <Palette className="w-4 h-4 text-slate-500" />
                                  <span>Brand Color</span>
                                </FormLabel>
                                <FormControl>
                                  <div className="flex items-center space-x-3">
                                    <Input
                                      type="color"
                                      {...field}
                                      className="w-16 h-12 p-1 border-slate-200 rounded-lg cursor-pointer"
                                    />
                                    <Input
                                      type="text"
                                      {...field}
                                      className="flex-1 h-12 px-4 bg-slate-50/50 border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-red-500 text-xs" />
                              </FormItem>
                            )}
                          />

                          {/* Template Selection */}
                          <FormField
                            control={form.control}
                            name="template"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                                  <Sliders className="w-4 h-4 text-slate-500" />
                                  <span>Invoice Template</span>
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="h-12 px-4 bg-slate-50/50 border-slate-200 focus:border-purple-500 focus:ring-purple-500/20">
                                      <SelectValue placeholder="Select a template" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {templateOptions.map((option) => (
                                      <SelectItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        <div className="flex flex-col">
                                          <span className="font-medium">
                                            {option.label}
                                          </span>
                                          <span className="text-xs text-slate-500">
                                            {option.description}
                                          </span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage className="text-red-500 text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </div>
                  </Card>

                  {/* Payment & Tax Settings Card */}
                  <Card className="border-0 shadow-2xl shadow-slate-900/5 bg-white/80 backdrop-blur-xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-200/30 via-transparent to-pink-200/20 p-[1px] rounded-xl">
                      <div className="rounded-xl bg-white/90 backdrop-blur-sm h-full w-full"></div>
                    </div>

                    <div className="relative">
                      <CardHeader className="bg-gradient-to-r from-slate-50/80 to-purple-50/40 border-b border-slate-200/50">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-md">
                            <Calculator className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-xl font-semibold text-slate-800">
                              Payment & Tax Settings
                            </CardTitle>
                            <CardDescription className="text-slate-600">
                              Configure payment information and tax calculations
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="p-8 space-y-6">
                        {/* Payment Information */}
                        <FormField
                          control={form.control}
                          name="paymentInfo"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                                <CreditCard className="w-4 h-4 text-slate-500" />
                                <span>Payment Information</span>
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Bank details, payment methods, instructions..."
                                  {...field}
                                  className="min-h-[100px] px-4 py-3 bg-slate-50/50 border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200 resize-none"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500 text-xs" />
                            </FormItem>
                          )}
                        />

                        {/* Thank You Message */}
                        <FormField
                          control={form.control}
                          name="thankYouMsg"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                                <Heart className="w-4 h-4 text-slate-500" />
                                <span>Thank You Message</span>
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Thank you for your business! We appreciate your trust in our services."
                                  {...field}
                                  className="min-h-[80px] px-4 py-3 bg-slate-50/50 border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200 resize-none"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500 text-xs" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="contactInfo"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                                <Heart className="w-4 h-4 text-slate-500" />
                                <span>Contact Info</span>
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Contact Info for your business!"
                                  {...field}
                                  className="min-h-[80px] px-4 py-3 bg-slate-50/50 border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200 resize-none"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500 text-xs" />
                            </FormItem>
                          )}
                        />

                        {/* Tax Settings */}
                        <div className="grid gap-6 sm:grid-cols-3">
                          <FormField
                            control={form.control}
                            name="taxRate"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel className="text-sm font-semibold text-slate-700">
                                  Tax Rate (%)
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    placeholder="8.25"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(
                                        parseFloat(e.target.value) || undefined
                                      )
                                    }
                                    className="h-12 px-4 bg-slate-50/50 border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
                                  />
                                </FormControl>
                                <FormMessage className="text-red-500 text-xs" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="salesTax"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel className="text-sm font-semibold text-slate-700">
                                  Sales Tax ($)
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(
                                        parseFloat(e.target.value) || undefined
                                      )
                                    }
                                    className="h-12 px-4 bg-slate-50/50 border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
                                  />
                                </FormControl>
                                <FormMessage className="text-red-500 text-xs" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="otherCharges"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel className="text-sm font-semibold text-slate-700">
                                  Other Charges ($)
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(
                                        parseFloat(e.target.value) || undefined
                                      )
                                    }
                                    className="h-12 px-4 bg-slate-50/50 border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
                                  />
                                </FormControl>
                                <FormMessage className="text-red-500 text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </div>
                  </Card>

                  {/* Save Button */}
                  <div className="pt-6">
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        size="lg"
                        disabled={loading}
                        className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg shadow-purple-500/25 transition-all duration-200 font-semibold"
                      >
                        {loading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            <span>
                              {currentBrand ? "Updating..." : "Creating..."}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Save className="w-4 h-4" />
                            <span>
                              {currentBrand ? "Update Brand" : "Create Brand"}
                            </span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </div>

            {/* Brand Logo Section */}
            <div className="lg:col-span-4 col-span-full">
              <div className="sticky top-6">
                <Card className="border-0 shadow-2xl shadow-slate-900/5 bg-white/80 backdrop-blur-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-200/30 via-transparent to-pink-200/20 p-[1px] rounded-xl">
                    <div className="rounded-xl bg-white/90 backdrop-blur-sm h-full w-full"></div>
                  </div>

                  <div className="relative p-6">
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">
                        Brand Logo
                      </h3>
                      <p className="text-sm text-slate-600">
                        Upload your company logo (Should be white on transparent
                        background)
                      </p>
                    </div>

                    <div className="">
                      <LogoUploader
                        imageUrl={imageUrl}
                        setImageUrl={setImageUrl}
                        endpoint="logoImage"
                      />
                    </div>

                    <div className="mt-4 p-3 bg-slate-50/50 rounded-lg border border-slate-200/50">
                      <div className="flex items-center space-x-2 text-xs text-slate-600">
                        <Store className="w-3 h-3 text-purple-500" />
                        <span>Logo appears on invoices and documents</span>
                      </div>
                    </div>
                    {/* */}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
