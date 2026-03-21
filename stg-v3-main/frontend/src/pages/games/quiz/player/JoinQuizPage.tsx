import {msg} from '@lingui/core/macro';
import {Trans} from '@lingui/react/macro';
import {useState, useEffect, type ReactNode, useCallback} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {Form, Button} from 'react-bootstrap';
import {useLingui} from '@lingui/react';
import api from '@client/ApiClient';
import {type GetQuizWithCodeResponse} from '@client/ApiTypes';
import {useToasts} from '@/components/toasts/index.js';
import {avatarColors, avatarSlugs} from '@/helpers/avatars.js';
import CodeInput from '@/components/ui/CodeInput.js';
import Logo from '@/components/ui/Logo.js';
import GlobalLanguagePicker from '@/components/ui/GlobalLanguagePicker.js';
import {SimpleLottiePlayer} from '@/components/ui/SimpleLottiePlayer.js';

type WrapperProperties = {
  readonly children: ReactNode;
};

function Wrapper(properties: WrapperProperties) {
  const {children} = properties;

  return (
    <div className="w-100 h-100">
      <div
        className="d-flex flex-column w-100 h-100 mx-auto"
        style={{maxWidth: 1200}}
      >
        <div className="d-flex flex-column justify-content-between h-100 px-3">
          <div className="mx-auto mt-5">
            <Logo className="mb-5" color="#fdd662" height={64} width={64} />
          </div>
          <div>{children}</div>
          <div className="mx-auto py-5">
            <GlobalLanguagePicker />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JoinQuizPage() {
  const {_} = useLingui();
  const navigate = useNavigate();
  const toasts = useToasts();
  const [searchParameters] = useSearchParams();
  const [quiz, setQuiz] = useState<GetQuizWithCodeResponse>();
  const [errorType, setErrorType] = useState('');
  const [code, setCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [color, setColor] = useState(''); // keep chosen color for next step
  const [avatar, setAvatar] = useState(''); // new: chosen avatar slug
  const [screen, setScreen] = useState<'join' | 'name' | 'color' | 'avatar'>(
    'join',
  );

  const getGameWithCode = useCallback(
    async (code: string) => {
      try {
        const quiz = await api.getQuizWithCode({code});
        if (quiz.isRegistered) {
          navigate(`/games/quizzes/${quiz.id}/player`);
        } else {
          setQuiz(quiz);
          setScreen('name');
        }
      } catch (error) {
        const {message} = error as Error;
        if (message === 'Quiz not found') {
          setErrorType('not-found');
        } else {
          toasts.danger({
            header: _(msg`Oops!`),
            body: _(msg`Something went wrong while joining the game`),
          });
        }
      }
    },
    [navigate, toasts, _],
  );

  const onCodeChange = (newCode: string) => {
    setErrorType('');
    setCode(newCode);
  };

  const onCodeSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (code.length === 6) {
      await getGameWithCode(code);
    }
  };

  const onNameSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedNickname = nickname.trim();
    setNickname(trimmedNickname);
    if (!trimmedNickname) {
      return;
    }

    setScreen('color');
  };

  const onColorSubmit = (pickedColor: string) => {
    setColor(pickedColor);
    setScreen('avatar');
  };

  const onAvatarSubmit = (pickedAvatar: string) => {
    setAvatar(pickedAvatar);
    void handleSave({nickname, color, avatar: pickedAvatar});
  };

  const handleSave = async ({
    nickname,
    color,
    avatar,
  }: {
    nickname: string;
    color: string;
    avatar: string;
  }) => {
    if (!quiz) {
      return;
    }

    try {
      const payload: {nickname: string; color: string; avatar: string} = {
        nickname,
        color,
        avatar,
      };

      await api.createQuizPlayer({id: quiz.id}, payload);

      navigate(`/games/quizzes/${quiz.id}/player`);
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Something went wrong while joining the game',
      });
    }
  };

  useEffect(() => {
    const code = searchParameters.get('code');
    if (code) {
      setCode(code);
      void getGameWithCode(code);
    }
  }, [getGameWithCode, searchParameters]);

  switch (screen) {
    case 'join': {
      return (
        <Wrapper>
          <h3 className="text-center">
            <Trans>Enter code to join</Trans>
          </h3>
          <Form
            className="mt-4 d-flex flex-column align-items-center gap-4"
            onSubmit={onCodeSubmit}
          >
            <CodeInput controlId="shortCode" onChange={onCodeChange} />
            {errorType === 'not-found' && (
              <span className="text-danger">
                <Trans>Quiz with this code was not found</Trans>
              </span>
            )}
            <Button
              variant="primary"
              type="submit"
              style={{maxWidth: 325}}
              className="w-100"
              disabled={code.length !== 6 || errorType !== ''}
            >
              <Trans>Continue</Trans>
            </Button>
          </Form>
        </Wrapper>
      );
    }

    case 'name': {
      return (
        <Wrapper>
          <h3 className="text-center">
            <Trans>Add your name</Trans>
          </h3>
          <Form
            className="mt-4 d-flex flex-column align-items-center gap-4"
            onSubmit={onNameSubmit}
          >
            <Form.Control
              autoFocus
              required
              name="name"
              className="w-100"
              style={{maxWidth: 325}}
              maxLength={50}
              value={nickname}
              onBlur={() => {
                setNickname(nickname.trim());
              }}
              onChange={(event) => {
                setNickname(event.target.value);
              }}
            />
            <Button
              variant="primary"
              type="submit"
              style={{maxWidth: 325}}
              className="w-100"
            >
              <Trans>Continue</Trans>
            </Button>
          </Form>
        </Wrapper>
      );
    }

    case 'color': {
      return (
        <Wrapper>
          <h3 className="text-center">
            <Trans>Choose color</Trans>
          </h3>
          <div
            className="mt-4 d-flex flex-wrap justify-content-center mx-auto"
            style={{maxWidth: 325}}
          >
            {avatarColors.slice(0, 25).map((avatarColor) => (
              <Button
                key={avatarColor}
                className="rounded-circle"
                style={{
                  width: '4rem',
                  height: '4rem',
                  backgroundColor: avatarColor,
                  margin: '0.5rem',
                  border: 'none',
                }}
                aria-label={_(msg`Choose color ${avatarColor}`)}
                onClick={() => {
                  onColorSubmit(avatarColor);
                }}
              />
            ))}
          </div>
        </Wrapper>
      );
    }

    case 'avatar': {
      return (
        <Wrapper>
          <h3 className="text-center">
            <Trans>Choose avatar</Trans>
          </h3>
          <div
            className="mt-4 d-flex flex-wrap justify-content-center gap-3 mx-auto"
            style={{maxWidth: 325}}
          >
            {avatarSlugs.map((slug) => {
              const isSelected = avatar === slug;
              return (
                <Button
                  key={slug}
                  variant={isSelected ? 'primary' : 'light'}
                  className="d-flex align-items-center justify-content-center p-0 m-0"
                  style={{
                    width: '4rem',
                    height: '4rem',
                    borderRadius: '50%',
                    backgroundColor: color,
                  }}
                  aria-label={_(msg`Choose avatar ${slug}`)}
                  onClick={() => {
                    onAvatarSubmit(slug);
                  }}
                >
                  <SimpleLottiePlayer
                    src={`/animations/avatars/${slug}.json`}
                    style={{width: '5rem', height: '5rem'}}
                  />
                </Button>
              );
            })}
          </div>
        </Wrapper>
      );
    }
  }
}
