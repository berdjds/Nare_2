// Email Configuration for Office 365
export interface EmailConfig {
  provider: 'office365';
  smtpHost: string;
  smtpPort: number;
  senderEmail: string;
  senderPassword: string;
  senderName: string;
  
  // Notification Settings
  notifyOnNewInquiry: boolean;
  adminEmail: string;
  autoReplyEnabled: boolean;
  autoReplyMessage: string;
  
  // Advanced Settings
  replyToEmail?: string;
  ccEmail?: string;
  enabled: boolean;
}

const EMAIL_CONFIG_KEY = 'email_configuration';

// Default configuration
const DEFAULT_CONFIG: EmailConfig = {
  provider: 'office365',
  smtpHost: 'smtp.office365.com',
  smtpPort: 587,
  senderEmail: '',
  senderPassword: '',
  senderName: 'Nare Travel Team',
  notifyOnNewInquiry: true,
  adminEmail: '',
  autoReplyEnabled: true,
  autoReplyMessage: `Thank you for contacting Nare Travel!

We have received your inquiry and our team will respond within 24 hours.

If you have any urgent questions, please call us at +374-10-545046.

Best regards,
Nare Travel Team
91 Teryan St, Yerevan, Armenia
www.nare.am`,
  enabled: false,
};

// Get email configuration
export async function getEmailConfig(): Promise<EmailConfig> {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  
  const stored = localStorage.getItem(EMAIL_CONFIG_KEY);
  if (!stored) return DEFAULT_CONFIG;
  
  try {
    return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
  } catch (error) {
    console.error('Error parsing email config:', error);
    return DEFAULT_CONFIG;
  }
}

// Save email configuration
export async function saveEmailConfig(config: EmailConfig): Promise<void> {
  if (typeof window === 'undefined') return;
  localStorage.setItem(EMAIL_CONFIG_KEY, JSON.stringify(config));
}

// Check if email is configured
export async function isEmailConfigured(): Promise<boolean> {
  const config = await getEmailConfig();
  return !!(
    config.enabled &&
    config.senderEmail &&
    config.senderPassword &&
    config.smtpHost
  );
}

// Validate email configuration
export function validateEmailConfig(config: Partial<EmailConfig>): string[] {
  const errors: string[] = [];
  
  if (!config.senderEmail) {
    errors.push('Sender email is required');
  } else if (!isValidEmail(config.senderEmail)) {
    errors.push('Invalid sender email format');
  }
  
  if (!config.senderPassword) {
    errors.push('Sender password is required');
  }
  
  if (!config.senderName) {
    errors.push('Sender name is required');
  }
  
  if (config.notifyOnNewInquiry && !config.adminEmail) {
    errors.push('Admin email is required when notifications are enabled');
  }
  
  if (config.adminEmail && !isValidEmail(config.adminEmail)) {
    errors.push('Invalid admin email format');
  }
  
  if (config.replyToEmail && !isValidEmail(config.replyToEmail)) {
    errors.push('Invalid reply-to email format');
  }
  
  if (config.ccEmail && !isValidEmail(config.ccEmail)) {
    errors.push('Invalid CC email format');
  }
  
  return errors;
}

// Helper: Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Encrypt password (basic - in production use proper encryption)
export function encryptPassword(password: string): string {
  if (typeof window === 'undefined') return password;
  return btoa(password); // Simple base64 encoding
}

// Decrypt password
export function decryptPassword(encrypted: string): string {
  if (typeof window === 'undefined') return encrypted;
  try {
    return atob(encrypted);
  } catch {
    return encrypted;
  }
}
