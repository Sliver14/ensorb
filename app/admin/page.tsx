'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Invite, AdminStats, CreateInviteInput } from '@/lib/types'
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
  Send,
  Eye,
  X,
  UserPlus,
  SlidersHorizontal,
  Calendar,
  Phone,
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
  const [createMode, setCreateMode] = useState<'email_direct' | 'bare' | 'batch' | 'custom'>('email_direct')
  const [editingInvite, setEditingInvite] = useState<Invite | null>(null)
  const [previewInvite, setPreviewInvite] = useState<Invite | null>(null)
  const [activeTab, setActiveTab] = useState<'approvals' | 'all' | 'registered' | 'pending' | 'vip' | 'checkedin' | 'declined'>('approvals')
  const [searchQuery, setSearchQuery] = useState('')
  const [quickCheckInCode, setQuickCheckInCode] = useState('')

  // Approval draft settings per invite code (for pending items)
  const [approvalDrafts, setApprovalDrafts] = useState<{
    [code: string]: { tableNumber: string; category: Invite['category']; maxGuests: number }
  }>({})
  const [approvingCode, setApprovingCode] = useState<string | null>(null)
  const [decliningCode, setDecliningCode] = useState<string | null>(null)

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
  const [bareCount, setBareCount] = useState<number>(1)
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

        // Initialize approval drafts with sensible defaults
        const drafts: { [code: string]: { tableNumber: string; category: Invite['category']; maxGuests: number } } = {}
        data.invites.forEach((inv: Invite) => {
          drafts[inv.code] = {
            tableNumber: inv.tableNumber || 'Table 01 - Emerald VIP',
            category: inv.category || 'General',
            maxGuests: inv.actualGuestCount || inv.maxGuests || 2,
          }
        })
        setApprovalDrafts(drafts)
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

  // Pending count calculation
  const pendingApprovalsCount = useMemo(() => {
    return invites.filter((inv) => inv.approvalStatus === 'pending').length
  }, [invites])

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

  // Handle Send Unique Link via Email (Resend)
  const handleSendEmailInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailInviteForm.targetName || !emailInviteForm.targetEmail) {
      showToast('Please enter both guest name and email address.', 'error')
      return
    }

    setIsSubmittingForm(true)
    try {
      const res = await fetch('/api/admin/send-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...emailInviteForm,
          sendEmailNow: true,
        }),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setInvites((prev) => [data.invite, ...prev])
        if (data.stats) setStats(data.stats)
        setShowCreateModal(false)
        showToast(
          `✓ Unique invite link emailed to ${emailInviteForm.targetEmail}! They will receive their access card automatically upon registration.`,
          'success'
        )
        setEmailInviteForm({
          targetName: '',
          targetEmail: '',
          maxGuests: 2,
          tableNumber: '',
          category: 'General',
          customNote: '',
        })
      } else {
        showToast(data.error || 'Failed to send invitation email', 'error')
      }
    } catch {
      showToast('Network error sending invite email', 'error')
    } finally {
      setIsSubmittingForm(false)
    }
  }

  // Handle Approve Pending Guest
  const handleApproveGuest = async (invite: Invite) => {
    setApprovingCode(invite.code)
    try {
      const draft = approvalDrafts[invite.code] || {
        tableNumber: invite.tableNumber || 'Table 01 - Emerald VIP',
        category: invite.category || 'General',
        maxGuests: invite.actualGuestCount || invite.maxGuests || 2,
      }

      const res = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: invite.code,
          tableNumber: draft.tableNumber,
          category: draft.category,
          maxGuests: draft.maxGuests,
          sendAccessCardEmail: true,
        }),
      })
      const data = await res.json()

      if (res.ok && data.success && data.invite) {
        setInvites((prev) =>
          prev.map((item) => (item.code === invite.code ? data.invite : item))
        )
        if (data.stats) setStats(data.stats)
        showToast(
          `✓ Guest approved! Official Access Card has been generated & emailed to ${invite.guestEmail || invite.targetName}.`,
          'success'
        )
      } else {
        showToast(data.error || 'Failed to approve guest', 'error')
      }
    } catch {
      showToast('Network error during guest approval', 'error')
    } finally {
      setApprovingCode(null)
    }
  }

  // Handle Decline Pending Guest
  const handleDeclineGuest = async (invite: Invite) => {
    const reason = prompt(
      `Decline RSVP for "${invite.guestName || invite.targetName}"? You may specify a reason:`,
      'Venue capacity limit reached'
    )
    if (reason === null) return

    setDecliningCode(invite.code)
    try {
      const res = await fetch('/api/admin/decline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: invite.code,
          reason,
        }),
      })
      const data = await res.json()

      if (res.ok && data.success && data.invite) {
        setInvites((prev) =>
          prev.map((item) => (item.code === invite.code ? data.invite : item))
        )
        if (data.stats) setStats(data.stats)
        showToast(`Guest RSVP marked as declined.`, 'info')
      } else {
        showToast(data.error || 'Failed to decline RSVP', 'error')
      }
    } catch {
      showToast('Network error declining guest', 'error')
    } finally {
      setDecliningCode(null)
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
    if (!confirm(`Are you sure you want to revoke and delete invite "${code}"?`)) {
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
    const targetEmail = invite.guestEmail || invite.targetEmail
    if (!targetEmail) {
      showToast('Cannot resend: this invite has no email associated.', 'error')
      return
    }

    showToast(`Sending access card pass to ${targetEmail}...`, 'info')
    try {
      const res = await fetch(`/api/invites/${encodeURIComponent(invite.code)}/resend`, {
        method: 'POST',
      })
      const data = await res.json()

      if (res.ok && data.success) {
        showToast(`✓ Access Card Pass emailed to ${targetEmail}`, 'success')
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
          data.checkedIn ? `✓ ${data.invite.guestName || code} Checked-In at door!` : `Check-in reverted for ${code}`,
          'success'
        )
      } else {
        showToast(data.error || 'Failed to toggle check-in', 'error')
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
      (inv) =>
        inv.code.toUpperCase() === query ||
        inv.passId?.toUpperCase() === query ||
        inv.accessCode?.toUpperCase() === query
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
      'Access Code',
      'Invite Code',
      'Invite Link',
      'Approval Status',
      'Assigned Table',
      'Category',
      'Max Seats',
      'Guest Name',
      'Email',
      'Phone',
      'Attendance',
      'Actual Seats',
      'Source',
      'Pass ID',
      'Checked In',
      'Dietary/Notes',
      'Created Date',
      'Approved Date',
    ]

    const siteOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://ensorb.com'

    const rows = invites.map((inv) => [
      `"${inv.accessCode || inv.passId || inv.code}"`,
      `"${inv.code}"`,
      `"${siteOrigin}/invite/${inv.code}"`,
      `"${inv.approvalStatus || 'approved'}"`,
      `"${inv.tableNumber || ''}"`,
      `"${inv.category || 'General'}"`,
      inv.maxGuests || 2,
      `"${inv.guestName || inv.targetName || ''}"`,
      `"${inv.guestEmail || inv.targetEmail || ''}"`,
      `"${inv.guestPhone || ''}"`,
      `"${inv.attendance || ''}"`,
      inv.actualGuestCount || '',
      `"${inv.source || 'admin_direct'}"`,
      `"${inv.passId || ''}"`,
      inv.checkedIn ? 'YES' : 'NO',
      `"${(inv.dietaryOrNotes || '').replace(/"/g, '""')}"`,
      `"${inv.createdAt ? new Date(inv.createdAt).toLocaleDateString('en-GB') : ''}"`,
      `"${inv.approvedAt ? new Date(inv.approvedAt).toLocaleDateString('en-GB') : ''}"`,
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
      .filter((inv) => (inv.isRegistered || inv.approvalStatus === 'approved') && (inv.guestEmail || inv.targetEmail))
      .map((inv) => inv.guestEmail || inv.targetEmail)
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
      if (activeTab === 'approvals' && inv.approvalStatus !== 'pending') return false
      if (activeTab === 'registered' && (inv.approvalStatus !== 'approved' || !inv.isRegistered)) return false
      if (activeTab === 'pending' && (inv.isRegistered || inv.approvalStatus === 'declined')) return false
      if (activeTab === 'declined' && inv.approvalStatus !== 'declined' && inv.attendance !== 'declined') return false
      if (activeTab === 'vip' && inv.category !== 'VIP') return false
      if (activeTab === 'checkedin' && !inv.checkedIn) return false

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchName = (inv.targetName || '').toLowerCase().includes(q)
        const matchGuest = (inv.guestName || '').toLowerCase().includes(q)
        const matchEmail = (inv.guestEmail || inv.targetEmail || '').toLowerCase().includes(q)
        const matchPhone = (inv.guestPhone || '').toLowerCase().includes(q)
        const matchCode = (inv.code || '').toLowerCase().includes(q)
        const matchTable = (inv.tableNumber || '').toLowerCase().includes(q)
        const matchPass = (inv.passId || inv.accessCode || '').toLowerCase().includes(q)
        return matchName || matchGuest || matchEmail || matchPhone || matchCode || matchTable || matchPass
      }

      return true
    })
  }, [invites, activeTab, searchQuery])

  // Pending Approvals List specifically
  const pendingApprovalsList = useMemo(() => {
    return invites.filter((inv) => inv.approvalStatus === 'pending')
  }, [invites])

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
            Manage guest registrations, review and approve website RSVPs, generate unique invite links, and issue luxury official Access Cards.
          </p>
        </section>

        <section className="admin-login-section section-shell">
          <div className="admin-login-card">
            <div className="login-icon-ring">
              <Lock size={32} />
            </div>
            <h2>Couple / Admin Login</h2>
            <p className="login-hint">Enter your designated wedding management passcode.</p>

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
              {pendingApprovalsCount > 0 && (
                <span className="admin-pending-alert-badge">
                  {pendingApprovalsCount} RSVP{pendingApprovalsCount > 1 ? 's' : ''} Awaiting Approval
                </span>
              )}
            </div>
            <h1>Invites &amp; Guest Management</h1>
            <p className="admin-subtitle">
              Approve pending website RSVPs, send personalized invitation links directly via Resend, and oversee luxury Access Card passes.
            </p>
          </div>

          <div className="admin-header-actions">
            {/* Direct Email Unique Link Button */}
            <button
              type="button"
              className="admin-primary-btn email-btn-gold"
              onClick={() => {
                setCreateMode('email_direct')
                setShowCreateModal(true)
              }}
            >
              <Send size={16} />
              <span>Email Unique Invite Link</span>
            </button>

            {/* 1-Click Bare Link Quick Generator */}
            <button
              type="button"
              className="admin-quick-bare-btn"
              onClick={handleQuickBareLink}
              disabled={isQuickGenerating}
              title="Generate a fresh bare invite link with auto-assigned table and copy URL"
            >
              <Zap size={16} className="zap-icon" />
              <span>{isQuickGenerating ? 'Generating...' : '⚡ Quick Bare Link'}</span>
            </button>

            {/* Multi-link / Batch modal */}
            <button
              type="button"
              className="admin-secondary-btn"
              onClick={() => {
                setCreateMode('bare')
                setShowCreateModal(true)
              }}
            >
              <Plus size={16} />
              <span>Batch / Multi-Link</span>
            </button>
          </div>
        </div>

        {/* Integration Status Bar */}
        <div className="admin-status-ribbon">
          <div className="status-item">
            <Mail size={16} className={emailStatus ? 'text-green' : 'text-amber'} />
            <span>
              Resend Notification Provider: <strong>{emailStatus ? 'Active (RESEND_API_KEY connected)' : 'Simulated Logger Ready'}</strong>
            </span>
          </div>
          <div className="status-item">
            <CloudUpload size={16} className={cloudinaryStatus ? 'text-green' : 'text-amber'} />
            <span>
              Cloudinary Media: <strong>{cloudinaryStatus ? 'Connected' : 'Local Fallback'}</strong>
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
        <div
          className={`stat-card clickable ${activeTab === 'approvals' ? 'active-stat' : ''}`}
          onClick={() => setActiveTab('approvals')}
        >
          <div className="stat-icon-box amber">
            <Clock size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Pending Approvals</span>
            <strong className="stat-val">{pendingApprovalsCount}</strong>
            <span className="stat-sub">Website RSVPs awaiting review</span>
          </div>
        </div>

        <div
          className={`stat-card clickable ${activeTab === 'registered' ? 'active-stat' : ''}`}
          onClick={() => setActiveTab('registered')}
        >
          <div className="stat-icon-box green">
            <UserCheck size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Approved &amp; Registered</span>
            <strong className="stat-val">{stats?.attendingCount || 0}</strong>
            <span className="stat-sub">{stats?.totalGuestsAttending || 0} confirmed seats</span>
          </div>
        </div>

        <div
          className={`stat-card clickable ${activeTab === 'all' ? 'active-stat' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <div className="stat-icon-box gold">
            <Users size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Invites / Links</span>
            <strong className="stat-val">{stats?.totalInvites || invites.length}</strong>
            <span className="stat-sub">{stats?.totalSeatsAllocated || 0} seats allocated</span>
          </div>
        </div>

        <div
          className={`stat-card clickable ${activeTab === 'checkedin' ? 'active-stat' : ''}`}
          onClick={() => setActiveTab('checkedin')}
        >
          <div className="stat-icon-box purple">
            <QrCode size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Door Check-Ins</span>
            <strong className="stat-val">{stats?.checkedInCount || 0}</strong>
            <span className="stat-sub">Admitted at venue gate</span>
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
                placeholder="Door Entrance Scanner: Scan or type Access Code / Pass ID / Invite Code..."
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
                className={`filter-tab ${activeTab === 'approvals' ? 'active' : ''}`}
                onClick={() => setActiveTab('approvals')}
              >
                <span>Pending Approvals</span>
                {pendingApprovalsCount > 0 && (
                  <span className="tab-counter-badge">{pendingApprovalsCount}</span>
                )}
              </button>
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
                Approved ({stats?.attendingCount || 0})
              </button>
              <button
                type="button"
                className={`filter-tab ${activeTab === 'pending' ? 'active' : ''}`}
                onClick={() => setActiveTab('pending')}
              >
                Pre-Generated ({stats?.pendingCount || 0})
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
              <button
                type="button"
                className={`filter-tab ${activeTab === 'declined' ? 'active' : ''}`}
                onClick={() => setActiveTab('declined')}
              >
                Declined
              </button>
            </div>

            {/* Actions & Export */}
            <div className="filter-actions-group">
              <div className="search-input-wrap">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search name, code, table..."
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

          {/* =========================================================================
              VIEW: PENDING APPROVALS QUEUE (If on 'approvals' tab)
              ========================================================================= */}
          {activeTab === 'approvals' && (
            <div className="pending-approvals-queue">
              <div className="queue-header-banner">
                <div className="queue-header-text">
                  <h3>Guest RSVP Review &amp; Approval Queue</h3>
                  <p>
                    Guests who submitted their details on the general RSVP page are shown below. Assign their table and seats, then click <strong>Approve &amp; Send Access Card</strong> to immediately generate and email their official entry pass.
                  </p>
                </div>
              </div>

              {pendingApprovalsList.length === 0 ? (
                <div className="empty-queue-box">
                  <CheckCircle2 size={42} className="text-green" />
                  <h4>No Pending RSVPs to Review</h4>
                  <p>All submitted guest RSVPs have been reviewed and issued their official access cards!</p>
                </div>
              ) : (
                <div className="pending-cards-grid">
                  {pendingApprovalsList.map((guest) => {
                    const draft = approvalDrafts[guest.code] || {
                      tableNumber: guest.tableNumber || 'Table 01 - Emerald VIP',
                      category: guest.category || 'General',
                      maxGuests: guest.actualGuestCount || guest.maxGuests || 2,
                    }
                    const isApproving = approvingCode === guest.code
                    const isDeclining = decliningCode === guest.code

                    return (
                      <div key={guest.id} className="approval-card-item">
                        <div className="approval-card-top">
                          <div className="guest-identity-wrap">
                            {guest.guestPhoto ? (
                              <img
                                src={guest.guestPhoto}
                                alt={guest.guestName || 'Guest'}
                                className="approval-guest-avatar"
                              />
                            ) : (
                              <div className="approval-guest-placeholder">
                                {(guest.guestName || guest.targetName || 'G').charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <h4 className="guest-display-name">{guest.guestName || guest.targetName}</h4>
                              <div className="guest-contact-pills">
                                {guest.guestEmail && (
                                  <span className="contact-pill">
                                    <Mail size={12} />
                                    {guest.guestEmail}
                                  </span>
                                )}
                                {guest.guestPhone && (
                                  <span className="contact-pill">
                                    <Phone size={12} />
                                    {guest.guestPhone}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="submission-meta">
                            <span className="source-tag">Website RSVP</span>
                            <span className="date-tag">
                              {guest.registeredAt
                                ? new Date(guest.registeredAt).toLocaleDateString('en-GB')
                                : guest.createdAt
                                ? new Date(guest.createdAt).toLocaleDateString('en-GB')
                                : 'Recent'}
                            </span>
                          </div>
                        </div>

                        {/* Guest Request Information */}
                        <div className="approval-details-row">
                          <div className="detail-field">
                            <span className="field-label">Requested Seats:</span>
                            <strong className="field-val">
                              {guest.actualGuestCount || guest.maxGuests || 1} Person(s)
                            </strong>
                          </div>
                          <div className="detail-field">
                            <span className="field-label">Code / Pass:</span>
                            <span className="access-code-tag">{guest.accessCode || guest.code}</span>
                          </div>
                          {guest.dietaryOrNotes && (
                            <div className="detail-field full-width">
                              <span className="field-label">Guest Note / Wishes:</span>
                              <p className="guest-note-text">“{guest.dietaryOrNotes}”</p>
                            </div>
                          )}
                        </div>

                        {/* Editable Table & Category Assignment Controls */}
                        <div className="approval-assignment-box">
                          <div className="assignment-grid">
                            <div className="assignment-group">
                              <label>Assigned Table</label>
                              <input
                                type="text"
                                value={draft.tableNumber}
                                onChange={(e) =>
                                  setApprovalDrafts({
                                    ...approvalDrafts,
                                    [guest.code]: { ...draft, tableNumber: e.target.value },
                                  })
                                }
                                placeholder="e.g. Table 01 - Emerald VIP"
                              />
                            </div>

                            <div className="assignment-group">
                              <label>Category</label>
                              <select
                                value={draft.category}
                                onChange={(e) =>
                                  setApprovalDrafts({
                                    ...approvalDrafts,
                                    [guest.code]: {
                                      ...draft,
                                      category: e.target.value as Invite['category'],
                                    },
                                  })
                                }
                              >
                                <option value="General">General</option>
                                <option value="VIP">VIP</option>
                                <option value="Family">Family</option>
                                <option value="Friends">Friends</option>
                                <option value="Colleagues">Colleagues</option>
                              </select>
                            </div>

                            <div className="assignment-group">
                              <label>Confirmed Seats</label>
                              <select
                                value={draft.maxGuests}
                                onChange={(e) =>
                                  setApprovalDrafts({
                                    ...approvalDrafts,
                                    [guest.code]: {
                                      ...draft,
                                      maxGuests: Number(e.target.value),
                                    },
                                  })
                                }
                              >
                                <option value="1">1 Seat</option>
                                <option value="2">2 Seats (Plus One)</option>
                                <option value="3">3 Seats</option>
                                <option value="4">4 Seats</option>
                              </select>
                            </div>
                          </div>

                          {/* Approval Actions */}
                          <div className="approval-buttons-bar">
                            <button
                              type="button"
                              className="approve-action-btn"
                              onClick={() => handleApproveGuest(guest)}
                              disabled={isApproving || isDeclining}
                            >
                              <CheckCircle2 size={16} />
                              <span>
                                {isApproving ? 'Approving & Sending Pass...' : '✓ Approve & Send Access Card'}
                              </span>
                            </button>

                            <button
                              type="button"
                              className="decline-action-btn"
                              onClick={() => handleDeclineGuest(guest)}
                              disabled={isApproving || isDeclining}
                            >
                              <XCircle size={16} />
                              <span>{isDeclining ? 'Declining...' : 'Decline'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              VIEW: GENERAL INVITES TABLE (All other tabs)
              ========================================================================= */}
          {activeTab !== 'approvals' && (
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
                      : 'Generate a unique link or email an invitation to get started.'}
                  </p>
                </div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Guest / Profile</th>
                      <th>Access Card &amp; Code</th>
                      <th>Approval / Status</th>
                      <th>Table &amp; Seats</th>
                      <th>Guest Contact</th>
                      <th>Pass Delivery</th>
                      <th>Door Check-In</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvites.map((inv) => {
                      const isRegistered = inv.isRegistered
                      const isDeclined = inv.approvalStatus === 'declined' || inv.attendance === 'declined'
                      const isPending = inv.approvalStatus === 'pending'
                      const isApproved = inv.approvalStatus === 'approved'

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
                                {inv.guestName || inv.targetName ? (
                                  <strong className="target-name">{inv.guestName || inv.targetName}</strong>
                                ) : (
                                  <strong className="target-name bare-tag">⚡ Bare Link</strong>
                                )}
                                <div className="tags-row">
                                  <span className={`category-tag ${inv.category.toLowerCase()}`}>
                                    {inv.category}
                                  </span>
                                  {inv.source === 'frontend_rsvp' && (
                                    <span className="source-mini-tag">Website RSVP</span>
                                  )}
                                  {inv.source === 'admin_direct' && (
                                    <span className="source-mini-tag direct">Admin Invite</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Code & 1-Click Copy Link */}
                          <td>
                            <div className="code-cell">
                              <span className="invite-code-pill font-mono">
                                {inv.accessCode || inv.passId || inv.code}
                              </span>
                              <button
                                type="button"
                                className="copy-url-icon-btn highlight-copy"
                                onClick={() => copyInviteLink(inv.code)}
                                title="Copy unique invite registration URL"
                              >
                                {copiedCode === inv.code ? (
                                  <Check size={14} className="text-green" />
                                ) : (
                                  <Copy size={14} />
                                )}
                                <span>{copiedCode === inv.code ? '✓ Copied' : 'Copy Link'}</span>
                              </button>
                            </div>
                          </td>

                          {/* Status Column */}
                          <td>
                            {isPending ? (
                              <div className="pending-status-block">
                                <span className="status-badge pending">⏳ Awaiting Approval</span>
                                <button
                                  type="button"
                                  className="inline-quick-approve-btn"
                                  onClick={() => handleApproveGuest(inv)}
                                  disabled={approvingCode === inv.code}
                                >
                                  {approvingCode === inv.code ? 'Approving...' : '✓ Approve'}
                                </button>
                              </div>
                            ) : isDeclined ? (
                              <span className="status-badge declined">✕ Declined</span>
                            ) : isRegistered || isApproved ? (
                              <span className="status-badge registered">✓ Approved</span>
                            ) : (
                              <span className="status-badge pending">⏳ Unfilled Link</span>
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
                            <div className="contact-cell">
                              <span className="contact-email">
                                {inv.guestEmail || inv.targetEmail || '—'}
                              </span>
                              {inv.guestPhone && (
                                <span className="contact-phone">{inv.guestPhone}</span>
                              )}
                            </div>
                          </td>

                          {/* Pass ID & Email Delivery */}
                          <td>
                            <div className="pass-meta-cell">
                              {inv.emailSent || inv.inviteEmailSent ? (
                                <span className="email-sent-badge">✓ Emailed via Resend</span>
                              ) : (
                                <span className="email-unsent-badge">Email Ready</span>
                              )}
                              {inv.passId && (
                                <span className="pass-id-sub font-mono">{inv.passId}</span>
                              )}
                            </div>
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
                              {/* Preview Access Card */}
                              <button
                                type="button"
                                className="action-icon-link preview-card-btn"
                                onClick={() => setPreviewInvite(inv)}
                                title="Preview Luxury Access Card Pass"
                              >
                                <Eye size={16} />
                              </button>

                              {/* Open link */}
                              <Link
                                href={`/invite/${inv.code}`}
                                target="_blank"
                                className="action-icon-link"
                                title="Open Guest Invite Page"
                              >
                                <ExternalLink size={16} />
                              </Link>

                              {/* Resend Pass Email */}
                              {(inv.guestEmail || inv.targetEmail) && (
                                <button
                                  type="button"
                                  className="action-icon-link"
                                  onClick={() => handleResendFromAdmin(inv)}
                                  title="Resend Access Card Pass to Guest Email"
                                >
                                  <Mail size={16} />
                                </button>
                              )}

                              {/* Edit details */}
                              <button
                                type="button"
                                className="action-icon-link"
                                onClick={() => setEditingInvite(inv)}
                                title="Edit table number or seats"
                              >
                                <Edit2 size={16} />
                              </button>

                              {/* Delete invite */}
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
          )}
        </div>
      </section>

      {/* =========================================================================
          MODAL: ACCESS CARD PREVIEW (Luxury Sample Match)
          ========================================================================= */}
      {previewInvite && (
        <div className="gift-modal-backdrop" onClick={() => setPreviewInvite(null)}>
          <div
            className="gift-modal access-card-preview-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              className="modal-close-btn"
              onClick={() => setPreviewInvite(null)}
              aria-label="Close dialog"
            >
              ✕
            </button>

            <div className="preview-modal-header">
              <span className="eyebrow">Digital Access Pass Preview</span>
              <h2>Official Wedding Access Card</h2>
              <p>
                Sample design matching the couple's official physical lanyard badge for{' '}
                <strong>{previewInvite.guestName || previewInvite.targetName || 'Valued Guest'}</strong>.
              </p>
            </div>

            <div className="preview-modal-body">
              <AccessCardPass
                invite={previewInvite}
                onResendEmail={() => handleResendFromAdmin(previewInvite)}
              />
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: GENERATE OR EMAIL UNIQUE INVITE LINKS
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
              <h2>Generate &amp; Email Wedding Invitations</h2>
              <p>Send unique invitation links directly to guests or generate batch links for messaging.</p>

              <div className="create-tabs">
                <button
                  type="button"
                  className={`create-tab-btn ${createMode === 'email_direct' ? 'active' : ''}`}
                  onClick={() => setCreateMode('email_direct')}
                >
                  <Send size={14} />
                  <span>Email Unique Link</span>
                </button>
                <button
                  type="button"
                  className={`create-tab-btn ${createMode === 'bare' ? 'active' : ''}`}
                  onClick={() => setCreateMode('bare')}
                >
                  <Zap size={14} />
                  <span>1-Click Bare Links</span>
                </button>
                <button
                  type="button"
                  className={`create-tab-btn ${createMode === 'batch' ? 'active' : ''}`}
                  onClick={() => setCreateMode('batch')}
                >
                  <Users size={14} />
                  <span>Batch Names List</span>
                </button>
                <button
                  type="button"
                  className={`create-tab-btn ${createMode === 'custom' ? 'active' : ''}`}
                  onClick={() => setCreateMode('custom')}
                >
                  <SlidersHorizontal size={14} />
                  <span>Custom Preset</span>
                </button>
              </div>
            </div>

            {/* MODE 1: EMAIL UNIQUE LINK DIRECTLY VIA RESEND */}
            {createMode === 'email_direct' && (
              <form onSubmit={handleSendEmailInvite} className="modal-form-admin">
                <div className="bare-generator-info-box">
                  <p>
                    <strong>Automatic Flow:</strong> An official royal invitation with a unique RSVP button is emailed directly to the guest. Once they open it and complete their profile, their official Access Card is generated and sent to them automatically.
                  </p>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="targetName">
                      Guest / Family Name <span>*</span>
                    </label>
                    <input
                      id="targetName"
                      type="text"
                      required
                      placeholder="e.g. Pastor & Mrs. David Oladipo"
                      value={emailInviteForm.targetName}
                      onChange={(e) =>
                        setEmailInviteForm({ ...emailInviteForm, targetName: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="targetEmail">
                      Guest Email Address <span>*</span>
                    </label>
                    <input
                      id="targetEmail"
                      type="email"
                      required
                      placeholder="guest@example.com"
                      value={emailInviteForm.targetEmail}
                      onChange={(e) =>
                        setEmailInviteForm({ ...emailInviteForm, targetEmail: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="maxGuests">Reserved Seats</label>
                    <select
                      id="maxGuests"
                      value={emailInviteForm.maxGuests}
                      onChange={(e) =>
                        setEmailInviteForm({
                          ...emailInviteForm,
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
                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      value={emailInviteForm.category}
                      onChange={(e) =>
                        setEmailInviteForm({
                          ...emailInviteForm,
                          category: e.target.value as Invite['category'],
                        })
                      }
                    >
                      <option value="General">General</option>
                      <option value="VIP">VIP</option>
                      <option value="Family">Family</option>
                      <option value="Friends">Friends</option>
                      <option value="Colleagues">Colleagues</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="tableNumber">Assigned Table (Auto if empty)</label>
                    <input
                      id="tableNumber"
                      type="text"
                      placeholder="e.g. Table 01 - Emerald VIP (Auto assigned)"
                      value={emailInviteForm.tableNumber}
                      onChange={(e) =>
                        setEmailInviteForm({ ...emailInviteForm, tableNumber: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="customNote">Personal Note / Message in Email (Optional)</label>
                    <input
                      id="customNote"
                      type="text"
                      placeholder="e.g. We would be deeply honored by your presence!"
                      value={emailInviteForm.customNote}
                      onChange={(e) =>
                        setEmailInviteForm({ ...emailInviteForm, customNote: e.target.value })
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
                    className="modal-submit-btn gold"
                    disabled={isSubmittingForm}
                  >
                    <Send size={16} />
                    <span>{isSubmittingForm ? 'Sending Email...' : 'Send Official Invitation Email ↗'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* MODE 2: BARE LINKS GENERATOR */}
            {createMode === 'bare' && (
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
                        setBareCategory(e.target.value as Invite['category'])
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
            )}

            {/* MODE 3: BATCH FROM NAMES LIST */}
            {createMode === 'batch' && (
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
                        setBareCategory(e.target.value as Invite['category'])
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
            )}

            {/* MODE 4: CUSTOM PRESET INVITE */}
            {createMode === 'custom' && (
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
