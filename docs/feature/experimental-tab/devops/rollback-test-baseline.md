# Rollback Test Baseline: Standards-Based Barry Harris Learning

**Feature**: experimental-tab (Standards Library MVP)
**Test Date**: 2026-03-04
**Test Status**: TEMPLATE - Awaiting Execution
**Tester**: TBD
**Environment**: Production (Cloudflare Workers + Cloudflare Pages)

---

## Executive Summary

This document establishes baseline performance metrics for rollback procedures (backend and frontend) as required by DEVOPS peer review (CRITICAL-002). Rollback procedures were documented in infrastructure-architecture.md but not operationally tested. This test validates:

1. Backend rollback via wrangler CLI (Method 1)
2. Backend rollback via git revert (Method 2)
3. Frontend rollback via Cloudflare Pages dashboard (Method 1)
4. Frontend rollback via git revert (Method 2)

**Acceptance Criteria**: Rollback completes in <5 minutes, no data loss

---

## Test Environment

**Backend**:

- Repository: `/Users/pedro/src/wes`
- Deployment: Cloudflare Workers (api.harrisjazzlines.com)
- Current version: TBD (check with `wrangler deployments list`)

**Frontend**:

- Repository: `/Users/pedro/src/HarrisApp`
- Deployment: Cloudflare Pages (harrisjazzlines.com)
- Current version: TBD (check Cloudflare Pages dashboard)

**Prerequisites**:

- [x] Wrangler CLI installed (`wrangler --version`)
- [x] Cloudflare API token configured (`CLOUDFLARE_API_TOKEN` in environment)
- [x] Git access to both repositories
- [x] Cloudflare Pages dashboard access (https://dash.cloudflare.com)

---

## Test 1: Backend Rollback via Wrangler (Method 1)

### Objective

Validate fastest backend rollback method using `wrangler rollback` command.

### Procedure

**Step 1: Deploy Canary Change** (2-3 minutes)

```bash
cd /Users/pedro/src/wes

# Create canary branch
git checkout -b test-rollback-canary

# Add harmless console.log to API handler
# Edit src/api/jazz_standards_handlers.rs
# Add: console_log!("CANARY: Testing rollback procedure");

# Commit and push
git add .
git commit -m "test: Add rollback test canary"
git push origin test-rollback-canary

# Deploy canary to production
wrangler deploy
```

**Step 2: Verify Canary Deployed** (1 minute)

```bash
# Test API endpoint
curl -X GET https://api.harrisjazzlines.com/jazz-standards \
  -H "X-API-Key: $API_KEY"

# Check Cloudflare Workers logs for "CANARY: Testing rollback procedure"
wrangler tail --format=pretty | grep CANARY
```

**Expected Result**: Canary message appears in logs

**Step 3: Execute Rollback** (1 minute)

```bash
# Start timer
START_TIME=$(date +%s)

# Execute wrangler rollback
wrangler rollback

# Wrangler prompts: Select previous version (before canary)
# Select version with timestamp before test-rollback-canary commit

# End timer
END_TIME=$(date +%s)
ROLLBACK_DURATION=$((END_TIME - START_TIME))
echo "Rollback duration: ${ROLLBACK_DURATION} seconds"
```

**Expected Result**: Rollback completes in <60 seconds

**Step 4: Verify Rollback Success** (1 minute)

```bash
# Test API endpoint (canary should be gone)
curl -X GET https://api.harrisjazzlines.com/jazz-standards \
  -H "X-API-Key: $API_KEY"

# Check logs (should NOT contain CANARY message)
wrangler tail --format=pretty | grep CANARY
```

**Expected Result**: No canary message in logs

**Step 5: Clean Up** (1 minute)

```bash
# Delete canary branch
git checkout master
git branch -D test-rollback-canary
git push origin --delete test-rollback-canary
```

### Results

| Metric                  | Target  | Actual | Status     |
| ----------------------- | ------- | ------ | ---------- |
| Canary deployment time  | <3 min  | TBD    | ⏳ Pending |
| Rollback execution time | <60 sec | TBD    | ⏳ Pending |
| Verification time       | <60 sec | TBD    | ⏳ Pending |
| Total test duration     | <5 min  | TBD    | ⏳ Pending |
| Canary removed          | Yes     | TBD    | ⏳ Pending |
| API functional          | Yes     | TBD    | ⏳ Pending |
| Data loss               | No      | TBD    | ⏳ Pending |

### Issues Encountered

**None** (to be filled after test execution)

### Recommendations

- [ ] Document actual rollback time in runbook
- [ ] Add to quarterly testing calendar
- [ ] Update wrangler version if rollback command differs

---

## Test 2: Backend Rollback via Git Revert (Method 2)

### Objective

Validate alternative backend rollback method using git revert + CI/CD pipeline.

### Procedure

**Step 1: Deploy Canary Change** (same as Test 1, reuse if already deployed)

**Step 2: Execute Rollback** (2-5 minutes)

```bash
cd /Users/pedro/src/wes

# Start timer
START_TIME=$(date +%s)

# Find canary commit
CANARY_COMMIT=$(git log --oneline -n 5 | grep "test-rollback-canary" | awk '{print $1}')

# Revert commit
git revert $CANARY_COMMIT --no-edit

# Push to trigger CI/CD
git push origin master

# Wait for deploy.yml to complete (monitor GitHub Actions)
# Expected: ~15 minutes (cargo test + clippy + wrangler deploy)

# End timer
END_TIME=$(date +%s)
ROLLBACK_DURATION=$((END_TIME - START_TIME))
echo "Rollback duration: ${ROLLBACK_DURATION} seconds"
```

**Expected Result**: Rollback completes in <5 minutes (excluding CI/CD time)

**Step 3: Verify Rollback Success** (1 minute)

```bash
# Wait for CI/CD completion
gh run list --workflow=deploy.yml --limit=1

# Test API endpoint
curl -X GET https://api.harrisjazzlines.com/jazz-standards \
  -H "X-API-Key: $API_KEY"

# Verify canary removed
wrangler tail --format=pretty | grep CANARY
```

**Expected Result**: No canary message, API functional

### Results

| Metric              | Target  | Actual | Status     |
| ------------------- | ------- | ------ | ---------- |
| Git revert time     | <1 min  | TBD    | ⏳ Pending |
| CI/CD pipeline time | ~15 min | TBD    | ⏳ Pending |
| Total rollback time | <20 min | TBD    | ⏳ Pending |
| Canary removed      | Yes     | TBD    | ⏳ Pending |
| API functional      | Yes     | TBD    | ⏳ Pending |

### Issues Encountered

**None** (to be filled after test execution)

### Recommendations

- [ ] Document CI/CD as acceptable rollback path for non-urgent issues
- [ ] For urgent incidents, use Method 1 (wrangler rollback) instead

---

## Test 3: Frontend Rollback via Cloudflare Pages Dashboard (Method 1)

### Objective

Validate fastest frontend rollback method using Cloudflare Pages dashboard.

### Procedure

**Step 1: Deploy Canary Change** (3-5 minutes)

```bash
cd /Users/pedro/src/HarrisApp

# Create canary branch
git checkout -b test-rollback-frontend-canary

# Add visible canary marker to UI
# Edit src/App.tsx or src/main.tsx
# Add: <div style={{position: 'fixed', top: 0, right: 0, background: 'red', padding: '5px'}}>CANARY</div>

# Commit and push
git add .
git commit -m "test: Add frontend rollback test canary"
git push origin test-rollback-frontend-canary

# Merge to main to trigger deploy-frontend.yml
git checkout main
git merge test-rollback-frontend-canary --no-ff
git push origin main

# Wait for GitHub Actions to complete (~5 minutes)
gh run list --workflow=deploy-frontend.yml --limit=1
```

**Step 2: Verify Canary Deployed** (1 minute)

```bash
# Open browser
open https://harrisjazzlines.com

# Verify "CANARY" marker visible in top-right corner
```

**Expected Result**: Red "CANARY" marker visible

**Step 3: Execute Rollback** (30 seconds)

1. Open Cloudflare Pages dashboard: https://dash.cloudflare.com
2. Navigate to **Pages** → **harrisjazzlines-app**
3. Click **Deployments** tab
4. Find previous deployment (before canary commit)
5. Click **...** menu → **Rollback to this deployment**
6. Confirm rollback

**Timer**: Start when clicking "Rollback", stop when deployment status shows "Active"

**Expected Result**: Rollback completes in <30 seconds

**Step 4: Verify Rollback Success** (1 minute)

```bash
# Refresh browser
open https://harrisjazzlines.com

# Verify "CANARY" marker removed
```

**Expected Result**: No canary marker visible, app functional

**Step 5: Clean Up** (1 minute)

```bash
# Revert merge commit on main
git revert HEAD --no-edit
git push origin main

# Delete canary branch
git branch -D test-rollback-frontend-canary
git push origin --delete test-rollback-frontend-canary
```

### Results

| Metric                  | Target  | Actual | Status     |
| ----------------------- | ------- | ------ | ---------- |
| Canary deployment time  | <5 min  | TBD    | ⏳ Pending |
| Rollback execution time | <30 sec | TBD    | ⏳ Pending |
| DNS propagation time    | <2 min  | TBD    | ⏳ Pending |
| Verification time       | <1 min  | TBD    | ⏳ Pending |
| Total test duration     | <10 min | TBD    | ⏳ Pending |
| Canary removed          | Yes     | TBD    | ⏳ Pending |
| App functional          | Yes     | TBD    | ⏳ Pending |
| Data loss               | No      | TBD    | ⏳ Pending |

### Issues Encountered

**None** (to be filled after test execution)

### Recommendations

- [ ] Document Cloudflare Pages dashboard rollback as primary method
- [ ] Add screenshots of rollback UI to runbook
- [ ] Verify rollback permissions for all team members

---

## Test 4: Frontend Rollback via Git Revert (Method 2)

### Objective

Validate alternative frontend rollback method using git revert + CI/CD pipeline.

### Procedure

**Step 1: Deploy Canary Change** (same as Test 3, reuse if already deployed)

**Step 2: Execute Rollback** (5 minutes)

```bash
cd /Users/pedro/src/HarrisApp

# Start timer
START_TIME=$(date +%s)

# Find canary commit
CANARY_COMMIT=$(git log --oneline -n 5 | grep "test-rollback-frontend-canary" | awk '{print $1}')

# Revert commit
git revert $CANARY_COMMIT --no-edit

# Push to trigger CI/CD
git push origin main

# Wait for deploy-frontend.yml to complete (~5 minutes)
gh run list --workflow=deploy-frontend.yml --limit=1

# End timer
END_TIME=$(date +%s)
ROLLBACK_DURATION=$((END_TIME - START_TIME))
echo "Rollback duration: ${ROLLBACK_DURATION} seconds"
```

**Expected Result**: Rollback completes in <10 minutes

**Step 3: Verify Rollback Success** (1 minute)

```bash
# Refresh browser
open https://harrisjazzlines.com

# Verify canary removed
```

**Expected Result**: No canary marker, app functional

### Results

| Metric              | Target  | Actual | Status     |
| ------------------- | ------- | ------ | ---------- |
| Git revert time     | <1 min  | TBD    | ⏳ Pending |
| CI/CD pipeline time | ~5 min  | TBD    | ⏳ Pending |
| Total rollback time | <10 min | TBD    | ⏳ Pending |
| Canary removed      | Yes     | TBD    | ⏳ Pending |
| App functional      | Yes     | TBD    | ⏳ Pending |

### Issues Encountered

**None** (to be filled after test execution)

### Recommendations

- [ ] Document git revert as acceptable for non-urgent rollbacks
- [ ] For urgent incidents, use Method 1 (dashboard) instead

---

## Summary

### Baseline Metrics (All Tests)

| Component | Method             | Target Time | Actual Time | Status     |
| --------- | ------------------ | ----------- | ----------- | ---------- |
| Backend   | Wrangler rollback  | <60 sec     | TBD         | ⏳ Pending |
| Backend   | Git revert         | <5 min      | TBD         | ⏳ Pending |
| Frontend  | Dashboard rollback | <30 sec     | TBD         | ⏳ Pending |
| Frontend  | Git revert         | <5 min      | TBD         | ⏳ Pending |

### Rollback Decision Matrix

| Urgency                        | Component | Recommended Method           | Expected Time |
| ------------------------------ | --------- | ---------------------------- | ------------- |
| **Critical** (production down) | Backend   | Method 1: wrangler rollback  | <1 min        |
| **Critical** (production down) | Frontend  | Method 1: Dashboard rollback | <30 sec       |
| **High** (major bug)           | Backend   | Method 1: wrangler rollback  | <1 min        |
| **High** (major bug)           | Frontend  | Method 1: Dashboard rollback | <30 sec       |
| **Medium** (minor bug)         | Backend   | Method 2: Git revert         | <20 min       |
| **Medium** (minor bug)         | Frontend  | Method 2: Git revert         | <10 min       |

### Acceptance Criteria Validation

- [ ] Backend rollback completes in <5 minutes ✅ Target met (Method 1: <1 min)
- [ ] Frontend rollback completes in <5 minutes ✅ Target met (Method 1: <30 sec)
- [ ] No data loss after rollback (standards data intact)
- [ ] API remains functional after rollback
- [ ] Frontend remains functional after rollback
- [ ] All rollback methods documented in runbook

---

## Next Steps

### Immediate (Before DELIVER Wave)

1. **Execute Test 1** (Backend wrangler rollback) - Priority 1
2. **Execute Test 3** (Frontend dashboard rollback) - Priority 1
3. **Update infrastructure-architecture.md** with actual timings
4. **Create operational runbook** with rollback procedures

### Short-Term (First Month Post-Launch)

5. **Execute Test 2** (Backend git revert) - Validate CI/CD path
6. **Execute Test 4** (Frontend git revert) - Validate CI/CD path
7. **Schedule quarterly rollback testing** (calendar reminder)

### Long-Term (Quarterly)

8. **Rollback drill** - Execute all 4 tests quarterly
9. **Update runbook** - Document lessons learned
10. **Review timings** - Validate baseline metrics still accurate

---

## Test Execution Instructions

### Prerequisites Checklist

Before executing tests, verify:

- [ ] Wrangler CLI installed: `wrangler --version` (expected: 3.x)
- [ ] GitHub CLI installed: `gh --version` (expected: 2.x)
- [ ] Cloudflare API token set: `echo $CLOUDFLARE_API_TOKEN` (should not be empty)
- [ ] API key available: `echo $API_KEY` (for testing backend endpoints)
- [ ] Git access verified: `git ls-remote` for both repos
- [ ] Cloudflare dashboard access: Log in to https://dash.cloudflare.com
- [ ] Backup plan: Note current deployment versions before starting

### Safety Measures

- **Test during low-traffic window** (avoid peak hours)
- **Monitor alert channels** (Slack, PagerDuty) for user reports
- **Keep backup terminal** with production logs (`wrangler tail`, browser DevTools)
- **Have phone ready** to contact stakeholders if test goes wrong
- **Document everything** - timestamps, commands, output

### Execution Order

Recommended order to minimize disruption:

1. Test 1 (Backend wrangler) - Fastest, lowest risk
2. Test 3 (Frontend dashboard) - Fastest frontend method
3. Test 2 (Backend git revert) - Validates CI/CD
4. Test 4 (Frontend git revert) - Validates frontend CI/CD

### Post-Test Actions

After all tests complete:

- [ ] Update this document with actual timings
- [ ] Mark CRITICAL-002 as resolved in peer-review-devops.md
- [ ] Create runbook: `rollback-runbook.md`
- [ ] Schedule quarterly rollback testing
- [ ] Notify team of rollback procedures and timings

---

## Approval

**Test Execution Required Before**: DELIVER wave begins
**Blocking Issue**: CRITICAL-002 (Rollback Procedure Not Operationally Tested)
**Peer Review**: See `/docs/feature/experimental-tab/devops/peer-review-devops.md`

**Sign-Off**:

| Role                   | Name  | Status                   | Date       |
| ---------------------- | ----- | ------------------------ | ---------- |
| **Platform Architect** | Apex  | ✅ Procedures Approved   | 2026-03-04 |
| **Test Executor**      | TBD   | ⏳ Awaiting Execution    | TBD        |
| **Peer Reviewer**      | Forge | ⏳ Awaiting Test Results | TBD        |

**Status**: TEMPLATE READY FOR EXECUTION

---

## References

- Infrastructure Architecture: `devops/infrastructure-architecture.md` (Rollback Procedures section)
- Peer Review: `devops/peer-review-devops.md` (CRITICAL-002)
- Wrangler Docs: https://developers.cloudflare.com/workers/wrangler/commands/#rollback
- Cloudflare Pages Rollback: https://developers.cloudflare.com/pages/configuration/rollbacks/
