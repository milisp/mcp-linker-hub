# MCP Linker - New Tiered Pricing Strategy

## Overview
This document explains the new pricing strategy based on **client complexity** and **feature requirements**.

## Pricing Tiers

### 1. Free / Open Source - $0
**Target**: Individual developers trying out MCP Linker

**Included Clients** (Simple Global JSON):
- ✅ Claude Desktop
- ✅ Windsurf
- ✅ CherryStudio
- ✅ Plux

**Features**:
- 600+ MCP servers marketplace
- Basic configuration management
- Local storage
- Community support
- Open-source code access

**Limitations**:
- ❌ No local sync
- ❌ No cloud sync
- ❌ No medium/complex clients

---

### 2. Lifetime Basic - $19 (was $39)
**Target**: Professional developers using standard AI clients

**Included Clients** (Simple + Medium):
- ✅ All Free tier clients
- ✅ **Cursor** (project-level JSON)
- ✅ **VS Code** (project-level JSON)
- ✅ **Cline** (VS Code global storage)
- ✅ **Roo Code** (project-level JSON)
- ✅ **Custom** clients (user-defined paths)

**Features**:
- ✅ Local sync between standard clients
- ✅ Enable/disable servers instantly
- ✅ Recently Used server lists
- ✅ Advanced configuration management
- ✅ Account-based verification (no license key)
- ✅ Priority community support

**Limitations**:
- ❌ No Codex (TOML) support
- ❌ No Claude Code (3 config methods) support
- ❌ No cloud sync

**Why $19?**: Covers 80% of user needs (most developers use Claude Desktop + Cursor/VS Code)

---

### 3. Lifetime Pro - $49 (was $79)
**Target**: Advanced developers using complex clients (Codex, Claude Code)

**Included Clients** (All):
- ✅ All Lifetime Basic clients
- ✅ **Codex** (TOML format - most complex)
- ✅ **Claude Code** (3 configuration methods)

**Features**:
- ✅ Everything in Lifetime Basic
- ✅ Sync between ALL client types
- ✅ TOML ↔ JSON conversion support
- ✅ Project-level configuration control
- ✅ Advanced analytics
- ✅ Priority support

**Limitations**:
- ❌ No cloud sync (local-only)

**Why $49?**: Advanced users who need Codex (TOML) or Claude Code's complex config system

---

### 4. Professional - $9.9/month or $99/year
**Target**: Developers needing cloud sync across multiple devices

**Features**:
- ✅ Everything in Lifetime Pro
- ✅ **Cloud encrypted backup**
- ✅ **Multi-device cloud sync**
- ✅ Unlimited cloud storage
- ✅ Real-time sync across devices
- ✅ 24/7 priority support

**Pricing**:
- Monthly: $9.9/month ($118.8/year if paid monthly)
- Annual: $99/year (**Save $19.8 - 16% off**)

**Why Subscription?**: Cloud sync requires ongoing server costs

**Value Comparison**: Only 2x the price of Lifetime Pro ($49) but adds critical cloud sync

---

### 5. Team - $19/month or $199/year
**Target**: Development teams sharing configurations

**Features**:
- ✅ Everything in Professional
- ✅ Team configuration sharing
- ✅ Permission management
- ✅ Team collaboration tools
- ✅ Admin dashboard
- ✅ Custom integrations
- ✅ Advanced security features

**Pricing**:
- Monthly: $19/month ($228/year if paid monthly)
- Annual: $199/year (**Save $29 - 13% off**)

---

## Client Complexity Matrix

| Client | Format | Scope | Complexity | Min. Tier |
|--------|--------|-------|------------|-----------|
| **Claude Desktop** | JSON | Global | Simple | Free |
| **Windsurf** | JSON | Global | Simple | Free |
| **CherryStudio** | JSON | Global | Simple | Free |
| **Plux** | JSON | Global | Simple | Free |
| **Cursor** | JSON | Project-level | Medium | Lifetime Basic |
| **VS Code** | JSON | Project-level | Medium | Lifetime Basic |
| **Cline** | JSON | VS Code Storage | Medium | Lifetime Basic |
| **Roo Code** | JSON | Project-level | Medium | Lifetime Basic |
| **Codex** | **TOML** | Global | **Complex** | **Lifetime Pro** |
| **Claude Code** | JSON | **3 methods** | **Complex** | **Lifetime Pro** |

### Why Codex & Claude Code are "Complex"?

**Codex**:
- Uses TOML format (not JSON)
- Requires TOML ↔ JSON conversion
- Different configuration structure
- More error-prone to sync

**Claude Code**:
- Has 3 different configuration methods:
  1. Global config
  2. Project-level config
  3. Workspace config
- Requires special handling in sync logic
- More complex state management

---

## Feature Comparison Table

| Feature | Free | Lifetime Basic | Lifetime Pro | Pro | Team |
|---------|------|----------------|--------------|-----|------|
| **Simple Clients** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Medium Clients** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Complex Clients** | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Local Sync** | ❌ | ✅ (standard) | ✅ (all) | ✅ | ✅ |
| **Cloud Sync** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Team Features** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Price** | $0 | $19 once | $49 once | $9.9/mo or $99/yr | $19/mo or $199/yr |

---

## Implementation Details

### New Files Created:

1. **`lib/client-tiers.ts`** - Client access control logic
   - `canAccessClient(userTier, clientName)` - Check if user can access a client
   - `getAccessibleClients(userTier)` - Get all accessible clients
   - `getMinimumTierForClient(clientName)` - Get minimum tier for a client
   - `canUseLocalSync(userTier)` - Check if user can use local sync
   - `canUseCloudSync(userTier)` - Check if user can use cloud sync

### Updated Files:

1. **`lib/plans.ts`** - New pricing structure
   - Updated `planFeatures` with new tiers
   - Replaced single `LIFETIME_PLANS` with two tiers (Basic + Pro)
   - Updated features for all plans

2. **`app/pricing/page.tsx`** - Pricing page UI
   - Updated to handle "Lifetime Basic" and "Lifetime Pro"
   - Added placeholder Polar URLs for Lifetime Basic

---

## Next Steps (Required)

### 1. Add Polar Checkout Links
Update in `app/pricing/page.tsx` line 149:
```typescript
// Replace placeholders with actual Polar URLs
"https://buy.polar.sh/polar_cl_LIFETIME_BASIC_PROD_URL_HERE"
"https://sandbox-api.polar.sh/v1/checkout-links/polar_cl_LIFETIME_BASIC_SANDBOX_URL_HERE/redirect"
```

### 2. Integrate Client Access Control
Add checks in the Tauri app's frontend:

```typescript
import { canAccessClient, getMinimumTierForClient } from '@/lib/client-tiers';

// In client selection UI
const handleClientSelect = (clientName: ClientName) => {
  if (!canAccessClient(user.tier, clientName)) {
    const minTier = getMinimumTierForClient(clientName);
    showUpgradeDialog(minTier);
    return;
  }
  // Proceed with client selection
};
```

### 3. Add Upgrade Prompts
When a user tries to access a restricted client, show:
- Which tier is required
- Benefits of upgrading
- Direct link to pricing page

### 4. Update Backend User Tiers
Ensure the backend supports these tier values:
- `FREE`
- `LIFETIME_BASIC`
- `LIFETIME_PRO`
- `PRO`
- `TEAM`

---

## Rationale

### Why This Strategy Works:

1. **Clear Value Ladder**: Each tier has obvious value over the previous
2. **Based on Technical Reality**: Codex/Claude Code genuinely are more complex
3. **Maximizes Revenue**:
   - $19 captures casual users
   - $49 captures power users
   - Subscription captures multi-device users
4. **Fair Pricing**: Users only pay for complexity they need
5. **Encourages Lifetime Sales**: Most users will choose $19 or $49 over subscription
6. **Recurring Revenue**: Cloud sync requires subscription (server costs)

### Expected User Distribution:

- **Free (30%)**: Trying out, basic needs
- **Lifetime Basic (50%)**: Most developers (Claude + Cursor/VS Code)
- **Lifetime Pro (15%)**: Power users (Codex/Claude Code)
- **Pro Subscription (4%)**: Multi-device workers
- **Team Subscription (1%)**: Teams

### Revenue Model:

- **Upfront Revenue**: Lifetime licenses ($19, $49)
- **Recurring Revenue**: Cloud sync subscriptions ($19.9/mo, $29/mo)
- **Server Costs**: Only paid by subscription users (fair!)

---

## Migration Path for Existing Users

If you have existing "Lifetime" license holders at $39:

**Option A**: Grandfather them into Lifetime Pro
- They paid $39, give them $49 tier
- Shows goodwill to early supporters

**Option B**: Grandfather them into Lifetime Basic
- They paid $39 (now Lifetime Basic price)
- Offer upgrade to Pro for $30 ($49 - $19)

**Recommendation**: Option A (Lifetime Pro) for early supporters
