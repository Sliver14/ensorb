'use client'

import { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { Invite, AdminStats, CreateInviteInput } from '@/lib/types'
import { GiftRecord, GiftContribution, GiftAdminStats } from '@/lib/db'
import { AccessCardPass } from '@/components/AccessCardPass'
import {
  Users,
  UserCheck,
  Clock,
  Plus,
  Search,
  Copy,
  Check,
  ExternalLink,
  Mail,
  Trash2,
  Edit2,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  LogOut,
  Lock,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Zap,
  Send,
  Eye,
  X,
  UserPlus,
  SlidersHorizontal,
  Calendar,
  Phone,
  Gift,
  DollarSign,
  CheckCheck,
  TrendingUp,
} from 'lucide-react'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [pinInput, setPinInput] = useState('')
  const [authError, setAuthError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Integration status
  const [emailStatus, setEmailStatus] = useState(false)

  // Dashboard Data
  const [invites, setInvites] = useState<Invite[]>([])
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null)

  // Modals & UI States
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createMode, setCreateMode] = useState<'email_direct' | 'bare' | 'batch' | 'custom'>('email_direct')
  const [editingInvite, setEditingInvite] = useState<Invite | null>(null)
  const [previewInvite, setPreviewInvite] = useState<Invite | null>(null)
  const [approvingInvite, setApprovingInvite] = useState<Invite | null>(null)
  const [assignedTable, setAssignedTable] = useState('Table 01 - Emerald VIP')
  const [assignedMaxGuests, setAssignedMaxGuests] = useState(2)
  const [assignedCategory, setAssignedCategory] = useState<Invite['category']>('General')
  const [sendPassEmailOnApprove, setSendPassEmailOnApprove] = useState(true)

  const [activeMainTab, setActiveMainTab] = useState<'guests' | 'gifts' | 'create'>('guests')
  const [guestFilterTab, setGuestFilterTab] = useState<'pending' | 'attending' | 'all' | 'declined' | 'vip'>('pending')
  const [searchQuery, setSearchQuery] = useState('')

  // Gift Registry Data & States
  const [giftContributions, setGiftContributions] = useState<GiftContribution[]>([])
  const [giftStats, setGiftStats] = useState<GiftAdminStats | null>(null)
  const [giftItems, setGiftItems] = useState<GiftRecord[]>([])
  const [isLoadingGifts, setIsLoadingGifts] = useState(false)
  const [confirmingContribId, setConfirmingContribId] = useState<string | null>(null)
  const [decliningContribId, setDecliningContribId] = useState<string | null>(null)
  const [giftFilter, setGiftFilter] = useState<'all' | 'pending' | 'confirmed' | 'declined'>('all')
  const [giftSearchQuery, setGiftSearchQuery] = useState('')

  // Email Direct Invite Form
  const [emailInviteForm, setEmailInviteForm] = useState({
    targetName: '',
    targetEmail: '',
    maxGuests: 2,
    tableNumber: '',
    category: 'General' as Invite['category'],
    customNote: '',
  })

  // Bare Link Generator state
  const [bareCount, setBareCount] = useState<number>(5)
  const [bareSeats, setBareSeats] = useState<number>(2)
  const [bareCategory, setBareCategory] = useState<Invite['category']>('General')

  // Custom Form
  const [customForm, setCustomForm] = useState<CreateInviteInput>({
    targetName: '',
    maxGuests: 2,
    tableNumber: '',
    category: 'VIP',
    customNote: '',
    customCode: '',
  })

  // Batch Names Form
  const [batchNames, setBatchNames] = useState('')

  const [isSubmittingForm, setIsSubmittingForm] = useState(false)
  const [isQuickGenerating, setIsQuickGenerating] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Show temporary toast notification
  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type })
    setTimeout(() => setToastMessage(null), 4500)
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  // Check auth on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/check')
        const data = await res.json()
        if (data.authenticated) {
          setIsAuthenticated(true)
          setEmailStatus(data.emailProviderConfigured)
          loadDashboardData()
        } else {
          setIsAuthenticated(false)
          setIsLoading(false)
        }
      } catch {
        setIsAuthenticated(false)
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  // Load Gift Registry Data
  const loadGiftData = async () => {
    try {
      setIsLoadingGifts(true)
      const [contribsRes, giftsRes] = await Promise.all([
        fetch('/api/gifts/contributions'),
        fetch('/api/gifts'),
      ])
      const contribsData = await contribsRes.json()
      const giftsData = await giftsRes.json()

      if (contribsData.success) {
        setGiftContributions(contribsData.contributions || [])
        setGiftStats(contribsData.stats || null)
      }
      if (giftsData.success) {
        setGiftItems(giftsData.gifts || [])
        if (!contribsData.stats && giftsData.stats) {
          setGiftStats(giftsData.stats)
        }
      }
    } catch (err) {
      console.error('Failed to load gifts data:', err)
    } finally {
      setIsLoadingGifts(false)
    }
  }

  // Handle Confirm Gift Transfer
  const handleConfirmGift = async (contributionId: string) => {
    setConfirmingContribId(contributionId)
    try {
      const res = await fetch('/api/gifts/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contributionId, confirmedBy: 'Admin / Couple' }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast('✓ Gift transfer confirmed! Progress updated on live website.', 'success')
        await loadGiftData()
      } else {
        showToast(data.error || 'Failed to confirm gift transfer', 'error')
      }
    } catch {
      showToast('Network error while confirming gift transfer', 'error')
    } finally {
      setConfirmingContribId(null)
    }
  }

  // Handle Decline Gift Transfer
  const handleDeclineGift = async (contributionId: string) => {
    setDecliningContribId(contributionId)
    try {
      const res = await fetch('/api/gifts/decline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contributionId, reason: 'Unverified transfer record' }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast('Gift contribution marked as declined.', 'info')
        await loadGiftData()
      } else {
        showToast(data.error || 'Failed to decline gift', 'error')
      }
    } catch {
      showToast('Network error while declining gift', 'error')
    } finally {
      setDecliningContribId(null)
    }
  }

  // Load all dashboard data
  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      const [invRes] = await Promise.all([
        fetch('/api/invites'),
        loadGiftData(),
      ])
      const invData = await invRes.json()

      if (invData.success) {
        setInvites(invData.invites || [])
        setStats(invData.stats || null)
      } else {
        showToast('Failed to load guest data', 'error')
      }
    } catch {
      showToast('Network error loading data from DB', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    setIsLoggingIn(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput }),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setIsAuthenticated(true)
        showToast('Welcome back, Ngozi & Sorbari!', 'success')
        loadDashboardData()
      } else {
        setAuthError(data.error || 'Invalid Admin Security PIN')
      }
    } catch {
      setAuthError('Connection error. Please try again.')
    } finally {
      setIsLoggingIn(false)
    }
  }

  // Logout handler
  const handleLogout = () => {
    document.cookie = 'ensorb_admin_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    setIsAuthenticated(false)
    setPinInput('')
  }

  // Copy code / link helper
  const handleCopy = (text: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedCode(id)
      setTimeout(() => setCopiedCode(null), 2500)
    }
  }

  // Quick bare link generation
  const handleQuickBareLink = async () => {
    setIsQuickGenerating(true)
    try {
      const res = await fetch('/api/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 1, maxGuests: 2, category: 'General' }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast('⚡ Quick invitation link generated and saved to DB!', 'success')
        loadDashboardData()
      } else {
        showToast(data.error || 'Failed to generate link', 'error')
      }
    } catch {
      showToast('Error generating quick link', 'error')
    } finally {
      setIsQuickGenerating(false)
    }
  }

  // Handle open approval modal
  const handleOpenApproveModal = (inv: Invite) => {
    setApprovingInvite(inv)
    setAssignedTable(inv.tableNumber || 'Table 01 - Emerald VIP')
    setAssignedMaxGuests(inv.maxGuests || 2)
    setAssignedCategory(inv.category || 'General')
    setSendPassEmailOnApprove(Boolean(inv.guestEmail || inv.targetEmail))
  }

  // Confirm Approval
  const handleConfirmApprove = async () => {
    if (!approvingInvite) return
    try {
      const res = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: approvingInvite.id,
          code: approvingInvite.code,
          tableNumber: assignedTable,
          maxGuests: assignedMaxGuests,
          category: assignedCategory,
          sendAccessCardEmail: sendPassEmailOnApprove,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast(`✓ ${approvingInvite.guestName || approvingInvite.targetName || 'Guest'} approved!`, 'success')
        setApprovingInvite(null)
        loadDashboardData()
      } else {
        showToast(data.error || 'Failed to approve guest', 'error')
      }
    } catch {
      showToast('Error approving guest', 'error')
    }
  }

  // Handle Decline
  const handleDecline = async (inv: Invite) => {
    if (!confirm(`Decline reservation for ${inv.guestName || inv.targetName || 'this guest'}?`)) return
    try {
      const res = await fetch('/api/admin/decline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: inv.id, code: inv.code, reason: 'Venue capacity reached' }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast('Guest reservation declined.', 'info')
        loadDashboardData()
      } else {
        showToast(data.error || 'Failed to decline guest', 'error')
      }
    } catch {
      showToast('Error declining guest', 'error')
    }
  }

  // Handle Resend Email
  const handleResendEmail = async (inv: Invite) => {
    const email = inv.guestEmail || inv.targetEmail
    if (!email) {
      showToast('No email address registered for this guest.', 'error')
      return
    }

    try {
      const res = await fetch(`/api/invites/${inv.code}/resend`, {
        method: 'POST',
      })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast(`✓ Digital pass emailed to ${email}!`, 'success')
        loadDashboardData()
      } else {
        showToast(data.error || 'Failed to send pass email', 'error')
      }
    } catch {
      showToast('Error sending email', 'error')
    }
  }

  // Handle Delete Invite
  const handleDeleteInvite = async (inv: Invite) => {
    if (!confirm(`Revoke and delete invite "${inv.code}" for ${inv.guestName || inv.targetName || 'unnamed guest'}?`)) return
    try {
      const res = await fetch(`/api/invites/${inv.id || inv.code}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast('Invitation revoked from database.', 'success')
        loadDashboardData()
      } else {
        showToast(data.error || 'Failed to delete invite', 'error')
      }
    } catch {
      showToast('Error deleting invite', 'error')
    }
  }

  // Handle Save Edited Invite
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingInvite) return

    try {
      const res = await fetch(`/api/invites/${editingInvite.id || editingInvite.code}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingInvite),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast('Guest details updated in database.', 'success')
        setEditingInvite(null)
        loadDashboardData()
      } else {
        showToast(data.error || 'Failed to update details', 'error')
      }
    } catch {
      showToast('Error updating details', 'error')
    }
  }

  // Export CSV
  const handleExportCSV = () => {
    if (!invites.length) {
      showToast('No guests to export.', 'info')
      return
    }

    const headers = [
      'Invite Code',
      'Access Code',
      'Target Name',
      'Guest Name',
      'Guest Email',
      'Guest Phone',
      'Status',
      'Attendance',
      'Guest Count',
      'Table Number',
      'Category',
      'Notes',
    ]

    const rows = invites.map((inv) => [
      inv.code,
      inv.accessCode || '',
      `"${inv.targetName || ''}"`,
      `"${inv.guestName || ''}"`,
      inv.guestEmail || inv.targetEmail || '',
      inv.guestPhone || '',
      inv.approvalStatus || 'pending',
      inv.attendance || 'attending',
      inv.actualGuestCount || inv.maxGuests || 1,
      `"${inv.tableNumber || ''}"`,
      inv.category || 'General',
      `"${inv.dietaryOrNotes || inv.customNote || ''}"`,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `ensorb_wedding_guestlist_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('✓ Guest list CSV downloaded!', 'success')
  }

  // Filtered Invites
  const filteredInvites = useMemo(() => {
    let result = [...invites]

    // Status Tab Filter
    if (guestFilterTab === 'pending') {
      result = result.filter((inv) => inv.approvalStatus === 'pending')
    } else if (guestFilterTab === 'attending') {
      result = result.filter((inv) => inv.attendance === 'attending' && inv.approvalStatus === 'approved')
    } else if (guestFilterTab === 'declined') {
      result = result.filter((inv) => inv.attendance === 'declined' || inv.approvalStatus === 'declined')
    } else if (guestFilterTab === 'vip') {
      result = result.filter((inv) => inv.category === 'VIP')
    }

    // Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (inv) =>
          inv.code.toLowerCase().includes(q) ||
          inv.accessCode?.toLowerCase().includes(q) ||
          inv.targetName?.toLowerCase().includes(q) ||
          inv.guestName?.toLowerCase().includes(q) ||
          inv.guestEmail?.toLowerCase().includes(q) ||
          inv.guestPhone?.toLowerCase().includes(q) ||
          inv.tableNumber?.toLowerCase().includes(q) ||
          inv.category?.toLowerCase().includes(q)
      )
    }

    return result
  }, [invites, guestFilterTab, searchQuery])

  // Filtered Gifts
  const filteredContributions = useMemo(() => {
    let result = [...giftContributions]

    if (giftFilter !== 'all') {
      result = result.filter((c) => c.status === giftFilter)
    }

    if (giftSearchQuery.trim()) {
      const q = giftSearchQuery.toLowerCase()
      result = result.filter(
        (c) =>
          c.contributorName.toLowerCase().includes(q) ||
          c.giftTitle.toLowerCase().includes(q) ||
          c.paymentReference.toLowerCase().includes(q) ||
          (c.contributorEmail && c.contributorEmail.toLowerCase().includes(q))
      )
    }

    return result
  }, [giftContributions, giftFilter, giftSearchQuery])

  // Pending counts
  const pendingApprovalsCount = useMemo(() => {
    return invites.filter((inv) => inv.approvalStatus === 'pending').length
  }, [invites])

  const pendingContributionsCount = useMemo(() => {
    return giftContributions.filter((c) => c.status === 'pending').length
  }, [giftContributions])

  // --------------------------------------------------------------------------
  // LOGIN SCREEN
  // --------------------------------------------------------------------------
  if (isAuthenticated === false) {
    return (
      <main className="elegant-burgundy-theme admin-portal-page">
        <section className="subpage-hero section-shell admin-portal-hero">
          <div className="subpage-hero-content reveal-fade-up">
            <span className="eyebrow-accent">— ADMIN &amp; PORTAL SECURITY —</span>
            <h1>Wedding Management Portal</h1>
            <p>Access guest RSVPs, real-time table assignments, and wedding registry contributions.</p>
          </div>
        </section>

        <section className="admin-login-section section-shell">
          <div className="admin-login-card card-luxury-border reveal-fade-up">
            <div className="lock-badge-icon">
              <Lock size={32} />
            </div>

            <h2>Enter Admin Security PIN</h2>
            <p className="admin-login-desc">
              Please enter the master security PIN to access the bride and groom dashboard.
            </p>

            <form onSubmit={handleLogin} className="admin-login-form">
              <div className="pin-input-group">
                <input
                  type="password"
                  placeholder="Enter Security PIN (e.g. ensorb2026)"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="pin-field"
                  autoFocus
                  required
                />
              </div>

              {authError && <div className="admin-error-box">{authError}</div>}

              <button
                type="submit"
                className="btn-primary-burgundy w-full"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? 'Verifying PIN...' : 'Access Dashboard →'}
              </button>
            </form>
          </div>
        </section>
      </main>
    )
  }

  // --------------------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD
  // --------------------------------------------------------------------------
  return (
    <main className="elegant-burgundy-theme admin-portal-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`admin-toast-banner ${toastMessage.type}`}>
          <span>{toastMessage.text}</span>
          <button type="button" onClick={() => setToastMessage(null)}>✕</button>
        </div>
      )}

      {/* Hero Header */}
      <section className="admin-hero-section section-shell">
        <div className="admin-hero-top-row reveal-fade-up">
          <div className="admin-branding">
            <span className="eyebrow-accent">— WEDDING ADMIN &amp; REGISTRY PORTAL —</span>
            <h1>Ngozi &amp; Sorbari Dashboard</h1>
            <p>Real-time PostgreSQL Database • Live RSVPs • Wedding Gifts Manager</p>
          </div>

          <div className="admin-quick-actions">
            <button
              type="button"
              className="admin-primary-btn"
              onClick={() => {
                setCreateMode('email_direct')
                setShowCreateModal(true)
              }}
            >
              <UserPlus size={16} />
              <span>Invite Guest</span>
            </button>

            <button
              type="button"
              className="admin-secondary-btn"
              onClick={handleQuickBareLink}
              disabled={isQuickGenerating}
            >
              <Zap size={16} />
              <span>{isQuickGenerating ? 'Generating...' : '⚡ Quick Link'}</span>
            </button>

            <button
              type="button"
              className="admin-secondary-btn"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Integration Status Bar */}
        <div className="admin-status-ribbon">
          <div className="status-item">
            <Mail size={16} className={emailStatus ? 'text-green' : 'text-amber'} />
            <span>
              Resend Email Service: <strong>{emailStatus ? 'Connected & Active' : 'Fallback / Simulation Ready'}</strong>
            </span>
          </div>
          <div className="status-item">
            <ShieldCheck size={16} className="text-green" />
            <span>
              Neon PostgreSQL Database: <strong>Connected</strong>
            </span>
          </div>
          <button
            type="button"
            className="refresh-btn"
            onClick={loadDashboardData}
            title="Refresh database"
          >
            <RefreshCw size={14} className={isLoading ? 'spinning' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="admin-stats-grid section-shell">
        {/* Pending RSVPs */}
        <div
          className={`stat-card clickable ${activeMainTab === 'guests' && guestFilterTab === 'pending' ? 'active-stat' : ''}`}
          onClick={() => {
            setActiveMainTab('guests')
            setGuestFilterTab('pending')
          }}
        >
          <div className="stat-icon-box amber">
            <Clock size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Pending RSVPs</span>
            <strong className="stat-val">{pendingApprovalsCount}</strong>
            <span className="stat-sub">Website RSVPs awaiting review</span>
          </div>
        </div>

        {/* Attending Guests */}
        <div
          className={`stat-card clickable ${activeMainTab === 'guests' && guestFilterTab === 'attending' ? 'active-stat' : ''}`}
          onClick={() => {
            setActiveMainTab('guests')
            setGuestFilterTab('attending')
          }}
        >
          <div className="stat-icon-box green">
            <UserCheck size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Confirmed Attending</span>
            <strong className="stat-val">{stats?.totalGuestsAttending || stats?.attendingCount || 0}</strong>
            <span className="stat-sub">{stats?.attendingCount || 0} RSVPs approved</span>
          </div>
        </div>

        {/* Total Invites */}
        <div
          className={`stat-card clickable ${activeMainTab === 'guests' && guestFilterTab === 'all' ? 'active-stat' : ''}`}
          onClick={() => {
            setActiveMainTab('guests')
            setGuestFilterTab('all')
          }}
        >
          <div className="stat-icon-box burgundy">
            <Users size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Invitations</span>
            <strong className="stat-val">{stats?.totalInvites || invites.length}</strong>
            <span className="stat-sub">{stats?.totalSeatsAllocated || 0} total seats allocated</span>
          </div>
        </div>

        {/* Gift Registry Total Raised */}
        <div
          className={`stat-card clickable ${activeMainTab === 'gifts' ? 'active-stat' : ''}`}
          onClick={() => setActiveMainTab('gifts')}
        >
          <div className="stat-icon-box gold">
            <TrendingUp size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Gift Funds Raised</span>
            <strong className="stat-val">₦{(giftStats?.totalConfirmedAmount || 0).toLocaleString()}</strong>
            <span className="stat-sub">{giftStats?.confirmedCount || 0} verified gifts confirmed</span>
          </div>
        </div>

        {/* Pending Gift Transfers */}
        <div
          className={`stat-card clickable ${activeMainTab === 'gifts' && giftFilter === 'pending' ? 'active-stat' : ''}`}
          onClick={() => {
            setActiveMainTab('gifts')
            setGiftFilter('pending')
          }}
        >
          <div className="stat-icon-box amber">
            <Gift size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Pending Transfers</span>
            <strong className="stat-val">{pendingContributionsCount}</strong>
            <span className="stat-sub">₦{(giftStats?.totalPendingAmount || 0).toLocaleString()} awaiting verification</span>
          </div>
        </div>
      </section>

      {/* Main Tab Navigation */}
      <section className="section-shell" style={{ paddingBottom: 0 }}>
        <div className="admin-main-nav-tabs">
          <button
            type="button"
            className={`main-tab-btn ${activeMainTab === 'guests' ? 'active' : ''}`}
            onClick={() => setActiveMainTab('guests')}
          >
            <Users size={18} />
            <span>RSVPs &amp; Guest Management ({invites.length})</span>
            {pendingApprovalsCount > 0 && (
              <span className="tab-pill-badge amber">{pendingApprovalsCount}</span>
            )}
          </button>

          <button
            type="button"
            className={`main-tab-btn ${activeMainTab === 'gifts' ? 'active' : ''}`}
            onClick={() => setActiveMainTab('gifts')}
          >
            <Gift size={18} />
            <span>Wedding Gift Registry &amp; Contributions</span>
            {pendingContributionsCount > 0 && (
              <span className="tab-pill-badge amber">{pendingContributionsCount}</span>
            )}
          </button>
        </div>
      </section>

      {/* =======================================================================
          TAB 1: GUESTS & RSVP MANAGEMENT
          ======================================================================= */}
      {activeMainTab === 'guests' && (
        <section className="admin-management-section section-shell">
          {/* Controls & Filter Bar */}
          <div className="management-controls-bar">
            {/* Status Pills */}
            <div className="management-pills-group">
              <button
                type="button"
                className={`mgmt-pill ${guestFilterTab === 'pending' ? 'active' : ''}`}
                onClick={() => setGuestFilterTab('pending')}
              >
                Needs Review ({pendingApprovalsCount})
              </button>
              <button
                type="button"
                className={`mgmt-pill ${guestFilterTab === 'attending' ? 'active' : ''}`}
                onClick={() => setGuestFilterTab('attending')}
              >
                Approved Attending ({stats?.attendingCount || 0})
              </button>
              <button
                type="button"
                className={`mgmt-pill ${guestFilterTab === 'all' ? 'active' : ''}`}
                onClick={() => setGuestFilterTab('all')}
              >
                All Invites ({invites.length})
              </button>
              <button
                type="button"
                className={`mgmt-pill ${guestFilterTab === 'vip' ? 'active' : ''}`}
                onClick={() => setGuestFilterTab('vip')}
              >
                VIP Guests
              </button>
              <button
                type="button"
                className={`mgmt-pill ${guestFilterTab === 'declined' ? 'active' : ''}`}
                onClick={() => setGuestFilterTab('declined')}
              >
                Declined ({stats?.declinedCount || 0})
              </button>
            </div>

            {/* Search & Export Buttons */}
            <div className="management-actions-right">
              <div className="search-box-wrap">
                <Search size={15} className="search-ico" />
                <input
                  type="text"
                  placeholder="Search guests, email, code, table..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input-mgmt"
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery('')} className="clear-btn">✕</button>
                )}
              </div>

              <button
                type="button"
                className="btn-export-csv"
                onClick={handleExportCSV}
              >
                <FileSpreadsheet size={15} />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Guest Table */}
          <div className="guest-table-card">
            {isLoading ? (
              <div className="admin-loading-state">
                <RefreshCw size={28} className="spinning" />
                <p>Loading real-time data from Neon PostgreSQL...</p>
              </div>
            ) : filteredInvites.length === 0 ? (
              <div className="admin-empty-state">
                <Users size={36} />
                <h3>No matching guests found</h3>
                <p>Try clearing your search query or switching tabs.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Guest / Family Name</th>
                      <th>Invite / Pass Code</th>
                      <th>Table &amp; Category</th>
                      <th>Guests</th>
                      <th>Status &amp; Attendance</th>
                      <th>Contact &amp; Blessing</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvites.map((inv) => {
                      const isPending = inv.approvalStatus === 'pending'
                      const isApproved = inv.approvalStatus === 'approved'
                      const isDeclined = inv.approvalStatus === 'declined' || inv.attendance === 'declined'
                      const guestDisplayName = inv.guestName || inv.targetName || '⚡ Bare Link Guest'
                      const inviteLink = typeof window !== 'undefined'
                        ? `${window.location.origin}/invite/${inv.code}`
                        : `https://ensorb.com/invite/${inv.code}`

                      return (
                        <tr key={inv.id || inv.code} className={isPending ? 'pending-row' : ''}>
                          {/* Name & Source */}
                          <td>
                            <div className="guest-name-cell">
                              <strong className="guest-main-name">{guestDisplayName}</strong>
                              <span className="guest-source-tag">
                                {inv.source === 'rsvp_form' ? '🌐 Website RSVP' : '✉️ Direct Invite'}
                              </span>
                            </div>
                          </td>

                          {/* Code & 1-Click Copy */}
                          <td>
                            <div className="code-badge-group">
                              <code className="font-mono">{inv.accessCode || inv.passId || inv.code}</code>
                              <button
                                type="button"
                                className="copy-icon-btn"
                                onClick={() => handleCopy(inviteLink, inv.code)}
                                title="Copy invitation link"
                              >
                                {copiedCode === inv.code ? <Check size={13} className="text-green" /> : <Copy size={13} />}
                              </button>
                            </div>
                          </td>

                          {/* Table & Category */}
                          <td>
                            <div className="table-cat-cell">
                              <span className="table-badge">{inv.tableNumber || 'Unassigned'}</span>
                              <span className={`cat-pill cat-${(inv.category || 'General').toLowerCase()}`}>
                                {inv.category || 'General'}
                              </span>
                            </div>
                          </td>

                          {/* Guests count */}
                          <td>
                            <span className="guest-count-pill">
                              👤 {inv.actualGuestCount || inv.maxGuests || 1}
                            </span>
                          </td>

                          {/* Status */}
                          <td>
                            {isPending ? (
                              <span className="status-badge pending">⏳ Needs Review</span>
                            ) : isApproved ? (
                              <span className="status-badge approved">✓ Approved Pass</span>
                            ) : (
                              <span className="status-badge declined">✕ Declined</span>
                            )}
                          </td>

                          {/* Contact & Blessing Note */}
                          <td>
                            <div className="contact-cell">
                              {(inv.guestEmail || inv.targetEmail) && (
                                <span className="email-text">✉️ {inv.guestEmail || inv.targetEmail}</span>
                              )}
                              {inv.guestPhone && (
                                <span className="phone-text">📞 {inv.guestPhone}</span>
                              )}
                              {(inv.dietaryOrNotes || inv.customNote) && (
                                <span className="note-text" title={inv.dietaryOrNotes || inv.customNote}>
                                  💬 {inv.dietaryOrNotes || inv.customNote}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Action Buttons */}
                          <td>
                            <div className="action-buttons-cell">
                              {isPending && (
                                <>
                                  <button
                                    type="button"
                                    className="btn-action-approve"
                                    onClick={() => handleOpenApproveModal(inv)}
                                    title="Approve & assign table"
                                  >
                                    <CheckCircle2 size={14} />
                                    <span>Approve</span>
                                  </button>
                                  <button
                                    type="button"
                                    className="btn-action-decline"
                                    onClick={() => handleDecline(inv)}
                                    title="Decline reservation"
                                  >
                                    <XCircle size={14} />
                                  </button>
                                </>
                              )}

                              {isApproved && (
                                <>
                                  <button
                                    type="button"
                                    className="btn-action-preview"
                                    onClick={() => setPreviewInvite(inv)}
                                    title="View Digital Pass"
                                  >
                                    <Eye size={14} />
                                  </button>
                                  {(inv.guestEmail || inv.targetEmail) && (
                                    <button
                                      type="button"
                                      className="btn-action-email"
                                      onClick={() => handleResendEmail(inv)}
                                      title="Resend Access Card Email"
                                    >
                                      <Mail size={14} />
                                    </button>
                                  )}
                                </>
                              )}

                              <button
                                type="button"
                                className="btn-action-edit"
                                onClick={() => setEditingInvite(inv)}
                                title="Edit Guest Details"
                              >
                                <Edit2 size={14} />
                              </button>

                              <button
                                type="button"
                                className="btn-action-delete"
                                onClick={() => handleDeleteInvite(inv)}
                                title="Revoke & Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {/* =======================================================================
          TAB 2: WEDDING GIFTS & REGISTRY MANAGEMENT
          ======================================================================= */}
      {activeMainTab === 'gifts' && (
        <section className="admin-management-section section-shell">
          {/* Header Summary Row */}
          <div className="gift-summary-header">
            <div className="gift-summary-col">
              <span className="eyebrow">Registry Financials</span>
              <h2>Wedding Registry &amp; Blessings Ledger</h2>
              <p>Verify bank transfers, confirm cash contributions, and track live website progress.</p>
            </div>

            <div className="gift-summary-badges">
              <div className="badge-stat">
                <span className="lbl">Target Registry Value</span>
                <strong className="val">₦{(giftStats?.totalRegistryValue || 0).toLocaleString()}</strong>
              </div>
              <div className="badge-stat confirmed">
                <span className="lbl">Confirmed Raised</span>
                <strong className="val text-green">₦{(giftStats?.totalConfirmedAmount || 0).toLocaleString()}</strong>
              </div>
              <div className="badge-stat pending">
                <span className="lbl">Pending Transfers</span>
                <strong className="val text-amber">₦{(giftStats?.totalPendingAmount || 0).toLocaleString()}</strong>
              </div>
            </div>
          </div>

          {/* Contributions Ledger Card */}
          <div className="gift-ledger-container" style={{ marginTop: '24px' }}>
            <div className="ledger-filter-row">
              <div className="ledger-pill-group">
                <button
                  type="button"
                  className={`ledger-pill ${giftFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setGiftFilter('all')}
                >
                  All Contributions ({giftContributions.length})
                </button>
                <button
                  type="button"
                  className={`ledger-pill ${giftFilter === 'pending' ? 'active' : ''}`}
                  onClick={() => setGiftFilter('pending')}
                >
                  Pending Verification ({pendingContributionsCount})
                </button>
                <button
                  type="button"
                  className={`ledger-pill ${giftFilter === 'confirmed' ? 'active' : ''}`}
                  onClick={() => setGiftFilter('confirmed')}
                >
                  Confirmed ({giftStats?.confirmedCount || 0})
                </button>
                <button
                  type="button"
                  className={`ledger-pill ${giftFilter === 'declined' ? 'active' : ''}`}
                  onClick={() => setGiftFilter('declined')}
                >
                  Declined
                </button>
              </div>

              <div className="search-box-wrap">
                <Search size={15} className="search-ico" />
                <input
                  type="text"
                  placeholder="Search donor, item, reference code..."
                  value={giftSearchQuery}
                  onChange={(e) => setGiftSearchQuery(e.target.value)}
                  className="search-input-mgmt"
                />
              </div>
            </div>

            {isLoadingGifts ? (
              <div className="admin-loading-state">
                <RefreshCw size={28} className="spinning" />
                <p>Loading gift contributions from database...</p>
              </div>
            ) : filteredContributions.length === 0 ? (
              <div className="admin-empty-state">
                <Gift size={36} />
                <h3>No contributions found in this filter</h3>
                <p>When guests submit gift transfer forms on the wishlist page, they will appear here for verification.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Contributor / Family</th>
                      <th>Target Gift Item</th>
                      <th>Amount</th>
                      <th>Transfer Reference</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContributions.map((contrib) => {
                      const isPending = contrib.status === 'pending'
                      const isConfirmed = contrib.status === 'confirmed'

                      return (
                        <tr key={contrib.id} className={isPending ? 'pending-row' : ''}>
                          <td>
                            <div className="guest-name-cell">
                              <strong className="guest-main-name">{contrib.contributorName}</strong>
                              {contrib.contributorPhone && (
                                <span className="phone-text">📞 {contrib.contributorPhone}</span>
                              )}
                              {contrib.customNote && (
                                <span className="note-text" title={contrib.customNote}>
                                  💬 &quot;{contrib.customNote}&quot;
                                </span>
                              )}
                            </div>
                          </td>

                          <td>
                            <strong>{contrib.giftTitle}</strong>
                          </td>

                          <td>
                            <strong className="text-burgundy" style={{ fontSize: '15px' }}>
                              ₦{contrib.amount.toLocaleString()}
                            </strong>
                          </td>

                          <td>
                            <code className="font-mono ref-code-badge">{contrib.paymentReference}</code>
                          </td>

                          <td>
                            {isPending ? (
                              <span className="status-badge pending-status">⏳ Pending Review</span>
                            ) : isConfirmed ? (
                              <span className="status-badge confirmed">✓ Confirmed</span>
                            ) : (
                              <span className="status-badge declined-status">✕ Declined</span>
                            )}
                          </td>

                          <td style={{ fontSize: '12px', color: '#7A6F64' }}>
                            {contrib.createdAt ? new Date(contrib.createdAt).toLocaleDateString() : 'Recent'}
                          </td>

                          <td>
                            <div className="action-buttons-cell">
                              {isPending && (
                                <>
                                  <button
                                    type="button"
                                    className="btn-confirm-transfer"
                                    onClick={() => handleConfirmGift(contrib.id)}
                                    disabled={confirmingContribId === contrib.id}
                                    title="Confirm payment received & credit progress"
                                  >
                                    <CheckCheck size={14} />
                                    <span>{confirmingContribId === contrib.id ? 'Confirming...' : 'Confirm'}</span>
                                  </button>

                                  <button
                                    type="button"
                                    className="btn-decline-transfer"
                                    onClick={() => handleDeclineGift(contrib.id)}
                                    disabled={decliningContribId === contrib.id}
                                    title="Decline transfer"
                                  >
                                    <X size={14} />
                                  </button>
                                </>
                              )}

                              {isConfirmed && (
                                <span className="text-green" style={{ fontSize: '12px', fontWeight: 600 }}>
                                  ✓ Credited
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Live Gift Items Status Cards */}
          <div className="gift-items-admin-section" style={{ marginTop: '36px' }}>
            <div style={{ marginBottom: '18px' }}>
              <span className="eyebrow">Registry Catalog</span>
              <h3 style={{ margin: '4px 0 0', fontSize: '20px', color: '#3D101C' }}>
                Live Registry Items &amp; Funding Progress
              </h3>
            </div>

            <div className="admin-gift-cards-grid">
              {giftItems.map((gift) => {
                const pct = Math.min(100, Math.round((gift.contributedAmount / gift.numericPrice) * 100))
                const isComplete = gift.isFullyGifted || pct >= 100

                return (
                  <div key={gift.id} className="admin-gift-item-card">
                    <div className="admin-gift-card-top">
                      <img src={gift.image} alt={gift.title} className="admin-gift-card-img" />
                      <span className={`admin-gift-card-badge ${isComplete ? 'funded' : ''}`}>
                        {isComplete ? '✓ Fully Funded' : `${pct}% Funded`}
                      </span>
                    </div>

                    <div className="admin-gift-card-body">
                      <h4 className="admin-gift-card-title">{gift.title}</h4>
                      <div className="admin-gift-card-pricing">
                        <span>Goal: <strong>{gift.price}</strong></span>
                        <span>Raised: <strong className="text-burgundy">₦{gift.contributedAmount.toLocaleString()}</strong></span>
                      </div>
                      <div className="fund-progress-track">
                        <div
                          className="fund-progress-fill"
                          style={{ width: `${pct}%`, background: isComplete ? '#2F634A' : '#4A1525' }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* =======================================================================
          MODAL: APPROVE RSVP & TABLE ASSIGNMENT
          ======================================================================= */}
      {approvingInvite && mounted && createPortal(
        <div className="gift-modal-backdrop" onClick={() => setApprovingInvite(null)}>
          <div
            className="gift-modal admin-create-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            style={{ maxWidth: '520px' }}
          >
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setApprovingInvite(null)}
            >
              ✕
            </button>

            <div className="modal-header-admin">
              <span className="eyebrow">Guest Approval</span>
              <h2>Approve &amp; Assign Table</h2>
              <p>
                Confirming reservation for <strong>{approvingInvite.guestName || approvingInvite.targetName}</strong>.
              </p>
            </div>

            <div className="modal-body-admin">
              <div className="form-group-admin">
                <label>Assigned Table *</label>
                <select
                  value={assignedTable}
                  onChange={(e) => setAssignedTable(e.target.value)}
                  className="admin-select"
                >
                  <option value="Table 01 - Emerald VIP">Table 01 - Emerald VIP</option>
                  <option value="Table 02 - Royal Gold">Table 02 - Royal Gold</option>
                  <option value="Table 03 - Sapphire">Table 03 - Sapphire</option>
                  <option value="Table 04 - Ruby VIP">Table 04 - Ruby VIP</option>
                  <option value="Table 05 - Diamond">Table 05 - Diamond</option>
                  <option value="Table 06 - Pearl">Table 06 - Pearl</option>
                  <option value="Table 07 - Crystal">Table 07 - Crystal</option>
                  <option value="Table 08 - Opal">Table 08 - Opal</option>
                  <option value="Table 09 - Velvet Wine">Table 09 - Velvet Wine</option>
                  <option value="Table 10 - Champagne">Table 10 - Champagne</option>
                  <option value="Table 11 - Rose Gold">Table 11 - Rose Gold</option>
                  <option value="Table 12 - Ivory Grand">Table 12 - Ivory Grand</option>
                </select>
              </div>

              <div className="grid-2-col" style={{ marginTop: '12px' }}>
                <div className="form-group-admin">
                  <label>Max Seats Allowed</label>
                  <input
                    type="number"
                    min={1}
                    max={4}
                    value={assignedMaxGuests}
                    onChange={(e) => setAssignedMaxGuests(Number(e.target.value) || 1)}
                    className="admin-input"
                  />
                </div>

                <div className="form-group-admin">
                  <label>Category</label>
                  <select
                    value={assignedCategory}
                    onChange={(e) => setAssignedCategory(e.target.value as Invite['category'])}
                    className="admin-select"
                  >
                    <option value="General">General</option>
                    <option value="VIP">VIP</option>
                    <option value="Family">Family</option>
                    <option value="Friends">Friends</option>
                    <option value="Colleagues">Colleagues</option>
                  </select>
                </div>
              </div>

              {(approvingInvite.guestEmail || approvingInvite.targetEmail) && (
                <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="sendPassCheck"
                    checked={sendPassEmailOnApprove}
                    onChange={(e) => setSendPassEmailOnApprove(e.target.checked)}
                  />
                  <label htmlFor="sendPassCheck" style={{ fontSize: '13px', color: '#3D101C', cursor: 'pointer' }}>
                    Email official Digital Access Card to <strong>{approvingInvite.guestEmail || approvingInvite.targetEmail}</strong>
                  </label>
                </div>
              )}

              <div className="modal-footer-admin" style={{ marginTop: '22px' }}>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setApprovingInvite(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-primary-burgundy"
                  onClick={handleConfirmApprove}
                >
                  Confirm &amp; Issue Pass →
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* =======================================================================
          MODAL: CREATE INVITATIONS (DIRECT / BARE / BATCH)
          ======================================================================= */}
      {showCreateModal && mounted && createPortal(
        <div className="gift-modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div
            className="gift-modal admin-create-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            style={{ maxWidth: '580px' }}
          >
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setShowCreateModal(false)}
            >
              ✕
            </button>

            <div className="modal-header-admin">
              <span className="eyebrow">Guest Creator</span>
              <h2>Generate Invitations</h2>
              <div className="creator-mode-tabs" style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  className={`mgmt-pill ${createMode === 'email_direct' ? 'active' : ''}`}
                  onClick={() => setCreateMode('email_direct')}
                >
                  Direct Email Invite
                </button>
                <button
                  type="button"
                  className={`mgmt-pill ${createMode === 'bare' ? 'active' : ''}`}
                  onClick={() => setCreateMode('bare')}
                >
                  Batch Multi-Links
                </button>
              </div>
            </div>

            <div className="modal-body-admin" style={{ marginTop: '16px' }}>
              {createMode === 'email_direct' && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault()
                    setIsSubmittingForm(true)
                    try {
                      const res = await fetch('/api/admin/send-invite', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          ...emailInviteForm,
                          sendEmailNow: Boolean(emailInviteForm.targetEmail),
                        }),
                      })
                      const data = await res.json()
                      if (res.ok && data.success) {
                        showToast(data.message || 'Invitation created!', 'success')
                        setShowCreateModal(false)
                        setEmailInviteForm({
                          targetName: '',
                          targetEmail: '',
                          maxGuests: 2,
                          tableNumber: '',
                          category: 'General',
                          customNote: '',
                        })
                        loadDashboardData()
                      } else {
                        showToast(data.error || 'Failed to create invite', 'error')
                      }
                    } catch {
                      showToast('Error creating invite', 'error')
                    } finally {
                      setIsSubmittingForm(false)
                    }
                  }}
                >
                  <div className="form-group-admin">
                    <label>Guest / Family Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Chief &amp; Mrs. John Okafor"
                      value={emailInviteForm.targetName}
                      onChange={(e) => setEmailInviteForm({ ...emailInviteForm, targetName: e.target.value })}
                      className="admin-input"
                      required
                    />
                  </div>

                  <div className="form-group-admin" style={{ marginTop: '10px' }}>
                    <label>Guest Email (Optional for direct link delivery)</label>
                    <input
                      type="email"
                      placeholder="e.g. okafor@example.com"
                      value={emailInviteForm.targetEmail}
                      onChange={(e) => setEmailInviteForm({ ...emailInviteForm, targetEmail: e.target.value })}
                      className="admin-input"
                    />
                  </div>

                  <div className="grid-2-col" style={{ marginTop: '10px' }}>
                    <div className="form-group-admin">
                      <label>Max Seats</label>
                      <input
                        type="number"
                        min={1}
                        max={4}
                        value={emailInviteForm.maxGuests}
                        onChange={(e) => setEmailInviteForm({ ...emailInviteForm, maxGuests: Number(e.target.value) || 1 })}
                        className="admin-input"
                      />
                    </div>

                    <div className="form-group-admin">
                      <label>Category</label>
                      <select
                        value={emailInviteForm.category}
                        onChange={(e) => setEmailInviteForm({ ...emailInviteForm, category: e.target.value as Invite['category'] })}
                        className="admin-select"
                      >
                        <option value="General">General</option>
                        <option value="VIP">VIP</option>
                        <option value="Family">Family</option>
                        <option value="Friends">Friends</option>
                        <option value="Colleagues">Colleagues</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group-admin" style={{ marginTop: '10px' }}>
                    <label>Personal Note / Greeting</label>
                    <textarea
                      rows={2}
                      placeholder="We warmly invite you to celebrate our holy matrimony!"
                      value={emailInviteForm.customNote}
                      onChange={(e) => setEmailInviteForm({ ...emailInviteForm, customNote: e.target.value })}
                      className="admin-textarea"
                    />
                  </div>

                  <div className="modal-footer-admin" style={{ marginTop: '20px' }}>
                    <button type="button" className="btn-cancel" onClick={() => setShowCreateModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary-burgundy" disabled={isSubmittingForm}>
                      {isSubmittingForm ? 'Creating...' : 'Create & Save to DB →'}
                    </button>
                  </div>
                </form>
              )}

              {createMode === 'bare' && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault()
                    setIsSubmittingForm(true)
                    try {
                      const res = await fetch('/api/invites', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          count: bareCount,
                          maxGuests: bareSeats,
                          category: bareCategory,
                        }),
                      })
                      const data = await res.json()
                      if (res.ok && data.success) {
                        showToast(`✓ Generated ${bareCount} new invitation links!`, 'success')
                        setShowCreateModal(false)
                        loadDashboardData()
                      } else {
                        showToast(data.error || 'Failed to generate batch', 'error')
                      }
                    } catch {
                      showToast('Error generating batch links', 'error')
                    } finally {
                      setIsSubmittingForm(false)
                    }
                  }}
                >
                  <div className="form-group-admin">
                    <label>Number of Bare Links to Generate</label>
                    <input
                      type="number"
                      min={1}
                      max={25}
                      value={bareCount}
                      onChange={(e) => setBareCount(Number(e.target.value) || 1)}
                      className="admin-input"
                      required
                    />
                  </div>

                  <div className="grid-2-col" style={{ marginTop: '10px' }}>
                    <div className="form-group-admin">
                      <label>Seats per Link</label>
                      <input
                        type="number"
                        min={1}
                        max={4}
                        value={bareSeats}
                        onChange={(e) => setBareSeats(Number(e.target.value) || 1)}
                        className="admin-input"
                      />
                    </div>

                    <div className="form-group-admin">
                      <label>Category</label>
                      <select
                        value={bareCategory}
                        onChange={(e) => setBareCategory(e.target.value as Invite['category'])}
                        className="admin-select"
                      >
                        <option value="General">General</option>
                        <option value="VIP">VIP</option>
                        <option value="Family">Family</option>
                        <option value="Friends">Friends</option>
                        <option value="Colleagues">Colleagues</option>
                      </select>
                    </div>
                  </div>

                  <div className="modal-footer-admin" style={{ marginTop: '20px' }}>
                    <button type="button" className="btn-cancel" onClick={() => setShowCreateModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary-burgundy" disabled={isSubmittingForm}>
                      {isSubmittingForm ? 'Generating...' : `Generate ${bareCount} Links →`}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* =======================================================================
          MODAL: EDIT GUEST DETAILS
          ======================================================================= */}
      {editingInvite && mounted && createPortal(
        <div className="gift-modal-backdrop" onClick={() => setEditingInvite(null)}>
          <div
            className="gift-modal admin-create-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            style={{ maxWidth: '520px' }}
          >
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setEditingInvite(null)}
            >
              ✕
            </button>

            <div className="modal-header-admin">
              <span className="eyebrow">Edit Database Record</span>
              <h2>Modify Guest: {editingInvite.code}</h2>
            </div>

            <form onSubmit={handleSaveEdit} className="modal-body-admin" style={{ marginTop: '14px' }}>
              <div className="form-group-admin">
                <label>Guest / Target Name</label>
                <input
                  type="text"
                  value={editingInvite.guestName || editingInvite.targetName || ''}
                  onChange={(e) => setEditingInvite({ ...editingInvite, guestName: e.target.value, targetName: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div className="grid-2-col" style={{ marginTop: '10px' }}>
                <div className="form-group-admin">
                  <label>Email</label>
                  <input
                    type="email"
                    value={editingInvite.guestEmail || editingInvite.targetEmail || ''}
                    onChange={(e) => setEditingInvite({ ...editingInvite, guestEmail: e.target.value, targetEmail: e.target.value })}
                    className="admin-input"
                  />
                </div>

                <div className="form-group-admin">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={editingInvite.guestPhone || ''}
                    onChange={(e) => setEditingInvite({ ...editingInvite, guestPhone: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="grid-2-col" style={{ marginTop: '10px' }}>
                <div className="form-group-admin">
                  <label>Table Number</label>
                  <input
                    type="text"
                    value={editingInvite.tableNumber || ''}
                    onChange={(e) => setEditingInvite({ ...editingInvite, tableNumber: e.target.value })}
                    className="admin-input"
                  />
                </div>

                <div className="form-group-admin">
                  <label>Category</label>
                  <select
                    value={editingInvite.category || 'General'}
                    onChange={(e) => setEditingInvite({ ...editingInvite, category: e.target.value as Invite['category'] })}
                    className="admin-select"
                  >
                    <option value="General">General</option>
                    <option value="VIP">VIP</option>
                    <option value="Family">Family</option>
                    <option value="Friends">Friends</option>
                    <option value="Colleagues">Colleagues</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer-admin" style={{ marginTop: '20px' }}>
                <button type="button" className="btn-cancel" onClick={() => setEditingInvite(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-burgundy">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* =======================================================================
          MODAL: DIGITAL WEDDING PASS PREVIEW
          ======================================================================= */}
      {previewInvite && mounted && createPortal(
        <div className="gift-modal-backdrop" onClick={() => setPreviewInvite(null)}>
          <div
            className="gift-modal access-pass-preview-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            style={{ maxWidth: '620px', background: 'transparent', boxShadow: 'none', border: 'none' }}
          >
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setPreviewInvite(null)}
              style={{ background: '#FFFFFF', color: '#191919' }}
            >
              ✕
            </button>

            <AccessCardPass invite={previewInvite} />
          </div>
        </div>,
        document.body
      )}
    </main>
  )
}
