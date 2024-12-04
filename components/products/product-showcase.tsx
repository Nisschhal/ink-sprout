"use client";
import { VariantsWithImagesTags } from "@/lib/infer-type";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function ProductShowcase({
  varaints,
}: {
  varaints: VariantsWithImagesTags[];
}) {
  const [api, setApi] = useState<CarouselApi>();

  // state is list because api on 'slideInView' event gives the list of index of image
  const [activeThumbnail, setActiveThumbnail] = useState([0]);
  const searchParams = useSearchParams();
  const selectedColor = searchParams.get("type") || varaints[0].productType;

  useEffect(() => {
    if (!api) return;
    api.on("slidesInView", (e) => {
      console.log(e.slidesInView(), "slices");
      setActiveThumbnail(e.slidesInView());
    });
  }, [api]);

  // update the preveiw image based on index
  const updatePreview = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <Carousel setApi={setApi} opts={{ loop: true }}>
      <CarouselContent>
        {varaints.map(
          (variant) =>
            variant.productType === selectedColor &&
            variant.variantImages.map((image, index) => (
              <CarouselItem key={index}>
                {image.url ? (
                  <Image
                    src={image.url}
                    alt={image.name}
                    priority
                    width={1280}
                    height={720}
                  />
                ) : null}
              </CarouselItem>
            ))
        )}
      </CarouselContent>
      {/* List of all images */}
      <div className="flex overflow-clip gap-4 py-2">
        {varaints.map(
          (variant) =>
            variant.productType === selectedColor &&
            variant.variantImages.map((image, index) => (
              <div key={index}>
                {image.url ? (
                  <Image
                    onClick={() => updatePreview(index)}
                    src={image.url}
                    alt={image.name}
                    priority
                    width={72}
                    height={48}
                    className={cn(
                      index === activeThumbnail[0]
                        ? "opacity-100"
                        : "opacity-55",
                      "rounded-md transition-all duration-300 ease-in-out cursor-pointer hover:opacity-75"
                    )}
                  />
                ) : null}
              </div>
            ))
        )}
      </div>
    </Carousel>
  );
}
