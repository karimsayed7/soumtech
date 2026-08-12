import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUsers } from '@/api/getUsers'
// import UsersTable from '@/components/users/users-table'
import UsersList from '@/features/users list/UsersList'

interface UsersPageProps {
  searchParams: Promise<{ page?: string; name?: string }>
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  const { page, name } = await searchParams
  const currentPage = Number(page) > 0 ? Number(page) : 1

  const { users, totalPages } = await getUsers({ page: currentPage, pageSize: 10, name })

  return <UsersList users={users} totalPages={totalPages} currentPage={currentPage} />
}