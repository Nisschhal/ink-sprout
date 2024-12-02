"use client";
import { Input, InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useState } from "react";
import { useFormContext } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

type InputTagsProps = InputProps & {
  value: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
};

export default function InputTags({
  value,
  onChange,
  ...props
}: InputTagsProps) {
  const [pendingDataPoint, setPendingDataPoint] = useState("");
  const [focused, setFocused] = useState(false);

  function addPendingDataPoint() {
    if (pendingDataPoint) {
      const newDataPoint = new Set([...value, pendingDataPoint]);
      onChange(Array.from(newDataPoint));
      setPendingDataPoint("");
    }
  }

  // for setting focus on input fields "tags" when clicked
  const { setFocus } = useFormContext();

  return (
    <div
      className={cn(
        "w-full rounded-lg border border-input bg-background  text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        focused
          ? "ring-offset-2 outline-none ring-ring ring-2"
          : "ring-offset-0 outline-none ring-ring ring-0"
      )}
      // when clicked set focus
      onClick={() => setFocus("tags")}
    >
      <motion.div className="rounded-md min-h-[2.5rem]  p-2 flex gap-2 flex-wrap items-center">
        {/* for new tags insert and remove transition */}
        <AnimatePresence>
          {value.map((tag) => (
            <motion.div
              key={tag}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Badge variant={"secondary"}>
                {tag}

                {/* when X clicked trigger incoming onChange that imitate e.target.value which is an array of filtered string[] in value props */}
                <button
                  className="w-2 ml-2 "
                  onClick={() => onChange(value.filter((i) => i !== tag))}
                >
                  <XIcon className="w-3" />
                </button>
              </Badge>
            </motion.div>
          ))}
        </AnimatePresence>
        <div className="flex">
          <Input
            //   get all the other shadcn default props
            {...props}
            className="focus-visible:border-transparent border-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Add tags"
            onKeyDown={(e) => {
              // when enter pressed trigger function to check and add new tags
              if (e.key === "Enter") {
                e.preventDefault();
                addPendingDataPoint();
              }
              // when backspace pressed && no text in input && has tags in value=[string[]]
              // create a new value array and pop the last one
              // pass the array of new value of array as e.target.value to incoming onChange
              if (
                e.key === "Backspace" &&
                !pendingDataPoint &&
                value.length > 0
              ) {
                e.preventDefault();
                const newValue = [...value];
                newValue.pop();
                onChange(newValue);
              }
            }}
            value={pendingDataPoint}
            onFocus={(e) => setFocused(true)}
            onBlurCapture={(e) => setFocused(false)}
            onChange={(e) => setPendingDataPoint(e.target.value)}
          />
        </div>
      </motion.div>
    </div>
  );
}
