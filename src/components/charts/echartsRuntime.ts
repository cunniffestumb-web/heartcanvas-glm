import * as echarts from 'echarts/core'
import { BarChart, GraphChart, LineChart, MapChart, RadarChart } from 'echarts/charts'
import {
  AriaComponent,
  GridComponent,
  LegendComponent,
  RadarComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  LineChart,
  MapChart,
  RadarChart,
  BarChart,
  GraphChart,
  GridComponent,
  LegendComponent,
  RadarComponent,
  TooltipComponent,
  VisualMapComponent,
  AriaComponent,
  CanvasRenderer,
])

export { echarts }
