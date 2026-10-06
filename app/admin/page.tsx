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
  Send,
  Eye,
  X,
  UserPlus,
  Phone,
  Gift,
  DollarSign,
  CheckCheck,
  TrendingUp,
  Share2,
  MessageCircle,
  AlertTriangle,
  Layers,
  Heart,
  ChevronRight,
} from 'lucide-react'

const WEDDING_TABLE_OPTIONS = [
  'Table 01 - Emerald VIP',
  'Table 02 - Royal Gold',
  'Table 03 - Sapphire',
  'Table 04 - Ruby VIP',
  'Table 05 - Diamond',
  'Table 06 - Pearl',
  'Table 07 - Crystal',
  'Table 08 - Opal',
  'Table 09 - Velvet Wine',
  'Table 10 - Champagne',
  'Table 11 - Rose Gold',
  'Table 12 - Ivory Grand',
]

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
  const [showManualModal, setShowManualModal] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [isResettingData, setIsResettingData] = useState(false)
  const [resetTarget, setResetTarget] = useState<'all' | 'invites' | 'gifts'>('all')

  const [editingInvite, setEditingInvite] = useState<Invite | null>(null)
  const [previewInvite, setPreviewInvite] = useState<Invite | null>(null)
  const [approvingInvite, setApprovingInvite] = useState<Invite | null>(null)
  const [assignedTable, setAssignedTable] = useState('Table 01 - Emerald VIP')
  const [assignedMaxGuests, setAssignedMaxGuests] = useState(2)
  const [assignedCategory, setAssignedCategory] = useState<Invite['category']>('General')
  const [sendPassEmailOnApprove, setSendPassEmailOnApprove] = useState(true)

  const [activeMainTab, setActiveMainTab] = useState<'guests' | 'gifts'>('guests')
  const [guestFilterTab, setGuestFilterTab] = useState<'pending' | 'attending' | 'all' | 'vip' | 'declined'>('pending')
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

  // Manual Add Guest Form
  const [manualGuestForm, setManualGuestForm] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    maxGuests: 2,
    tableNumber: 'Table 01 - Emerald VIP',
    category: 'General' as Invite['category'],
    customNote: '',
    autoApprove: true,
  })

  const [isSubmittingManual, setIsSubmittingManual] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [isCopiedMasterLink, setIsCopiedMasterLink] = useState(false)
  const [originUrl, setOriginUrl] = useState('')
  const [mounted, setMounted] = useState(false)

  // Show temporary toast notification
  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type })
    setTimeout(() => setToastMessage(null), 4500)
  }

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      setOriginUrl(window.location.origin)
    }
  }, [])

  // Master RSVP Link
  const masterRsvpLink = useMemo(() => {
    if (originUrl) return `${originUrl}/rsvp`
    return 'https://ensorb.com/rsvp'
  }, [originUrl])

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

  // Copy helper
  const handleCopyText = (text: string, id?: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
      if (id) {
        setCopiedCode(id)
        setTimeout(() => setCopiedCode(null), 2500)
      } else {
        setIsCopiedMasterLink(true)
        showToast('✓ Link copied to clipboard!', 'success')
        setTimeout(() => setIsCopiedMasterLink(false), 3000)
      }
    }
  }

  // Share to WhatsApp
  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(
      `✨ Warmest Greetings!\n\nYou are cordially invited to celebrate the holy matrimony of Ngozi & Sorbari.\n\n📅 Date: Saturday, November 21, 2026\n\n⛪ Church Ceremony (11:00 AM):\nChrist Embassy Ogba 1\n25 Odusanmi Street, Ogba, Lagos (Landmark: AY Hotel)\n\n🥂 Reception Celebration (1:00 PM):\nCELVZ Youth Church\n24 Sanyaolu Street, Oregun, Ikeja, Lagos\n\n🎨 Dress Color Code:\nBurgundy • Blush Pink • Mint Green • Olive Green\n\n🎟️ Kindly confirm your attendance & RSVP here:\n${masterRsvpLink}\n\nFor inquiries, contact:\nBright: 09066157126 | Faith: 08079071291\n\nWe cannot wait to celebrate with you!`
    )
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank')
  }

  // Handle open approval modal
  const handleOpenApproveModal = (inv: Invite) => {
    setApprovingInvite(inv)
    setAssignedTable(inv.tableNumber || 'Table 01 - Emerald VIP')
    setAssignedMaxGuests(inv.actualGuestCount || inv.maxGuests || 2)
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
    if (!confirm(`Permanently remove reservation for ${inv.guestName || inv.targetName || 'this guest'}?`)) return
    try {
      const res = await fetch(`/api/invites/${inv.id || inv.code}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast('Guest reservation removed from database.', 'success')
        loadDashboardData()
      } else {
        showToast(data.error || 'Failed to delete record', 'error')
      }
    } catch {
      showToast('Error deleting record', 'error')
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

  // Handle Manual Add Guest
  const handleManualGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualGuestForm.guestName.trim()) {
      showToast('Please enter a guest or family name', 'error')
      return
    }

    setIsSubmittingManual(true)
    try {
      const res = await fetch('/api/admin/manual-guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(manualGuestForm),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        showToast(`✓ Guest "${manualGuestForm.guestName}" added to database!`, 'success')
        setShowManualModal(false)
        setManualGuestForm({
          guestName: '',
          guestEmail: '',
          guestPhone: '',
          maxGuests: 2,
          tableNumber: 'Table 01 - Emerald VIP',
          category: 'General',
          customNote: '',
          autoApprove: true,
        })
        loadDashboardData()
      } else {
        showToast(data.error || 'Failed to add guest', 'error')
      }
    } catch {
      showToast('Network error while adding guest', 'error')
    } finally {
      setIsSubmittingManual(false)
    }
  }

  // Handle Complete Data Reset
  const handleResetData = async () => {
    setIsResettingData(true)
    try {
      const res = await fetch('/api/admin/reset-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: resetTarget }),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        showToast('✓ Demo data successfully wiped and reset clean!', 'success')
        setShowResetModal(false)
        await loadDashboardData()
      } else {
        showToast(data.error || 'Failed to reset data', 'error')
      }
    } catch {
      showToast('Error executing database reset', 'error')
    } finally {
      setIsResettingData(false)
    }
  }

  // Export CSV
  const handleExportCSV = () => {
    if (!invites.length) {
      showToast('No guests to export.', 'info')
      return
    }

    const headers = [
      'Pass Code',
      'Guest Name',
      'Guest Email',
      'Guest Phone',
      'Approval Status',
      'Attendance',
      'Guest Count',
      'Table Assignment',
      'Category',
      'Special Notes & Blessings',
      'Registration Date',
    ]

    const rows = invites.map((inv) => [
      inv.accessCode || inv.passId || inv.code,
      `"${inv.guestName || inv.targetName || ''}"`,
      inv.guestEmail || inv.targetEmail || '',
      inv.guestPhone || '',
      inv.approvalStatus || 'pending',
      inv.attendance || 'attending',
      inv.actualGuestCount || inv.maxGuests || 1,
      `"${inv.tableNumber || 'Unassigned'}"`,
      inv.category || 'General',
      `"${inv.dietaryOrNotes || inv.customNote || ''}"`,
      inv.registeredAt || inv.createdAt || '',
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `ensorb_wedding_guests_${new Date().toISOString().split('T')[0]}.csv`)
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

  const approvedAttendingCount = useMemo(() => {
    return invites.filter((inv) => inv.approvalStatus === 'approved' && inv.attendance === 'attending').length
  }, [invites])

  const totalSeatsCount = useMemo(() => {
    return invites
      .filter((inv) => inv.approvalStatus === 'approved' && inv.attendance === 'attending')
      .reduce((sum, inv) => sum + (inv.actualGuestCount || inv.maxGuests || 1), 0)
  }, [invites])

  const pendingContributionsCount = useMemo(() => {
    return giftContributions.filter((c) => c.status === 'pending').length
  }, [giftContributions])

  // --------------------------------------------------------------------------
  // LOGIN SCREEN
  // --------------------------------------------------------------------------
  if (isAuthenticated === false) {
    return (
      <main className="admin-portal-wrapper">
        <section className="admin-login-hero">
          <div className="admin-hero-content-inner reveal-fade-up">
            <span className="admin-badge-eyebrow">— COUPLE &amp; ADMIN PORTAL —</span>
            <h1 className="admin-login-title">Ngozi &amp; Sorbari</h1>
            <p className="admin-login-subtitle">Wedding Management &amp; Live RSVP Dashboard</p>
          </div>
        </section>

        <section className="admin-login-body-section">
          <div className="admin-login-card-luxury reveal-fade-up">
            <div className="admin-lock-icon-circle">
              <Lock size={28} />
            </div>

            <h2>Admin Security Authentication</h2>
            <p className="admin-login-card-desc">
              Please enter the wedding master security PIN to access the dashboard.
            </p>

            <form onSubmit={handleLogin} className="admin-login-form-modern">
              <div className="admin-field-group">
                <input
                  type="password"
                  placeholder="Enter Security PIN (e.g. ensorb2026)"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="admin-pin-field"
                  autoFocus
                  required
                />
              </div>

              {authError && <div className="admin-error-banner">{authError}</div>}

              <button
                type="submit"
                className="admin-btn-primary-luxury w-full"
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
    <main className="admin-portal-wrapper">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`admin-floating-toast ${toastMessage.type}`}>
          <div className="toast-content-row">
            <span>{toastMessage.text}</span>
            <button type="button" onClick={() => setToastMessage(null)} className="toast-close-btn">✕</button>
          </div>
        </div>
      )}

      {/* Top Header & Branding Bar */}
      <section className="admin-top-header-section">
        <div className="admin-container">
          <div className="admin-header-row reveal-fade-up">
            <div className="admin-header-branding">
              <div className="admin-header-crest-row">
                <span className="admin-crest-tag">NGOZI &amp; SORBARI</span>
                <span className="admin-db-status-pill">
                  <span className="pulsing-green-dot" /> Live PostgreSQL Connected
                </span>
              </div>
              <h1 className="admin-main-heading">Wedding Admin &amp; Guest Manager</h1>
              <p className="admin-sub-heading">
                Universal RSVP approvals, table seating arrangements &amp; wedding gift registry verification.
              </p>
            </div>

            <div className="admin-header-actions-group">
              <button
                type="button"
                className="admin-action-btn-refresh"
                onClick={loadDashboardData}
                title="Refresh database"
              >
                <RefreshCw size={15} className={isLoading ? 'spinning' : ''} />
                <span>{isLoading ? 'Syncing...' : 'Sync DB'}</span>
              </button>

              <button
                type="button"
                className="admin-action-btn-danger"
                onClick={() => setShowResetModal(true)}
                title="Reset test data"
              >
                <Trash2 size={15} />
                <span>Reset Demo Data</span>
              </button>

              <button
                type="button"
                className="admin-action-btn-logout"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="admin-container admin-main-content-stack">
        {/* =======================================================================
            SINGLE MASTER INVITATION LINK BANNER
            ======================================================================= */}
        <section className="admin-master-invite-card reveal-fade-up">
          <div className="master-invite-left">
            <div className="master-invite-badge-row">
              <span className="master-badge-gold">
                <Sparkles size={13} /> SINGLE OFFICIAL WEDDING RSVP LINK
              </span>
              <span className="master-badge-status">Universal Public Invite</span>
            </div>
            <h2 className="master-invite-title">The Universal Invitation Link</h2>
            <p className="master-invite-desc">
              Share this single link with all family, friends, and esteemed guests. Guests fill out the RSVP form, which instantly lands under <strong>Needs Review</strong> below for you to approve and assign their celebration table.
            </p>

            <div className="master-link-input-group">
              <div className="master-link-display-box">
                <code className="master-link-url">{masterRsvpLink}</code>
              </div>

              <div className="master-link-buttons-row">
                <button
                  type="button"
                  className={`btn-master-action copy ${isCopiedMasterLink ? 'copied' : ''}`}
                  onClick={() => handleCopyText(masterRsvpLink)}
                >
                  {isCopiedMasterLink ? <Check size={16} /> : <Copy size={16} />}
                  <span>{isCopiedMasterLink ? 'Copied RSVP Link!' : 'Copy RSVP Link'}</span>
                </button>

                <button
                  type="button"
                  className="btn-master-action whatsapp"
                  onClick={handleShareWhatsApp}
                >
                  <MessageCircle size={16} />
                  <span>Share on WhatsApp</span>
                </button>

                <Link
                  href="/rsvp"
                  target="_blank"
                  className="btn-master-action preview"
                >
                  <ExternalLink size={15} />
                  <span>Open RSVP Form ↗</span>
                </Link>

                <button
                  type="button"
                  className="btn-master-action manual"
                  onClick={() => setShowManualModal(true)}
                >
                  <Plus size={16} />
                  <span>+ Add Guest Manually</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =======================================================================
            KPI STATS OVERVIEW CARDS
            ======================================================================= */}
        <section className="admin-kpi-grid reveal-fade-up">
          {/* Pending Reviews */}
          <div
            className={`admin-kpi-card ${activeMainTab === 'guests' && guestFilterTab === 'pending' ? 'selected' : ''}`}
            onClick={() => {
              setActiveMainTab('guests')
              setGuestFilterTab('pending')
            }}
          >
            <div className="kpi-card-inner">
              <div className="kpi-icon-box amber">
                <Clock size={22} />
              </div>
              <div className="kpi-data-col">
                <span className="kpi-label">Needs Review</span>
                <span className="kpi-number text-amber">{pendingApprovalsCount}</span>
                <span className="kpi-caption">Pending couple approval</span>
              </div>
            </div>
          </div>

          {/* Confirmed Attending */}
          <div
            className={`admin-kpi-card ${activeMainTab === 'guests' && guestFilterTab === 'attending' ? 'selected' : ''}`}
            onClick={() => {
              setActiveMainTab('guests')
              setGuestFilterTab('attending')
            }}
          >
            <div className="kpi-card-inner">
              <div className="kpi-icon-box green">
                <UserCheck size={22} />
              </div>
              <div className="kpi-data-col">
                <span className="kpi-label">Approved Attending</span>
                <span className="kpi-number text-green">{approvedAttendingCount}</span>
                <span className="kpi-caption">{totalSeatsCount} total seats allocated</span>
              </div>
            </div>
          </div>

          {/* Total RSVPs */}
          <div
            className={`admin-kpi-card ${activeMainTab === 'guests' && guestFilterTab === 'all' ? 'selected' : ''}`}
            onClick={() => {
              setActiveMainTab('guests')
              setGuestFilterTab('all')
            }}
          >
            <div className="kpi-card-inner">
              <div className="kpi-icon-box burgundy">
                <Users size={22} />
              </div>
              <div className="kpi-data-col">
                <span className="kpi-label">Total Reservations</span>
                <span className="kpi-number">{invites.length}</span>
                <span className="kpi-caption">Registered in database</span>
              </div>
            </div>
          </div>

          {/* Gift Registry Raised */}
          <div
            className={`admin-kpi-card ${activeMainTab === 'gifts' ? 'selected' : ''}`}
            onClick={() => setActiveMainTab('gifts')}
          >
            <div className="kpi-card-inner">
              <div className="kpi-icon-box gold">
                <TrendingUp size={22} />
              </div>
              <div className="kpi-data-col">
                <span className="kpi-label">Gift Funds Raised</span>
                <span className="kpi-number text-gold">₦{(giftStats?.totalConfirmedAmount || 0).toLocaleString()}</span>
                <span className="kpi-caption">{giftStats?.confirmedCount || 0} verified transfers</span>
              </div>
            </div>
          </div>

          {/* Pending Gift Transfers */}
          <div
            className={`admin-kpi-card ${activeMainTab === 'gifts' && giftFilter === 'pending' ? 'selected' : ''}`}
            onClick={() => {
              setActiveMainTab('gifts')
              setGiftFilter('pending')
            }}
          >
            <div className="kpi-card-inner">
              <div className="kpi-icon-box rose">
                <Gift size={22} />
              </div>
              <div className="kpi-data-col">
                <span className="kpi-label">Pending Transfers</span>
                <span className="kpi-number text-rose">{pendingContributionsCount}</span>
                <span className="kpi-caption">₦{(giftStats?.totalPendingAmount || 0).toLocaleString()} to verify</span>
              </div>
            </div>
          </div>
        </section>

        {/* =======================================================================
            MAIN NAVIGATION TABS
            ======================================================================= */}
        <section className="admin-main-tabs-wrapper">
          <div className="admin-tabs-nav-bar">
            <button
              type="button"
              className={`admin-nav-tab-item ${activeMainTab === 'guests' ? 'active' : ''}`}
              onClick={() => setActiveMainTab('guests')}
            >
              <Users size={18} />
              <span>Guests &amp; RSVPs ({invites.length})</span>
              {pendingApprovalsCount > 0 && (
                <span className="admin-tab-bubble amber">{pendingApprovalsCount}</span>
              )}
            </button>

            <button
              type="button"
              className={`admin-nav-tab-item ${activeMainTab === 'gifts' ? 'active' : ''}`}
              onClick={() => setActiveMainTab('gifts')}
            >
              <Gift size={18} />
              <span>Wedding Gift Registry &amp; Transfers</span>
              {pendingContributionsCount > 0 && (
                <span className="admin-tab-bubble amber">{pendingContributionsCount}</span>
              )}
            </button>
          </div>
        </section>

        {/* =======================================================================
            TAB 1: GUESTS & RSVP MANAGEMENT
            ======================================================================= */}
        {activeMainTab === 'guests' && (
          <section className="admin-table-container-section reveal-fade-up">
            {/* Filter Bar & Controls */}
            <div className="admin-table-filter-bar">
              <div className="admin-filter-pills-row">
                <button
                  type="button"
                  className={`admin-pill-btn ${guestFilterTab === 'pending' ? 'active' : ''}`}
                  onClick={() => setGuestFilterTab('pending')}
                >
                  Needs Review ({pendingApprovalsCount})
                </button>
                <button
                  type="button"
                  className={`admin-pill-btn ${guestFilterTab === 'attending' ? 'active' : ''}`}
                  onClick={() => setGuestFilterTab('attending')}
                >
                  Approved Attending ({approvedAttendingCount})
                </button>
                <button
                  type="button"
                  className={`admin-pill-btn ${guestFilterTab === 'all' ? 'active' : ''}`}
                  onClick={() => setGuestFilterTab('all')}
                >
                  All Guests ({invites.length})
                </button>
                <button
                  type="button"
                  className={`admin-pill-btn ${guestFilterTab === 'vip' ? 'active' : ''}`}
                  onClick={() => setGuestFilterTab('vip')}
                >
                  VIP Tier
                </button>
                <button
                  type="button"
                  className={`admin-pill-btn ${guestFilterTab === 'declined' ? 'active' : ''}`}
                  onClick={() => setGuestFilterTab('declined')}
                >
                  Declined ({invites.filter(i => i.attendance === 'declined' || i.approvalStatus === 'declined').length})
                </button>
              </div>

              <div className="admin-filter-actions-right">
                <div className="admin-search-wrap">
                  <Search size={15} className="admin-search-icon" />
                  <input
                    type="text"
                    placeholder="Search guest name, email, phone, code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="admin-search-input"
                  />
                  {searchQuery && (
                    <button type="button" onClick={() => setSearchQuery('')} className="admin-clear-search-btn">✕</button>
                  )}
                </div>

                <button
                  type="button"
                  className="admin-btn-export"
                  onClick={handleExportCSV}
                  title="Export guest list to CSV spreadsheet"
                >
                  <FileSpreadsheet size={15} />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Table Card */}
            <div className="admin-luxury-table-card">
              {isLoading ? (
                <div className="admin-loading-state-box">
                  <RefreshCw size={28} className="spinning text-burgundy" />
                  <p>Syncing live guest list from PostgreSQL...</p>
                </div>
              ) : filteredInvites.length === 0 ? (
                <div className="admin-empty-table-box">
                  <div className="empty-icon-circle">
                    <Users size={34} />
                  </div>
                  <h3>No Guests Found in this View</h3>
                  <p>
                    {invites.length === 0
                      ? 'The guest list is currently empty. Share the universal invite link or add guests manually.'
                      : 'No guests match the selected filter or search keyword.'}
                  </p>
                  <div className="empty-actions-row">
                    <button
                      type="button"
                      className="admin-btn-primary-luxury"
                      onClick={() => handleCopyText(masterRsvpLink)}
                    >
                      <Copy size={15} />
                      <span>Copy RSVP Link</span>
                    </button>
                    <button
                      type="button"
                      className="admin-btn-secondary-luxury"
                      onClick={() => setShowManualModal(true)}
                    >
                      <Plus size={15} />
                      <span>+ Add Guest Manually</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="admin-table-responsive-wrapper">
                  <table className="admin-modern-table">
                    <thead>
                      <tr>
                        <th>Guest / Family</th>
                        <th>Contact Details</th>
                        <th>Party Size</th>
                        <th>Assigned Table &amp; Category</th>
                        <th>Status &amp; Pass Code</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInvites.map((inv) => {
                        const isPending = inv.approvalStatus === 'pending'
                        const isApproved = inv.approvalStatus === 'approved'
                        const isDeclined = inv.approvalStatus === 'declined' || inv.attendance === 'declined'
                        const guestDisplayName = inv.guestName || inv.targetName || 'Guest'
                        const email = inv.guestEmail || inv.targetEmail
                        const phone = inv.guestPhone
                        const passCode = inv.accessCode || inv.passId || inv.code

                        return (
                          <tr key={inv.id || inv.code} className={`table-row ${isPending ? 'row-pending' : ''}`}>
                            {/* Guest & Note */}
                            <td>
                              <div className="guest-info-cell">
                                <strong className="guest-name-text">{guestDisplayName}</strong>
                                <div className="guest-meta-tags">
                                  <span className="source-tag">
                                    {inv.source === 'rsvp_form' ? '🌐 Website RSVP' : '✉️ Direct Entry'}
                                  </span>
                                  {inv.category === 'VIP' && (
                                    <span className="vip-star-tag">⭐ VIP</span>
                                  )}
                                </div>
                                {(inv.dietaryOrNotes || inv.customNote) && (
                                  <div className="guest-note-bubble" title={inv.dietaryOrNotes || inv.customNote}>
                                    💬 &quot;{inv.dietaryOrNotes || inv.customNote}&quot;
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Contact Details */}
                            <td>
                              <div className="contact-info-cell">
                                {email ? (
                                  <a href={`mailto:${email}`} className="contact-link email">
                                    <Mail size={13} />
                                    <span>{email}</span>
                                  </a>
                                ) : (
                                  <span className="contact-empty">No email provided</span>
                                )}
                                {phone ? (
                                  <a
                                    href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="contact-link phone whatsapp-click"
                                    title="Open WhatsApp chat"
                                  >
                                    <MessageCircle size={13} className="text-green" />
                                    <span>{phone}</span>
                                  </a>
                                ) : (
                                  <span className="contact-empty">No phone provided</span>
                                )}
                              </div>
                            </td>

                            {/* Party Size */}
                            <td>
                              <span className="seats-badge">
                                <Users size={13} />
                                <span>{inv.actualGuestCount || inv.maxGuests || 1} {((inv.actualGuestCount || inv.maxGuests || 1) === 1) ? 'Seat' : 'Seats'}</span>
                              </span>
                            </td>

                            {/* Table & Category */}
                            <td>
                              <div className="table-category-cell">
                                <span className="table-assigned-tag">
                                  {inv.tableNumber || 'Unassigned Table'}
                                </span>
                                <span className={`category-pill cat-${(inv.category || 'general').toLowerCase()}`}>
                                  {inv.category || 'General'}
                                </span>
                              </div>
                            </td>

                            {/* Status & Pass Code */}
                            <td>
                              <div className="status-pass-cell">
                                {isPending ? (
                                  <span className="badge-status-pill pending">
                                    <Clock size={12} /> Needs Review
                                  </span>
                                ) : isApproved ? (
                                  <span className="badge-status-pill approved">
                                    <CheckCircle2 size={12} /> Confirmed Pass
                                  </span>
                                ) : (
                                  <span className="badge-status-pill declined">
                                    <XCircle size={12} /> Declined
                                  </span>
                                )}

                                <div className="pass-code-copy-row">
                                  <code className="pass-code-text">{passCode}</code>
                                  <button
                                    type="button"
                                    className="mini-copy-btn"
                                    onClick={() => handleCopyText(passCode, inv.code)}
                                    title="Copy pass code"
                                  >
                                    {copiedCode === inv.code ? <Check size={12} className="text-green" /> : <Copy size={12} />}
                                  </button>
                                </div>
                              </div>
                            </td>

                            {/* Action Buttons */}
                            <td style={{ textAlign: 'right' }}>
                              <div className="table-actions-cell">
                                {isPending && (
                                  <>
                                    <button
                                      type="button"
                                      className="btn-table-approve"
                                      onClick={() => handleOpenApproveModal(inv)}
                                      title="Approve RSVP and assign seating table"
                                    >
                                      <Check size={14} />
                                      <span>Approve</span>
                                    </button>

                                    <button
                                      type="button"
                                      className="btn-table-decline"
                                      onClick={() => handleDecline(inv)}
                                      title="Decline reservation"
                                    >
                                      <X size={14} />
                                    </button>
                                  </>
                                )}

                                {isApproved && (
                                  <>
                                    <button
                                      type="button"
                                      className="btn-table-icon preview"
                                      onClick={() => setPreviewInvite(inv)}
                                      title="View & Download Digital Access Card"
                                    >
                                      <Eye size={14} />
                                    </button>

                                    {email && (
                                      <button
                                        type="button"
                                        className="btn-table-icon email"
                                        onClick={() => handleResendEmail(inv)}
                                        title="Email Digital Pass to Guest"
                                      >
                                        <Mail size={14} />
                                      </button>
                                    )}
                                  </>
                                )}

                                <button
                                  type="button"
                                  className="btn-table-icon edit"
                                  onClick={() => setEditingInvite(inv)}
                                  title="Edit guest details & table"
                                >
                                  <Edit2 size={14} />
                                </button>

                                <button
                                  type="button"
                                  className="btn-table-icon delete"
                                  onClick={() => handleDeleteInvite(inv)}
                                  title="Delete reservation"
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
          <section className="admin-table-container-section reveal-fade-up">
            {/* Financials Header Row */}
            <div className="admin-gift-stats-banner">
              <div className="gift-banner-left">
                <span className="admin-badge-eyebrow">WEDDING REGISTRY FINANCIALS</span>
                <h2>Gift Registry &amp; Blessings Ledger</h2>
                <p>Verify direct bank transfers, confirm cash blessings, and monitor real-time website funding progress.</p>
              </div>

              <div className="gift-banner-stat-boxes">
                <div className="gift-stat-box">
                  <span className="lbl">Target Registry Goal</span>
                  <strong className="val">₦{(giftStats?.totalRegistryValue || 0).toLocaleString()}</strong>
                </div>
                <div className="gift-stat-box confirmed">
                  <span className="lbl">Confirmed Raised</span>
                  <strong className="val text-green">₦{(giftStats?.totalConfirmedAmount || 0).toLocaleString()}</strong>
                </div>
                <div className="gift-stat-box pending">
                  <span className="lbl">Pending Transfers</span>
                  <strong className="val text-amber">₦{(giftStats?.totalPendingAmount || 0).toLocaleString()}</strong>
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="admin-table-filter-bar" style={{ marginTop: '20px' }}>
              <div className="admin-filter-pills-row">
                <button
                  type="button"
                  className={`admin-pill-btn ${giftFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setGiftFilter('all')}
                >
                  All Contributions ({giftContributions.length})
                </button>
                <button
                  type="button"
                  className={`admin-pill-btn ${giftFilter === 'pending' ? 'active' : ''}`}
                  onClick={() => setGiftFilter('pending')}
                >
                  Pending Verification ({pendingContributionsCount})
                </button>
                <button
                  type="button"
                  className={`admin-pill-btn ${giftFilter === 'confirmed' ? 'active' : ''}`}
                  onClick={() => setGiftFilter('confirmed')}
                >
                  Confirmed &amp; Credited ({giftStats?.confirmedCount || 0})
                </button>
                <button
                  type="button"
                  className={`admin-pill-btn ${giftFilter === 'declined' ? 'active' : ''}`}
                  onClick={() => setGiftFilter('declined')}
                >
                  Declined
                </button>
              </div>

              <div className="admin-filter-actions-right">
                <div className="admin-search-wrap">
                  <Search size={15} className="admin-search-icon" />
                  <input
                    type="text"
                    placeholder="Search donor name, gift, payment ref..."
                    value={giftSearchQuery}
                    onChange={(e) => setGiftSearchQuery(e.target.value)}
                    className="admin-search-input"
                  />
                  {giftSearchQuery && (
                    <button type="button" onClick={() => setGiftSearchQuery('')} className="admin-clear-search-btn">✕</button>
                  )}
                </div>
              </div>
            </div>

            {/* Gift Contributions Ledger Table */}
            <div className="admin-luxury-table-card">
              {isLoadingGifts ? (
                <div className="admin-loading-state-box">
                  <RefreshCw size={28} className="spinning text-burgundy" />
                  <p>Syncing gift contributions from database...</p>
                </div>
              ) : filteredContributions.length === 0 ? (
                <div className="admin-empty-table-box">
                  <div className="empty-icon-circle">
                    <Gift size={34} />
                  </div>
                  <h3>No Gift Contributions Found</h3>
                  <p>
                    When guests contribute to items on the Gift Couple page, their bank payment references will appear here for verification.
                  </p>
                </div>
              ) : (
                <div className="admin-table-responsive-wrapper">
                  <table className="admin-modern-table">
                    <thead>
                      <tr>
                        <th>Contributor / Family</th>
                        <th>Target Gift Item</th>
                        <th>Amount</th>
                        <th>Payment Reference / Narration</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContributions.map((contrib) => {
                        const isPending = contrib.status === 'pending'
                        const isConfirmed = contrib.status === 'confirmed'

                        return (
                          <tr key={contrib.id} className={`table-row ${isPending ? 'row-pending' : ''}`}>
                            <td>
                              <div className="guest-info-cell">
                                <strong className="guest-name-text">{contrib.contributorName}</strong>
                                {contrib.contributorPhone && (
                                  <a
                                    href={`https://wa.me/${contrib.contributorPhone.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="contact-link phone whatsapp-click"
                                  >
                                    <MessageCircle size={13} className="text-green" />
                                    <span>{contrib.contributorPhone}</span>
                                  </a>
                                )}
                                {contrib.customNote && (
                                  <div className="guest-note-bubble" title={contrib.customNote}>
                                    💬 &quot;{contrib.customNote}&quot;
                                  </div>
                                )}
                              </div>
                            </td>

                            <td>
                              <span className="gift-item-name-tag">{contrib.giftTitle}</span>
                            </td>

                            <td>
                              <strong className="gift-amount-display">
                                ₦{contrib.amount.toLocaleString()}
                              </strong>
                            </td>

                            <td>
                              <div className="pass-code-copy-row">
                                <code className="pass-code-text">{contrib.paymentReference}</code>
                                <button
                                  type="button"
                                  className="mini-copy-btn"
                                  onClick={() => handleCopyText(contrib.paymentReference, contrib.id)}
                                  title="Copy bank payment reference"
                                >
                                  {copiedCode === contrib.id ? <Check size={12} className="text-green" /> : <Copy size={12} />}
                                </button>
                              </div>
                            </td>

                            <td>
                              {isPending ? (
                                <span className="badge-status-pill pending">
                                  <Clock size={12} /> Pending Verification
                                </span>
                              ) : isConfirmed ? (
                                <span className="badge-status-pill approved">
                                  <CheckCircle2 size={12} /> Confirmed &amp; Credited
                                </span>
                              ) : (
                                <span className="badge-status-pill declined">
                                  <XCircle size={12} /> Declined
                                </span>
                              )}
                            </td>

                            <td style={{ fontSize: '12.5px', color: '#666' }}>
                              {contrib.createdAt ? new Date(contrib.createdAt).toLocaleDateString() : 'Recent'}
                            </td>

                            <td style={{ textAlign: 'right' }}>
                              <div className="table-actions-cell">
                                {isPending && (
                                  <>
                                    <button
                                      type="button"
                                      className="btn-table-approve"
                                      onClick={() => handleConfirmGift(contrib.id)}
                                      disabled={confirmingContribId === contrib.id}
                                      title="Confirm payment received and credit progress to website"
                                    >
                                      <CheckCheck size={14} />
                                      <span>{confirmingContribId === contrib.id ? 'Confirming...' : 'Confirm'}</span>
                                    </button>

                                    <button
                                      type="button"
                                      className="btn-table-decline"
                                      onClick={() => handleDeclineGift(contrib.id)}
                                      disabled={decliningContribId === contrib.id}
                                      title="Decline transfer"
                                    >
                                      <X size={14} />
                                    </button>
                                  </>
                                )}

                                {isConfirmed && (
                                  <span className="badge-status-pill approved" style={{ fontSize: '11px' }}>
                                    ✓ Credited to Registry
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

            {/* Live Registry Catalog Progress Grid */}
            <div className="admin-catalog-grid-section">
              <div className="admin-section-header">
                <span className="admin-badge-eyebrow">LIVE REGISTRY STATUS</span>
                <h3>Catalog Items &amp; Real-Time Progress</h3>
              </div>

              <div className="admin-catalog-cards-grid">
                {giftItems.map((gift) => {
                  const pct = Math.min(100, Math.round((gift.contributedAmount / gift.numericPrice) * 100))
                  const isComplete = gift.isFullyGifted || pct >= 100

                  return (
                    <div key={gift.id} className="admin-catalog-item-card">
                      <div className="catalog-img-wrap">
                        <img src={gift.image} alt={gift.title} className="catalog-card-img" />
                        <span className={`catalog-badge ${isComplete ? 'complete' : ''}`}>
                          {isComplete ? '✓ Fully Gifted' : `${pct}% Funded`}
                        </span>
                      </div>

                      <div className="catalog-card-info">
                        <h4 className="catalog-item-title">{gift.title}</h4>
                        <div className="catalog-price-row">
                          <span>Goal: <strong>{gift.price}</strong></span>
                          <span>Raised: <strong className="text-burgundy">₦{gift.contributedAmount.toLocaleString()}</strong></span>
                        </div>
                        <div className="catalog-progress-track">
                          <div
                            className="catalog-progress-bar"
                            style={{ width: `${pct}%`, background: isComplete ? '#2F634A' : '#6B1D2F' }}
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
      </div>

      {/* =======================================================================
          MODAL: APPROVE RSVP & TABLE ASSIGNMENT
          ======================================================================= */}
      {approvingInvite && mounted && createPortal(
        <div className="admin-modal-overlay" onClick={() => setApprovingInvite(null)}>
          <div
            className="admin-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className="admin-modal-close"
              onClick={() => setApprovingInvite(null)}
            >
              ✕
            </button>

            <div className="admin-modal-header">
              <span className="admin-badge-eyebrow">GUEST SEATING ASSIGNMENT</span>
              <h2>Approve Guest &amp; Assign Table</h2>
              <p>
                Confirm reservation for <strong>{approvingInvite.guestName || approvingInvite.targetName}</strong>.
              </p>
            </div>

            <div className="admin-modal-body">
              <div className="admin-form-group">
                <label className="admin-label">Assigned Celebration Table *</label>
                <select
                  value={assignedTable}
                  onChange={(e) => setAssignedTable(e.target.value)}
                  className="admin-input-field select"
                >
                  {WEDDING_TABLE_OPTIONS.map((tbl) => (
                    <option key={tbl} value={tbl}>{tbl}</option>
                  ))}
                </select>
              </div>

              <div className="admin-two-col-grid" style={{ marginTop: '12px' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Seats Allocated</label>
                  <input
                    type="number"
                    min={1}
                    max={4}
                    value={assignedMaxGuests}
                    onChange={(e) => setAssignedMaxGuests(Number(e.target.value) || 1)}
                    className="admin-input-field"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Guest Tier / Category</label>
                  <select
                    value={assignedCategory}
                    onChange={(e) => setAssignedCategory(e.target.value as Invite['category'])}
                    className="admin-input-field select"
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
                <div className="admin-checkbox-row">
                  <input
                    type="checkbox"
                    id="sendPassCheck"
                    checked={sendPassEmailOnApprove}
                    onChange={(e) => setSendPassEmailOnApprove(e.target.checked)}
                  />
                  <label htmlFor="sendPassCheck">
                    Email official Digital Access Card Pass to <strong>{approvingInvite.guestEmail || approvingInvite.targetEmail}</strong>
                  </label>
                </div>
              )}

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn-secondary-luxury"
                  onClick={() => setApprovingInvite(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="admin-btn-primary-luxury"
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
          MODAL: MANUAL GUEST ENTRY
          ======================================================================= */}
      {showManualModal && mounted && createPortal(
        <div className="admin-modal-overlay" onClick={() => setShowManualModal(false)}>
          <div
            className="admin-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className="admin-modal-close"
              onClick={() => setShowManualModal(false)}
            >
              ✕
            </button>

            <div className="admin-modal-header">
              <span className="admin-badge-eyebrow">OFFLINE &amp; VIP GUEST ENTRY</span>
              <h2>Add Guest to Database</h2>
              <p>Add an esteemed family member, VIP, or offline guest directly to the database.</p>
            </div>

            <form onSubmit={handleManualGuestSubmit} className="admin-modal-body">
              <div className="admin-form-group">
                <label className="admin-label">Guest / Family Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Chief &amp; Mrs. John Okafor"
                  value={manualGuestForm.guestName}
                  onChange={(e) => setManualGuestForm({ ...manualGuestForm, guestName: e.target.value })}
                  className="admin-input-field"
                  required
                />
              </div>

              <div className="admin-two-col-grid" style={{ marginTop: '12px' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Email (Optional for digital pass)</label>
                  <input
                    type="email"
                    placeholder="okafor@example.com"
                    value={manualGuestForm.guestEmail}
                    onChange={(e) => setManualGuestForm({ ...manualGuestForm, guestEmail: e.target.value })}
                    className="admin-input-field"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+234 803 000 0000"
                    value={manualGuestForm.guestPhone}
                    onChange={(e) => setManualGuestForm({ ...manualGuestForm, guestPhone: e.target.value })}
                    className="admin-input-field"
                  />
                </div>
              </div>

              <div className="admin-form-group" style={{ marginTop: '12px' }}>
                <label className="admin-label">Personal Greeting / Notes (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Special note or blessings..."
                  value={manualGuestForm.customNote}
                  onChange={(e) => setManualGuestForm({ ...manualGuestForm, customNote: e.target.value })}
                  className="admin-textarea-field"
                />
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn-secondary-luxury"
                  onClick={() => setShowManualModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn-primary-luxury"
                  disabled={isSubmittingManual}
                >
                  {isSubmittingManual ? 'Adding Guest...' : 'Save Guest to DB →'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* =======================================================================
          MODAL: RESET DATA CONFIRMATION
          ======================================================================= */}
      {showResetModal && mounted && createPortal(
        <div className="admin-modal-overlay" onClick={() => setShowResetModal(false)}>
          <div
            className="admin-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            style={{ maxWidth: '480px' }}
          >
            <button
              type="button"
              className="admin-modal-close"
              onClick={() => setShowResetModal(false)}
            >
              ✕
            </button>

            <div className="admin-modal-header" style={{ textAlign: 'center' }}>
              <div className="admin-warning-circle">
                <AlertTriangle size={32} />
              </div>
              <h2>Reset Demo Data</h2>
              <p>This action will cleanly wipe test data so you can launch with a completely fresh system.</p>
            </div>

            <div className="admin-modal-body">
              <div className="admin-form-group">
                <label className="admin-label">Select What to Reset:</label>
                <div className="reset-options-list">
                  <label className="reset-radio-item">
                    <input
                      type="radio"
                      name="resetTarget"
                      value="all"
                      checked={resetTarget === 'all'}
                      onChange={() => setResetTarget('all')}
                    />
                    <div>
                      <strong>All Data (Guests &amp; Gifts)</strong>
                      <span>Wipes guest RSVPs and resets all gift registry funds to ₦0</span>
                    </div>
                  </label>

                  <label className="reset-radio-item">
                    <input
                      type="radio"
                      name="resetTarget"
                      value="invites"
                      checked={resetTarget === 'invites'}
                      onChange={() => setResetTarget('invites')}
                    />
                    <div>
                      <strong>Guest List Only</strong>
                      <span>Wipes all RSVPs and registered invites</span>
                    </div>
                  </label>

                  <label className="reset-radio-item">
                    <input
                      type="radio"
                      name="resetTarget"
                      value="gifts"
                      checked={resetTarget === 'gifts'}
                      onChange={() => setResetTarget('gifts')}
                    />
                    <div>
                      <strong>Gift Contributions Only</strong>
                      <span>Resets gift funding progress and contribution records</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn-secondary-luxury"
                  onClick={() => setShowResetModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="admin-btn-danger-luxury"
                  onClick={handleResetData}
                  disabled={isResettingData}
                >
                  {isResettingData ? 'Wiping Database...' : 'Confirm Reset Data 🗑'}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* =======================================================================
          MODAL: EDIT GUEST DETAILS
          ======================================================================= */}
      {editingInvite && mounted && createPortal(
        <div className="admin-modal-overlay" onClick={() => setEditingInvite(null)}>
          <div
            className="admin-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className="admin-modal-close"
              onClick={() => setEditingInvite(null)}
            >
              ✕
            </button>

            <div className="admin-modal-header">
              <span className="admin-badge-eyebrow">EDIT RECORD</span>
              <h2>Modify Guest: {editingInvite.guestName || editingInvite.targetName || editingInvite.code}</h2>
            </div>

            <form onSubmit={handleSaveEdit} className="admin-modal-body">
              <div className="admin-form-group">
                <label className="admin-label">Guest / Family Name</label>
                <input
                  type="text"
                  value={editingInvite.guestName || editingInvite.targetName || ''}
                  onChange={(e) => setEditingInvite({ ...editingInvite, guestName: e.target.value, targetName: e.target.value })}
                  className="admin-input-field"
                />
              </div>

              <div className="admin-two-col-grid" style={{ marginTop: '12px' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Email</label>
                  <input
                    type="email"
                    value={editingInvite.guestEmail || editingInvite.targetEmail || ''}
                    onChange={(e) => setEditingInvite({ ...editingInvite, guestEmail: e.target.value, targetEmail: e.target.value })}
                    className="admin-input-field"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Phone</label>
                  <input
                    type="tel"
                    value={editingInvite.guestPhone || ''}
                    onChange={(e) => setEditingInvite({ ...editingInvite, guestPhone: e.target.value })}
                    className="admin-input-field"
                  />
                </div>
              </div>

              <div className="admin-two-col-grid" style={{ marginTop: '12px' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Table Number</label>
                  <select
                    value={editingInvite.tableNumber || 'Table 01 - Emerald VIP'}
                    onChange={(e) => setEditingInvite({ ...editingInvite, tableNumber: e.target.value })}
                    className="admin-input-field select"
                  >
                    {WEDDING_TABLE_OPTIONS.map((tbl) => (
                      <option key={tbl} value={tbl}>{tbl}</option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Category</label>
                  <select
                    value={editingInvite.category || 'General'}
                    onChange={(e) => setEditingInvite({ ...editingInvite, category: e.target.value as Invite['category'] })}
                    className="admin-input-field select"
                  >
                    <option value="General">General</option>
                    <option value="VIP">VIP</option>
                    <option value="Family">Family</option>
                    <option value="Friends">Friends</option>
                    <option value="Colleagues">Colleagues</option>
                  </select>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn-secondary-luxury"
                  onClick={() => setEditingInvite(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn-primary-luxury"
                >
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
        <div className="admin-modal-overlay" onClick={() => setPreviewInvite(null)}>
          <div
            className="admin-pass-preview-wrapper"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className="pass-preview-close-btn"
              onClick={() => setPreviewInvite(null)}
            >
              ✕ Close
            </button>

            <AccessCardPass invite={previewInvite} />
          </div>
        </div>,
        document.body
      )}
    </main>
  )
}
