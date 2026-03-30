import { UploadButton } from "@/lib/uploadthing";
// import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import React from "react";
type ImageInputProps = {
  imageUrl: string;
  setImageUrl: any;
  endpoint: any;
};
export default function LogoUploader({
  imageUrl,
  setImageUrl,
  endpoint,
}: ImageInputProps) {
  return (
    <div className="flex items-end bg-slate-900 px-4 rounded-lg">
      <div className="">
        <UploadButton
          className="col-span-full"
          endpoint={endpoint}
          onClientUploadComplete={(res) => {
            // Do something with the response
            console.log("Files: ", res);

            setImageUrl(res[0].url);
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`ERROR! ${error.message}`);
          }}
        />
      </div>
      {imageUrl && (
        <div className="">
          <Image
            alt="Logo"
            className="h-24 w-full rounded-md object-contain"
            height="300"
            src={imageUrl}
            width="300"
          />
        </div>
      )}
    </div>
  );
}
