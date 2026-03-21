import {useCallback, useMemo, useState} from 'react';
import {Alert, Stack, Tab, Tabs} from 'react-bootstrap';
import {useSearchParams} from 'react-router-dom';
import {useQueryClient} from '@tanstack/react-query';
import type {
  BillingContact,
  CreateBillingContactRequest,
  UpdateBillingContactRequest,
} from '@client/ApiTypes';
import {normalizeOptionalText} from './components/billingUtils.js';
import {BillingContactsTab} from './components/BillingContactsTab.js';
import {BillingGroupsTab} from './components/BillingGroupsTab.js';
import {CommunitiesTab} from './components/CommunitiesTab.js';
import {ExpiringSubscriptionsTab} from './components/ExpiringSubscriptionsTab.js';
import {
  BillingContactModal,
  emptyContactForm,
  type BillingContactFormState,
} from './components/BillingContactModal.js';
import PageTitle from '@/components/ui/PageTitle.js';
import CenteredLoader from '@/components/CenteredLoader.js';
import {useToasts} from '@/components/toasts/index.js';
import {useCurrentUser} from '@/context/currentUserContext.js';
import {confirm} from '@/components/ui/confirm.js';
import {
  useCreateBillingContactMutation,
  useGetBillingContactsQuery,
  useGetBillingGroupsQuery,
  useRemoveBillingContactMutation,
  useUpdateBillingContactMutation,
} from '@/hooks/useApi.js';

const sortByName = <T extends {name: string}>(items: T[]) =>
  [...items].sort((a, b) => a.name.localeCompare(b.name));

export default function BillingPage() {
  const toasts = useToasts();
  const {isSuperAdmin} = useCurrentUser();
  const [searchParameters, setSearchParameters] = useSearchParams();
  const queryClient = useQueryClient();

  const {data: contacts = [], isLoading: loadingContacts} =
    useGetBillingContactsQuery({limit: '10000'}, {enabled: isSuperAdmin});
  const {data: groups = [], isLoading: loadingGroups} =
    useGetBillingGroupsQuery({limit: '10000'}, {enabled: isSuperAdmin});
  const {data: recentContacts = [], isFetching: isRecentContactsLoading} =
    useGetBillingContactsQuery(
      {sort: 'recent', limit: '20'},
      {enabled: isSuperAdmin},
    );
  const {data: recentGroups = [], isFetching: isRecentGroupsLoading} =
    useGetBillingGroupsQuery(
      {sort: 'recent', limit: '20'},
      {enabled: isSuperAdmin},
    );
  const sortedContacts = useMemo(() => sortByName(contacts), [contacts]);
  const sortedGroups = useMemo(() => sortByName(groups), [groups]);

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactForm, setContactForm] =
    useState<BillingContactFormState>(emptyContactForm);
  const [savingContact, setSavingContact] = useState(false);
  const [deletingContactId, setDeletingContactId] = useState<string>();
  const [onContactCreated, setOnContactCreated] = useState<
    ((contact: BillingContact) => void) | undefined
  >(undefined);
  const createBillingContact = useCreateBillingContactMutation();
  const updateBillingContact = useUpdateBillingContactMutation();
  const removeBillingContact = useRemoveBillingContactMutation();

  const selectedTabParameter = searchParameters.get('tab');
  const validTabs = new Set(['communities', 'expiring', 'groups', 'contacts']);
  const selectedTab =
    selectedTabParameter !== null && validTabs.has(selectedTabParameter)
      ? selectedTabParameter
      : 'expiring';
  const selectedCommunityId = searchParameters.get('communityId') ?? undefined;
  const selectedGroupId = searchParameters.get('groupId') ?? undefined;
  const selectedContactId = searchParameters.get('contactId') ?? undefined;

  const updateSearchParameter = (key: string, value: string | undefined) => {
    setSearchParameters(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (value) {
          next.set(key, value);
        } else {
          next.delete(key);
        }

        return next;
      },
      {replace: true},
    );
  };

  const reloadGroups = useCallback(async () => {
    await queryClient.invalidateQueries({queryKey: ['billingGroup', 'list']});
  }, [queryClient]);

  const initialLoading =
    loadingContacts &&
    loadingGroups &&
    contacts.length === 0 &&
    groups.length === 0;

  const contactHasGroups = (contactId: string) =>
    groups.some((group) => group.billingContact.id === contactId);

  if (!isSuperAdmin) {
    return (
      <div className="mt-4">
        <PageTitle title="Billing" />
        <Alert variant="warning">
          You need super admin rights to access the billing tools.
        </Alert>
      </div>
    );
  }

  if (initialLoading) {
    return <CenteredLoader />;
  }

  const handleContactSubmit = async (
    event: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (!contactForm.name || !contactForm.email) {
      toasts.danger({
        header: 'Missing information',
        body: 'Please provide a name and email for the billing contact.',
      });
      return;
    }

    setSavingContact(true);
    try {
      if (contactForm.id) {
        const payload: UpdateBillingContactRequest = {
          name: contactForm.name,
          email: contactForm.email,
          crmLink: normalizeOptionalText(contactForm.crmLink),
          notes: normalizeOptionalText(contactForm.notes),
        };
        const updated = await updateBillingContact.mutateAsync({
          pathParameters: {id: contactForm.id},
          payload,
        });
        toasts.success({
          header: 'Contact updated',
          body: `${updated.name} has been updated.`,
        });
      } else {
        const payload: CreateBillingContactRequest = {
          name: contactForm.name,
          email: contactForm.email,
          crmLink: normalizeOptionalText(contactForm.crmLink),
          notes: normalizeOptionalText(contactForm.notes),
        };
        const created = await createBillingContact.mutateAsync({payload});
        toasts.success({
          header: 'Contact created',
          body: `${created.name} has been added.`,
        });
        onContactCreated?.(created);
      }

      setIsContactModalOpen(false);
      setContactForm(emptyContactForm);
      setOnContactCreated(undefined);
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Saving the billing contact failed.',
      });
    } finally {
      setSavingContact(false);
    }
  };

  const handleRemoveContact = async (contact: BillingContact) => {
    if (contactHasGroups(contact.id)) {
      toasts.danger({
        header: 'Cannot remove contact',
        body: 'Remove or reassign its billing groups before deleting.',
      });
      return;
    }

    const confirmed = await confirm({
      title: 'Remove billing contact?',
      text: `This will permanently delete ${contact.name}. Continue?`,
      cancel: 'Cancel',
      confirm: 'Remove',
      confirmVariant: 'danger',
    });
    if (!confirmed) return;

    setDeletingContactId(contact.id);
    try {
      await removeBillingContact.mutateAsync({
        pathParameters: {id: contact.id},
      });
      toasts.success({
        header: 'Contact removed',
        body: `${contact.name} was removed.`,
      });
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Failed to remove billing contact.',
      });
    } finally {
      setDeletingContactId(undefined);
    }
  };

  return (
    <Stack gap={3}>
      <PageTitle title="Billing" />
      <Tabs
        mountOnEnter
        activeKey={selectedTab}
        id="billing-tabs"
        onSelect={(key) => {
          updateSearchParameter('tab', key ?? undefined);
        }}
      >
        <Tab eventKey="expiring" title="Expiring">
          <ExpiringSubscriptionsTab />
        </Tab>
        <Tab eventKey="communities" title="Communities">
          <CommunitiesTab
            selectedCommunityId={selectedCommunityId}
            onSelectCommunity={(id) => {
              updateSearchParameter('communityId', id);
            }}
          />
        </Tab>
        <Tab eventKey="groups" title="Billing groups">
          <BillingGroupsTab
            contacts={sortedContacts}
            isContactModalOpen={isContactModalOpen}
            selectedGroupId={selectedGroupId}
            recentGroups={recentGroups}
            isRecentGroupsLoading={isRecentGroupsLoading}
            onReloadGroups={reloadGroups}
            onAddContact={(onCreated) => {
              setContactForm(emptyContactForm);
              setOnContactCreated(() => onCreated);
              setIsContactModalOpen(true);
            }}
            onSelectGroup={(id) => {
              updateSearchParameter('groupId', id);
            }}
          />
        </Tab>
        <Tab eventKey="contacts" title="Contacts">
          <BillingContactsTab
            contacts={sortedContacts}
            groups={sortedGroups}
            recentContacts={recentContacts}
            isRecentContactsLoading={isRecentContactsLoading}
            deletingContactId={deletingContactId}
            canRemove={(contactId) => !contactHasGroups(contactId)}
            selectedContactId={selectedContactId}
            isContactModalOpen={isContactModalOpen}
            onAdd={() => {
              setContactForm(emptyContactForm);
              setIsContactModalOpen(true);
            }}
            onEdit={(contact) => {
              setContactForm(contact);
              setIsContactModalOpen(true);
            }}
            onRemove={(contact) => {
              void handleRemoveContact(contact);
            }}
            onSelectContact={(id) => {
              updateSearchParameter('contactId', id);
            }}
            onReloadGroups={reloadGroups}
            onAddGroupContact={(onCreated) => {
              setContactForm(emptyContactForm);
              setOnContactCreated(() => onCreated);
              setIsContactModalOpen(true);
            }}
          />
        </Tab>
      </Tabs>

      <BillingContactModal
        isOpen={isContactModalOpen}
        isSaving={savingContact}
        contactForm={contactForm}
        setContactForm={setContactForm}
        onHide={() => {
          setIsContactModalOpen(false);
          setContactForm(emptyContactForm);
          setOnContactCreated(undefined);
        }}
        onSubmit={handleContactSubmit}
      />
    </Stack>
  );
}
