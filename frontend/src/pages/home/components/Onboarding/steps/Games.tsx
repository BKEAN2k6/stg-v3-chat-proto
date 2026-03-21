import {Trans} from '@lingui/react/macro';

export default function Games() {
  return (
    <div data-prevent-scrolling className="p-4 pb-0">
      <div className="row align-items-start">
        <div className="col-12 col-md-6">
          <p>
            <Trans>
              A strength sprint is an exercise that boosts positive interaction
              within your group! It helps everyone notice the good and recognize
              strengths in each other.
            </Trans>
          </p>
          <p>
            <Trans>
              Try the strength sprint with your students and fellow teachers!
              You can find it in the main menu.
            </Trans>
          </p>
        </div>
        <div className="col-12 col-md-6 d-flex justify-content-center">
          <img
            src="/images/onboarding/participant-view.png"
            alt=""
            className="img-fluid mb-3"
            style={{
              width: '65%',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          />
        </div>
      </div>
    </div>
  );
}
