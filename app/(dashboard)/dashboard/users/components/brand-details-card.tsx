import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Palette, Phone, Mail, MapPin, Quote } from "lucide-react";
import { UserDetailsResponse } from "@/types/user";

interface BrandDetailsCardProps {
  brand: UserDetailsResponse["brand"];
}

export function BrandDetailsCard({ brand }: BrandDetailsCardProps) {
  if (!brand) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Brand Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No brand information available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Brand Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{brand.name}</h3>
              {brand.slogan && (
                <p className="text-muted-foreground italic">{brand.slogan}</p>
              )}
            </div>

            {brand.logo && (
              <div>
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className="h-16 w-auto object-contain rounded border"
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Brand Color:</span>
              <div
                className="w-6 h-6 rounded border border-gray-300"
                style={{ backgroundColor: brand.brandColor || "#000000" }}
              />
              <span className="text-sm font-mono">{brand.brandColor}</span>
            </div>

            <div>
              <Badge variant="outline">{brand.template} Template</Badge>
            </div>
          </div>

          <div className="space-y-4">
            {brand.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{brand.email}</span>
              </div>
            )}

            {brand.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{brand.phone}</span>
              </div>
            )}

            {brand.address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{brand.address}</span>
              </div>
            )}

            {brand.currency && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Currency:</span>
                <Badge variant="secondary">{brand.currency}</Badge>
              </div>
            )}

            {brand.thankYouMsg && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Quote className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    Thank You Message:
                  </span>
                </div>
                <p className="text-sm text-muted-foreground bg-gray-50 p-2 rounded">
                  {brand.thankYouMsg}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
