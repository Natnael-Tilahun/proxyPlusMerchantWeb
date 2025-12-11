import { toast } from "~/components/ui/toast";

export const downloadQrCode = async (qrImgRef:any) => {
    if (!qrImgRef) return;
    const imageUrl = qrImgRef.src;
    try {
      const response = await fetch(imageUrl, { mode: "cors" });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "qr-code.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({
        title: "QR code downloaded successfully.",
      });
    } catch (e) {
      toast({
        title: "Failed to download QR code.",
        description: "Failed to download QR code. Try opening the image in a new tab and saving manually.",
        variant: "destructive",
      });
    }
  };