# Git Flow & Deployment Guide

This README section documents the full workflow for syncing changes from another repository, fixing dependencies, and deploying your app.

---

## 1. Backup Current Branch

```bash
# Backup current code
git checkout main
git checkout -b backup-old-version
```

## 2. Add Remote and Fetch Changes

```bash
# Add the other repository
git remote add biashara-connect-4c1472b1 https://github.com/twende-org/biashara-connect-4c1472b1.git
git fetch biashara-connect-4c1472b1
```

## 3. Merge or Reset Changes

### Option A — Replace main with fetched repo (recommended)

```bash
git checkout main
git reset --hard biashara-connect-4c1472b1/main
```

### Option B — Merge manually (not recommended for full-app conflicts)

```bash
git merge biashara-connect-4c1472b1/main --allow-unrelated-histories
```

## 4. Install Dependencies

```bash
rm -rf node_modules package-lock.json
npm install
```

## 5. Fix Missing Packages or TypeScript Errors

* Install missing Radix UI modules:

```bash
npm install @radix-ui/react-avatar
```

* Add temporary TS module declaration if needed:

```ts
// src/types/custom.d.ts
declare module "@radix-ui/react-avatar";
```

* Remove problematic packages like `lovable-tagger` from `vite.config.ts`:

```ts
// import { componentTagger } from "lovable-tagger";
```

* Remove `componentTagger()` from the plugins array:

```ts
plugins: [
  react(),
],
```

## 6. Commit Local Changes

```bash
git add .
git commit -m "Apply latest changes from fetched repo"
```

## 7. Push main Branch

```bash
git push origin main --force
```

## 8. Create Deployment Branch

```bash
git checkout main
git checkout -b deploy
git push origin deploy
```

## 9. Keep deploy Up-to-Date

```bash
git checkout deploy
git merge main
git push origin deploy
```

## 10. Run App Locally

```bash
npm run dev
```

## 11. Deployment

* Ensure deployment service (Netlify / Vercel / GitHub Actions) is tracking the `deploy` branch.
* Trigger manual deployment if necessary.

## 12. Future Git Workflow

1. Work in `main` branch, commit, and test locally.
2. Merge `main` into `deploy` when ready for production.
3. Push `deploy` to trigger deployment.
4. Avoid force-pushing unless intentional.

---

This workflow ensures safe syncing, dependency management, and deployment for your React + Vite project.
