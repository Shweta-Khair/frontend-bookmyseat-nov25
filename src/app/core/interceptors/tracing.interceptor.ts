import { HttpInterceptorFn } from '@angular/common/http';

export const tracingInterceptor: HttpInterceptorFn = (req, next) => {
  // Generate trace IDs (simplified version)
  const traceId = generateTraceId();
  const spanId = generateSpanId();

  const tracedReq = req.clone({
    setHeaders: {
      'X-B3-TraceId': traceId,
      'X-B3-SpanId': spanId
    }
  });

  return next(tracedReq);
};

function generateTraceId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function generateSpanId(): string {
  return Math.random().toString(36).substring(2, 18);
}