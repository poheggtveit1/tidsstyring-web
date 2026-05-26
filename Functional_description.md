# Funksjonell beskrivelse – MBN Web Jobbprofil

> Versjon: prototype  
> Dato: 2026-05-26

---

## Innholdsfortegnelse

1. [Oversikt](#1-oversikt)
2. [Navigasjon og appstruktur](#2-navigasjon-og-appstruktur)
3. [Tilstandsmodell (store)](#3-tilstandsmodell-store)
4. [Sentralbord – startside](#4-sentralbord--startside)
5. [Sentralbord – hovedvisning](#5-sentralbord--hovedvisning)
6. [Mitt MBN – På jobb (Jobbprofil)](#6-mitt-mbn--på-jobb-jobbprofil)
7. [Tidsstyring](#7-tidsstyring)
8. [Avslutt-dialog](#8-avslutt-dialog)
9. [Innstillinger](#9-innstillinger)

---

## 1. Oversikt

Applikasjonen er en prototype for **MBN Web – Jobbprofil**, et grensesnitt for operatørstyring av telefonkøer og jobbprofil. Den har to primære faner:

| Fane | Formål |
|------|--------|
| **Sentralbord** | Håndtering av innkommende kø-anrop, køpålogging og køstatus i sanntid |
| **Mitt MBN** | Styring av jobbprofil, visningsnummer, køaktivering og tidsstyring |

Felles funksjonalitet: tidsstyrt automatisk på-/avlogging av køer (Tidsstyring) og manuell avlogging via Avslutt-dialog.

---

## 2. Navigasjon og appstruktur

### Faner (TopNav)
- **Sentralbord / Mitt MBN** – segmentert kontroll øverst i midten.
- Bytte av fane nullstiller `sentralbordStarted` slik at startsiden vises på nytt neste gang Sentralbord-fanen åpnes.

### Verktøylinje (TopNav – høyre side)
- Versjonsnummer-chip (statisk, viser `v.#.##.#`)
- Varsler-, meldings- og pause-ikonknapper (ingen implementert funksjon)
- **Avslutt**-knapp – åpner Avslutt-dialogen

### Visningsnivåer i App
| Tilstand | Hva vises |
|----------|-----------|
| `view = 'settings'` | Innstillinger-siden |
| `navTab = 'sentralbord'` og `!sentralbordStarted` | Sentralbord startside |
| `navTab = 'sentralbord'` og `sentralbordStarted` | Sentralbord hovedvisning |
| `navTab = 'mitt-mbn'` | Mitt MBN |

---

## 3. Tilstandsmodell (store)

Applikasjonen bruker **Zustand** med `persist`-middleware. Tilstanden lagres i `localStorage` under nøkkelen `jobbprofil-state` (skjemaversjon 11). All tilstand persisteres mellom sesjoner.

### Kjernefelt

| Felt | Type | Beskrivelse |
|------|------|-------------|
| `enabled` | `boolean` | «På jobb»-masterbryteren. Styrer om Jobbprofil er aktiv. |
| `queues` | `Queue[]` | Liste over tre køer (Administrasjon, Support, Verksted) med `active`, `inQueue`, `waitTime`, `operatorsActive`, `operatorsTotal` og valgfri `paused`-flagg. |
| `lastActiveQueueIds` | `string[]` | Køer som var aktive sist `enabled` ble slått av. Gjenopprettes automatisk når `enabled` slås på igjen. |
| `lastSessionQueueIds` | `string[]` | Køer som var aktive da brukeren sist logget ut via Avslutt. **Aldri nullstilt av utlogging** – brukes som husket valg til neste sesjon. |
| `selectedDisplayNumberId` | `string` | Aktivt visningsnummer. Valg av «Mitt nummer» tvinger `externalOnly` til `false`. Alle andre valg setter `externalOnly` til `true`. |
| `externalOnly` | `boolean` | «Bruk kun for eksterne samtaler»-bryter. |
| `tidsstyringActive` | `boolean` | Om tidsstyringen er aktivert. |
| `tidsstyringConfigured` | `boolean` | Settes `true` etter at veiviseren er fullført minst én gang; settes `false` hvis alle tidsperioder slettes. |
| `timePeriods` | `TimePeriod[]` | Liste over konfigurerte tidsperioder. Hver periode inneholder `timeFrom`, `timeTo`, `days[]`, `displayNumberId`, `externalOnly` og `queueAssignments`. |
| `loginMode` | `'automatisk' \| 'paminnelse'` | Om tidsstyringen logger automatisk på/av, eller bare sender påminnelse. |

### Køhandlinger

| Handling | Hva den gjør |
|----------|-------------|
| `setEnabled(true)` | Gjenoppretter køer fra `lastActiveQueueIds`; inkrementerer `operatorsActive`. |
| `setEnabled(false)` | Lagrer aktive køer i `lastActiveQueueIds`; deaktiverer alle køer. |
| `setQueuesActive(states)` | Setter `active` for hver kø basert på sendt map; justerer `operatorsActive`. |
| `toggleQueueActive(id)` | Veksler én køs aktive tilstand. |
| `logoutQueues()` | Lagrer aktive køer i `lastSessionQueueIds`, deaktiverer deretter alle køer. Kalles ved manuell utlogging. |

---

## 4. Sentralbord – startside

Startsiden vises kun i to tilfeller:
- **Første gangs oppstart** – `sentralbordStarted` er `false` ved appoppstart.
- **Etter utlogging fra køer** – «Logg meg ut av køene mine» i Avslutt-dialogen (eller full brukerutlogging) nullstiller `sentralbordStarted`.

Bytte mellom Sentralbord- og Mitt MBN-fanene tilbakestiller **ikke** lenger startsiden; brukeren vender tilbake til der de var.

### Seksjoner

#### 4.1 Hilsen
Statisk: «God dag, Kari Nordmann!»

#### 4.2 Tidsstyring-statusblokk
Vises kun dersom `tidsstyringConfigured = true`.

| Indikator | Grønn prikk + «Tidsstyring er aktiv» |
|-----------|--------------------------------------|
| Inaktiv | Grå prikk + «Tidsstyring er av» |

Dersom tidsstyringen er aktiv og `prevLabel` / `nextLabel` er ikke-tomme, vises:
- **Gjeldende:** `[prevLabel]` – f.eks. «Pålogget 08:00»
- **Neste:** `[nextLabel]` – f.eks. «Logges av 16:00»

Hjelpetekst under statusblokken:

| Situasjon | Tekst |
|-----------|-------|
| Aktiv periode ELLER kommende periode < 60 min | «Tidsstyring har valgt køene nedenfor.» |
| Ingen aktiv tidsstyring | «Køene er valgt fra forrige økt.» |

#### 4.3 Køseksjon – tre visningsmoduser

| Modus | Betingelse | Utseende |
|-------|-----------|---------|
| **Read-only – aktiv periode** | `queuesReadOnly = true` (dvs. `tidsstyringActive && inPeriod`) | Overskrift «Køer du er logget på av tidsstyringen». Viser kun aktive køer som ren tekst – ingen avkrysningsbokser. |
| **Redigerbare avkrysningsbokser** | Alt annet | Overskrift «Velg hvilke køer du vil betjene». Alle køer vises med avkrysningsboks. |

**Forhåndsvalg av avkrysningsbokser** (beregnet én gang ved komponentmontering):

```
1. Tidsstyring konfigurert & aktiv OG getUpcomingPeriod() ≠ null
   → Forhåndsvalg fra kommende periodes queueAssignments (< 60 min til start)

2. Ellers
   → Forhåndsvalg fra lastSessionQueueIds (husket fra forrige utlogging)
   → Hvis lastSessionQueueIds er tom (første sesjon): ingen avkrysningsbokser merket
```

Brukeren kan endre utvalget manuelt uansett forhåndsvalg.

#### 4.4 Ringeprofil
Statisk visning av rekkefølgen telefoner ringer:
1. 916 88 677 (Kontaktnummer)
2. 478 33 684 (Tvilling)
3. 67 13 67 04 (Softphone)

Knappen «Endre hvordan du besvarer kø-anrop» er ikke implementert.

#### 4.5 Start sentralbord-knapp
Ved klikk:
1. `setQueuesActive(selected)` – aktiverer de valgte køene i store.
2. `onStart()` – setter `sentralbordStarted = true`, navigerer til hovedvisningen.

---

## 5. Sentralbord – hovedvisning

### 5.1 IKø-panel (I kø)
Statisk liste over tre kø-anrop:

| Navn | Kø | Ventetid | Type |
|------|----|----------|------|
| Hedda Haugen | Resepsjon | – | Tildelt operatør |
| Lucas Jørgensen Varberg | Kundeservice | 24:38 | VIP (rød bakgrunn, blå VIP-badge) |
| Isak Lie | Kundeservice | 19:31 | Standard |

### 5.2 Mine køer-panel

**Tre-prikker-meny (header):**
- **Anropsdistribusjon** – ingen handling implementert
- **Tidsstyring** – kaller `onOpenTidsstyring()`:
  - Dersom `tidsstyringConfigured`: navigerer til Innstillinger-siden
  - Ellers: åpner Tidsstyring-veiviseren

**Tidsstyring-statusblokk** (kun hvis `tidsstyringConfigured`):
Viser «Tidsstyring» med grønn/grå prikk og «På»/«Av». Dersom aktiv: «Gjeldende:» og «Neste:» (høyrejustert).

**Køliste:**
Én rad per kø med:
- Toggle for individuell køaktivering (`toggleQueueActive`)
- Kønavn (avkortet)
- Antall i kø (eller «–»)
- Ventetid (eller «–»)
- Operatørforhold (aktive / totalt)
- Per-rad menyknapp (ikke implementert)

Kolonneoverskrifter: «Kønavn ↓», «I kø», «Tid», «Operatører»

---

## 6. Mitt MBN – På jobb (Jobbprofil)

### 6.1 Masterbryteren «På jobb»

**Slå AV:**
- `setEnabled(false)` → lagrer aktive køer i `lastActiveQueueIds`, deaktiverer alle køer.

**Slå PÅ:**
- `setEnabled(true)` → gjenoppretter køer fra `lastActiveQueueIds` (standard store-logikk).
- Dersom `tidsstyringConfigured = true`, overstyres deretter:

  | Situasjon | Handling |
  |-----------|---------|
  | Kommende periode starter < 60 min (`getUpcomingPeriod() ≠ null`) | Aktiverer kommende periodes køer; setter visningsnummer til periodens `displayNumberId` |
  | Ingen kommende periode OG `lastSessionQueueIds.length > 0` | Aktiverer køene fra `lastSessionQueueIds` |
  | Ingen kommende periode OG `lastSessionQueueIds` er tom | Ingen ytterligere endring (bare `lastActiveQueueIds` gjenopprettes) |

### 6.2 Tidsstyring-visning i Jobbprofil

**Tilstand 1 – Ikke konfigurert:**
Enkelt rad: «Tidsstyring» + «Aktiver»-knapp som åpner veiviseren.

**Tilstand 2 – Konfigurert:**
Rad med grønn/grå prikk og «På»/«Av». Dersom aktiv:
- «Gjeldende: [label]» (vises hvis `prevLabel` er ikke-tom)
- «Neste: [label]» (vises hvis `nextLabel` er ikke-tom)

Statusen oppdateres automatisk hvert 30. sekund.

**Tre-prikker-meny:**
- «Tidsstyring» → navigerer til Innstillinger (om konfigurert) eller åpner veiviseren.

### 6.3 Visningsnummer
Nedtrekksliste med 5 alternativer. Valg av «Mitt nummer» deaktiverer og skjuler «Bruk kun for eksterne samtaler»-bryteren.

### 6.4 Ekstern-bryter
«Bruk kun for eksterne samtaler» – skjult når `selectedDisplayNumberId = 'mitt-nummer'` eller `!enabled`.

### 6.5 QueueTable (køtabell)
HTML-tabell under Jobbprofil-panelet. Viser alle køer med toggle, kønavn+nummer, I kø, Tid og operatørforhold. Paused-køer vises med gul bakgrunn og «På pause»-tekst. Header har tre-prikker-meny med «Anropsdistribusjon» (ingen handling).

---

## 7. Tidsstyring

### 7.1 Statusberegning

`computeTidsstyringStatus(periods, isActive, activeQueueIds?)` beregner dynamisk status. Kaller `new Date()` for gjeldende tidspunkt.

| Situasjon | `inPeriod` | `prevLabel` | `nextLabel` |
|-----------|-----------|-------------|-------------|
| `!isActive` eller ingen perioder | `false` | `''` | `''` |
| Ingen perioder i dag | `false` | `''` | `''` |
| Inne i en periode (nå ≥ `timeFrom` og nå < `timeTo`) | `true` | `'Pålogget HH:MM'` | `'Ny periode HH:MM'` (hvis back-to-back) eller `'Logges av HH:MM'` |
| Mellom perioder | `false` | `'Avlogget HH:MM'` (siste avsluttede periode) | Se under |

Søk etter neste periode skanner opptil 6 dager frem. Neste dag returneres som «i morgen»; øvrige dager som norsk ukedagnavn i små bokstaver.

**«Neste»-label mellom perioder** — dersom `activeQueueIds` er oppgitt og det finnes en neste periode i dag, sammenlignes gjeldende aktive køer med neste periodes `loggedIn`-køer:

| Situasjon | `nextLabel` |
|-----------|-------------|
| Gjeldende køer **samsvarer** med neste periodes køer | `'Logges av HH:MM'` — periodeslutten er den neste faktiske hendelsen |
| Gjeldende køer **avviker** fra neste periodes køer | `'Logges på HH:MM'` — neste periodestart medfører en endring |
| Ingen neste periode i dag | `'Logges på [dag] HH:MM'` (fremtidig dag) eller tom |

Alle visningssteder som viser `nextLabel` (Sentralbord startside, Mine køer, Jobbprofil, Avslutt-dialog) sender inn gjeldende aktive køer som `activeQueueIds`.

### 7.2 Kommende periode (60-minuttersvinduet)

`getUpcomingPeriod(periods)` brukes for å avgjøre om neste periode er nær nok til å forhåndsvelge køer.

- Returnerer `null` hvis vi er **inne i** en aktiv periode.
- Returnerer `null` hvis neste periode på samme dag starter **60 minutter eller mer** frem i tid.
- Returnerer neste `TimePeriod` hvis den starter **mindre enn 60 minutter** frem i tid (kun samme dag).

Brukes i:
- **Sentralbord startside** – forhåndsvalg av køer
- **Jobbprofil-toggle** – automatisk valg av køer ved aktivering

### 7.3 Veiviser (TidsstyringDialog)

5-trinns modal:

| Trinn | Innhold |
|-------|---------|
| `info` | Introduksjon til tidsstyring |
| `tidsperiode` | Velg fra/til-tid (HH:MM-felt med klikkbart klokkikon som åpner native tidvelger) |
| `visningsnummer` | Velg visningsnummer fra liste + eksternt-bryter |
| `koer` | Kryss av hvilke køer som skal logges på (SMS-varsling kobles til ved avkryssing) |
| `paa-og-avlogging` | Velg «Automatisk» eller «Påminnelse» + ukedager (hverdager forvalgt) |

Avbryt (X-knapp eller backdrop) avbryter alltid uten lagring. «Aktiver tidsstyring»-knappen på siste trinn:
1. Oppdaterer `selectedDisplayNumber`, `externalOnly`, køer, tidsstyringsfelt og `loginMode` i store.
2. Kaller `finalizeWizardPeriod()` – snapper gjeldende flatfelt inn i `timePeriods[0]`.
3. Setter `enabled = true` og `tidsstyringActive = true`.

### 7.4 Koplingslinje: Pålogget ↔ SMS-varsling
I veiviseren: avkryssing av «Pålogget» setter automatisk «MBN SMS-varsling» til avkrysset. Frakobling av «Pålogget» fjerner automatisk «MBN SMS-varsling». Omvendt kobling gjelder ikke.

### 7.5 Tidsperiodehandlinger (Innstillinger)
- **LeggTilTidsperiodeDialog** – legger til ny periode i `timePeriods`-listen. Tidsinputfeltene har et klikkbart klokkikon som kaller `showPicker()` på `<input type="time">`.
- **EndreTidsperiodeDialog** – redigerer eksisterende periode. Samme klikkbare klokkikon som over.
- **SlettTidsperiodeDialog** – sletter en periode. Hvis alle perioder slettes, settes `tidsstyringConfigured = false` og `tidsstyringActive = false`.

---

## 8. Avslutt-dialog

Åpnes fra «Avslutt»-knappen i TopNav. Rendret via React Portal (z-index 200).

### Tidsstyring-statusblokk
Vises kun hvis `tidsstyringConfigured`. Samme format som andre steder (prikk + «er aktiv/er av», Gjeldende, Neste). Under radioknappene, hvis `tidsstyringActive = true`:
> «Tidsstyringen vil fortsatt være aktiv selv om du velger å logge ut eller forbli pålogget.»

### Valg

**Radioknapper (køhåndtering):**
- «Logg meg ut av køene mine» *(standardvalg)*
- «Forbli pålogget køene mine»

**Avkrysningsboks:**
- «Logg meg også helt ut som bruker» *(ikke avkrysset som standard)*

### Handlinger ved «Avslutt»

| `logoutUser` | `logoutQueues` | Resultat |
|-------------|---------------|---------|
| `true` | (irrelevant) | `reset()` – full tilbakestilling til initial tilstand. Alle data slettes. |
| `false` | `true` | `logoutQueues()` → lagrer aktive køer i `lastSessionQueueIds`, deaktiverer alle køer. Deretter `setEnabled(false)`. |
| `false` | `false` | Ingen tilstandsendring – dialogen lukkes uten effekt. |

Klikk på bakgrunn lukker dialogen uten handling.

---

## 9. Innstillinger

Navigeres til via tre-prikker-meny i Jobbprofil-panelet («Tidsstyring»-valget) eller via Innstillinger-ikonet i TopNav.

### Venstre sidepanel
8 navigasjonselementer (Tidsstyring, Språk, Viderekobling, Mine numre, Visningsnummer, Hurtigtaster, Meldingsmaler, Illustrasjoner). Kun «Tidsstyring» har implementert innhold.

### Tidsstyring-seksjon

**Bryteren øverst** binder direkte til `tidsstyringActive`/`setTidsstyringActive` – eneste sted utenom veiviseren der tidsstyringen kan slås på og av.

**Tidsperiodekort:**

Vises én per konfigurert periode. Hvert kort viser:
- Tidsrom som fet overskrift
- Ukedager («Alle hverdager» dersom Man–Fre, ellers individuelle forkortede dagnavn)
- Visningsnummer (label + nummer)
- Pålogget (kommaseparert liste over køer med `loggedIn = true`)
- MBN SMS-varsling (kommaseparert liste over køer med `smsVarsling = true`)
- Rediger- og slett-knapper

**Legg til tidsperiode** – åpner `LeggTilTidsperiodeDialog`.

**Utenfor tidsperioder** – statisk informasjonstekst om hva som skjer ved periodeslutt (utlogging av køer, tilbakestilling av visningsnummer, deaktivering av Jobbprofil).

### På- og avloggingsinnstillinger

| Valg | Beskrivelse |
|------|-------------|
| Automatisk | Tidsstyringen logger på/av automatisk ved periodeskift |
| Påminnelse | Sender varsling 10 minutter før, men logger ikke automatisk |

**Påminnelse om arbeidstid** – avkrysningsboks (lokal tilstand, ikke persistert): «Få en påminnelse 10 minutter før tidsperioden starter og slutter».

---

*Dokument generert fra kildekodeanalyse av prototypen.*
