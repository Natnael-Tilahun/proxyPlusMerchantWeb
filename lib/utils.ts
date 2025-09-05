import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { camelize, getCurrentInstance, toHandlerKey } from "vue";
import type { Updater } from "@tanstack/vue-table";
import { type Ref } from "vue";
import { toast } from "~/components/ui/toast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function valueUpdater<T extends Updater<any>>(
  updaterOrValue: T,
  ref: Ref
) {
  ref.value =
    typeof updaterOrValue === "function"
      ? updaterOrValue(ref.value)
      : updaterOrValue;
}

export const copyToClipboard = async (data: any) => {
  try {
    // Convert object to formatted JSON string if it's an object
    const textToCopy =
      typeof data === "object" ? JSON.stringify(data, null, 2) : String(data);

    await navigator.clipboard.writeText(textToCopy);

    toast({
      title: "Copied to clipboard",
      description: "Content has been copied to your clipboard",
    });

    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);

    toast({
      title: "Copy failed",
      description: "Failed to copy content to clipboard",
      variant: "destructive",
    });

    return false;
  }
};

export function splitPath(path: any) {
  return path.split("/").filter(Boolean);
}

export  const getIdFromPath = (passedPath?: string) => {
  const route = useRoute();
  const pathSegments = passedPath ? passedPath.split("/").filter(Boolean) : route.path.split("/").filter(Boolean);
    return pathSegments[pathSegments.length - 1];
  }

  export const dateFormatter = (date: string) => {
    return new Date(date).toISOString().split("T")[0];
  };