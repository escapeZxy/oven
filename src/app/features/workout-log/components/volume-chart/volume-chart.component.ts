import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartData } from '../../services/workout-statistics.service';

@Component({
  selector: 'app-volume-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h3 class="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <span class="w-1 h-6 bg-indigo-500 rounded-full block"></span>
        {{ title() }}
      </h3>
      
      @if (data().length > 0) {
        <div class="space-y-2">
          <!-- Chart Area -->
          <div class="relative h-48 flex items-end justify-between gap-2 pb-px border-b border-slate-200">
            <!-- Grid Lines -->
            <div class="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div class="border-t border-dashed border-slate-100 w-full h-0"></div>
              <div class="border-t border-dashed border-slate-100 w-full h-0"></div>
              <div class="border-t border-dashed border-slate-100 w-full h-0"></div>
              <div class="border-t border-dashed border-slate-100 w-full h-0"></div>
            </div>

            <!-- Bars -->
            @for (item of data(); track item.label) {
              <div class="relative flex-1 h-full flex items-end justify-center group z-10">
                
                <!-- Tooltip -->
                <div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-lg translate-y-2 group-hover:translate-y-0">
                  {{ item.value | number:'1.0-0' }} kg
                  <div class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-800"></div>
                </div>

                <!-- Bar -->
                <div 
                  class="w-full max-w-[24px] bg-indigo-100 rounded-t-sm transition-all duration-500 ease-out group-hover:bg-indigo-500 relative overflow-hidden"
                  [style.height.%]="getPercentage(item.value)"
                >
                  <!-- Inner Bar for animation/gradient effect -->
                  <div class="absolute bottom-0 left-0 right-0 top-0 bg-indigo-500 opacity-80 group-hover:opacity-100"></div>
                </div>
              </div>
            }
          </div>

          <!-- Labels -->
          <div class="flex justify-between gap-2">
            @for (item of data(); track item.label) {
              <div class="flex-1 text-center">
                <div class="text-[10px] text-slate-400 font-medium truncate leading-tight">{{ item.label }}</div>
              </div>
            }
          </div>
        </div>
      } @else {
        <div class="h-48 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-xl border-dashed border-2 border-slate-200">
          <svg class="w-10 h-10 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          <span class="text-sm">暂无训练数据</span>
        </div>
      }
    </div>
  `
})
export class VolumeChartComponent {
  title = input.required<string>();
  data = input.required<ChartData[]>();

  maxVal = computed(() => {
    const max = Math.max(...this.data().map(d => d.value), 0);
    return max === 0 ? 1 : max;
  });

  getPercentage(value: number): number {
    return (value / this.maxVal()) * 100;
  }
}
