# Image Upload System - Admin Panel

## 📸 Overview

The admin panel now includes **automatic image upload** with WebP conversion and size optimization!

---

## ✨ Features

### 1. **Drag & Drop / Click to Upload**
- Upload images directly through the admin interface
- Supports: JPG, PNG, GIF, SVG
- Maximum size: 10MB

### 2. **Automatic WebP Conversion**
- All uploaded images are automatically converted to WebP format
- **WebP** is the most efficient image format for web
- Significantly reduces file sizes while maintaining quality

### 3. **Real-Time Size Information**
Shows you immediately after upload:
- ✅ Image dimensions (width × height)
- ✅ WebP file size
- ✅ Original file size
- ✅ **Savings percentage** (compression achieved)

### 4. **Size Recommendations**
The system shows recommended sizes for each image type:
- **Hero Background**: 1920×1080px (Full HD)
- **Hero Card Images**: 600×400px
- **Tour Images**: 800×600px
- **Team Photos**: 400×400px (Square)

### 5. **Smart Validation**
- Warns if uploaded image differs from recommended size
- Accepts images but notifies you they'll be resized
- Prevents upload of files >10MB

---

## 🚀 How to Use

### Upload an Image

1. **Navigate** to admin panel section (Hero Slides, Tours, or Team)
2. **Click** "Upload Image" button or **drag & drop** file
3. **Wait** for automatic WebP conversion (usually 1-3 seconds)
4. **View** image info:
   ```
   ✅ Image Uploaded Successfully
   Dimensions: 1920×1080px
   WebP Size: 245 KB
   Original Size: 1.2 MB
   Saved 80%
   ```
5. Image URL is automatically filled in the form

### Manual URL Entry

You can still enter URLs manually if you prefer:
- Use the text input below the upload button
- Paste any image URL (e.g., `/images/hero/mountain.webp`)
- Useful for images already in your `/public` folder

---

## 📁 Where Images Are Stored

### Uploaded Images
```
public/images/uploads/
├── destination-name-1699123456.webp
├── tour-photo-1699234567.webp
└── team-member-1699345678.webp
```

### File Naming
- Original filename + timestamp
- Example: `paris-eiffel-1699123456.webp`
- Ensures unique filenames (no overwriting)

---

## 🎯 Compression Settings

### Quality Balance
- **Quality**: 85% (sweet spot for web)
- **Effort**: 6 (maximum compression)
- Result: Typically **70-85% file size reduction**

### Example Savings
```
Original JPEG: 2.5 MB (3000×2000px)
↓ Convert to WebP
WebP Output: 450 KB (3000×2000px)
Savings: 82% smaller! 🎉
```

---

## 💡 Best Practices

### 1. Image Sizes
Upload images close to recommended sizes:
- **Hero backgrounds**: 1920×1080px or larger
- **Tour images**: 800×600px or larger
- **Team photos**: Square aspect ratio (400×400px)

### 2. File Formats
**Best to upload**:
- JPG/JPEG (photos)
- PNG (graphics with transparency)

**System converts to**:
- WebP (optimized for all)

### 3. File Names
Use descriptive names before upload:
- ✅ `paris-eiffel-tower.jpg`
- ✅ `team-member-john.png`
- ❌ `IMG_1234.jpg`
- ❌ `photo.png`

### 4. Image Optimization Before Upload
For best results, consider:
- Crop unnecessary parts
- Adjust brightness/contrast
- Remove metadata
- Use image editing software first

---

## 🔧 Technical Details

### WebP Conversion
```typescript
// Sharp library settings
{
  quality: 85,      // Balance quality/size
  effort: 6,        // Max compression
}
```

### Upload Process
```
1. User selects file
2. Validate type and size
3. Read file buffer
4. Convert to WebP with Sharp
5. Save to /public/images/uploads/
6. Return URL and metadata
7. Display info to admin
```

### Security
- ✅ Admin authentication required
- ✅ File type validation
- ✅ Size limits enforced (10MB max)
- ✅ Filename sanitization
- ✅ Server-side processing only

---

## 📊 Size Comparison Examples

### Scenario 1: Hero Background
```
Original PNG: 3.2 MB (1920×1080)
WebP Output:  380 KB
Savings:      88%
```

### Scenario 2: Tour Photo
```
Original JPEG: 1.8 MB (2400×1600)
WebP Output:   285 KB
Savings:       84%
```

### Scenario 3: Team Photo
```
Original PNG:  850 KB (800×800)
WebP Output:   95 KB
Savings:       89%
```

---

## ⚠️ Limitations

### Current Limitations
- Max file size: 10MB
- No batch upload (one at a time)
- No image editing tools (use external editor)
- No image library/gallery view

### Future Enhancements
Could add:
- Batch upload support
- Image cropping/editing
- Upload progress bar
- Image gallery browser
- Automatic image resizing

---

## 🐛 Troubleshooting

### "File too large" error
- Reduce image size before upload
- Max allowed: 10MB
- Compress image with external tool first

### "Upload failed" error
- Check internet connection
- Verify you're logged in to admin
- Check browser console for details
- Ensure `/public/images/uploads/` directory exists

### Image not appearing
- Check the URL is correct
- Verify image was saved
- Look in `/public/images/uploads/` folder
- Check browser Network tab

### Poor image quality
- Upload higher resolution original
- System uses 85% quality (good balance)
- WebP is very efficient at this quality

---

## 📝 Usage in Each Section

### Hero Slides
```
1. Add Slide → Upload Image button
2. Upload background (1920×1080 recommended)
3. Upload card image (600×400 recommended)
4. See compression stats
5. Save All
```

### Tour Packages
```
1. Add Tour → Upload Image button
2. Upload tour photo (800×600 recommended)
3. Check size info
4. Save All
```

### Team Members
```
1. Add Member → Upload Image button
2. Upload profile photo (400×400 recommended)
3. Verify dimensions
4. Save All
```

---

## 🎨 UI Features

### Visual Feedback
- ✅ Image preview after upload
- ✅ Loading spinner during conversion
- ✅ Success message with green checkmark
- ✅ Warning for non-recommended sizes
- ✅ Error messages for issues

### Information Display
```
┌─────────────────────────────────────┐
│ ✓ Image Uploaded Successfully       │
├─────────────────────────────────────┤
│ Dimensions: 1920×1080px             │
│ WebP Size: 245 KB                   │
│ Original Size: 1.2 MB               │
│ Saved 80%                           │
└─────────────────────────────────────┘
```

### Size Warnings
```
⚠️ Image size (2400×1600px) differs from 
   recommended (1920×1080px). It will be 
   resized to fit.
```

---

## 🔒 Security Notes

### Authentication
- Only logged-in admins can upload
- Session validation on every upload
- Upload API protected

### File Validation
- Type checking (images only)
- Size limits enforced
- Filename sanitization
- No executable files accepted

### Storage
- Images stored in public directory
- Accessible via web after upload
- Unique filenames prevent conflicts

---

## 💻 For Developers

### API Endpoint
```
POST /api/upload-image
Authorization: Admin cookie required
Content-Type: multipart/form-data
```

### Request
```typescript
FormData {
  file: File
}
```

### Response
```typescript
{
  url: string,           // "/images/uploads/..."
  width: number,         // Image width in px
  height: number,        // Image height in px
  size: number,          // WebP size in bytes
  originalSize: number,  // Original size in bytes
  savings: number        // Percentage saved
}
```

### Dependencies
- **sharp**: Image processing library
- Next.js API routes
- File system (fs/promises)

---

## ✅ Quick Checklist

Before uploading images:
- [ ] Image is relevant to content
- [ ] File size < 10MB
- [ ] Decent quality/resolution
- [ ] Descriptive filename
- [ ] Logged in to admin panel

After uploading:
- [ ] Check compression savings
- [ ] Verify image displays correctly
- [ ] Note any size warnings
- [ ] Click "Save All" to persist

---

**Version**: 1.0.0  
**Last Updated**: November 1, 2025  
**Status**: ✅ Fully Functional
