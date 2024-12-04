import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  avatarUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .onUploadError(async ({ error }) => {
      console.log("Error in avatarUPloading", error);
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Avatar Image Upload", file);
    }),

  // variant Image uploader
  variantUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 3,
    },
  })
    .onUploadError(async ({ error }) => {
      console.log("Error in variantUploader", error);
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("VariantImage Uploaded", file);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
