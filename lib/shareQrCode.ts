import { toast } from "~/components/ui/toast";

export const shareQrCode = async (qrImgRef:any) => {
    if (!qrImgRef) return;
    const imageUrl = qrImgRef.src;
  
    if (navigator.share) {
      try {
        await navigator.share({
          title: "QR Code",
          text: "Scan this QR code for payment.",
          url: imageUrl,
        });
      } catch (err) {
        toast({
        title: "Sharing was cancelled or failed.",
        variant: "destructive",
      });
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(imageUrl);
        alert("QR code link copied to clipboard!");
      } catch (err) {
        toast({
        title: "Failed to copy QR code link.",
        variant: "destructive",
      })
      }
    } else {
      prompt("Copy this QR code link:", imageUrl);
    }
  };