"use client"; // Indicates that this is a client-side component in Next.js

// Import required components, utilities, and libraries
import { UploadDropzone } from "@/app/api/uploadthing/uploadthing"; // Dropzone for handling file uploads
import { Button } from "@/components/ui/button"; // Custom button component
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"; // Components for handling form fields
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Components for table rendering
import { cn } from "@/lib/utils"; // Utility function for conditional classNames
import { zVariantSchema } from "@/types/variant-schema"; // Type definition for form schema
import { Trash } from "lucide-react"; // Trash icon for delete action
import Image from "next/image"; // Next.js optimized Image component
import { useFieldArray, useFormContext } from "react-hook-form"; // React-Hook-Form utilities

// Reorder from framer motion
import { Reorder } from "motion/react";
import { useState } from "react";

// Main component for managing variant images
export default function VariantImages() {
  // Index for reorder images
  const [active, setActive] = useState(0);

  // Get form methods from the context (provided by parent form component)
  const { getValues, control, setError } = useFormContext<zVariantSchema>();

  // Access the "variantImages" field array and its CRUD methods on fields array
  const { fields, remove, append, update, move } = useFieldArray({
    control, // Link the field array to the form control
    name: "variantImages", // Field name in the form schema
  });

  return (
    <div>
      {/* Form field for selecting the variant color */}
      <FormField
        control={control}
        name="variantImages"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Variant Images</FormLabel>
            <FormControl>
              {/* UploadDropzone for uploading and handling files */}
              <UploadDropzone
                className="ut-allowed-content:text-secondary-foreground ut-label:text-primary ut-upload-icon:text-primary/50 hover:bg-primary/10 transition-all duration-500 ease-in-out border-secondary ut-button:bg-primary/75 ut-button:ut-readying:bg-secondary"
                onUploadError={(error) => {
                  // Handle upload errors by setting a validation error on the form
                  setError("variantImages", {
                    type: "validate",
                    message: error.message,
                  });
                  return;
                }}
                onBeforeUploadBegin={(files) => {
                  // Before uploading files, map through them and append to fields
                  files.map((file) => {
                    append({
                      name: file.name, // File name
                      size: file.size, // File size in bytes
                      url: URL.createObjectURL(file), // Create a temporary blob URL for preview
                    });
                  });
                  return files; // Return the files (required by the Dropzone)
                }}
                onClientUploadComplete={(files) => {
                  const images = getValues("variantImages");
                  images.map((field, imgIDX) => {
                    if (field.url.search("blob:") === 0) {
                      const image = files.find(
                        (img) => img.name === field.name
                      );
                      if (image) {
                        update(imgIDX, {
                          url: image.url,
                          name: image.name,
                          size: image.size,
                          key: image.key,
                        });
                      }
                    }
                  });
                  return;
                }}
                endpoint={"variantUploader"} // API endpoint for uploading files
                config={{ mode: "auto" }} // Configurations for the uploader
              />
            </FormControl>
            <FormMessage /> {/* Placeholder for validation error messages */}
          </FormItem>
        )}
      />

      {/* Table for displaying the list of uploaded images */}
      <div className="rounded-md overflow-y-auto">
        <Table>
          <TableCaption>List of variant images</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <Reorder.Group
            as="tbody"
            values={fields}
            onReorder={(e) => {
              const activeElement = fields[active];
              e.map((item, index) => {
                if (item === activeElement) move(active, index);
              });
              return;
            }}
          >
            {/* Loop through the fields to render each row in the table */}
            {fields.map((field, index) => (
              <Reorder.Item
                as="tr"
                value={field}
                onDragStart={() => setActive(index)}
                key={field.id}
                className={cn(
                  field.url.search("blob:") === 0
                    ? "animate-pulse transition-all"
                    : "",
                  "text-sm font-bold text-muted-foreground hover:text-primary"
                )}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{field.name}</TableCell>
                <TableCell>
                  {(field.size / (1024 * 1024)).toFixed(2)} MB
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center">
                    <Image
                      src={field.url}
                      alt={field.name}
                      className="rounded-md"
                      width={72}
                      height={48}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    onClick={() => remove(index)}
                    className="hover:text-primary"
                  >
                    <Trash className="h-4" />
                  </Button>
                </TableCell>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </Table>
      </div>
    </div>
  );
}
