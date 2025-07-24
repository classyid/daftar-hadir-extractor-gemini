# 🚀 Complete Deployment Guide

## Student Attendance Parser AI - Deployment Instructions

### 📋 Prerequisites Checklist

Before starting the deployment, ensure you have:

- [ ] Google Account with Drive and Sheets access
- [ ] Gemini AI API key
- [ ] Basic understanding of Google Apps Script
- [ ] Images ready for testing

---

## 🎯 Step 1: Get Gemini AI API Key

### 1.1 Visit Google AI Studio
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Accept terms and conditions

### 1.2 Create API Key
1. Click on **"Get API Key"** button
2. Select **"Create API key in new project"** or choose existing project
3. Copy the generated API key
4. **⚠️ Important:** Keep this key secure and don't share it publicly

---

## 📊 Step 2: Prepare Google Sheets

### 2.1 Create New Spreadsheet
1. Go to [Google Sheets](https://sheets.google.com/)
2. Click **"+ Blank"** to create new spreadsheet
3. Rename it: **"Student Attendance Parser Data"**

### 2.2 Get Spreadsheet ID
1. Look at the URL of your spreadsheet:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
   ```
2. Copy the **SPREADSHEET_ID** (long string between `/d/` and `/edit`)

### 2.3 Set Sharing Permissions
1. Click **"Share"** button
2. Change access to **"Anyone with the link can edit"**
3. Or add your Google Apps Script service account email

---

## 📁 Step 3: Create Google Drive Folder

### 3.1 Create Folder
1. Go to [Google Drive](https://drive.google.com/)
2. Click **"+ New"** → **"Folder"**
3. Name it: **"Attendance Images"**

### 3.2 Get Folder ID
1. Open the folder you created
2. Look at the URL:
   ```
   https://drive.google.com/drive/folders/FOLDER_ID_HERE
   ```
3. Copy the **FOLDER_ID**

### 3.3 Set Folder Permissions
1. Right-click the folder → **"Share"**
2. Change to **"Anyone with the link can view"**

---

## 🔧 Step 4: Create Google Apps Script Project

### 4.1 Create New Project
1. Go to [Google Apps Script](https://script.google.com/)
2. Click **"+ New project"**
3. Rename project: **"Student Attendance Parser"**

### 4.2 Delete Default Code
1. Delete all content in **Code.gs**
2. We'll replace it with our custom code

---

## 📝 Step 5: Upload Project Files

### 5.1 Add Code.gs
1. Select **Code.gs** file
2. Replace all content with the code from our `Code.gs` file
3. **Update configuration variables:**

```javascript
// ⚠️ IMPORTANT: Update these values with your own
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';
const GEMINI_MODEL = 'gemini-2.0-flash';
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
const LOG_SHEET_NAME = 'log';
const METADATA_SHEET_NAME = 'metadata';
const TRANSACTIONS_SHEET_NAME = 'data_daftar_hadir';
const FOLDER_ID = 'YOUR_FOLDER_ID_HERE';
```

### 5.2 Add HTML Files
1. Click **"+"** → **"HTML file"**
2. Name it: **"Index"**
3. Replace content with our `Index.html` code

4. Click **"+"** → **"HTML file"**
5. Name it: **"JavaScript"**
6. Replace content with our `JavaScript.html` code

7. Click **"+"** → **"HTML file"**
8. Name it: **"Stylesheet"**
9. Replace content with our `Stylesheet.html` code

### 5.3 Final File Structure
Your project should have these files:
```
📁 Student Attendance Parser/
├── 📄 Code.gs
├── 📄 Index.html
├── 📄 JavaScript.html
└── 📄 Stylesheet.html
```

---

## ⚙️ Step 6: Configure Permissions

### 6.1 Enable Required APIs
1. In Google Apps Script, click **"Services"** (+ icon on left sidebar)
2. Add these services:
   - **Google Sheets API**
   - **Google Drive API**

### 6.2 Test the Code
1. In **Code.gs**, click on **`doGet`** function
2. Click **"Run"** button
3. **Authorize permissions** when prompted:
   - Allow access to Google Sheets
   - Allow access to Google Drive
   - Allow external API calls

---

## 🌐 Step 7: Deploy as Web App

### 7.1 Create Deployment
1. Click **"Deploy"** → **"New deployment"**
2. Click **gear icon** → Select **"Web app"**

### 7.2 Configure Deployment Settings
```
Type: Web app
Description: Student Attendance Parser v1.0
Execute as: Me (your-email@gmail.com)
Who has access: Anyone
```

### 7.3 Deploy
1. Click **"Deploy"**
2. **Copy the Web App URL** (you'll need this!)
3. URL format: `https://script.google.com/macros/s/SCRIPT_ID/exec`

---

## 🧪 Step 8: Testing Your Deployment

### 8.1 Test Web App Access
1. Open the **Web App URL** in a new browser tab
2. You should see the attendance parser interface
3. Check if all styling loads correctly

### 8.2 Test File Upload
1. Prepare a test attendance sheet image
2. Upload via drag-and-drop or file selection
3. Click **"Extract Data"**
4. Verify the AI processes the image correctly

### 8.3 Test Data Storage
1. After successful extraction, check your Google Sheets
2. Verify new sheets are created:
   - `data_daftar_hadir`
   - `log`
   - `metadata`

### 8.4 Test Drive Storage
1. Check your Google Drive folder
2. Uploaded images should appear there

---

## 🔒 Step 9: Security Configuration

### 9.1 API Key Security
```javascript
// ⚠️ NEVER commit your real API key to public repositories
// Consider using Google Apps Script Properties Service:

function getApiKey() {
  return PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
}
```

### 9.2 Set Script Properties (Recommended)
1. In Apps Script: **"Project Settings"** → **"Script Properties"**
2. Add property:
   - **Property:** `GEMINI_API_KEY`
   - **Value:** `your-actual-api-key`

3. Update Code.gs:
```javascript
const GEMINI_API_KEY = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
```

---

## 📱 Step 10: Domain and Access Configuration

### 10.1 Custom Domain (Optional)
If you want a custom domain:
1. Purchase domain from registrar
2. Set up DNS CNAME record pointing to Google Apps Script
3. Configure in Google Apps Script deployment settings

### 10.2 Access Control Options

#### Public Access (Default)
```
Who has access: Anyone
```
- ✅ Easy to share
- ❌ Anyone can use your resources

#### Restricted Access
```
Who has access: Anyone with Google account
```
- ✅ Better security
- ✅ Usage tracking
- ❌ Requires Google login

#### Organization Only
```
Who has access: Anyone at [your-domain.com]
```
- ✅ Maximum security
- ❌ Limited to your organization

---

## 🚨 Step 11: Troubleshooting Common Issues

### Issue 1: "Script function not found"
**Solution:**
1. Ensure `doGet()` function exists in Code.gs
2. Save all files
3. Try redeploying

### Issue 2: "Authorization required"
**Solution:**
1. Run any function manually first
2. Grant all required permissions
3. Redeploy if needed

### Issue 3: "API key invalid"
**Solution:**
1. Verify API key is correct
2. Check if API key has proper permissions
3. Ensure Gemini AI API is enabled

### Issue 4: "Cannot access spreadsheet"
**Solution:**
1. Check spreadsheet ID is correct
2. Verify sharing permissions
3. Ensure Google Sheets API is enabled

### Issue 5: "Images not uploading"
**Solution:**
1. Check Google Drive folder ID
2. Verify folder permissions
3. Ensure Google Drive API is enabled

---

## 📊 Step 12: Monitoring and Maintenance

### 12.1 View Execution Logs
1. In Apps Script: **"Executions"** tab
2. Monitor for errors and performance
3. Check API usage

### 12.2 Monitor API Usage
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Check Gemini AI API quotas
3. Monitor costs if applicable

### 12.3 Regular Maintenance
- **Weekly:** Check error logs
- **Monthly:** Review API usage
- **Quarterly:** Update dependencies
- **Annually:** Rotate API keys

---

## 🎉 Step 13: Go Live!

### 13.1 Share Your App
1. Copy the Web App URL
2. Share with intended users
3. Provide basic usage instructions

### 13.2 Create Shortcuts (Optional)
1. Add to Google Drive as shortcut
2. Bookmark in browsers
3. Create QR code for mobile access

### 13.3 Document for Users
Create a simple user guide:
```markdown
# How to Use Attendance Parser

1. Visit: [Your Web App URL]
2. Upload attendance sheet image
3. Click "Extract Data"
4. Copy results or check Google Sheets
```

---

## 📈 Advanced Deployment Options

### Option 1: Version Management
```javascript
// In Code.gs, add version tracking
const APP_VERSION = 'v1.0.0';
const LAST_UPDATED = '2024-01-15';
```

### Option 2: Environment Variables
```javascript
// Use different configs for dev/prod
const CONFIG = {
  development: {
    SPREADSHEET_ID: 'dev-sheet-id',
    FOLDER_ID: 'dev-folder-id'
  },
  production: {
    SPREADSHEET_ID: 'prod-sheet-id',
    FOLDER_ID: 'prod-folder-id'
  }
};
```

### Option 3: Multiple Deployments
- **Development:** For testing new features
- **Staging:** For user acceptance testing  
- **Production:** For live usage

---

## 🔄 Update and Redeploy Process

### When Making Changes:
1. **Edit code** in Google Apps Script
2. **Test thoroughly** in development
3. **Create new deployment** (don't update existing)
4. **Test new deployment** URL
5. **Update live URL** when confirmed working
6. **Archive old deployment**

---

## 📞 Support Information

### If You Need Help:
1. **Check logs** in Google Apps Script executions
2. **Review troubleshooting** section above
3. **Test with sample images** first
4. **Verify all IDs and keys** are correct

### Common Support Contacts:
- **Google Apps Script:** [Google Apps Script Help](https://developers.google.com/apps-script/support)
- **Gemini AI:** [Google AI Support](https://ai.google.dev/support)

---

## ✅ Final Deployment Checklist

- [ ] Gemini AI API key obtained and configured
- [ ] Google Sheets created and ID copied
- [ ] Google Drive folder created and ID copied
- [ ] Google Apps Script project created
- [ ] All 4 files uploaded and configured
- [ ] Configuration variables updated
- [ ] Permissions authorized
- [ ] Web app deployed successfully
- [ ] Testing completed (upload, process, storage)
- [ ] Security settings configured
- [ ] Monitoring set up
- [ ] Documentation created for users
- [ ] Backup of configuration saved

**🎊 Congratulations! Your Student Attendance Parser AI is now live and ready to use!**
