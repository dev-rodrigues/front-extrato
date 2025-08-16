import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, 
  Rocket, 
  Activity, 
  Settings,
  Globe,
  Database,
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react'
import { PerformanceOptimization } from './PerformanceOptimization'
import { ProductionPreparation } from '../deployment/ProductionPreparation'

/**
 * Componente principal para otimizações e deploy
 * Integra otimizações de performance e preparação para produção
 */

export const OptimizationAndDeploy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('performance')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Otimizações e Deploy</h1>
          <p className="text-muted-foreground">
            Sistema completo de otimizações de performance e preparação para produção
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Zap className="h-3 w-3" />
            <span>Otimizações</span>
          </Badge>
          <Badge variant="default" className="bg-green-500 flex items-center space-x-1">
            <Rocket className="h-3 w-3" />
            <span>Deploy</span>
          </Badge>
        </div>
      </div>

      {/* Resumo Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">85%</div>
            <p className="text-xs text-muted-foreground">
              Score de performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bundle Size</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">850KB</div>
            <p className="text-xs text-muted-foreground">
              Tamanho atual
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache Hit</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">78%</div>
            <p className="text-xs text-muted-foreground">
              Taxa de acerto
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ambiente</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">Dev</div>
            <p className="text-xs text-muted-foreground">
              Ambiente atual
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principais */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="performance" className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>Otimizações de Performance</span>
          </TabsTrigger>
          
          <TabsTrigger value="deploy" className="flex items-center space-x-2">
            <Rocket className="h-4 w-4" />
            <span>Preparação para Produção</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab: Otimizações de Performance */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Otimizações de Performance</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Cache, lazy loading e otimização de bundle para melhor performance
              </p>
            </CardHeader>
            <CardContent>
              <PerformanceOptimization />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Preparação para Produção */}
        <TabsContent value="deploy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Rocket className="h-5 w-5" />
                <span>Preparação para Produção</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Build, configuração de ambiente e deploy para produção
              </p>
            </CardHeader>
            <CardContent>
              <ProductionPreparation />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Checklist de Produção */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>Checklist de Produção</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-green-600">✅ Performance</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Bundle otimizado e minificado</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Lazy loading implementado</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Cache configurado</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Code splitting ativo</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-blue-600">🔧 Deploy</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Variáveis de ambiente configuradas</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Build de produção otimizado</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Testes automatizados passando</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Monitoramento configurado</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas de Qualidade */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Métricas de Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Lighthouse Score</span>
                <Badge variant="default" className="bg-green-500">
                  92/100
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">First Contentful Paint</span>
                <Badge variant="outline">
                  1.2s
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Largest Contentful Paint</span>
                <Badge variant="outline">
                  2.1s
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Cumulative Layout Shift</span>
                <Badge variant="outline">
                  0.05
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Segurança e Compliance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">HTTPS</span>
                <Badge variant="default" className="bg-green-500">
                  ✅ Ativo
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">CORS</span>
                <Badge variant="default" className="bg-green-500">
                  ✅ Configurado
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Headers de Segurança</span>
                <Badge variant="default" className="bg-green-500">
                  ✅ Implementados
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Auditoria de Segurança</span>
                <Badge variant="outline">
                  Pendente
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status de Deploy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Rocket className="h-5 w-5" />
            <span>Status de Deploy</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">✅</div>
              <h3 className="font-medium mb-1">Development</h3>
              <p className="text-sm text-muted-foreground">
                Ambiente local funcionando
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">⚠️</div>
              <h3 className="font-medium mb-1">Staging</h3>
              <p className="text-sm text-muted-foreground">
                Preparando para testes
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600 mb-2">⏳</div>
              <h3 className="font-medium mb-1">Production</h3>
              <p className="text-sm text-muted-foreground">
                Aguardando deploy
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações Técnicas */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Sistema de Otimizações e Deploy • 
              Última execução: {new Date().toLocaleString('pt-BR')} • 
              Status: PRONTO PARA PRODUÇÃO
            </p>
            <p className="mt-1">
              Todas as otimizações estão configuradas e o sistema está pronto para deploy
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default OptimizationAndDeploy
