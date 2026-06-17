import { useLang } from '@src/i18n';
import { useEffect, useState } from 'react';
import { ClockCard, ClockDate, ClockTime, Greeting } from './StClock';

export function Clock() {
  const { t } = useLang();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const h = now.getHours();
  const part =
    h < 5
      ? t('Late night')
      : h < 12
        ? t('Good morning')
        : h < 18
          ? t('Good afternoon')
          : t('Good evening');

  return (
    <ClockCard>
      <Greeting>{part}</Greeting>
      <ClockTime>
        {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </ClockTime>
      <ClockDate>
        {now.toLocaleDateString([], {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
        })}
      </ClockDate>
    </ClockCard>
  );
}
