type Handler<T = any> = (payload: T) => void;

class EventBus {
  private listeners = new Map<string, Set<Handler>>();

  on<T = any>(event: string, handler: Handler<T>) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(handler as Handler);
    return () => this.off(event, handler);
  }

  off<T = any>(event: string, handler: Handler<T>) {
    this.listeners.get(event)?.delete(handler as Handler);
  }

  emit<T = any>(event: string, payload: T) {
    this.listeners.get(event)?.forEach(h => h(payload));
  }
}

export const events = new EventBus();

export type ToastPayload = {
  title?: string;
  message: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  timeoutMs?: number;
};

export const notify = (p: ToastPayload) => events.emit<ToastPayload>('toast', p);
