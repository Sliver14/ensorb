'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Invite, AdminStats, CreateInviteInput } from '@/lib/types'
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
  QrCode,
  RefreshCw,
  LogOut,
  Lock,
  CloudUpload,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileSpreadsheet,
  Zap,
} from 'lucide-react'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [pinInput, setPinInput] = useState('')
  const [authError, setAuthError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Integrations status
  const [cloudinaryStatus, setCloudinaryStatus] = useState(false)
  const [emailStatus, setEmailStatus] = useState(false)

  // Dashboard Data
  const [invites, setInvites] = useState<Invite[]>([])
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null)

  // Modals & UI States
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createMode, setCreateMode] = useState<'bare' | 'batch' | 'custom'>('bare')
  const [editingInvite, setEditingInvite] = useState<Invite | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'registered' | 'pending' | 'declined' | 'vip' | 'checkedin'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [quickCheckInCode, setQuickCheckInCode] = useState('')

  // Bare Link Generator state
  const [bareCount, setBareCount] = useState<number>(1)
  const [bareSeats, setBareSeats] = useState<number>(2)
  const [bareCategory, setBareCategory] = useState<'VIP' | 'Family' | 'Friends' | 'Colleagues' | 'General'>('General')

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

  // Show temporary toast notification
  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type })
    setTimeout(() => setToastMessage(null), 4500)
  }

  // Check auth on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/check')
        const data = await res.json()
        if (data.authenticated) {
          setIsAuthenticated(true)
          setCloudinaryStatus(data.cloudinaryConfigured)
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

  // Load all invites and stats
  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/invites')
      const data = await res.json()
      if (res.ok && data.success) {
        setInvites(data.invites)
        setStats(data.stats)
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
      showToast('Error loading invites data', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Login
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
        loadDashboardData()
        showToast('Welcome to the Couple & Admin Dashboard!', 'success')
      } else {
        setAuthError(data.error || 'Incorrect passcode')
      }
    } catch {
      setAuthError('Connection error during login')
    } finally {
      setIsLoggingIn(false)
    }
  }

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/check', { method: 'DELETE' })
      setIsAuthenticated(false)
      setPinInput('')
      showToast('Logged out successfully', 'info')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  // 1-Click Instant Bare Link Generator & Copy
  const handleQuickBareLink = async () => {
    setIsQuickGenerating(true)
    try {
      const res = await fetch('/api/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maxGuests: 2, category: 'General' }),
      })
      const data = await res.json()

      if (res.ok && data.success && data.invite) {
        setInvites((prev) => [data.invite, ...prev])
        if (data.stats) setStats(data.stats)
        const url = `${window.location.origin}/invite/${data.invite.code}`
        if (typeof window !== 'undefined' && navigator.clipboard) {
          navigator.clipboard.writeText(url)
        }
        setCopiedCode(data.invite.code)
        showToast(`⚡ Bare invite generated & copied: ${url} (Table: ${data.invite.tableNumber})`, 'success')
        setTimeout(() => setCopiedCode(null), 3000)
      } else {
        showToast(data.error || 'Failed to generate link', 'error')
      }
    } catch {
      showToast('Network error while generating link', 'error')
    } finally {
      setIsQuickGenerating(false)
    }
  }

  // Handle Bare Link Generation (Single or Multiple)
  const handleCreateBareModal = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingForm(true)

    try {
      const res = await fetch('/api/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          count: bareCount,
          maxGuests: Number(bareSeats) || 2,
          category: bareCategory,
        }),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        if (data.invites) {
          setInvites((prev) => [...data.invites, ...prev])
          showToast(`⚡ Generated ${data.count} bare invite links with auto-assigned tables!`, 'success')
        } else if (data.invite) {
          setInvites((prev) => [data.invite, ...prev])
          const url = `${window.location.origin}/invite/${data.invite.code}`
          if (typeof window !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(url)
          }
          showToast(`⚡ Generated & Copied Invite Link: ${url}`, 'success')
        }
        if (data.stats) setStats(data.stats)
        setShowCreateModal(false)
      } else {
        showToast(data.error || 'Failed to generate links', 'error')
      }
    } catch {
      showToast('Network error while generating links', 'error')
    } finally {
      setIsSubmittingForm(false)
    }
  }

  // Handle Custom Invite Creation
  const handleCreateCustom = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingForm(true)

    try {
      const res = await fetch('/api/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customForm),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setInvites((prev) => [data.invite, ...prev])
        if (data.stats) setStats(data.stats)
        setShowCreateModal(false)
        const url = `${window.location.origin}/invite/${data.invite.code}`
        if (typeof window !== 'undefined' && navigator.clipboard) {
          navigator.clipboard.writeText(url)
        }
        showToast(`Invite created & link copied: ${url}`, 'success')
        setCustomForm({
          targetName: '',
          maxGuests: 2,
          tableNumber: '',
          category: 'VIP',
          customNote: '',
          customCode: '',
        })
      } else {
        showToast(data.error || 'Failed to create invite', 'error')
      }
    } catch {
      showToast('Network error while creating invite', 'error')
    } finally {
      setIsSubmittingForm(false)
    }
  }

  // Handle Batch Names Creation
  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault()
    const names = batchNames
      .split('\n')
      .map((n) => n.trim())
      .filter(Boolean)

    if (names.length === 0) {
      showToast('Please enter at least one guest name.', 'error')
      return
    }

    setIsSubmittingForm(true)
    try {
      const res = await fetch('/api/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          names,
          maxGuests: Number(bareSeats) || 2,
          category: bareCategory,
        }),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setInvites((prev) => [...data.invites, ...prev])
        if (data.stats) setStats(data.stats)
        setShowCreateModal(false)
        setBatchNames('')
        showToast(`Successfully generated ${data.count} unique invite links!`, 'success')
      } else {
        showToast(data.error || 'Batch creation failed', 'error')
      }
    } catch {
      showToast('Network error while generating batch invites', 'error')
    } finally {
      setIsSubmittingForm(false)
    }
  }

  // Handle Update Invite
  const handleUpdateInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingInvite) return

    setIsSubmittingForm(true)
    try {
      const res = await fetch(`/api/invites/${encodeURIComponent(editingInvite.code)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingInvite),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setInvites((prev) =>
          prev.map((inv) => (inv.code === editingInvite.code ? data.invite : inv))
        )
        if (data.stats) setStats(data.stats)
        setEditingInvite(null)
        showToast(`Invite ${editingInvite.code} updated successfully`, 'success')
      } else {
        showToast(data.error || 'Failed to update invite', 'error')
      }
    } catch {
      showToast('Network error while updating invite', 'error')
    } finally {
      setIsSubmittingForm(false)
    }
  }

  // Handle Delete / Revoke Invite
  const handleDeleteInvite = async (code: string) => {
    if (!confirm(`Are you sure you want to revoke and delete invite code "${code}"?`)) {
      return
    }

    try {
      const res = await fetch(`/api/invites/${encodeURIComponent(code)}`, {
        method: 'DELETE',
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setInvites((prev) => prev.filter((inv) => inv.code !== code))
        if (data.stats) setStats(data.stats)
        showToast(`Invite "${code}" has been revoked`, 'info')
      } else {
        showToast(data.error || 'Failed to revoke invite', 'error')
      }
    } catch {
      showToast('Error revoking invite', 'error')
    }
  }

  // Handle Resend Pass Email from Admin
  const handleResendFromAdmin = async (invite: Invite) => {
    if (!invite.isRegistered || !invite.guestEmail) {
      showToast('Cannot resend: this invite is not yet registered with an email', 'error')
      return
    }

    showToast(`Sending pass to ${invite.guestEmail}...`, 'info')
    try {
      const res = await fetch(`/api/invites/${encodeURIComponent(invite.code)}/resend`, {
        method: 'POST',
      })
      const data = await res.json()

      if (res.ok && data.success) {
        showToast(`✓ Pass sent to ${invite.guestEmail}`, 'success')
        setInvites((prev) =>
          prev.map((inv) =>
            inv.code === invite.code ? { ...inv, emailSent: true, emailSentAt: new Date().toISOString() } : inv
          )
        )
      } else {
        showToast(data.error || 'Failed to resend email', 'error')
      }
    } catch {
      showToast('Network error while resending email', 'error')
    }
  }

  // Handle Door Check-In Toggle
  const handleToggleCheckIn = async (code: string) => {
    try {
      const res = await fetch(`/api/invites/${encodeURIComponent(code)}/checkin`, {
        method: 'POST',
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setInvites((prev) =>
          prev.map((inv) => (inv.code === code ? data.invite : inv))
        )
        if (data.stats) setStats(data.stats)
        showToast(
          data.checkedIn ? `✓ ${data.invite.guestName || code} Checked-In!` : `Check-in reverted for ${code}`,
          'success'
        )
      }
    } catch {
      showToast('Error toggling check-in', 'error')
    }
  }

  // Quick Check-in by Search Code
  const handleQuickCheckIn = (e: React.FormEvent) => {
    e.preventDefault()
    const query = quickCheckInCode.trim().toUpperCase()
    if (!query) return

    const target = invites.find(
      (inv) => inv.code.toUpperCase() === query || inv.passId?.toUpperCase() === query
    )

    if (!target) {
      showToast(`No invite found matching code "${quickCheckInCode}"`, 'error')
      return
    }

    handleToggleCheckIn(target.code)
    setQuickCheckInCode('')
  }

  // Copy unique invite link
  const copyInviteLink = (code: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      const url = `${window.location.origin}/invite/${code}`
      navigator.clipboard.writeText(url)
      setCopiedCode(code)
      showToast(`Link copied: ${url}`, 'success')
      setTimeout(() => setCopiedCode(null), 2500)
    }
  }

  // Export to CSV
  const handleExportCsv = () => {
    if (invites.length === 0) {
      showToast('No invite data to export', 'info')
      return
    }

    const headers = [
      'Code',
      'Invite Link',
      'Assigned Table',
      'Max Seats',
      'Status',
      'Registered Guest Name',
      'Email',
      'Phone',
      'Attendance',
      'Actual Seats',
      'Pass ID',
      'Checked In',
      'Dietary/Notes',
      'Created Date',
      'Registered Date',
    ]

    const siteOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://ensorb.com'

    const rows = invites.map((inv) => [
      `"${inv.code}"`,
      `"${siteOrigin}/invite/${inv.code}"`,
      `"${inv.tableNumber || ''}"`,
      inv.maxGuests || 2,
      inv.isRegistered ? (inv.attendance === 'declined' ? 'Declined' : 'Registered') : 'Pending',
      `"${inv.guestName || inv.targetName || ''}"`,
      `"${inv.guestEmail || ''}"`,
      `"${inv.guestPhone || ''}"`,
      `"${inv.attendance || ''}"`,
      inv.actualGuestCount || '',
      `"${inv.passId || ''}"`,
      inv.checkedIn ? 'YES' : 'NO',
      `"${(inv.dietaryOrNotes || '').replace(/"/g, '""')}"`,
      `"${inv.createdAt ? new Date(inv.createdAt).toLocaleDateString('en-GB') : ''}"`,
      `"${inv.registeredAt ? new Date(inv.registeredAt).toLocaleDateString('en-GB') : ''}"`,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `ensorb_wedding_guest_list_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Guest list exported to CSV!', 'success')
  }

  // Copy all registered emails
  const handleCopyRegisteredEmails = () => {
    const emails = invites
      .filter((inv) => inv.isRegistered && inv.guestEmail && inv.attendance === 'attending')
      .map((inv) => inv.guestEmail)
      .join(', ')

    if (!emails) {
      showToast('No registered attendee emails found yet.', 'info')
      return
    }

    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(emails)
      showToast(`Copied ${emails.split(',').length} attendee emails to clipboard!`, 'success')
    }
  }

  // Filtered Invites List
  const filteredInvites = useMemo(() => {
    return invites.filter((inv) => {
      // Tab filter
      if (activeTab === 'registered' && (!inv.isRegistered || inv.attendance === 'declined')) return false
      if (activeTab === 'pending' && inv.isRegistered) return false
      if (activeTab === 'declined' && inv.attendance !== 'declined') return false
      if (activeTab === 'vip' && inv.category !== 'VIP') return false
      if (activeTab === 'checkedin' && !inv.checkedIn) return false

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchName = (inv.targetName || '').toLowerCase().includes(q)
        const matchGuest = (inv.guestName || '').toLowerCase().includes(q)
        const matchEmail = (inv.guestEmail || '').toLowerCase().includes(q)
        const matchPhone = (inv.guestPhone || '').toLowerCase().includes(q)
        const matchCode = (inv.code || '').toLowerCase().includes(q)
        const matchTable = (inv.tableNumber || '').toLowerCase().includes(q)
        const matchPass = (inv.passId || '').toLowerCase().includes(q)
        return matchName || matchGuest || matchEmail || matchPhone || matchCode || matchTable || matchPass
      }

      return true
    })
  }, [invites, activeTab, searchQuery])

  // If checking authentication
  if (isAuthenticated === null) {
    return (
      <main className="wedding-site admin-dashboard-page">
        <header className="admin-custom-topbar">
          <div className="admin-topbar-brand">
            <Link href="/" className="admin-brand-link" title="Visit Public Site">
              <img src="/logo.png" alt="ENSORB" className="admin-brand-logo" />
              <span className="admin-brand-name">ENSORB</span>
              <span className="admin-brand-badge">ADMIN</span>
            </Link>
          </div>
        </header>
        <div className="admin-loading-screen">
          <div className="loading-spinner" />
          <p>Verifying admin credentials...</p>
        </div>
      </main>
    )
  }

  // If not authenticated, render Couple PIN Login Screen
  if (!isAuthenticated) {
    return (
      <main className="wedding-site admin-dashboard-page">
        <header className="admin-custom-topbar">
          <div className="admin-topbar-brand">
            <Link href="/" className="admin-brand-link" title="Visit Public Site">
              <img src="/logo.png" alt="ENSORB" className="admin-brand-logo" />
              <span className="admin-brand-name">ENSORB</span>
              <span className="admin-brand-badge">ADMIN</span>
            </Link>
          </div>
          <div className="admin-topbar-right">
            <Link href="/" className="admin-back-site-link">
              <span>View Public Website</span>
              <ExternalLink size={14} />
            </Link>
          </div>
        </header>

        <section className="subpage-hero section-shell admin-portal-hero">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <strong>Admin Portal</strong>
          </div>
          <p className="eyebrow">Couple &amp; Planner Access</p>
          <h1>Wedding Admin Dashboard</h1>
          <p className="subpage-hero-desc">
            Please enter your wedding access passcode to manage guest invitations, generate unique links, and oversee RSVPs.
          </p>
        </section>

        <section className="admin-login-section section-shell">
          <div className="admin-login-card">
            <div className="login-icon-ring">
              <Lock size={32} />
            </div>
            <h2>Couple / Admin Login</h2>
            <p className="login-hint">Enter your designated wedding management PIN.</p>

            <form onSubmit={handleLogin} className="admin-login-form">
              {authError && (
                <div className="invite-alert-banner error">
                  <AlertCircle size={18} />
                  <span>{authError}</span>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="pin">Wedding Passcode</label>
                <input
                  id="pin"
                  type="password"
                  required
                  placeholder="Enter passcode (e.g. ensorb2026)"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="admin-login-btn"
                disabled={isLoggingIn || !pinInput.trim()}
              >
                {isLoggingIn ? 'Verifying...' : 'Unlock Dashboard ↗'}
              </button>
            </form>
          </div>
        </section>

        <footer className="admin-custom-footer">
          <p>© 2026 Ngozi Emele Kalu &amp; Sorbari Godwin Uebari • Private Couple &amp; Admin Dashboard</p>
        </footer>
      </main>
    )
  }

  // =========================================================================
  // AUTHENTICATED DASHBOARD VIEW
  // =========================================================================
  return (
    <main className="wedding-site admin-dashboard-page">
      {/* Custom Sleek Admin Topbar */}
      <header className="admin-custom-topbar">
        <div className="admin-topbar-brand">
          <Link href="/" className="admin-brand-link" title="Visit Public Site">
            <img src="/logo.png" alt="ENSORB" className="admin-brand-logo" />
            <span className="admin-brand-name">ENSORB</span>
            <span className="admin-brand-badge">ADMIN</span>
          </Link>
        </div>
        <div className="admin-topbar-right">
          <span className="admin-topbar-date">Wedding: Sat, Oct 31, 2026</span>
          <Link href="/" className="admin-back-site-link">
            <span>View Public Website</span>
            <ExternalLink size={14} />
          </Link>
          <button
            type="button"
            className="admin-topbar-logout"
            onClick={handleLogout}
            title="Log out of admin"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className={`admin-toast-banner ${toastMessage.type}`}>
          {toastMessage.type === 'success' ? (
            <CheckCircle2 size={18} />
          ) : toastMessage.type === 'error' ? (
            <XCircle size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Admin Dashboard Header */}
      <section className="admin-hero-section section-shell">
        <div className="admin-header-flex">
          <div>
            <div className="admin-badge-row">
              <span className="admin-pill">COUPLE &amp; ADMIN PORTAL</span>
              <span className="admin-couple-name">Ngozi &amp; Sorbari Wedding</span>
            </div>
            <h1>Invites &amp; Guest Management</h1>
            <p className="admin-subtitle">
              Generate bare invite links in 1 click with automatically assigned tables. Guests fill in their own details upon receiving the link.
            </p>
          </div>

          <div className="admin-header-actions">
            {/* 1-Click Bare Link Quick Generator */}
            <button
              type="button"
              className="admin-quick-bare-btn"
              onClick={handleQuickBareLink}
              disabled={isQuickGenerating}
              title="Generate a fresh bare invite link with auto-assigned table and copy URL"
            >
              <Zap size={18} className="zap-icon" />
              <span>{isQuickGenerating ? 'Generating...' : '⚡ Quick Generate & Copy Link'}</span>
            </button>

            {/* Modal Generator for batch / multi links */}
            <button
              type="button"
              className="admin-primary-btn"
              onClick={() => {
                setCreateMode('bare')
                setShowCreateModal(true)
              }}
            >
              <Plus size={18} />
              <span>Multi-Link Generator</span>
            </button>
          </div>
        </div>

        {/* Integration Status Bar */}
        <div className="admin-status-ribbon">
          <div className="status-item">
            <CloudUpload size={16} className={cloudinaryStatus ? 'text-green' : 'text-amber'} />
            <span>
              Cloudinary Media: <strong>{cloudinaryStatus ? 'Active & Connected' : 'Local Fallback Mode'}</strong>
            </span>
          </div>
          <div className="status-item">
            <Mail size={16} className={emailStatus ? 'text-green' : 'text-amber'} />
            <span>
              Pass Email Service: <strong>{emailStatus ? 'Resend API Active' : 'Simulated Logger Ready'}</strong>
            </span>
          </div>
          <button
            type="button"
            className="refresh-btn"
            onClick={loadDashboardData}
            title="Refresh data"
          >
            <RefreshCw size={14} className={isLoading ? 'spinning' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </section>

      {/* Metrics & KPI Cards */}
      <section className="admin-stats-grid section-shell">
        <div className="stat-card">
          <div className="stat-icon-box gold">
            <Users size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Links Generated</span>
            <strong className="stat-val">{stats?.totalInvites || invites.length}</strong>
            <span className="stat-sub">{stats?.totalSeatsAllocated || 0} seats allocated</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box green">
            <UserCheck size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Registered Attendees</span>
            <strong className="stat-val">{stats?.attendingCount || 0}</strong>
            <span className="stat-sub">{stats?.totalGuestsAttending || 0} confirmed guests</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box amber">
            <Clock size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Unfilled / Pending Links</span>
            <strong className="stat-val">{stats?.pendingCount || 0}</strong>
            <span className="stat-sub">Ready to send to guests</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box purple">
            <QrCode size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Door Check-Ins</span>
            <strong className="stat-val">{stats?.checkedInCount || 0}</strong>
            <span className="stat-sub">Admitted at venue</span>
          </div>
        </div>
      </section>

      {/* Main Table & Management Area */}
      <section className="admin-management-section section-shell">
        <div className="admin-controls-card">
          {/* Quick Check-in / Entrance Scanner Bar */}
          <div className="quick-checkin-wrap">
            <form onSubmit={handleQuickCheckIn} className="quick-checkin-form">
              <QrCode size={18} className="qr-icon" />
              <input
                type="text"
                placeholder="Door Entrance Scanner: Scan or type Pass ID / Invite Code..."
                value={quickCheckInCode}
                onChange={(e) => setQuickCheckInCode(e.target.value)}
              />
              <button type="submit" className="quick-checkin-btn">
                Verify Check-In ↗
              </button>
            </form>
          </div>

          {/* Search, Tabs, and Bulk Export Tools */}
          <div className="table-filter-bar">
            {/* Filter Tabs */}
            <div className="filter-tabs">
              <button
                type="button"
                className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All Links ({invites.length})
              </button>
              <button
                type="button"
                className={`filter-tab ${activeTab === 'registered' ? 'active' : ''}`}
                onClick={() => setActiveTab('registered')}
              >
                Registered ({stats?.attendingCount || 0})
              </button>
              <button
                type="button"
                className={`filter-tab ${activeTab === 'pending' ? 'active' : ''}`}
                onClick={() => setActiveTab('pending')}
              >
                Pending RSVP ({stats?.pendingCount || 0})
              </button>
              <button
                type="button"
                className={`filter-tab ${activeTab === 'vip' ? 'active' : ''}`}
                onClick={() => setActiveTab('vip')}
              >
                VIP Access
              </button>
              <button
                type="button"
                className={`filter-tab ${activeTab === 'checkedin' ? 'active' : ''}`}
                onClick={() => setActiveTab('checkedin')}
              >
                Checked-In ({stats?.checkedInCount || 0})
              </button>
            </div>

            {/* Actions & Export */}
            <div className="filter-actions-group">
              <div className="search-input-wrap">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search code, table, guest name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="clear-search-btn"
                    onClick={() => setSearchQuery('')}
                  >
                    ✕
                  </button>
                )}
              </div>

              <button
                type="button"
                className="export-tool-btn"
                onClick={handleExportCsv}
                title="Export guest list to CSV spreadsheet"
              >
                <FileSpreadsheet size={16} />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                className="export-tool-btn"
                onClick={handleCopyRegisteredEmails}
                title="Copy all attendee emails"
              >
                <Mail size={16} />
                <span>Copy Emails</span>
              </button>
            </div>
          </div>

          {/* Invites Table View */}
          <div className="admin-table-container">
            {isLoading ? (
              <div className="table-loading-wrap">
                <div className="loading-spinner" />
                <p>Loading invite records...</p>
              </div>
            ) : filteredInvites.length === 0 ? (
              <div className="empty-table-wrap">
                <Users size={40} className="empty-icon" />
                <h3>No Invitations Found</h3>
                <p>
                  {searchQuery
                    ? `No invites match your search for "${searchQuery}".`
                    : 'Click "⚡ Quick Generate & Copy Link" to create your first bare invite.'}
                </p>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Guest / Registered Profile</th>
                    <th>Unique Invite Link (1-Click Copy)</th>
                    <th>Status</th>
                    <th>Auto Table &amp; Seats</th>
                    <th>Guest Contact</th>
                    <th>Pass ID &amp; Email</th>
                    <th>Door Check-In</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvites.map((inv) => {
                    const isRegistered = inv.isRegistered
                    const isDeclined = inv.attendance === 'declined'

                    return (
                      <tr key={inv.id} className={inv.checkedIn ? 'checked-in-row' : ''}>
                        {/* Guest Profile Column */}
                        <td>
                          <div className="guest-cell-profile">
                            {inv.guestPhoto ? (
                              <img
                                src={inv.guestPhoto}
                                alt={inv.guestName || 'Guest'}
                                className="guest-thumb-img"
                              />
                            ) : (
                              <div className="guest-thumb-placeholder">
                                {(inv.guestName || inv.targetName || 'G').charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="guest-names-wrap">
                              {isRegistered ? (
                                <>
                                  <strong className="target-name">{inv.guestName || inv.targetName}</strong>
                                  <span className="registered-sub-name text-green">
                                    ✓ Registered Guest
                                  </span>
                                </>
                              ) : inv.targetName ? (
                                <>
                                  <strong className="target-name">{inv.targetName}</strong>
                                  <span className="registered-sub-name text-amber">
                                    Awaiting Guest Fill
                                  </span>
                                </>
                              ) : (
                                <>
                                  <strong className="target-name bare-tag">⚡ Bare Link</strong>
                                  <span className="registered-sub-name text-muted">
                                    Guest fills details upon receiving
                                  </span>
                                </>
                              )}
                              <span className={`category-tag ${inv.category.toLowerCase()}`}>
                                {inv.category}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Code & 1-Click Copy Link */}
                        <td>
                          <div className="code-cell">
                            <span className="invite-code-pill font-mono">{inv.code}</span>
                            <button
                              type="button"
                              className="copy-url-icon-btn highlight-copy"
                              onClick={() => copyInviteLink(inv.code)}
                              title="Copy full invite URL to send on WhatsApp/SMS"
                            >
                              {copiedCode === inv.code ? (
                                <Check size={14} className="text-green" />
                              ) : (
                                <Copy size={14} />
                              )}
                              <span>{copiedCode === inv.code ? '✓ Link Copied!' : 'Copy Link'}</span>
                            </button>
                          </div>
                        </td>

                        {/* Status Column */}
                        <td>
                          {isRegistered ? (
                            isDeclined ? (
                              <span className="status-badge declined">✕ Declined</span>
                            ) : (
                              <span className="status-badge registered">✓ Registered</span>
                            )
                          ) : (
                            <span className="status-badge pending">⏳ Pending RSVP</span>
                          )}
                        </td>

                        {/* Table & Seats */}
                        <td>
                          <div className="table-seats-cell">
                            <strong className="table-badge auto-table">{inv.tableNumber}</strong>
                            <span className="seat-count">
                              {isRegistered
                                ? `${inv.actualGuestCount || 1} of ${inv.maxGuests} seat(s)`
                                : `${inv.maxGuests} seat(s) allocated`}
                            </span>
                          </div>
                        </td>

                        {/* Contact Details */}
                        <td>
                          {isRegistered ? (
                            <div className="contact-cell">
                              <span className="contact-email">{inv.guestEmail || '—'}</span>
                              <span className="contact-phone">{inv.guestPhone || '—'}</span>
                            </div>
                          ) : (
                            <span className="text-muted">Unfilled by guest</span>
                          )}
                        </td>

                        {/* Pass ID & Email Delivery */}
                        <td>
                          {isRegistered ? (
                            <div className="pass-meta-cell">
                              <span className="pass-id-text font-mono">{inv.passId || '—'}</span>
                              {inv.emailSent ? (
                                <span className="email-sent-badge">✓ Pass Emailed</span>
                              ) : (
                                <span className="email-unsent-badge">Email Pending</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>

                        {/* Check-In Toggle */}
                        <td>
                          <button
                            type="button"
                            className={`checkin-toggle-btn ${inv.checkedIn ? 'checked' : ''}`}
                            onClick={() => handleToggleCheckIn(inv.code)}
                            title={inv.checkedIn ? 'Guest is checked in (Click to revert)' : 'Click to check in guest'}
                          >
                            {inv.checkedIn ? '✓ Admitted' : 'Admit Guest'}
                          </button>
                        </td>

                        {/* Actions */}
                        <td>
                          <div className="row-actions">
                            <Link
                              href={`/invite/${inv.code}`}
                              target="_blank"
                              className="action-icon-link"
                              title="Open Guest Invite Page"
                            >
                              <ExternalLink size={16} />
                            </Link>

                            {isRegistered && (
                              <button
                                type="button"
                                className="action-icon-link"
                                onClick={() => handleResendFromAdmin(inv)}
                                title="Resend digital pass to guest email"
                              >
                                <Mail size={16} />
                              </button>
                            )}

                            <button
                              type="button"
                              className="action-icon-link"
                              onClick={() => setEditingInvite(inv)}
                              title="Edit table number or seats"
                            >
                              <Edit2 size={16} />
                            </button>

                            <button
                              type="button"
                              className="action-icon-link delete"
                              onClick={() => handleDeleteInvite(inv.code)}
                              title="Revoke and delete invite"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          MODAL: MULTI-LINK BARE GENERATOR OR CUSTOM INVITE
          ========================================================================= */}
      {showCreateModal && (
        <div className="gift-modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div
            className="gift-modal admin-create-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              className="modal-close-btn"
              onClick={() => setShowCreateModal(false)}
              aria-label="Close dialog"
            >
              ✕
            </button>

            <div className="modal-header-admin">
              <span className="eyebrow">Invitation Generator</span>
              <h2>Generate Unique Invite Links</h2>
              <p>Create single or batch invite links with automatically assigned wedding tables.</p>

              <div className="create-tabs">
                <button
                  type="button"
                  className={`create-tab-btn ${createMode === 'bare' ? 'active' : ''}`}
                  onClick={() => setCreateMode('bare')}
                >
                  ⚡ Bare Links (1-Click)
                </button>
                <button
                  type="button"
                  className={`create-tab-btn ${createMode === 'batch' ? 'active' : ''}`}
                  onClick={() => setCreateMode('batch')}
                >
                  From Guest Names List
                </button>
                <button
                  type="button"
                  className={`create-tab-btn ${createMode === 'custom' ? 'active' : ''}`}
                  onClick={() => setCreateMode('custom')}
                >
                  Custom Preset Invite
                </button>
              </div>
            </div>

            {createMode === 'bare' ? (
              <form onSubmit={handleCreateBareModal} className="modal-form-admin">
                <div className="bare-generator-info-box">
                  <p>
                    <strong>How bare links work:</strong> Unique invite links are generated with automatic table rotation. You just copy and send the link to each guest — they will enter their full name, email, phone, and upload their photo upon opening the link!
                  </p>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>How many bare links to generate?</label>
                    <select
                      value={bareCount}
                      onChange={(e) => setBareCount(Number(e.target.value))}
                    >
                      <option value="1">1 Bare Link</option>
                      <option value="5">5 Bare Links</option>
                      <option value="10">10 Bare Links</option>
                      <option value="20">20 Bare Links</option>
                      <option value="50">50 Bare Links</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Seats Allowed Per Link</label>
                    <select
                      value={bareSeats}
                      onChange={(e) => setBareSeats(Number(e.target.value))}
                    >
                      <option value="1">1 Seat (Solo Guest)</option>
                      <option value="2">2 Seats (Guest + Plus One)</option>
                      <option value="3">3 Seats</option>
                      <option value="4">4 Seats (Family)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={bareCategory}
                      onChange={(e) =>
                        setBareCategory(e.target.value as 'VIP' | 'Family' | 'Friends' | 'Colleagues' | 'General')
                      }
                    >
                      <option value="General">General</option>
                      <option value="VIP">VIP</option>
                      <option value="Friends">Friends</option>
                      <option value="Family">Family</option>
                      <option value="Colleagues">Colleagues</option>
                    </select>
                  </div>
                </div>

                <div className="modal-actions-admin">
                  <button
                    type="button"
                    className="modal-cancel-btn"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="modal-submit-btn"
                    disabled={isSubmittingForm}
                  >
                    {isSubmittingForm ? 'Generating...' : `Generate ${bareCount} Bare Link(s) ↗`}
                  </button>
                </div>
              </form>
            ) : createMode === 'batch' ? (
              <form onSubmit={handleCreateBatch} className="modal-form-admin">
                <div className="form-group">
                  <label htmlFor="batchNames">
                    Guest Names List <span>* (One name per line)</span>
                  </label>
                  <textarea
                    id="batchNames"
                    rows={6}
                    required
                    placeholder="Pastor & Mrs. Adebayo&#10;Dr. Chioma Nwachukwu&#10;Mr. & Mrs. Tunde Bakare&#10;Senator & Lady Victor..."
                    value={batchNames}
                    onChange={(e) => setBatchNames(e.target.value)}
                  />
                  <small className="field-hint">
                    Each line generates a distinct link with automatically rotating tables!
                  </small>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Seats Per Invite</label>
                    <select
                      value={bareSeats}
                      onChange={(e) => setBareSeats(Number(e.target.value))}
                    >
                      <option value="1">1 Seat (Solo)</option>
                      <option value="2">2 Seats (Plus One)</option>
                      <option value="3">3 Seats</option>
                      <option value="4">4 Seats</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={bareCategory}
                      onChange={(e) =>
                        setBareCategory(e.target.value as 'VIP' | 'Family' | 'Friends' | 'Colleagues' | 'General')
                      }
                    >
                      <option value="General">General</option>
                      <option value="Friends">Friends</option>
                      <option value="Family">Family</option>
                      <option value="VIP">VIP</option>
                      <option value="Colleagues">Colleagues</option>
                    </select>
                  </div>
                </div>

                <div className="modal-actions-admin">
                  <button
                    type="button"
                    className="modal-cancel-btn"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="modal-submit-btn"
                    disabled={isSubmittingForm}
                  >
                    {isSubmittingForm ? 'Batch Generating...' : 'Generate All Invites ↗'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleCreateCustom} className="modal-form-admin">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="targetName">Guest / Family Name (Optional)</label>
                    <input
                      id="targetName"
                      type="text"
                      placeholder="e.g. Chief & Lolo Adeleke (or leave blank for bare link)"
                      value={customForm.targetName}
                      onChange={(e) =>
                        setCustomForm({ ...customForm, targetName: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="maxGuests">Reserved Seats Allowance</label>
                    <select
                      id="maxGuests"
                      value={customForm.maxGuests}
                      onChange={(e) =>
                        setCustomForm({
                          ...customForm,
                          maxGuests: Number(e.target.value),
                        })
                      }
                    >
                      <option value="1">1 Seat (Solo)</option>
                      <option value="2">2 Seats (Plus One)</option>
                      <option value="3">3 Seats</option>
                      <option value="4">4 Seats (Family)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="tableNumber">Assigned Table (Leave blank for auto)</label>
                    <input
                      id="tableNumber"
                      type="text"
                      placeholder="e.g. Table 01 - Emerald VIP (Auto if empty)"
                      value={customForm.tableNumber}
                      onChange={(e) =>
                        setCustomForm({ ...customForm, tableNumber: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      value={customForm.category}
                      onChange={(e) =>
                        setCustomForm({
                          ...customForm,
                          category: e.target.value as CreateInviteInput['category'],
                        })
                      }
                    >
                      <option value="VIP">VIP</option>
                      <option value="Family">Family</option>
                      <option value="Friends">Friends</option>
                      <option value="Colleagues">Colleagues</option>
                      <option value="General">General</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="customCode">Custom Code (Optional)</label>
                    <input
                      id="customCode"
                      type="text"
                      placeholder="e.g. NS-VIP-01"
                      value={customForm.customCode}
                      onChange={(e) =>
                        setCustomForm({ ...customForm, customCode: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="modal-actions-admin">
                  <button
                    type="button"
                    className="modal-cancel-btn"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="modal-submit-btn"
                    disabled={isSubmittingForm}
                  >
                    {isSubmittingForm ? 'Creating...' : 'Create Invite ↗'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: EDIT INVITE DETAILS
          ========================================================================= */}
      {editingInvite && (
        <div className="gift-modal-backdrop" onClick={() => setEditingInvite(null)}>
          <div
            className="gift-modal admin-create-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              className="modal-close-btn"
              onClick={() => setEditingInvite(null)}
              aria-label="Close dialog"
            >
              ✕
            </button>

            <div className="modal-header-admin">
              <span className="eyebrow">Modify Invitation</span>
              <h2>Edit Details for {editingInvite.code}</h2>
              <p>Update assigned table or seats allowance.</p>
            </div>

            <form onSubmit={handleUpdateInvite} className="modal-form-admin">
              <div className="form-grid">
                <div className="form-group">
                  <label>Guest Name</label>
                  <input
                    type="text"
                    placeholder="Guest Name (or empty for bare link)"
                    value={editingInvite.guestName || editingInvite.targetName || ''}
                    onChange={(e) =>
                      setEditingInvite({
                        ...editingInvite,
                        guestName: e.target.value,
                        targetName: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Assigned Table</label>
                  <input
                    type="text"
                    required
                    value={editingInvite.tableNumber}
                    onChange={(e) =>
                      setEditingInvite({ ...editingInvite, tableNumber: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Reserved Seats Allowance</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={editingInvite.maxGuests}
                    onChange={(e) =>
                      setEditingInvite({
                        ...editingInvite,
                        maxGuests: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={editingInvite.category}
                    onChange={(e) =>
                      setEditingInvite({
                        ...editingInvite,
                        category: e.target.value as Invite['category'],
                      })
                    }
                  >
                    <option value="VIP">VIP</option>
                    <option value="Family">Family</option>
                    <option value="Friends">Friends</option>
                    <option value="Colleagues">Colleagues</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions-admin">
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={() => setEditingInvite(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modal-submit-btn"
                  disabled={isSubmittingForm}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="admin-custom-footer">
        <p>© 2026 Ngozi Emele Kalu &amp; Sorbari Godwin Uebari • Confidential Couple &amp; Admin Management Portal</p>
      </footer>
    </main>
  )
}
