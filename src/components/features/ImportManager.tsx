import { useState } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle, Clock, Download, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface ImportFile {
  id: string
  name: string
  size: number
  status: 'pending' | 'processing' | 'completed' | 'error'
  uploadedAt: Date
  processedAt?: Date
  records: number
  errors?: string[]
}

export const ImportManager = () => {
  const [files, setFiles] = useState<ImportFile[]>([])
  const [dragActive, setDragActive] = useState(false)

  const handleFileUpload = (fileList: FileList) => {
    const newFiles: ImportFile[] = Array.from(fileList).map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      status: 'pending',
      uploadedAt: new Date(),
      records: Math.floor(Math.random() * 1000) + 100
    }))
    
    setFiles(prev => [...prev, ...newFiles])
    
    // Simular processamento
    newFiles.forEach((file, index) => {
      setTimeout(() => {
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { ...f, status: 'processing' }
            : f
        ))
      }, 1000 + index * 500)
      
      setTimeout(() => {
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { ...f, status: 'completed' }
            : f
        ))
      }, 3000 + index * 500)
    })
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  const getStatusBadge = (status: ImportFile['status']) => {
    const variants = {
      pending: { variant: 'outline' as const, icon: Clock, text: 'Pendente' },
      processing: { variant: 'secondary' as const, icon: Clock, text: 'Processando' },
      completed: { variant: 'default' as const, icon: CheckCircle, text: 'Concluído' },
      error: { variant: 'destructive' as const, icon: AlertCircle, text: 'Erro' }
    }
    
    const config = variants[status]
    const Icon = config.icon
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    )
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gerenciador de Importações</h1>
        <p className="text-muted-foreground">
          Upload e processamento de arquivos de extrato bancário
        </p>
      </div>

      {/* Área de Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload de Arquivos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Arraste arquivos aqui</h3>
            <p className="text-muted-foreground mb-4">
              ou clique para selecionar arquivos
            </p>
            <Button
              onClick={() => document.getElementById('file-input')?.click()}
              className="mb-4"
            >
              Selecionar Arquivos
            </Button>
            <input
              id="file-input"
              type="file"
              multiple
              accept=".csv,.xlsx,.txt"
              className="hidden"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            />
            <p className="text-sm text-muted-foreground">
              Formatos suportados: CSV, Excel, TXT (máx. 10MB por arquivo)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Arquivos */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Arquivos Importados ({files.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Arquivo</TableHead>
                  <TableHead>Tamanho</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registros</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className="font-medium">{file.name}</TableCell>
                    <TableCell>{formatFileSize(file.size)}</TableCell>
                    <TableCell>{getStatusBadge(file.status)}</TableCell>
                    <TableCell>{file.records.toLocaleString()}</TableCell>
                    <TableCell>
                      {file.uploadedAt.toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {file.status === 'completed' && (
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{files.length}</div>
                <div className="text-sm text-muted-foreground">Total de Arquivos</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">
                  {files.filter(f => f.status === 'completed').length}
                </div>
                <div className="text-sm text-muted-foreground">Processados</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold">
                  {files.filter(f => f.status === 'processing').length}
                </div>
                <div className="text-sm text-muted-foreground">Processando</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold">
                  {files.filter(f => f.status === 'error').length}
                </div>
                <div className="text-sm text-muted-foreground">Com Erro</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
