import * as React from 'react';
import { useIntl } from 'react-intl';

import {
  Button,
  SoundOffIcon,
  SoundOnIcon,
} from '../../bricks';
import {
  setSoundEnabled,
  useSoundEnabled,
} from '../../services/sound-preference';

/**
 * Footer toggle for the transaction success "ka-ching" sound. Persists to
 * localStorage; respects `prefers-reduced-motion` at the play site so users
 * who haven't opted out via this toggle but have set the OS preference still
 * get silence.
 */
export const SoundToggle: React.FC = () => {
  const enabled = useSoundEnabled();
  const intl = useIntl();
  return (
    <Button
      onClick={() => setSoundEnabled(!enabled)}
      aria-label={intl.formatMessage({
        id: enabled ? 'SOUND_DISABLE' : 'SOUND_ENABLE',
        defaultMessage: enabled
          ? 'Disable transaction sound'
          : 'Enable transaction sound',
      })}
      aria-pressed={!enabled}
    >
      {enabled ? <SoundOnIcon /> : <SoundOffIcon />}
    </Button>
  );
};
