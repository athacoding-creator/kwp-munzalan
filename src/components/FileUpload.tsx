import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";

interface FileUploadProps {
  label: string;
  currentUrl?: string;
  onUploadComplete: (url: string) => void;
  accept?: string;
  bucketName?: string;
}

export function FileUpload({
  label,
  currentUrl,
  onUploadComplete,
  accept = "image/*",
  bucketName = "media",
}: FileUploadProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      setPreviewUrl(publicUrl);
      onUploadComplete(publicUrl);
      
      toast({ title: "File berhasil diupload!" });
    } catch (error: any) {
      toast({ 
        title: "Error upload", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setPreviewUrl(null);
    onUploadComplete("");
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2 items-start">
        <div className="flex-1">
          <Input
            type="file"
            accept={accept}
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </div>
        {previewUrl && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {uploading && (
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Upload className="h-4 w-4 animate-pulse" />
          Mengupload...
        </p>
      )}
      {previewUrl && (
        <div className="mt-2">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-32 h-32 object-cover rounded border border-border"
          />
        </div>
      )}
    </div>
  );
}
