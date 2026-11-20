const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_MIN_LENGTH = 3;
const MESSAGE_MIN_LENGTH = 15;

/**
 * Validates the contact form values.
 * Returns { [field]: { key, params? } } where `key` is a translation key, so messages
 * can be translated at render time and follow the current language.
 */
export const validateContact = (values) => {
  const errors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();

  if (!name) errors.name = { key: 'contact.errors.nameRequired' };
  else if (name.length < NAME_MIN_LENGTH) errors.name = { key: 'contact.errors.nameShort' };

  if (!email) errors.email = { key: 'contact.errors.emailRequired' };
  else if (!EMAIL_REGEX.test(email)) errors.email = { key: 'contact.errors.emailInvalid' };

  if (!values.subject.trim()) errors.subject = { key: 'contact.errors.subjectRequired' };

  if (!message) errors.message = { key: 'contact.errors.messageRequired' };
  else if (message.length < MESSAGE_MIN_LENGTH) {
    errors.message = { key: 'contact.errors.messageShort', params: { count: message.length } };
  }

  return errors;
};
