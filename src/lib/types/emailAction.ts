import { requestPasswordResetAction } from '@/app/password-reset/actions';
import { requestActivationAction } from '@/app/activate/actions';

export type CheckInboxType = 'activate' | 'password';

export interface EmailFormProps {
  action: EmailAction;
  type: CheckInboxType;
  submitLabel?: string;
  submittingLabel?: string;
}

export type EmailAction =
  | typeof requestPasswordResetAction
  | typeof requestActivationAction;
