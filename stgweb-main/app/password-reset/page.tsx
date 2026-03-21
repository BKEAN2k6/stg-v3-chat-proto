import {PasswordForm} from './PasswordForm';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

export default async function StartAdminPage() {
  return (
    <div className="min-safe-h-screen w-screen bg-primary">
      <PageTransitionWrapper>
        <div className="min-safe-h-screen flex items-center justify-center px-4">
          <div>
            <div className="text-center">
              <PasswordForm />
            </div>
          </div>
        </div>
      </PageTransitionWrapper>
    </div>
  );
}
