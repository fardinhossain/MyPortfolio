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

export async function sendContactEmail(data) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    const error = new Error('Contact email service is not configured.');
    error.code = 'CONTACT_NOT_CONFIGURED';
    throw error;
  }

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
    const isNotConfigured = error.code === 'CONTACT_NOT_CONFIGURED';
    return {
      status: isNotConfigured ? 503 : 502,
      body: {
        success: false,
        message: isNotConfigured
          ? 'The message service is temporarily unavailable. Please email me directly.'
          : 'Your message could not be sent right now. Please try again shortly.',
      },
    };
  }
}
