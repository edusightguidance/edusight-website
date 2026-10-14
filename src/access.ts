import type { Access, FieldAccess, PayloadRequest } from 'payload'

type U = { id: number | string; role?: string } | null | undefined

export const isSuper = (u: U) => u?.role === 'superadmin'
export const isStaff = (u: U) => u?.role === 'superadmin' || u?.role === 'editor'

export const superOnly: Access = ({ req }) => isSuper(req.user as U)
export const staffOnly: Access = ({ req }) => isStaff(req.user as U)
export const anyone: Access = () => true
export const superField: FieldAccess = ({ req }) => isSuper(req.user as U)

/** Content readable by the public only when published; staff see drafts too. */
export const publishedOrStaff: Access = ({ req }) =>
  isStaff(req.user as U) ? true : { published: { equals: true } }

/** Super admin sees everything; signed-in users only their own records. */
export const ownOrSuper =
  (field = 'user'): Access =>
  ({ req }) => {
    const u = req.user as U
    if (isSuper(u)) return true
    if (!u) return false
    return { [field]: { equals: u.id } }
  }

export const hideFromEditor = ({ user }: { user: PayloadRequest['user'] }) => !isSuper(user as U)
export const hideFromNonStaff = ({ user }: { user: PayloadRequest['user'] }) => !isStaff(user as U)
