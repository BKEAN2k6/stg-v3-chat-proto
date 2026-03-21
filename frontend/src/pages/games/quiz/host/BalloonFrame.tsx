type Properties = {
  readonly children?: React.ReactNode;
};

export default function BalloonFrame({children}: Properties) {
  return (
    <div
      className="w-100 p-5 position-absolute top-0 start-0 h-100"
      style={{
        position: 'relative',
        backgroundColor: 'var(--primary-darker-1)',
        backgroundImage: 'url(/images/backgrounds/balloons.png)',
      }}
    >
      {children}
    </div>
  );
}
