import { toast } from "sonner";

export function openPdf(id: string | null) {
  if (!id) toast.error("Failed to fetch PDF");
  toast.promise(
    async () => {
      return fetch(`/api/download/${id}`)
        .then((response) => {
          if (!response.ok) toast.error("Failed to fetch PDF");
          return response.blob();
        })
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          window.open(url, "_blank"); // Open the PDF in a new tab
        })
        .catch((error) => console.error(error));
    },
    {
      loading: "Loading...",
      error: "Failed to fetch PDF",
    },
  );
}
