'use client';

import React, {useState} from 'react';
import toast from 'react-hot-toast';
import {ORG_SWL_MEDIA_PARENT_FOLDER_ID} from '@/constants.mjs';
import {
  createClientSideDirectusClient,
  getAvailableJoinShortCode,
  refreshAuthIfExpired,
} from '@/lib/directus';
import {type LocaleCode} from '@/lib/locale';
import slugify from '@/lib/slugify';
import {ButtonWithLoader} from '@/components/atomic/atoms/ButtonWithLoader';

type OrgType = '' | 'school' | 'kindergarten' | 'other';

type FormState = {
  orgName: string;
  orgType: OrgType;
  defaultLanguage: LocaleCode | '';
};

const initialFormState: FormState = {
  orgName: '',
  orgType: '',
  defaultLanguage: '',
};

export const NewOrgForm = () => {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const {name, value} = event.target;
    setFormState((previous) => ({...previous, [name]: value}));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    // handle the form submission here
    const directus = createClientSideDirectusClient();
    const newOrgId = crypto.randomUUID();
    const name = formState.orgName.trim();
    const type = formState.orgType;
    const defaultLanguage = formState.defaultLanguage;
    try {
      localStorage.removeItem('refreshing_auth');
      await refreshAuthIfExpired();
      const joinShortCode = await getAvailableJoinShortCode(directus);
      await directus.items('organization').createOne({
        id: newOrgId,
        slug: slugify(name),
        type,
        default_language: defaultLanguage,
        translation: {
          create: [
            {name, language_code: {code: 'en-US'}},
            {name, language_code: {code: 'fi-FI'}},
            {name, language_code: {code: 'sv-SE'}},
          ],
        },
        join_short_code: joinShortCode,
        created_from_admin_tools: true,
        swl_wall: {
          media_folder: {
            name: `org_${newOrgId.slice(0, 8)}_swl_media`,
            parent: ORG_SWL_MEDIA_PARENT_FOLDER_ID,
          },
        },
      });
      setIsSubmitted(true);
      setFormState(initialFormState);
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
      }, 100);
    } catch {
      toast.error('Failed to create a new organization');
    }

    setIsLoading(false);
    console.log(formState);
  };

  return (
    <>
      <div className="mb-12 text-center">
        <a href="/admin/organizations" className="hover:underline">
          Back to organization list
        </a>
      </div>
      <form className="w-full max-w-md space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block">Organization Name</label>
          <input
            required
            className="block w-full rounded border-2 border-gray-100 p-2"
            type="text"
            name="orgName"
            value={formState.orgName}
            disabled={Boolean(isSubmitted)}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block">Organization type</label>
          <select
            required
            className="block w-full rounded border-2 border-gray-100 p-2"
            name="orgType"
            value={formState.orgType}
            disabled={Boolean(isSubmitted)}
            onChange={handleChange as any}
          >
            <option value="">- select -</option>
            <option value="school">School</option>
            <option value="kindergarten">Kindergarten</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block">Default language</label>
          <select
            required
            className="block w-full rounded border-2 border-gray-100 p-2"
            name="defaultLanguage"
            value={formState.defaultLanguage}
            disabled={Boolean(isSubmitted)}
            onChange={handleChange as any}
          >
            <option value="">- select -</option>
            <option value="sv-SE">Swedish</option>
            <option value="fi-FI">Finnish</option>
            <option value="en-US">English</option>
          </select>
        </div>

        <div>
          <ButtonWithLoader
            type="submit"
            className="block w-full rounded bg-blue-500 px-4 py-2 text-white"
            isLoading={isLoading}
            isDisabled={isLoading || Boolean(isSubmitted)}
          >
            Submit
          </ButtonWithLoader>
        </div>
      </form>
      {isSubmitted && (
        <div className="mt-8 text-center">
          <p className="text-green-900">
            New organization created successfully!
          </p>
          <div className="mt-2">
            <a href="/admin/organizations" className="hover:underline">
              Back to organization list
            </a>
          </div>
        </div>
      )}
    </>
  );
};
