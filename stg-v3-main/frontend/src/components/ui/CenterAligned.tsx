export function CenterAligned({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div
      className="d-flex align-items-center justify-content-center text-center"
      style={{height: '100vh'}}
    >
      {children}
    </div>
  );
}
