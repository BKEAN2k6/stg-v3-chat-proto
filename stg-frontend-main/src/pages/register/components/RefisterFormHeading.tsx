type Props = {
  readonly title: string;
};

export default function RegisterFormHeading(props: Props) {
  const {title} = props;

  return <h1 className="display-6 my-5 text-center">{title}</h1>;
}
