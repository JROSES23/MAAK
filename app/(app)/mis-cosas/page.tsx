"use client";

import { useState, useMemo } from "react";
import {
  CalendarRange,
  Plus,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Clock,
  Trash2,
  Flag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Card } from "@/components/ui/Card";
import { plannerTasksMock } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { PlannerTask, Prioridad } from "@/lib/types";

const PRIORIDAD_STYLES: Record<Prioridad, { badge: "danger" | "warning" | "info" | "default"; label: string }> = {
  urgente: { badge: "danger", label: "Urgente" },
  alta: { badge: "warning", label: "Alta" },
  media: { badge: "info", label: "Media" },
  baja: { badge: "default", label: "Baja" },
};

const DAYS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

function getMonthDays(year: number, month: number) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const days: (number | null)[] = [];
  let startDay = first.getDay() - 1;
  if (startDay < 0) startDay = 6;
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let d = 1; d <= last.getDate(); d++) days.push(d);
  return days;
}

export default function MisCosasPage() {
  const [tasks, setTasks] = useState<PlannerTask[]>(plannerTasksMock);
  const [currentMonth, setCurrentMonth] = useState(2);
  const [currentYear, setCurrentYear] = useState(2026);
  const [showNewTask, setShowNewTask] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const [newTask, setNewTask] = useState({
    titulo: "",
    descripcion: "",
    fecha: "",
    prioridad: "media" as Prioridad,
    recordatorio: "",
  });

  const monthDays = useMemo(() => getMonthDays(currentYear, currentMonth), [currentYear, currentMonth]);
  const monthName = new Date(currentYear, currentMonth).toLocaleDateString("es-CL", { month: "long", year: "numeric" });
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const tareasHoy = tasks.filter((t) => t.fecha === todayStr && !t.completada);
  const tareasAtrasadas = tasks.filter((t) => t.fecha < todayStr && !t.completada);
  const tareasCompletadas = tasks.filter((t) => t.completada);
  const tareasPendientes = tasks.filter((t) => !t.completada);

  const tasksByDay = useMemo(() => {
    const map: Record<number, PlannerTask[]> = {};
    tasks.forEach((t) => {
      const d = new Date(t.fecha + "T12:00:00");
      if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
        const day = d.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(t);
      }
    });
    return map;
  }, [tasks, currentMonth, currentYear]);

  const toggleTask = (id: string) => setTasks(tasks.map((t) => (t.id === id ? { ...t, completada: !t.completada } : t)));
  const deleteTask = (id: string) => setTasks(tasks.filter((t) => t.id !== id));

  const handleAddTask = () => {
    const task: PlannerTask = {
      id: `task${Date.now()}`,
      titulo: newTask.titulo,
      descripcion: newTask.descripcion,
      fecha: newTask.fecha,
      prioridad: newTask.prioridad,
      completada: false,
    };
    setTasks([...tasks, task]);
    setShowNewTask(false);
    setNewTask({ titulo: "", descripcion: "", fecha: "", prioridad: "media", recordatorio: "" });
  };

  const prevMonth = () => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); } else setCurrentMonth(currentMonth - 1); };
  const nextMonth = () => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); } else setCurrentMonth(currentMonth + 1); };

  const displayTasks = selectedDay
    ? tasksByDay[selectedDay] || []
    : tareasPendientes.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  return (
    <div className="space-y-6">
      <SectionHeader title="Planner" subtitle="Tareas y recordatorios personales" icon={CalendarRange} action={<Button icon={Plus} onClick={() => setShowNewTask(true)}>Nueva tarea</Button>} />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Tareas hoy" value={tareasHoy.length.toString()} sublabel={todayStr} icon={Clock} />
        <StatCard label="Atrasadas" value={tareasAtrasadas.length.toString()} sublabel="Requieren atencion" icon={AlertTriangle} />
        <StatCard label="Completadas" value={tareasCompletadas.length.toString()} sublabel="Este mes" icon={CheckCircle2} />
        <StatCard label="Pendientes" value={tareasPendientes.length.toString()} sublabel="Total" icon={Flag} />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Calendario */}
        <Card className="lg:col-span-3" padding="md">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="rounded-lg p-1.5 text-[var(--color-muted)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text)]">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h3 className="text-sm font-semibold capitalize text-[var(--color-text)]">{monthName}</h3>
            <button onClick={nextMonth} className="rounded-lg p-1.5 text-[var(--color-muted)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text)]">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map((d) => (<div key={d} className="text-center text-xs font-medium text-[var(--color-muted)] py-1">{d}</div>))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {monthDays.map((day, idx) => {
              if (day === null) return <div key={`e-${idx}`} />;
              const dayTasks = tasksByDay[day] || [];
              const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
              const isSelected = day === selectedDay;

              return (
                <button key={day} onClick={() => setSelectedDay(day === selectedDay ? null : day)} className={cn("relative flex flex-col items-center rounded-xl p-2 text-sm min-h-[3.5rem] transition-colors", isToday && "ring-1 ring-[var(--color-accent)]", isSelected ? "bg-[var(--color-accent)]/15 text-[var(--color-accent)]" : "hover:bg-[var(--color-surface-alt)] text-[var(--color-text)]")}>
                  <span className={cn("text-xs font-medium", isToday && "text-[var(--color-accent)]")}>{day}</span>
                  {dayTasks.length > 0 && (
                    <div className="flex gap-0.5 mt-1">
                      {dayTasks.slice(0, 3).map((t) => (<div key={t.id} className={cn("h-1.5 w-1.5 rounded-full", t.completada ? "bg-emerald-400" : t.prioridad === "urgente" ? "bg-red-400" : t.prioridad === "alta" ? "bg-amber-400" : "bg-[var(--color-accent)]")} />))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Lista de tareas */}
        <Card className="lg:col-span-2" padding="md">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">
            {selectedDay ? `Tareas del ${selectedDay}` : "Todas las tareas pendientes"}
          </h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {displayTasks.length === 0 ? (
              <p className="text-sm text-[var(--color-muted)] text-center py-8">No hay tareas</p>
            ) : (
              displayTasks.map((task) => (
                <div key={task.id} className={cn("rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3 space-y-2", task.completada && "opacity-60")}>
                  <div className="flex items-start gap-2">
                    <button onClick={() => toggleTask(task.id)} className="mt-0.5 flex-shrink-0">
                      {task.completada ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Circle className="h-4 w-4 text-[var(--color-muted)]" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm font-medium", task.completada ? "line-through text-[var(--color-muted)]" : "text-[var(--color-text)]")}>{task.titulo}</p>
                      {task.descripcion && <p className="text-xs text-[var(--color-muted)] mt-0.5">{task.descripcion}</p>}
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant={PRIORIDAD_STYLES[task.prioridad].badge}>{PRIORIDAD_STYLES[task.prioridad].label}</Badge>
                        <span className="text-[10px] text-[var(--color-muted)]">{task.fecha}</span>
                      </div>
                    </div>
                    <button onClick={() => deleteTask(task.id)} className="flex-shrink-0 rounded-lg p-1 text-[var(--color-muted)] hover:text-red-400">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Modal nueva tarea */}
      <Modal open={showNewTask} onClose={() => setShowNewTask(false)} title="Nueva tarea">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--color-text-secondary)]">Titulo</label>
            <input type="text" value={newTask.titulo} onChange={(e) => setNewTask({ ...newTask, titulo: e.target.value })} placeholder="Nombre de la tarea" className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--color-text-secondary)]">Descripcion</label>
            <textarea value={newTask.descripcion} onChange={(e) => setNewTask({ ...newTask, descripcion: e.target.value })} rows={2} placeholder="Detalle..." className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none resize-none" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">Fecha limite</label>
              <input type="date" value={newTask.fecha} onChange={(e) => setNewTask({ ...newTask, fecha: e.target.value })} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">Prioridad</label>
              <select value={newTask.prioridad} onChange={(e) => setNewTask({ ...newTask, prioridad: e.target.value as Prioridad })} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none">
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">Recordatorio</label>
              <input type="text" value={newTask.recordatorio} onChange={(e) => setNewTask({ ...newTask, recordatorio: e.target.value })} placeholder="Ej: cada 10 del mes" className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setShowNewTask(false)}>Cancelar</Button>
            <Button onClick={handleAddTask} disabled={!newTask.titulo || !newTask.fecha}>Crear tarea</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
