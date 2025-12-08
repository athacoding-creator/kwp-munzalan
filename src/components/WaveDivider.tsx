interface WaveDividerProps {
  flip?: boolean;
  className?: string;
  variant?: 'primary' | 'white' | 'muted';
}
export const WaveDivider = ({
  flip = false,
  className = "",
  variant = 'primary'
}: WaveDividerProps) => {
  const colors = {
    primary: 'hsl(var(--primary))',
    white: 'hsl(var(--background))',
    muted: 'hsl(var(--muted))'
  };
  const fillColor = colors[variant];
  return <div className={`w-full overflow-hidden leading-[0] ${flip ? 'rotate-180' : ''} ${className}`}>
      
    </div>;
};
export const WaveDividerSimple = ({
  flip = false,
  className = "",
  variant = 'primary'
}: WaveDividerProps) => {
  const colors = {
    primary: 'hsl(var(--primary))',
    white: 'hsl(var(--background))',
    muted: 'hsl(var(--muted))'
  };
  const fillColor = colors[variant];
  return <div className={`w-full overflow-hidden leading-[0] ${flip ? 'rotate-180' : ''} ${className}`}>
      <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-12 md:h-16 lg:h-20">
        <path d="M0,50 C360,100 1080,0 1440,50 L1440,100 L0,100 Z" fill={fillColor} />
      </svg>
    </div>;
};