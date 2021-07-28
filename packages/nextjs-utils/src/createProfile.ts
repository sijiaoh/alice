import { Profile } from 'passport';

export const createProfile = (attributes: Partial<Profile> = {}): Profile => {
  return {
    provider: 'google',
    id: 'profileId',
    displayName: '',
    emails: [{ value: 'email@email.com' }],
    ...attributes,
  };
};
