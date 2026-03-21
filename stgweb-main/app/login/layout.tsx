import {Brand} from '@/components/atomic/atoms/Brand';
import {Circle, Square, Triangle} from '@/components/atomic/atoms/Shapes';
import {Varis} from '@/components/atomic/atoms/Varis';

type Props = {
  children: React.ReactNode;
};

export default async function LoginLayout({children}: Props) {
  return (
    <div className="min-safe-h-screen flex items-center justify-center bg-primary-darker-1 px-0 sm:px-4">
      <div className="flex w-full max-w-5xl flex-col sm:max-h-[560px] sm:flex-row sm:overflow-hidden sm:rounded-lg sm:shadow-lg">
        <div className="relative hidden w-full items-center justify-center overflow-hidden bg-primary sm:flex sm:w-1/2">
          <div className="absolute" style={{left: -45, top: -45}}>
            <Circle height={174} width={174} />
          </div>
          <div
            className="absolute"
            style={{right: -97, top: 0, transform: 'rotate(-45deg)'}}
          >
            <Square height={174} width={174} />
          </div>
          <div
            className="absolute"
            style={{left: 26, bottom: -90, transform: 'rotate(-45deg)'}}
          >
            <Triangle height={300} width={300} />
          </div>
          <Varis color="#fdd662" height={64} width={64} />
          <Brand color="white" height={64} width="60%" />
        </div>
        <div className="min-safe-h-screen flex w-full flex-col bg-primary-darker-1 sm:h-auto sm:w-1/2 sm:bg-white">
          {children}
        </div>
      </div>
    </div>
  );
}
