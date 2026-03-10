import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
import { BarChartComponent, LineChartComponent } from './components/ui/chart';
import { Slider } from './components/ui/slider';
import { Alert } from './components/ui/alert';
import { Button } from './components/ui/button';
import { useTheme } from './components/ThemeProvider';
import { 
  Zap, Activity, Thermometer, Home, Gauge, 
  Sun, Moon, AlertCircle, TrendingUp, Clock 
} from 'lucide-react';

// Datos de las viviendas (corregidos según el PDF)
const viviendasData = [
  { 
    id: 1, 
    mensual: 420, 
    diario: 14, 
    lProm: 12.5, 
    lPico: 35, 
    pProm: 1.5, 
    pPico: 4.2, 
    rProm: 9.6, 
    rPico: 9.6, 
    jouleProm: 1.5, 
    joulePico: 4.2 
  },
  { 
    id: 2, 
    mensual: 380, 
    diario: 12.7, 
    lProm: 11.3, 
    lPico: 32, 
    pProm: 1.4, 
    pPico: 3.8, 
    rProm: 10.6, 
    rPico: 10.6, 
    jouleProm: 1.4, 
    joulePico: 3.8 
  },
  { 
    id: 3, 
    mensual: 450, 
    diario: 15, 
    lProm: 13.4, 
    lPico: 38, 
    pProm: 1.6, 
    pPico: 4.6, 
    rProm: 8.9, 
    rPico: 8.9, 
    jouleProm: 1.6, 
    joulePico: 4.6 
  },
  { 
    id: 4, 
    mensual: 320, 
    diario: 10.7, 
    lProm: 9.5, 
    lPico: 28, 
    pProm: 1.1, 
    pPico: 3.4, 
    rProm: 12.6, 
    rPico: 12.6, 
    jouleProm: 1.1, 
    joulePico: 3.4 
  },
  { 
    id: 5, 
    mensual: 510, 
    diario: 17, 
    lProm: 15.2, 
    lPico: 42, 
    pProm: 1.8, 
    pPico: 5, 
    rProm: 7.9, 
    rPico: 7.9, 
    jouleProm: 1.8, 
    joulePico: 5 
  },
  { 
    id: 6, 
    mensual: 360, 
    diario: 12, 
    lProm: 10.7, 
    lPico: 30, 
    pProm: 1.3, 
    pPico: 3.6, 
    rProm: 11.2, 
    rPico: 11.2, 
    jouleProm: 1.3, 
    joulePico: 3.6 
  },
  { 
    id: 7, 
    mensual: 335, 
    diario: 11.2, 
    lProm: 10, 
    lPico: 26.67, 
    pProm: 1.2, 
    pPico: 3.2, 
    rProm: 12, 
    rPico: 12, 
    jouleProm: 1.2, 
    joulePico: 3.2 
  }
];

// Datos para la curva de demanda diaria
const demandaDiaria = [
  { hora: '01:00', kw: 0.8 },
  { hora: '02:00', kw: 0.6 },
  { hora: '03:00', kw: 0.5 },
  { hora: '04:00', kw: 0.5 },
  { hora: '05:00', kw: 0.6 },
  { hora: '06:00', kw: 1.2 },
  { hora: '07:00', kw: 2.1 },
  { hora: '08:00', kw: 2.8 },
  { hora: '09:00', kw: 3.2 },
  { hora: '10:00', kw: 3.0 },
  { hora: '11:00', kw: 2.8 },
  { hora: '12:00', kw: 2.5 },
  { hora: '13:00', kw: 2.4 },
  { hora: '14:00', kw: 2.3 },
  { hora: '15:00', kw: 2.4 },
  { hora: '16:00', kw: 2.8 },
  { hora: '17:00', kw: 3.5 },
  { hora: '18:00', kw: 4.0 },
  { hora: '19:00', kw: 4.2 },
  { hora: '20:00', kw: 4.1 },
  { hora: '21:00', kw: 3.8 },
  { hora: '22:00', kw: 2.8 },
  { hora: '23:00', kw: 1.8 },
  { hora: '00:00', kw: 1.0 }
];

function App() {
  const { theme, toggleTheme } = useTheme();
  const [simuladorCarga, setSimuladorCarga] = useState(48);
  const [corrienteSimulada, setCorrienteSimulada] = useState(123);
  const [, setActiveTab] = useState('tabla');
  
  const R_LINEA = 0.5;
  const efectoJouleSimulado = Math.pow(corrienteSimulada, 2) * R_LINEA / 1000;
  const consumoTotal = viviendasData.reduce((sum, casa) => sum + casa.mensual, 0);
  const potenciaPicoTotal = viviendasData.reduce((sum, casa) => sum + casa.pPico, 0);

  return (
    <div className="App">
      <header className="bg-white shadow-sm dark:bg-gray-800 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo imagen de WATIOS - tamaño h-10 (40px) */}
            <img 
              src="/WALTIOS.jpg" 
              alt="WATIOS Logo" 
              className="h-10 w-auto object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/40x40?text=W';
              }}
            />
            
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Sistema de Alertas
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sistema de monitoreo de consumo y efecto Joule
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-full dark:bg-green-900">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Sistema Estable
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>



      <main className="container mx-auto py-6 px-4">
        {/* Tarjetas de KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="bg-blue-100 p-3 rounded-lg dark:bg-blue-900">
                <Activity className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Consumo Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {consumoTotal.toLocaleString()} kWh
                </p>
                <p className="text-xs text-gray-500">Últimos 30 días</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="bg-green-100 p-3 rounded-lg dark:bg-green-900">
                <Gauge className="w-6 h-6 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Potencia Pico</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {potenciaPicoTotal.toFixed(1)} kW
                </p>
                <p className="text-xs text-gray-500">Máxima del sistema</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="bg-red-100 p-3 rounded-lg dark:bg-red-900">
                <Thermometer className="w-6 h-6 text-red-600 dark:text-red-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Efecto Joule</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {efectoJouleSimulado.toFixed(1)} kW
                </p>
                <p className="text-xs text-gray-500">En tiempo real</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="bg-purple-100 p-3 rounded-lg dark:bg-purple-900">
                <Home className="w-6 h-6 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Viviendas</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {viviendasData.length}
                </p>
                <p className="text-xs text-gray-500">Monitorizadas</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs para navegación */}
        <Tabs defaultValue="tabla" className="mb-6" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="tabla">📊 Datos Detallados</TabsTrigger>
            <TabsTrigger value="graficas">📈 Gráficas</TabsTrigger>
            <TabsTrigger value="simulador">🎮 Simulador</TabsTrigger>
          </TabsList>

          <TabsContent value="tabla">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Datos detallados de consumo eléctrico y efecto Joule</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Resumen de consumo por vivienda - Actualizado: {new Date().toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>VIVIENDA</TableHead>
                        <TableHead>MENSUAL (kWh)</TableHead>
                        <TableHead>DIARIO (kWh)</TableHead>
                        <TableHead>L. PROM (A)</TableHead>
                        <TableHead>L. PICO (A)</TableHead>
                        <TableHead>P. PROM (kW)</TableHead>
                        <TableHead>P. PICO (kW)</TableHead>
                        <TableHead>R. PROM (Ω)</TableHead>
                        <TableHead>R. PICO (Ω)</TableHead>
                        <TableHead>JOULE PROM (kW)</TableHead>
                        <TableHead>JOULE PICO (kW)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {viviendasData.map((casa) => (
                        <TableRow key={casa.id}>
                          <TableCell className="font-medium">Casa {casa.id}</TableCell>
                          <TableCell>{casa.mensual}</TableCell>
                          <TableCell>{casa.diario}</TableCell>
                          <TableCell>{casa.lProm}</TableCell>
                          <TableCell>{casa.lPico}</TableCell>
                          <TableCell>{casa.pProm}</TableCell>
                          <TableCell>{casa.pPico}</TableCell>
                          <TableCell>{casa.rProm}</TableCell>
                          <TableCell>{casa.rPico}</TableCell>
                          <TableCell>{casa.jouleProm}</TableCell>
                          <TableCell>{casa.joulePico}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="graficas">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Potencia vs Corriente */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Potencia vs Corriente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BarChartComponent
                    data={viviendasData.map(c => ({
                      name: `Casa ${c.id}`,
                      Promedio: c.pProm,
                      Pico: c.pPico
                    }))}
                    bars={[
                      { dataKey: 'Promedio', name: 'Potencia Promedio', color: '#3b82f6' },
                      { dataKey: 'Pico', name: 'Potencia Pico', color: '#ef4444' }
                    ]}
                    xAxisKey="name"
                    height={300}
                  />
                  <div className="flex justify-center gap-6 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span>Promedio</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span>Pico</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Efecto Joule por Casa */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Thermometer className="w-5 h-5" />
                    Efecto Joule por Casa (kW)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BarChartComponent
                    data={viviendasData.map(c => ({
                      name: `Casa ${c.id}`,
                      Promedio: c.jouleProm,
                      Pico: c.joulePico
                    }))}
                    bars={[
                      { dataKey: 'Promedio', name: 'Joule Promedio', color: '#3b82f6' },
                      { dataKey: 'Pico', name: 'Joule Pico', color: '#ef4444' }
                    ]}
                    xAxisKey="name"
                    height={300}
                  />
                </CardContent>
              </Card>

              {/* Consumo Mensual */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Consumo Mensual por Vivienda (kWh)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BarChartComponent
                    data={viviendasData.map(c => ({
                      name: `Casa ${c.id}`,
                      consumo: c.mensual
                    }))}
                    bars={[
                      { dataKey: 'consumo', name: 'Consumo Mensual', color: '#3b82f6' }
                    ]}
                    xAxisKey="name"
                    height={300}
                  />
                </CardContent>
              </Card>

              {/* Curva de Demanda Diaria */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Curva de Demanda Diaria (kW)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LineChartComponent
                    data={demandaDiaria}
                    lines={[
                      { dataKey: 'kw', name: 'Demanda', color: '#f59e0b' }
                    ]}
                    xAxisKey="hora"
                    height={300}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="simulador">
            <Card>
              <CardHeader>
                <CardTitle>Simulador y Alertas (Tiempo Real)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Gauge className="w-5 h-5" />
                      Corriente Principal Simulada
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">CARGA SISTEMA</span>
                          <span className="text-sm font-bold text-blue-600">{simuladorCarga}%</span>
                        </div>
                        <Slider 
                          value={simuladorCarga}
                          onChange={setSimuladorCarga}
                          min={0}
                          max={100}
                        />
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Corriente Actual</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                              {corrienteSimulada} A
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Efecto Joule</p>
                            <p className="text-3xl font-bold text-red-600">
                              {efectoJouleSimulado.toFixed(2)} kW
                            </p>
                          </div>
                        </div>

                        {/* Barra de progreso de capacidad */}
                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>0A</span>
                            <span>125A</span>
                            <span>250A</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-600 transition-all duration-300"
                              style={{ width: `${(corrienteSimulada / 250) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          onClick={() => setCorrienteSimulada(prev => Math.min(prev + 10, 250))}
                          className="flex-1"
                        >
                          +10 A
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setCorrienteSimulada(prev => Math.max(prev - 10, 0))}
                          className="flex-1"
                        >
                          -10 A
                        </Button>
                        <Button 
                          variant="secondary"
                          onClick={() => setCorrienteSimulada(123)}
                          className="flex-1"
                        >
                          Reset
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Alertas y Estado del Sistema
                    </h3>
                    
                    <Alert variant="success" className="mb-4">
                      <div>
                        <p className="font-medium mb-1">✅ Sistema Estable</p>
                        <p className="text-sm">Operación normal. Todos los parámetros dentro de rangos seguros.</p>
                      </div>
                    </Alert>

                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Límite de corriente:</span>
                        <span className="font-medium">250 A</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Capacidad utilizada:</span>
                        <span className={`font-medium ${corrienteSimulada > 200 ? 'text-red-600' : 'text-green-600'}`}>
                          {((corrienteSimulada / 250) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Resistencia línea:</span>
                        <span className="font-medium">{R_LINEA} Ω</span>
                      </div>
                      
                      {corrienteSimulada > 200 && (
                        <Alert variant="warning" className="mt-4">
                          <p className="text-sm font-medium">⚠️ Alta corriente detectada</p>
                          <p className="text-xs">El sistema está cerca del límite máximo</p>
                        </Alert>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 mt-4 italic">
                      * El Efecto Joule estimado se calcula utilizando P = I²R asumiendo R = {R_LINEA}Ω para la línea troncal simulada.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-700 mt-8 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          WATIOS - Sistema de Monitoreo Eléctrico v1.0 | Datos actualizados en tiempo real
        </div>
      </footer>
    </div>
  );
}

export default App;