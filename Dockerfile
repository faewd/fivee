FROM node:24-slim as builder

RUN npm install -g deno

# Copy source
WORKDIR /app
COPY . .

# Cache Deno dependencies
ARG PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
RUN deno cache main.ts

# Build the docs
WORKDIR /app/docs
RUN yarn
RUN yarn build


FROM denoland/deno:latest

ENV PORT=8000
ENV ENVIRONMENT=prod

# Copy Application Files
WORKDIR /app
COPY --from=builder /app .

# Install Chrome for Puppeteer
RUN apt update -y && apt upgrade -y && apt-get install -y chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Generate Data
ENV DENO_KV_URL=/app/.kvdata
RUN deno task db:init

HEALTHCHECK --interval=30s --timeout=3s \
            --start-period=10s --retries=3 \
            CMD deno eval "try { await fetch('http://localhost:${PORT}'); } catch { Deno.exit(1); }"


EXPOSE ${PORT}
CMD ["deno", "task", "start"]
