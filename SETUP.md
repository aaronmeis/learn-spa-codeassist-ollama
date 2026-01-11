# Setup Guide

Complete step-by-step setup instructions for the Self-Improving Coding Agent MVP.

## Prerequisites

Before you begin, ensure you have the following installed:

### 1. Node.js and npm

**Check if installed:**
```bash
node --version   # Should be v18.0.0 or higher
npm --version    # Should be 9.0.0 or higher
```

**Install if missing:**
- **Windows:** Download from [nodejs.org](https://nodejs.org/) (LTS version recommended)
- **macOS:** `brew install node`
- **Linux:** `sudo apt-get install nodejs npm` or use [nvm](https://github.com/nvm-sh/nvm)

### 2. Ollama

**Check if installed:**
```bash
ollama --version
```

**Install if missing:**

- **Windows:**
  1. Download installer from [ollama.com/download](https://ollama.com/download)
  2. Run the installer (`.exe` file)
  3. Ollama will start automatically after installation

- **macOS:**
  ```bash
  brew install ollama
  ```

- **Linux:**
  ```bash
  curl -fsSL https://ollama.com/install.sh | sh
  ```

### 3. Git (Optional)

Required only if cloning from a repository:
```bash
git --version
```

### 4. Browser Requirements

- **Chrome/Edge:** Version 90+ (recommended)
- **Firefox:** Version 88+
- **Safari:** Version 14+

## Step-by-Step Setup

### Step 1: Navigate to Project Directory

```bash
# Navigate to the my-agent-app directory (where package.json is located)
cd my-agent-app
```

**Note:** All npm commands should be run from the `my-agent-app` directory, not the root directory.

### Step 2: Install Project Dependencies

```bash
npm install
```

**Expected output:**
- Downloads and installs React, Vite, Monaco Editor, and other dependencies
- Creates `node_modules` folder
- May take 1-3 minutes depending on internet speed

**Troubleshooting:**
- If you get permission errors, try: `npm install --legacy-peer-deps`
- If npm is slow, consider using a faster registry: `npm config set registry https://registry.npmjs.org/`
- On Windows, if you get errors about long paths, run: `git config --global core.longpaths true`

### Step 3: Download Ollama Model

**First-time setup only** (downloads ~4GB):

```bash
ollama pull codellama:7b
```

**Expected output:**
```
pulling manifest
pulling 8a5b2c... 100% ▕████████████████▏ 4.0 GB
pulling 8e5b2d... 100% ▕████████████████▏ 2.1 GB
...
```

**Time:** 5-15 minutes depending on internet speed.

**Alternative models** (smaller, faster):
- `codellama:3b` - Smaller model (~2GB), faster but less accurate
- `mistral:7b` - General purpose model

### Step 4: Start Ollama Server

**In a separate terminal window:**

```bash
ollama serve
```

**Expected output:**
```
INFO[0000] server config env="map[OLLAMA_DEBUG:false OLLAMA_HOST:0.0.0.0:11434]"
INFO[0000] starting server... addr=0.0.0.0:11434
```

**Keep this terminal open** - Ollama must be running for the app to work.

**Windows Note:** On Windows, Ollama may run as a background service. Check if it's running:
```powershell
# Check if Ollama is running
Get-Process ollama -ErrorAction SilentlyContinue
```

If it's not running, start it:
```powershell
ollama serve
```

### Step 5: Verify Ollama Connection

**In a new terminal** (while Ollama is running):

```bash
# Test connection
curl http://localhost:11434/api/tags
```

**Windows PowerShell alternative:**
```powershell
Invoke-WebRequest -Uri http://localhost:11434/api/tags -Method GET
```

**Expected output:** JSON response with available models.

**If connection fails:**
- Ensure Ollama is running (`ollama serve`)
- Check if port 11434 is available: `netstat -an | findstr 11434` (Windows) or `lsof -i :11434` (macOS/Linux)
- Try restarting Ollama

### Step 6: Start the Development Server

**In the project directory** (`my-agent-app`):

```bash
npm run dev
```

**Expected output:**
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**The browser should open automatically** to `http://localhost:5173`

**If browser doesn't open:** Manually navigate to `http://localhost:5173`

### Step 7: Verify Setup

1. **Check Health Status:**
   - Look for the "Health Check" panel in the app
   - Ollama status should show as "Connected" (green)

2. **Test Code Generation:**
   - Enter a goal: "Write a function that adds two numbers"
   - Click "Generate Code"
   - You should see code stream in real-time in the Monaco editor
   - Check the bottom-right corner for token usage after generation completes

3. **Check Browser Console:**
   - Open DevTools (F12)
   - Look for any errors in the Console tab
   - Structured logs should appear (🤖, 🦙, 🖥️ prefixes)

## Verification Checklist

- [ ] Node.js v18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Ollama installed (`ollama --version`)
- [ ] Dependencies installed (`node_modules` folder exists)
- [ ] Model downloaded (`ollama list` shows `codellama:7b`)
- [ ] Ollama server running (`ollama serve` in separate terminal)
- [ ] Ollama connection works (`curl http://localhost:11434/api/tags`)
- [ ] Dev server running (`npm run dev`)
- [ ] App opens in browser (`http://localhost:5173`)
- [ ] Health check shows Ollama as "Connected"
- [ ] Can generate code successfully
- [ ] Code streams in real-time (not all at once)
- [ ] Token counter appears in bottom-right after generation

## Common Setup Issues

### Issue: "Cannot find module" errors

**Solution:**
```bash
cd my-agent-app
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 5173 already in use

**Solution:**
```bash
# Kill process on port 5173 (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or change port in vite.config.js
```

### Issue: Ollama connection fails

**Solutions:**
1. Ensure Ollama is running: `ollama serve`
2. Check Windows Firewall isn't blocking port 11434
3. Try restarting Ollama: Stop and run `ollama serve` again
4. Verify model is downloaded: `ollama list`

### Issue: Model download fails or is slow

**Solutions:**
1. Check internet connection
2. Try downloading a smaller model first: `ollama pull codellama:3b`
3. Use a VPN if in a restricted network
4. Download may take 10-30 minutes depending on speed

### Issue: npm install fails on Windows

**Solutions:**
1. Run PowerShell/CMD as Administrator
2. Clear npm cache: `npm cache clean --force`
3. Use `npm install --legacy-peer-deps`
4. Ensure Python/Visual Studio Build Tools are installed (for native modules)

### Issue: Browser shows blank page

**Solutions:**
1. Check browser console for errors (F12)
2. Verify you're accessing `http://localhost:5173` (not `https://`)
3. Try a different browser
4. Clear browser cache and reload

## Windows-Specific Notes

### Running Ollama as a Service

On Windows, Ollama can run as a Windows service. To check:
```powershell
Get-Service ollama
```

To start/stop:
```powershell
Start-Service ollama
Stop-Service ollama
```

### PowerShell vs Command Prompt

All commands work in both PowerShell and Command Prompt. If you encounter issues:
- Use PowerShell (recommended)
- Ensure execution policy allows scripts: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`
- **Important:** PowerShell uses `;` instead of `&&` to chain commands:
  ```powershell
  # ✅ Correct (PowerShell)
  cd my-agent-app; npm run dev
  
  # ❌ Wrong (bash/cmd syntax)
  cd my-agent-app && npm run dev
  ```

### Path Length Issues

If you encounter "path too long" errors:
```powershell
git config --global core.longpaths true
```

## Mock Mode (Alternative Setup)

If you want to test the UI without setting up Ollama:

1. Start the dev server: `npm run dev` (from `my-agent-app` directory)
2. Open the app in your browser
3. When you see the "Ollama not connected" warning, click **"Use Mock Mode"**
4. The app will use simulated responses instead of calling Ollama

**Mock Mode is useful for:**
- Testing the UI without Ollama setup
- Development when Ollama is unavailable
- Quick demonstrations

**Note:** Mock mode generates simple example code and doesn't use real AI inference.

## Next Steps

Once setup is complete:

1. Read the main [README.md](./README.md) for usage instructions
2. Check out [CLAUDE.md](./CLAUDE.md) for project architecture
3. Try the example goals in the app
4. Explore the debug panel to see raw API calls
5. Toggle mock mode on/off to compare behavior

## Getting Help

If you're stuck:

1. Check the [Troubleshooting](./README.md#-troubleshooting) section in README
2. Review browser console for error messages
3. Verify all checklist items above
4. Check that Ollama is actually running and accessible

## Quick Reference

```bash
# Start Ollama (Terminal 1)
ollama serve

# Start Dev Server (Terminal 2)
cd my-agent-app
npm run dev

# Test Ollama (Terminal 3)
curl http://localhost:11434/api/tags
```

**Remember:** Keep Ollama running in a separate terminal while developing!
