'use client';

import { useEffect, useState } from 'react';

interface Props {
  /** Sets the honeypot and timestamp on the parent form data */
  onChange?: (data: { _hp: string; _t: number }) => void;
}

/**
 * Invisible bot-protection fields to render inside a form.
 * Includes honeypot input + initial-render timestamp.
 *
 * Place anywhere inside the form. Read the latest values via callback or
 * via the hidden inputs' name attributes when submitting via FormData.
 */
export default function CaptchaFields({ onChange }: Props) {
  const [timestamp] = useState(() => Date.now());

  useEffect(() => {
    onChange?.({ _hp: '', _t: timestamp });
  }, [onChange, timestamp]);

  return (
    <>
      {/* Honeypot — visually & a11y hidden, but autofilled by bots */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-9999px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      >
        <label htmlFor="company">Company name</label>
        <input
          id="company"
          name="_hp"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <input type="hidden" name="_t" value={timestamp} />
    </>
  );
}

/** Use this hook to get the captcha payload to merge into JSON body */
export function useCaptcha(): { _hp: string; _t: number } {
  const [t] = useState(() => Date.now());
  return { _hp: '', _t: t };
}
