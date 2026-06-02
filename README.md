# aesthetix-clinic

Management system for advanced aesthetic clinics. Handles patient records, procedure history, before/after photos, health questionnaires, appointment scheduling, and stock control — built for clinics doing botox, fillers, laser, and skin treatments.

## Problem

Aesthetic clinics are one of the fastest-growing businesses in Brazil, but most manage clients in WhatsApp, photos in phone galleries, and stock on paper. When a client comes back 6 months later, the professional has no idea what was applied, at what concentration, or how the client reacted. This app centralizes everything.

## Features

- **Client anamnesis**: full health questionnaire (allergies, medications, contraindications)
- **Procedure records**: what was applied, product, concentration, ml, location on body
- **Before/after photos**: organized per procedure and client
- **Appointment scheduling**: per professional, with room/equipment assignment
- **Consent forms**: digital, stored permanently per session
- **Stock control**: product inventory, expiry alerts, usage per procedure
- **Financial**: procedure revenue, commission per professional

## Screenshots

```
┌─────────────────────────────────────────────────────────┐
│  AESTHETIX CLINIC                                       │
├──────────┬──────────────────────────────────────────────┤
│ Clients  │  Maria Silva — últimas sessões               │
│ Calendar │  ┌──────────────────────────────────────────┐│
│ Stock    │  │ 15/05 Botox testa — 20u Botox® — Dra. Ana││
│ Reports  │  │ 10/03 Preench. lábios — 1ml Juvederm®    ││
│          │  │ 12/01 Laser CO₂ — sessão 2/6             ││
│          │  └──────────────────────────────────────────┘│
└──────────┴──────────────────────────────────────────────┘
```

## Quick start

```bash
git clone https://github.com/evilkobayashi/aesthetix-clinic
cd aesthetix-clinic
npm install
cp .env.example .env.local
npx prisma migrate dev
npm run dev
# open http://localhost:3000
```

## Database schema

```
Client       — name, cpf, phone, email, birth_date, anamnesis
Professional — name, specialty, council_number
Appointment  — clientId, professionalId, date, room, status
Procedure    — appointmentId, name, product, concentration, quantity_ml
               body_location, notes, before_photo, after_photo
Product      — name, brand, batch, expiry_date, stock_units
Consent      — appointmentId, signed_at, content
```

## Real-world use cases

- **Botox/filler clinics**: track every vial, concentration, and location applied
- **Laser clinics**: manage multi-session protocols (6 sessions of X)
- **Skin clinics**: before/after documentation for treatment evidence
- **ANVISA compliance**: maintain procedure records for regulatory audits

## Stack

`Next.js 14` `TypeScript` `Prisma` `SQLite` `Tailwind CSS` `Docker`
