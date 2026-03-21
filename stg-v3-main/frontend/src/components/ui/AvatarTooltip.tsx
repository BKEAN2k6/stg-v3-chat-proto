type Properties = {
  readonly name?: string;
  readonly path?: string;
  readonly color?: string;
};

export function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

export default function AvatarTooltip(properties: Properties) {
  const {name, path, color} = properties;
  const size = 80;

  return (
    <div className="p-3 d-flex flex-row align-items-center gap-3">
      <div>
        {path ? (
          <img
            src={path}
            alt="foo"
            className="rounded-circle"
            style={{
              width: size,
              height: size,
              objectFit: 'cover',
            }}
          />
        ) : null}
        {!path && (
          <div
            className="rounded-circle align-items-center"
            style={{
              width: size,
              height: size,
              textAlign: 'center',
              backgroundColor: color,
              color: 'white',
              fontSize: 26,
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <span style={{marginTop: 4}}>{getInitials(name ?? '')}</span>
          </div>
        )}
      </div>
      <div>
        <span className="fw-semibold">{name}</span>
      </div>
    </div>
  );
}
