import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Maximize2, Play } from "lucide-react";
import { LazyImage } from "./LazyImage";
import { cn } from "@/lib/utils";

interface GalleryItem {
  id: string;
  jenis_media: string;
  media_url: string;
  deskripsi: string | null;
  kegiatan?: {
    nama_kegiatan: string;
  };
}

interface MasonryGalleryProps {
  items: GalleryItem[];
  className?: string;
}

export const MasonryGallery = ({ items, className }: MasonryGalleryProps) => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  return (
    <>
      <div
        className={cn(
          "columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6",
          className
        )}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            className="break-inside-avoid mb-6 animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div
              className="group relative overflow-hidden rounded-lg shadow-soft hover:shadow-elegant transition-smooth cursor-pointer bg-card"
              onClick={() => setSelectedItem(item)}
            >
              {/* Media Content */}
              <div className="relative">
                {item.jenis_media === "foto" ? (
                  <LazyImage
                    src={item.media_url}
                    alt={item.deskripsi || "Dokumentasi"}
                    className="w-full h-auto"
                  />
                ) : (
                  <div className="relative aspect-video bg-black">
                    <video
                      src={item.media_url}
                      className="w-full h-full object-cover"
                      preload="metadata"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Play className="h-16 w-16 text-white opacity-80" />
                    </div>
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    {item.kegiatan && (
                      <Badge variant="secondary" className="mb-2 bg-white/90 text-primary">
                        {item.kegiatan.nama_kegiatan}
                      </Badge>
                    )}
                    {item.deskripsi && (
                      <p className="text-sm text-white/90 line-clamp-2">
                        {item.deskripsi}
                      </p>
                    )}
                  </div>
                  <div className="absolute top-4 right-4">
                    <Maximize2 className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-screen-xl w-[95vw] h-[95vh] p-0 bg-black/95 border-0">
          {selectedItem && (
            <div className="w-full h-full flex flex-col">
              {/* Media Display */}
              <div className="flex-1 flex items-center justify-center p-4">
                {selectedItem.jenis_media === "foto" ? (
                  <img
                    src={selectedItem.media_url}
                    alt={selectedItem.deskripsi || "Dokumentasi"}
                    className="max-w-full max-h-full object-contain animate-scale-in"
                  />
                ) : (
                  <video
                    src={selectedItem.media_url}
                    controls
                    autoPlay
                    className="max-w-full max-h-full object-contain animate-scale-in"
                  />
                )}
              </div>

              {/* Info Bar */}
              {(selectedItem.kegiatan || selectedItem.deskripsi) && (
                <div className="p-6 bg-gradient-to-t from-black to-transparent">
                  {selectedItem.kegiatan && (
                    <Badge variant="secondary" className="mb-2 bg-primary text-primary-foreground">
                      {selectedItem.kegiatan.nama_kegiatan}
                    </Badge>
                  )}
                  {selectedItem.deskripsi && (
                    <p className="text-white/90">{selectedItem.deskripsi}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
