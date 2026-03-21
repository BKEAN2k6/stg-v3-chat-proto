type Properties = {
  readonly title: string;
};

export default function RegisterFormHeading(properties: Properties) {
  const {title} = properties;

  return (
    <h1
      style={{fontSize: '2rem', fontWeight: 300}}
      className="mb-4 text-center"
    >
      {title}
    </h1>
  );
}
