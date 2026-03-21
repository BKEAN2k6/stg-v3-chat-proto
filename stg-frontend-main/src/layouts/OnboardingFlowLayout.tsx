import {Container} from 'react-bootstrap';

type Props = {
  readonly children: React.ReactNode;
};

export default function OnboardingFlowLayout(props: Props) {
  const {children} = props;
  return (
    <div className="w-100" style={{minHeight: '100vh'}}>
      <Container
        className="d-flex flex-column justify-content-center"
        style={{minHeight: '100vh'}}
      >
        <div className="d-flex flex-column align-items-center">{children}</div>
      </Container>
    </div>
  );
}
