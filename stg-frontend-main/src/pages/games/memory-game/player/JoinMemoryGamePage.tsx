import {useState, useEffect, type ReactNode} from 'react';
import {Form, useNavigate, useSearchParams} from 'react-router-dom';
import {Trans, msg} from '@lingui/macro';
import {Button} from 'react-bootstrap';
import {useLingui} from '@lingui/react';
import api from '@/api/ApiClient';
import {type GetMemoryGameWithCodeResponse} from '@/api/ApiTypes';
import {useToasts} from '@/components/toasts';
import {avatarColors} from '@/helpers/avatars';
import CodeInput from '@/components/ui/CodeInput';
import Logo from '@/components/ui/Logo';
import GlobalLanguagePicker from '@/components/ui/GlobalLanguagePicker';
import TextInput from '@/components/ui/TextInput';
import {CenterAligned} from '@/components/ui/CenterAligned';
import {Loader} from '@/components/ui/Loader';

type WrapperProps = {
  readonly children: ReactNode;
};

function Wrapper(props: WrapperProps) {
  const {children} = props;

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

export default function JoinMemoryGamePage() {
  const {_} = useLingui();
  const navigate = useNavigate();
  const toasts = useToasts();
  const [searchParameters, setSearchParameters] = useSearchParams();
  const [memoryGame, setMemoryGame] = useState<GetMemoryGameWithCodeResponse>();
  const [errorType, setErrorType] = useState('');
  const [code, setCode] = useState('');
  const [nickname, setNickname] = useState('');

  const getSprintByCode = async (code: string) => {
    try {
      const memoryGame = await api.getMemoryGameWithCode({code});
      if (memoryGame.isRegistered) {
        navigate(`/games/memory-games/${memoryGame._id}/player`);
      } else {
        setMemoryGame(memoryGame);
        setSearchParameters({code});
      }
    } catch (error) {
      const message = (error as Error).message;
      if (message === 'Game not found') {
        setErrorType('not-found');
      } else {
        toasts.danger({
          header: _(msg`Oops!`),
          body: _(msg`Something went wrong while joining the game`),
        });
      }
    }
  };

  const onCodeChange = (newCode: string) => {
    setErrorType('');
    setCode(newCode);
  };

  const onCodeSubmit = async () => {
    if (code.length === 6) {
      await getSprintByCode(code);
    }
  };

  const onNameSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nickname = formData.get('name') as string;
    setNickname(nickname);
  };

  const onColorSubmit = (color: string) => {
    void handleSave({nickname, color});
  };

  const handleSave = async ({
    nickname,
    color,
  }: {
    nickname: string;
    color: string;
  }) => {
    if (!memoryGame) {
      return;
    }

    try {
      await api.createMemoryGamePlayer(
        {
          id: memoryGame._id,
        },
        {
          nickname: nickname.trim(),
          color,
        },
      );

      navigate(`/games/memory-games/${memoryGame._id}/player`);
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Something went wrong while joining the game',
      });
    }
  };

  useEffect(() => {
    const code = searchParameters.get('code');
    if (!code) {
      return;
    }

    void getSprintByCode(code);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  let screen = 'join';
  if (memoryGame && !nickname) screen = 'name';
  if (memoryGame && nickname) screen = 'color';

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
                <Trans>Sprint with this code was not found</Trans>
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
            <TextInput
              autoFocus
              controlId="name"
              name="name"
              className="w-100"
              style={{maxWidth: 325}}
              maxLength={50}
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
                onClick={() => {
                  onColorSubmit(avatarColor);
                }}
              />
            ))}
          </div>
        </Wrapper>
      );
    }

    default: {
      return (
        <CenterAligned>
          <Loader />
        </CenterAligned>
      );
    }
  }
}
