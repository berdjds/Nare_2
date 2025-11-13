# 🎛️ Admin Control Panel

A comprehensive content management system for the Nare Travel and Tours website.

## ✨ Features

### What You Can Manage

✅ **Hero Section Slides** - Homepage slider with destination showcases  
✅ **Tour Packages** - Daily, Cultural, and Adventure tours  
✅ **Team Members** - Staff profiles and bios  
✅ **Contact Information** - Phone, email, address, WhatsApp, Telegram  
✅ **Social Media Links** - Facebook, Instagram, Twitter, LinkedIn, YouTube  

---

## 🚀 Quick Start

### 1. Access Admin Panel
```
http://localhost:3000/admin/login
```

### 2. Login Credentials (DEFAULT)
```
Username: admin
Password: admin123
```

⚠️ **IMPORTANT**: Change these before going to production!

### 3. Start Managing
Click any tab to manage that content type. Don't forget to click "Save"!

---

## 📚 Documentation

- **[Quick Start Guide](./docs/ADMIN_QUICK_START.md)** - Get started in 3 minutes
- **[Complete Guide](./docs/ADMIN_PANEL_GUIDE.md)** - Full documentation

---

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 16 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Storage**: JSON files (upgrade to database for production)
- **Auth**: Simple session-based (upgrade to NextAuth.js for production)

### File Structure
```
app/
├── admin/
│   ├── login/page.tsx         # Login page
│   └── dashboard/page.tsx     # Main dashboard
├── api/
│   ├── admin/
│   │   ├── login/route.ts     # Authentication
│   │   └── logout/route.ts
│   └── content/
│       └── [type]/route.ts    # Content CRUD

components/admin/               # Admin UI components
lib/
├── auth.ts                    # Authentication
└── content-storage.ts         # Data layer

data/                          # Content storage (auto-created)
├── heroSlides.json
├── tourPackages.json
├── teamMembers.json
├── contactInfo.json
└── socialLinks.json
```

---

## 🔐 Security Considerations

### For Development
- ✅ Simple username/password auth
- ✅ Session-based authentication
- ✅ 24-hour session timeout

### For Production (TODO)
- ⚠️ Change default credentials
- ⚠️ Use environment variables
- ⚠️ Implement NextAuth.js
- ⚠️ Add password hashing (bcrypt)
- ⚠️ Enable HTTPS
- ⚠️ Add rate limiting
- ⚠️ Use a real database

---

## 💾 Data Storage

### Current Implementation
- JSON files in `/data` directory
- Auto-created on first use
- Simple and portable

### For Production
Consider upgrading to:
- PostgreSQL (recommended)
- MongoDB
- MySQL
- Supabase
- Firebase

---

## 🎨 Customization

### Changing Login Credentials
Edit `lib/auth.ts`:
```typescript
const ADMIN_CREDENTIALS = {
  username: 'your_username',
  password: 'your_password',
};
```

### Adding New Content Types
1. Add type to `lib/content-storage.ts`
2. Create manager component in `components/admin/`
3. Add tab to `app/admin/dashboard/page.tsx`

---

## 🧪 Testing the Admin Panel

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Navigate to admin login:
   ```
   http://localhost:3000/admin/login
   ```

3. Login with default credentials

4. Add some test content

5. View changes on the frontend:
   ```
   http://localhost:3000
   ```

---

## 📝 Content Management Best Practices

### Images
- Use WebP format for best compression
- Optimize before upload
- Use descriptive filenames
- Organize by category in `/public/images/`

### Text Content
- Keep descriptions concise
- Use consistent formatting
- Include relevant keywords
- Proofread before saving

### URLs
- Use full URLs for external links
- Use relative paths for images (`/images/...`)
- Test all links after updating

---

## 🐛 Troubleshooting

### Cannot Login
- Verify credentials in `lib/auth.ts`
- Clear browser cookies
- Check browser console

### Changes Not Saving
- Click the Save button
- Check file permissions on `/data` directory
- Look for errors in server console

### TypeScript Errors
- Run `npx tsc --noEmit` to check
- Restart dev server
- Clear `.next` cache

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Change default admin credentials
- [ ] Move credentials to environment variables
- [ ] Enable HTTPS
- [ ] Add rate limiting to login endpoint
- [ ] Consider upgrading to database
- [ ] Implement proper session management
- [ ] Add backup strategy for data
- [ ] Test all admin functions
- [ ] Set up monitoring/logging

---

## 📞 Support

For questions or issues:
1. Check the [Complete Guide](./docs/ADMIN_PANEL_GUIDE.md)
2. Review [Quick Start](./docs/ADMIN_QUICK_START.md)
3. Check troubleshooting section above
4. Contact your development team

---

## 🔄 Future Enhancements

Planned features for future versions:

- [ ] Direct image upload
- [ ] Rich text editor
- [ ] Multi-language content management
- [ ] Analytics dashboard
- [ ] Booking management
- [ ] User role system
- [ ] Content versioning
- [ ] Automated backups

---

**Version**: 1.0.0  
**Status**: Production Ready (with security enhancements)  
**License**: Private

---

## 🎯 Quick Links

- [Quick Start Guide](./docs/ADMIN_QUICK_START.md)
- [Complete Documentation](./docs/ADMIN_PANEL_GUIDE.md)
- [System Improvements](./docs/SYSTEM_IMPROVEMENTS.md)
