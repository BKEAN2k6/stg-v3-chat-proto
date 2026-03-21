'use client';

import {useState} from 'react';
import toast from 'react-hot-toast';
import {ClickToCopy} from './ClickToCopy';
import {USER_ROLE_ID, USER_SWL_MEDIA_PARENT_FOLDER_ID} from '@/constants.mjs';
import {getRandomSlugColorPair} from '@/lib/avatar-helpers';
import {
  createClientSideDirectusClient,
  refreshAuthIfExpired,
} from '@/lib/directus';
import {
  type LanguageCode,
  type LocaleCode,
  getLanguageDomain,
  mapLocaleCodeToLanguageCode,
} from '@/lib/locale';
import {generateId} from '@/lib/utils';
import {ButtonWithLoader} from '@/components/atomic/atoms/ButtonWithLoader';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/atomic/atoms/Dialog';

type FormState = {
  email: string;
  firstName: string;
  lastName: string;
  role: 'member' | 'admin';
};

const initialFormState: FormState = {
  email: '',
  firstName: '',
  lastName: '',
  role: 'member',
};

type Props = {
  readonly organizationId: string;
  readonly organizationName: string;
  readonly organizationLanguage: LocaleCode;
};

export const AddUserButton = (props: Props) => {
  const {organizationId, organizationName, organizationLanguage} = props;
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [userSignUpLink, setUserSignUpLink] = useState<string | undefined>(
    undefined,
  );
  const languageCode = mapLocaleCodeToLanguageCode[organizationLanguage];

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const {name, value} = event.target;
    setFormState((previous) => ({...previous, [name]: value}));
  };

  const handleFormReset = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setUserSignUpLink(undefined);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    // handle the form submission here
    const directus = createClientSideDirectusClient();
    const newUserId = crypto.randomUUID();
    const newUserEmail = formState.email.trim();
    const newUserFirstName = formState.firstName.trim();
    const newUserLastName = formState.lastName.trim();
    const randomPasswordString = generateId(16);
    const role = formState.role;
    const password = `${randomPasswordString}${Date.now()}`;
    const newAvatarSlugAndColorPair = getRandomSlugColorPair([]);
    try {
      localStorage.removeItem('refreshing_auth');
      await refreshAuthIfExpired();
      await directus.items('user_to_organization').createOne({
        role,
        organization: organizationId,
        user: {
          id: newUserId,
          avatar_slug: newAvatarSlugAndColorPair.slug,
          color: newAvatarSlugAndColorPair.color,
          first_name: newUserFirstName,
          last_name: newUserLastName,
          email: newUserEmail,
          password,
          role: USER_ROLE_ID,
          active_organization: organizationId,
          swl_wall: {
            media_folder: {
              name: `user_${newUserId.slice(0, 8)}_swl_media`, // prettier-ignore
              parent: USER_SWL_MEDIA_PARENT_FOLDER_ID,
            },
          },
        },
      });
      setUserSignUpLink(
        // prettier-ignore
        `${getLanguageDomain(true, languageCode as LanguageCode)}/start/user?e=${encodeURIComponent(newUserEmail)}&p=${password}&r=${role}`,
      );
      setFormState(initialFormState);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      const message = (error as Error).message;
      if (message.includes('email') && message.includes('has to be unique')) {
        toast.error('User with this email already exists');
        return;
      }

      toast.error('Failed to create a new user');
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="rounded bg-blue-500 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700">
        Add user
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{organizationName}</DialogTitle>
          <DialogDescription>Add a new user</DialogDescription>
        </DialogHeader>
        <div>
          <form className="w-full max-w-md space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block">First name</label>
              <input
                required
                className="block w-full rounded border-2 border-gray-100 p-2"
                type="text"
                name="firstName"
                value={formState.firstName}
                disabled={Boolean(userSignUpLink)}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block">Last name</label>
              <input
                required
                className="block w-full rounded border-2 border-gray-100 p-2"
                type="text"
                name="lastName"
                value={formState.lastName}
                disabled={Boolean(userSignUpLink)}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block">Email</label>
              <input
                required
                className="block w-full rounded border-2 border-gray-100 p-2"
                type="email"
                name="email"
                value={formState.email}
                disabled={Boolean(userSignUpLink)}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block">Role</label>
              <select
                required
                className="block w-full rounded border-2 border-gray-100 p-2"
                name="role"
                value={formState.role}
                disabled={Boolean(userSignUpLink)}
                onChange={handleChange}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <ButtonWithLoader
                type="submit"
                className="block w-full rounded bg-blue-500 px-4 py-2 text-white"
                isLoading={isLoading}
                isDisabled={isLoading || Boolean(userSignUpLink)}
              >
                Submit
              </ButtonWithLoader>
            </div>
          </form>
          {userSignUpLink && (
            <>
              <div className="mt-8 text-center">
                <p className="text-green-900">
                  New user created successfully! The new user needs to sign up
                  using this link:
                </p>
                <p className="mt-2 text-sm text-gray-700">{userSignUpLink}</p>
                <p className="mt-2 text-xs text-gray-400">
                  <ClickToCopy
                    content="(click here to to copy the link)"
                    textToCopy={userSignUpLink}
                  />
                </p>
              </div>
              <div className="mt-12 text-center">
                <a
                  href="#"
                  className="text-xs underline"
                  onClick={handleFormReset}
                >
                  Create another user
                </a>
                <br />
                <span className="text-xs">
                  make sure you have the link above copied and saved first!
                </span>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
