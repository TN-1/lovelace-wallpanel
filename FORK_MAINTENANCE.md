# Fork Maintenance & Upstreaming Workflow

This guide details the maintenance model for the TN-1 Lovelace WallPanel fork, keeping custom features cleanly isolated for independent upstreaming while maintaining a unified production branch for local deployment.

---

## 1. Branch Topology

```
                  ┌── [feature/playlists] ─────────► (PR #1 to j-f-moran/lovelace-wallpanel)
                  │
[upstream/main] ──┤
                  │
                  └── [feature/birdnet] ───────────► (PR #2 to j-f-moran/lovelace-wallpanel)
                          │             │
                          ▼             ▼
                     [feature/merged] ─────────────► (Compiled production build for Home Assistant)
```

| Branch | Base | Purpose |
| --- | --- | --- |
| `upstream/main` | `j-f-moran/master` | Pure upstream baseline from original author. |
| `feature/playlists` | `upstream/main` | Multi-source playlist sequencer (`cycles`, `display_time`, sub-source iteration). |
| `feature/birdnet` | `upstream/main` | BirdNET-Go screensaver layouts (`folio`, `cluster`, `spread`, `plate`, `chart`), local artwork resolution, and documentation. |
| `feature/merged` | `feature/playlists` | Integration branch combining playlists and BirdNET for active WallPanel installations. |

---

## 2. Initial Setup

Configure the upstream remote repository (if not already set):

```bash
git remote add upstream https://github.com/j-f-moran/lovelace-wallpanel.git
git fetch upstream
```

---

## 3. Routine Workflow: Updating from Upstream

When upstream publishes changes, updates, or bugfixes:

### Step 1: Fetch Upstream Changes
```bash
git fetch upstream
```

### Step 2: Rebase `feature/playlists`
```bash
git checkout feature/playlists
git rebase upstream/main
npm run build
```

### Step 3: Rebase `feature/birdnet`
```bash
git checkout feature/birdnet
git rebase upstream/main
npm run build
```

### Step 4: Recreate `feature/merged`
Reset the merged branch to the newly rebased playlists branch, then merge birdnet:

```bash
git checkout feature/merged
git reset --hard feature/playlists
git merge feature/birdnet -m "Merge feature/birdnet into feature/merged"
npm run build
```

---

## 4. Making Changes to Features

Always implement changes on the specific feature branch, not directly on `feature/merged`:

### To update Playlists:
```bash
git checkout feature/playlists
# ... make edits ...
npm run build
git commit -am "Improve playlist cycling interval logic"

# Update merged production branch
git checkout feature/merged
git merge feature/playlists -m "Merge updated playlists"
npm run build
```

### To update BirdNET:
```bash
git checkout feature/birdnet
# ... make edits ...
npm run build
git commit -am "Refine birdnet label layout"

# Update merged production branch
git checkout feature/merged
git merge feature/birdnet -m "Merge updated birdnet"
npm run build
```

---

## 5. Upstreaming / Pull Requests

When ready to submit changes to `j-f-moran/lovelace-wallpanel`:

1. **Pull Request 1: Playlists**
   - Push `feature/playlists` to your GitHub fork (`origin`).
   - Open a pull request targeting `j-f-moran/lovelace-wallpanel:master`.
   - The PR will contain strictly playlist changes with zero birdnet code.

2. **Pull Request 2: BirdNET Screensaver**
   - Push `feature/birdnet` to your GitHub fork (`origin`).
   - Open a second pull request targeting `j-f-moran/lovelace-wallpanel:master`.
   - The PR will contain strictly BirdNET additions with zero playlist dependencies.
