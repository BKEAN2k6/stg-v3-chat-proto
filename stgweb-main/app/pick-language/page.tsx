import Link from 'next/link';
import {LanguageButton} from './LanguageButton';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';
import {Varis} from '@/components/atomic/atoms/Varis';

type Props = {
  readonly searchParams?: {
    target?: string;
  };
};

const LanguageSelectPage = (props: Props) => {
  const target = props.searchParams?.target ?? '/';
  return (
    <div className="bg-primary-darker-1">
      <div className="min-safe-h-screen pb-16">
        <PageTransitionWrapper>
          <div className="flex h-full flex-col items-center justify-center px-4 text-center text-white">
            <Link href="/">
              <Varis
                color="#fdd662"
                width={64}
                height={64}
                className="mb-12 mt-16 sm:mt-32"
              />
            </Link>
            <h1 className="mb-16 text-xl sm:mb-10">
              Valitse kieli. Välj språk. Choose language.
            </h1>
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-20">
              <LanguageButton
                target={target}
                targetLocale="fi-FI"
                languageName="Suomi"
                chooseText="Valitse"
                flagFile="/images/flags/fi.png"
                flagAlt="Finnish flag"
              />
              <LanguageButton
                target={target}
                targetLocale="sv-SE"
                languageName="Svenska"
                chooseText="Välj"
                flagFile="/images/flags/sv.png"
                flagAlt="Swedish flag"
              />
              <LanguageButton
                target={target}
                targetLocale="en-US"
                languageName="English"
                chooseText="Choose"
                flagFile="/images/flags/gb.png"
                flagAlt="English flag"
              />
            </div>
          </div>
        </PageTransitionWrapper>
      </div>
    </div>
  );
};

export default LanguageSelectPage;
