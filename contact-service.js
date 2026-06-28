const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanSingleLine(value, maxLength) {
  return value.trim().replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').slice(0, maxLength);
}

export function validateContactPayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { ok: false, message: 'Invalid message data.' };
  }

  const website = typeof payload.website === 'string' ? payload.website.trim() : '';
  if (website) return { ok: true, isBot: true };

  if (![payload.name, payload.email, payload.subject, payload.message].every((value) => typeof value === 'string')) {
    return { ok: false, message: 'Please complete every field.' };
  }

  const data = {
    name: cleanSingleLine(payload.name, 100),
    email: cleanSingleLine(payload.email, 254).toLowerCase(),
    subject: cleanSingleLine(payload.subject, 120),
    message: payload.message.trim().slice(0, 2000),
  };

  if (!data.name || !data.email || !data.subject || !data.message) {
    return { ok: false, message: 'Please complete every field.' };
  }

  if (!EMAIL_PATTERN.test(data.email)) {
    return { ok: false, message: 'Please enter a valid email address.' };
  }

  if (data.message.length < 10) {
    return { ok: false, message: 'Your message must be at least 10 characters.' };
  }

  return { ok: true, data };
}

async function sendWithResend(data, apiKey) {
  const recipient = process.env.CONTACT_TO_EMAIL || 'fardin.hosn@gmail.com';
  const sender = process.env.CONTACT_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>';
  const emailResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: sender,
      to: [recipient],
      reply_to: data.email,
      subject: `[Portfolio] ${data.subject}`,
      text: [
        'New portfolio message',
        '',
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Subject: ${data.subject}`,
        '',
        data.message,
      ].join('\n'),
    }),
  });

  if (!emailResponse.ok) {
    const responseBody = await emailResponse.text();
    throw new Error(`Email provider returned ${emailResponse.status}: ${responseBody.slice(0, 500)}`);
  }
}

async function sendWithFormSubmit(data) {
  const recipient = process.env.CONTACT_TO_EMAIL || 'fardin.hosn@gmail.com';
  const siteUrl = (process.env.CONTACT_SITE_URL || 'https://mdfardin.vercel.app').replace(/\/+$/, '');
  const formResponse = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Origin: siteUrl,
      Referer: `${siteUrl}/`,
    },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      _replyto: data.email,
      _subject: `[Portfolio] ${data.subject}`,
      _template: 'table',
      _captcha: 'false',
    }),
  });

  const responseBody = await formResponse.json().catch(() => ({}));
  const succeeded = responseBody.success === true || responseBody.success === 'true';

  if (!formResponse.ok || !succeeded) {
    const providerMessage = typeof responseBody.message === 'string' ? responseBody.message : '';
    const error = new Error(`Form relay returned ${formResponse.status}: ${providerMessage.slice(0, 500)}`);
    if (providerMessage.toLowerCase().includes('activation')) {
      error.code = 'CONTACT_ACTIVATION_REQUIRED';
    }
    throw error;
  }
}

export async function sendContactEmail(data) {
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) return sendWithResend(data, apiKey);
  return sendWithFormSubmit(data);
}

export async function processContactRequest(payload) {
  const validation = validateContactPayload(payload);

  if (!validation.ok) {
    return { status: 400, body: { success: false, message: validation.message } };
  }

  if (validation.isBot) {
    return { status: 200, body: { success: true, message: 'Message sent successfully. Thank you!' } };
  }

  try {
    await sendContactEmail(validation.data);
    return { status: 200, body: { success: true, message: 'Message sent successfully. Thank you!' } };
  } catch (error) {
    console.error('Contact email error:', error);
    const needsActivation = error.code === 'CONTACT_ACTIVATION_REQUIRED';
    return {
      status: needsActivation ? 503 : 502,
      body: {
        success: false,
        code: needsActivation ? 'CONTACT_ACTIVATION_REQUIRED' : 'EMAIL_DELIVERY_FAILED',
        message: needsActivation
          ? 'Direct messaging is awaiting one-time activation by the portfolio owner.'
          : 'Your message could not be sent right now. Please try again shortly.',
      },
    };
  }
}
