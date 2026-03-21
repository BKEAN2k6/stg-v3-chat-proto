import {Container} from 'react-bootstrap';

type Properties = {
  readonly children: React.ReactNode;
};

export default function OnboardingFlowLayout(properties: Properties) {
  const {children} = properties;
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
