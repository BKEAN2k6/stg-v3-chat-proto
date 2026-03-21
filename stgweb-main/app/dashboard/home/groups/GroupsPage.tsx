'use client';

import {useState} from 'react';
import {CreateGroupDialogAndTrigger} from './CreateGroupDialogAndTrigger';
import {GroupPicker} from './GroupPicker';

export const GroupsPage = () => {
  const [groupPickerKey, setGroupPickerKey] = useState('initial');

  const handleRerenderGroupPicker = () => {
    setGroupPickerKey(`gp-${Math.random()}`);
  };

  return (
    <div className="p-8">
      <GroupPicker key={groupPickerKey} />
      <div className="flex w-full justify-center">
        <CreateGroupDialogAndTrigger
          onCreateGroup={handleRerenderGroupPicker}
        />
      </div>
    </div>
  );
};
