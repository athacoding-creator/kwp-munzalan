import { cn } from "@/lib/utils";

interface CircleImageProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  borderColor?: 'primary' | 'accent' | 'white';
}

const sizeClasses = {
  sm: 'w-20 h-20',
  md: 'w-32 h-32',
  lg: 'w-40 h-40 md:w-48 md:h-48',
  xl: 'w-48 h-48 md:w-64 md:h-64',
};

const borderClasses = {
  primary: 'border-primary/30',
  accent: 'border-accent/30',
  white: 'border-white/50',
};

export const CircleImage = ({ 
  src, 
  alt, 
  size = 'md', 
  className = '',
  borderColor = 'primary'
}: CircleImageProps) => {
  return (
    <div 
      className={cn(
        "rounded-full overflow-hidden border-4 shadow-elegant",
        sizeClasses[size],
        borderClasses[borderColor],
        className
      )}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

interface CircleImageGroupProps {
  images: { src: string; alt: string }[];
  className?: string;
}

export const CircleImageGroup = ({ images, className = '' }: CircleImageGroupProps) => {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      {images.map((image, index) => (
        <div
          key={index}
          className={cn(
            "rounded-full overflow-hidden border-4 border-background shadow-elegant",
            index === 1 ? "w-32 h-32 md:w-40 md:h-40 z-20 -mx-4" : "w-24 h-24 md:w-32 md:h-32 z-10"
          )}
          style={{ 
            transform: index === 0 ? 'translateX(10%)' : index === 2 ? 'translateX(-10%)' : 'none'
          }}
        >
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};
