import { Toaster as Sonner } from "sonner";

export const Toaster = (props: React.ComponentProps<typeof Sonner>) => (
  <Sonner
    theme="dark"
    position="bottom-center"
    toastOptions={{
      classNames: {
        toast:
          "group toast glass border border-border text-foreground shadow-2xl shadow-black/40 rounded-2xl",
        description: "text-muted-foreground",
        actionButton: "bg-primary text-primary-foreground rounded-full",
        cancelButton: "bg-muted text-muted-foreground rounded-full",
      },
    }}
    {...props}
  />
);
