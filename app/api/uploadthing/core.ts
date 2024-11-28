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
      console.log(error);
      console.log("errorrr");
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("uploadedd", file);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
