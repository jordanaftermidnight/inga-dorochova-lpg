# Terra Salon and Wellness Spa - Deployment Guide

**Designer:** Jordan After Midnight  
**Product Owner:** George Dorochov  
**Client:** Terra Salon and Wellness Spa

---

## Package Types

### DEV Package (George Dorochov)
**File:** `terra-salon-DEV-package.zip`

Contains:
- All original source files (editable)
- Full documentation
- Development notes
- All images and videos
- Complete project structure

**Use for:**
- Future modifications
- Adding new features
- Updating content
- Reference and backups

---

### CLIENT Package (Terra Salon)
**File:** `terra-salon-CLIENT-package.zip`

Contains:
- Minified production files
- Optimized assets
- Deployment instructions
- Essential files only

**Use for:**
- Web hosting deployment
- Client handoff
- Production environment

---

## Deployment Instructions

### Option 1: Simple Web Hosting (Recommended)

**Compatible with:**
- GoDaddy
- Bluehost
- HostGator  
- SiteGround
- Any cPanel hosting

**Steps:**
1. Unzip the CLIENT package
2. Connect to your hosting via FTP (FileZilla recommended)
3. Upload all files to `public_html` or `www` directory
4. Ensure `index.html` is in the root directory
5. Test the website at your domain

**FTP Credentials:**
- Host: ftp.yourdomain.com
- Username: (from hosting provider)
- Password: (from hosting provider)
- Port: 21

---

### Option 2: GitHub Pages (Free)

**Steps:**
1. Create GitHub account at github.com
2. Create new repository: `terra-salon-website`
3. Upload all CLIENT package files
4. Go to Settings → Pages
5. Select main branch as source
6. Your site will be live at: `username.github.io/terra-salon-website`

**Custom Domain:**
- Add CNAME file with your domain
- Configure DNS with your domain registrar

---

### Option 3: Netlify (Free, Easy)

**Steps:**
1. Go to netlify.com
2. Sign up for free account
3. Drag and drop CLIENT package folder
4. Site goes live instantly
5. Free SSL included

**Custom Domain:**
- Go to Domain Settings
- Add custom domain
- Follow DNS instructions

---

## Pre-Deployment Checklist

### Required Changes

- [ ] Update Google Analytics ID in `index.html` (line 123)
- [ ] Update Facebook Pixel ID in `index.html` (line 144)
- [ ] Test contact form submissions
- [ ] Verify all images load correctly
- [ ] Test all videos play properly
- [ ] Check mobile responsiveness
- [ ] Test booking system
- [ ] Verify admin login credentials

### Optional Changes

- [ ] Add custom favicon
- [ ] Configure email for contact form
- [ ] Set up booking confirmation emails
- [ ] Add Google Maps integration
- [ ] Configure SSL certificate

---

## Post-Deployment Steps

### 1. Test Website

Visit these pages and verify functionality:
- Homepage: `https://yourdomain.com`
- Booking: `https://yourdomain.com/booking.html`
- Admin Login: `https://yourdomain.com/admin-login.html`
- 404 Page: `https://yourdomain.com/nonexistent`

### 2. SEO Setup

**Google Search Console:**
1. Add property at search.google.com/search-console
2. Verify ownership
3. Submit sitemap

**Google Analytics:**
1. Create property at analytics.google.com
2. Add tracking code to index.html
3. Verify tracking works

**Google My Business:**
1. Claim business listing
2. Add website URL
3. Verify location

### 3. Social Media

Update these profiles with website link:
- Facebook: facebook.com/terrasalonandspa
- Instagram
- Google My Business

---

## File Structure (Production)

```
public_html/
├── index.html
├── booking.html
├── booking-success.html
├── admin-login.html
├── admin-dashboard.html
├── 404.html
├── style.css
├── script.js
├── booking.js
├── admin.js
├── [all image files]
├── [all video files]
└── README.txt
```

---

## Security Configuration

### Admin Panel

**Default Credentials:**
- Username: `admin`
- Password: `terra2025`

**⚠️ CHANGE THESE IMMEDIATELY**

Edit `admin.js` to update credentials.

### SSL Certificate

**Free SSL Options:**
- Let's Encrypt (via cPanel)
- Cloudflare SSL
- Hosting provider SSL

**Enable HTTPS:**
1. Install SSL certificate
2. Force HTTPS redirect in `.htaccess`

---

## Maintenance

### Regular Updates

**Monthly:**
- Check broken links
- Update gallery photos
- Review booking system
- Monitor analytics

**Quarterly:**
- Update service pricing
- Refresh testimonials  
- Update business hours

**Annually:**
- Renew domain and hosting
- Update copyright year
- Review and refresh content

---

## Troubleshooting

### Images Not Loading
- Check file paths are correct
- Verify files uploaded to correct directory
- Ensure case-sensitive filenames match

### Videos Not Playing
- Check file size (hosting limits)
- Verify MP4 format compatibility
- Consider hosting on YouTube/Vimeo

### Booking Form Not Working
- Configure contact form backend
- Check email server settings
- Test with FormSpree or similar service

### Mobile Display Issues
- Clear browser cache
- Test on multiple devices
- Verify viewport meta tag

---

## Support Contacts

**Technical Issues:**
- Designer: Jordan After Midnight
- Product Owner: George Dorochov

**Hosting Support:**
- Contact your hosting provider's support

**Website Updates:**
- Contact George Dorochov for modifications

---

## Backup Recommendations

### What to Backup

- All HTML files
- CSS and JavaScript files
- Image and video assets
- Booking database (if applicable)

### Backup Schedule

- Weekly: Automated hosting backups
- Monthly: Manual local backup
- Before updates: Full site backup

### Backup Tools

- cPanel Backup (if available)
- FTP download all files
- Git version control (DEV package)

---

## Performance Optimization

### Already Included

✅ Image lazy loading  
✅ Minified CSS/JS (CLIENT package)  
✅ Optimized images  
✅ Responsive design

### Additional Options

- Enable gzip compression
- Add caching headers
- Use CDN for assets
- Optimize video delivery

---

## Legal Requirements

### Privacy Policy
Add if collecting user data via booking form

### Cookie Notice
Add if using Google Analytics

### Terms of Service
Recommended for booking system

### Accessibility
Website follows WCAG guidelines

---

## Version Control

**Current Version:** 1.0 (October 2025)

**Changelog Location:** See README.md

**Update Process:**
1. Make changes in DEV package
2. Test thoroughly
3. Create new CLIENT package
4. Deploy updated files
5. Clear cache and test

---

## Resources

**Documentation:**
- README.md - Full project documentation
- This file - Deployment instructions

**External Resources:**
- LPG America: https://lpgusa.com
- Font Awesome: https://fontawesome.com
- Google Fonts: https://fonts.google.com

---

**End of Deployment Guide**

For additional support, contact George Dorochov or Jordan After Midnight.
