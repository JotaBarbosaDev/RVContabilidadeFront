import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  Search,
  Filter,
  Eye,
  UserCheck,
  UserX,
  ArrowLeft,
  RefreshCw,
  Shield,
  Mail,
  Phone,
  Calendar
} from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";
import { Link } from "react-router-dom";

export default function AdminUsersPage() {
  const { 
    users, 
    isLoadingUsers,
    fetchUsers,
    updateUserStatus,
    userFilters,
    setUserFilters 
  } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, userFilters]);

  const handleFilterChange = () => {
    setUserFilters({
      status: statusFilter || undefined,
      role: roleFilter || undefined,
      search: searchTerm || undefined
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setRoleFilter('');
    setUserFilters({});
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    setIsUpdating(userId);
    try {
      await updateUserStatus(userId, newStatus);
    } catch (error) {
      console.error('Error updating user status:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><UserCheck className="w-3 h-3 mr-1" />Ativo</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800"><UserX className="w-3 h-3 mr-1" />Inativo</Badge>;
      case 'suspended':
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><UserX className="w-3 h-3 mr-1" />Suspenso</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800"><Shield className="w-3 h-3 mr-1" />Admin</Badge>;
      case 'client':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Cliente</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleDateString('pt-PT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.nif.includes(searchTerm) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestão de Utilizadores</h1>
            <p className="text-muted-foreground">
              Todos os utilizadores registados no sistema
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={fetchUsers}
            disabled={isLoadingUsers}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingUsers ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtros
          </CardTitle>
          <CardDescription>
            Filtre os utilizadores por status, função ou termo de pesquisa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Pesquisar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nome, email, NIF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-10 px-3 border border-input bg-background rounded-md text-sm"
              >
                <option value="">Todos os status</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
                <option value="suspended">Suspenso</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Função</Label>
              <select
                id="role"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full h-10 px-3 border border-input bg-background rounded-md text-sm"
              >
                <option value="">Todas as funções</option>
                <option value="client">Cliente</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div className="flex items-end space-x-2">
              <Button onClick={handleFilterChange} size="sm">
                Aplicar Filtros
              </Button>
              <Button variant="outline" onClick={clearFilters} size="sm">
                Limpar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ativos</p>
                <p className="text-2xl font-bold text-green-600">
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Clientes</p>
                <p className="text-2xl font-bold text-blue-600">
                  {users.filter(u => u.role === 'client').length}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold text-purple-600">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Utilizadores</CardTitle>
          <CardDescription>
            {filteredUsers.length} utilizador(es) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingUsers ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Nenhum utilizador encontrado</p>
              <p className="text-sm">Tente ajustar os filtros ou termos de pesquisa</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium">{user.name}</h3>
                        {getStatusBadge(user.status)}
                        {getRoleBadge(user.role)}
                      </div>
                      
                      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center">
                          <span>NIF: {user.nif}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          <span>{user.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Último login: {formatDate(user.lastLogin)}</span>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground mt-1">
                        Registado em {formatDate(user.createdAt)}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Status Actions */}
                      {user.status === 'active' ? (
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                            onClick={() => handleStatusChange(user.id, 'inactive')}
                            disabled={isUpdating === user.id}
                          >
                            {isUpdating === user.id ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Desativar'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleStatusChange(user.id, 'suspended')}
                            disabled={isUpdating === user.id}
                          >
                            {isUpdating === user.id ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Suspender'}
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-600 hover:bg-green-50"
                          onClick={() => handleStatusChange(user.id, 'active')}
                          disabled={isUpdating === user.id}
                        >
                          {isUpdating === user.id ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Ativar'}
                        </Button>
                      )}

                      <Link to={`/admin/users/${user.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
