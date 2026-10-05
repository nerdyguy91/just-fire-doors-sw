/**
 * Form messages that depend on business facts. Contact details are only mentioned once they are
 * confirmed in src/data/business.ts.
 */
import { business } from '../../data/business';

const { phone, email } = business;

/** Shown when the enquiry can't be sent (network, spam check or email provider failure). */
export const sendErrorMessage = (() => {
  const base =
    'Sorry, we couldn’t send that just now. Everything you’ve typed is still here. Please try again.';
  const direct = [phone && `call ${phone.display}`, email && `email ${email}`].filter(Boolean);
  return direct.length ? `${base} If it still isn’t working, ${direct.join(' or ')}.` : base;
})();

/** Shown in place of the upload control when JavaScript is unavailable (uploads need it). */
export const noJsFilesNote = email
  ? `Send the form, then email your documents to ${email} and quote your name.`
  : 'Send the form and we’ll arrange how to get your documents to us when we reply.';
