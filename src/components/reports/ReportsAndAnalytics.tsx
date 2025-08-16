import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  BarChart3, 
  TrendingUp, 
  Download,
  Activity,
  Clock,
  Zap,
  CheckCircle
} from 'lucide-react'
import { BasicReports } from './BasicReports'
import { AdvancedAnalytics } from './AdvancedAnalytics'

/**
 * Componente principal para relatórios e analytics
 * Integra relatórios básicos e analytics avançados em uma interface unificada
 */

export const ReportsAndAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('basic')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios e Analytics</h1>
          <p className="text-muted-foreground">
            Sistema completo de relatórios, métricas e análise de dados do sistema
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Activity className="h-3 w-3" />
            <span>Sistema Ativo</span>
          </Badge>
          <Badge variant="default" className="bg-green-500 flex items-center space-x-1">
            <CheckCircle className="h-3 w-3" />
            <span>Dados em Tempo Real</span>
          </Badge>
        </div>
      </div>

      {/* Resumo Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Relatórios Gerados</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              Este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Média</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">98.5%</div>
            <p className="text-xs text-muted-foreground">
              Uptime do sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo de Resposta</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">145ms</div>
            <p className="text-xs text-muted-foreground">
              Média da API
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crescimento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">+22.1%</div>
            <p className="text-xs text-muted-foreground">
              Este mês vs anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principais */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Relatórios Básicos</span>
          </TabsTrigger>
          
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics Avançados</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab: Relatórios Básicos */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Relatórios Básicos</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Relatórios de consultas, importações e movimentações com filtros e exportação
              </p>
            </CardHeader>
            <CardContent>
              <BasicReports />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Analytics Avançados */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Analytics Avançados</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Métricas de performance, padrões de uso e previsões do sistema
              </p>
            </CardHeader>
            <CardContent>
              <AdvancedAnalytics />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Informações Adicionais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Exportação de Dados</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Formato CSV</span>
                <Badge variant="outline">Disponível</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Formato JSON</span>
                <Badge variant="outline">Disponível</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Formato PDF</span>
                <Badge variant="secondary">Em Desenvolvimento</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Formato Excel</span>
                <Badge variant="secondary">Em Desenvolvimento</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recursos do Sistema</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Atualização em Tempo Real</span>
                <Badge variant="default" className="bg-green-500">Ativo</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Cache Inteligente</span>
                <Badge variant="default" className="bg-green-500">Ativo</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Compressão de Dados</span>
                <Badge variant="default" className="bg-green-500">Ativo</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Backup Automático</span>
                <Badge variant="default" className="bg-green-500">Ativo</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer com informações técnicas */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Sistema de Relatórios e Analytics • 
              Dados atualizados automaticamente • 
              Última atualização: {new Date().toLocaleString('pt-BR')}
            </p>
            <p className="mt-1">
              Para suporte técnico ou dúvidas sobre relatórios, entre em contato com a equipe de desenvolvimento
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ReportsAndAnalytics
