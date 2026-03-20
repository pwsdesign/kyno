// ─── Email Parser ─────────────────────────────────────────────
// Parses raw MIME email messages from Cloudflare Email Workers
// into structured data the classifier can use.

/**
 * Parse a raw email message into structured data
 *
 * @param {ReadableStream} rawStream - Raw email stream from Cloudflare
 * @param {object} message - Cloudflare email message object
 * @returns {object} Parsed email data
 */
export async function parseEmail(rawStream, message) {
  // Read the raw email into a string
  const rawText = await streamToText(rawStream);

  // Extract headers
  const headers = parseHeaders(rawText);

  // Extract body (plain text preferred, fallback to stripping HTML)
  const body = extractBody(rawText);

  // Extract sender info
  const fromHeader = message.from || headers["from"] || "";
  const { name: fromName, address: fromAddress } = parseAddress(fromHeader);

  return {
    from: fromAddress || message.from,
    fromName: fromName,
    to: message.to,
    subject: headers["subject"] || "(no subject)",
    body: body,
    messageId: headers["message-id"] || null,
    date: headers["date"] || null,
    rawSize: rawText.length,
    headers: headers,
  };
}

/**
 * Convert ReadableStream to text
 */
async function streamToText(stream) {
  const reader = stream.getReader();
  const chunks = [];
  let done = false;

  while (!done) {
    const result = await reader.read();
    done = result.done;
    if (result.value) {
      chunks.push(result.value);
    }
  }

  // Combine chunks
  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const combined = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.length;
  }

  return new TextDecoder().decode(combined);
}

/**
 * Parse email headers from raw text
 */
function parseHeaders(rawText) {
  const headers = {};

  // Headers end at the first blank line
  const headerEnd = rawText.indexOf("\r\n\r\n");
  const headerBlock =
    headerEnd > -1 ? rawText.substring(0, headerEnd) : rawText.substring(0, 2000);

  // Unfold continued headers (lines starting with whitespace)
  const unfolded = headerBlock.replace(/\r?\n[ \t]+/g, " ");

  const lines = unfolded.split(/\r?\n/);
  for (const line of lines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim().toLowerCase();
      const value = line.substring(colonIndex + 1).trim();
      headers[key] = value;
    }
  }

  return headers;
}

/**
 * Extract the plain text body from a raw email
 */
function extractBody(rawText) {
  // Find the body (after the first blank line)
  const bodyStart = rawText.indexOf("\r\n\r\n");
  if (bodyStart === -1) return "";

  let body = rawText.substring(bodyStart + 4);

  // Check if this is multipart
  const contentType = extractHeader(rawText, "content-type") || "";

  if (contentType.includes("multipart")) {
    // Extract boundary
    const boundaryMatch = contentType.match(/boundary="?([^"\s;]+)"?/i);
    if (boundaryMatch) {
      const boundary = boundaryMatch[1];
      body = extractPlainTextPart(body, boundary);
    }
  } else if (contentType.includes("text/html")) {
    // Strip HTML tags
    body = stripHtml(body);
  }

  // Handle quoted-printable decoding
  const encoding = extractHeader(rawText, "content-transfer-encoding") || "";
  if (encoding.toLowerCase().includes("quoted-printable")) {
    body = decodeQuotedPrintable(body);
  } else if (encoding.toLowerCase().includes("base64")) {
    try {
      body = atob(body.replace(/\s/g, ""));
    } catch {
      // keep as-is if base64 decode fails
    }
  }

  // Trim and limit length
  return body.trim().substring(0, 5000);
}

/**
 * Extract a specific header value from raw text
 */
function extractHeader(rawText, headerName) {
  const regex = new RegExp(`^${headerName}:\\s*(.+?)$`, "im");
  const match = rawText.match(regex);
  return match ? match[1].trim() : null;
}

/**
 * Extract the plain text part from a multipart MIME message
 */
function extractPlainTextPart(body, boundary) {
  const parts = body.split("--" + boundary);

  // Look for text/plain part first
  for (const part of parts) {
    if (part.toLowerCase().includes("content-type: text/plain")) {
      const partBody = part.substring(part.indexOf("\r\n\r\n") + 4);
      return cleanBodyText(partBody);
    }
  }

  // Fallback: look for text/html and strip tags
  for (const part of parts) {
    if (part.toLowerCase().includes("content-type: text/html")) {
      const partBody = part.substring(part.indexOf("\r\n\r\n") + 4);
      return stripHtml(partBody);
    }
  }

  // Last resort: return whatever we have
  return cleanBodyText(body);
}

/**
 * Strip HTML tags and decode entities
 */
function stripHtml(html) {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Decode quoted-printable encoding
 */
function decodeQuotedPrintable(text) {
  return text
    .replace(/=\r?\n/g, "") // soft line breaks
    .replace(/=([0-9A-Fa-f]{2})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    );
}

/**
 * Clean up body text
 */
function cleanBodyText(text) {
  return text
    .replace(/--[^\r\n]+--/g, "") // remove boundary markers
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n") // collapse multiple blank lines
    .trim();
}

/**
 * Parse "Name <email@example.com>" format
 */
function parseAddress(header) {
  const match = header.match(/^"?([^"<]*)"?\s*<?([^>]*)>?$/);
  if (match) {
    return {
      name: match[1].trim().replace(/"/g, ""),
      address: match[2].trim() || header.trim(),
    };
  }
  return { name: "", address: header.trim() };
}
