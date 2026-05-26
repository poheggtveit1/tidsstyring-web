# UX-analyse: Tidsstyring (brukertest mai 2026)

> **TL;DR.** Inngangen til Tidsstyring er for vanskelig. 4 av 5 deltakere lette etter funksjonen i Sentralbord, ikke Mitt MBN. 4 av 5 har en mental modell om at tidsstyring skjer per kø — ikke per tidsperiode. 4 av 5 oversett Jobbprofil-toggle. Når brukerne først kommer inn i wizarden, går oppsettet greit. Fiks tilgjengeligheten og mentalmodellen først, så fungerer resten.

---

## 1. Sammendrag

Det er gjennomført 5 moderert brukertester av Tidsstyring-prototypen i web-klienten. Deltakerne dekket et bredt spekter: én erfaren power-user (D1), to support-/admin-roller (D2, D3), en sentralbordoperatør i en kommune (D4) og en prosjektleder (D5).

Til sammen ble det notert **316 observasjoner** (177 nøytrale, 70 negative, 38 positive, 31 nye ideer). Funnene faller i **8 hovedtemaer** (+ 5 sekundære). De fire mest alvorlige hindrer eller forvrenger oppgaveløsning:

1. **Tidsstyring forventes i Sentralbord, ikke Mitt MBN** (kritisk, 4/5).
2. **Per-kø mental modell** kolliderer med per-periode-konseptet (kritisk, 4/5).
3. **Jobbprofil-toggle blir oversett** (høy, 4/5).
4. **Overlappende perioder tillates** i prototypen — en bug som forsterker per-kø-misforståelsen (kritisk, 3/5).

Wizarden i seg selv oppleves intuitiv når brukerne først kommer inn i den.

---

## 2. Metode

- **Format:** Moderert brukertest, web-prototype i nettleser.
- **Deltakere:** 5 (én power-user, to support-/admin-roller, én sentralbordoperatør, én prosjektleder).
- **Oppgaver:** Bli kjent → Oppgave 1 (sette opp tidsstyring) → Oppgave 2 (justere/utvide) → Posttest.
- **Datakilde:** Fargekodede stickies i FigJam-fila `Sentralbord UXR`, ekstrahert via plugin-script til [`docs/ux-analysis/raw-data.json`](./ux-analysis/raw-data.json).
- **Kategorier:** 🟢 Positivt · 🔴 Negativt · 🟡 Nøytralt/observasjon · 🔵 Ny idé.

---

## 3. Nøkkeltall

| | |
|---|---|
| Deltakere | 5 |
| Observasjoner totalt | 316 |
| Stickies skannet | 392 (76 var legend/templates) |
| Hovedtemaer identifisert | 8 |
| Sekundære funn | 5 |
| Kritiske funn (blokkerer oppgaver) | 4 |

**Fordeling:**

| Kategori | Antall | Andel |
|---|---|---|
| Nøytralt | 177 | 56 % |
| Negativt | 70 | 22 % |
| Positivt | 38 | 12 % |
| Ny idé | 31 | 10 % |

**Per deltaker:** D1: 62 · D2: 52 · D3: 69 · D4: 77 · D5: 56
**Per oppgave:** Bli kjent: 86 · Oppgave 1: 173 · Oppgave 2: 23 · Posttest: 34

---

## 4. Tematiske funn

Sortert etter alvorlighetsgrad.

### T1 · Kritisk — Tidsstyring forventes i Sentralbord, ikke Mitt MBN
**Frekvens:** 4/5 (D2, D3, D4, D5)

Brukerne starter i Sentralbord-fanen og leter der. Særlig under «...»-menyen på enkeltkøer i Mine køer. De finner ikke Tidsstyring før de får hint.

> «Forstår ikke hvorfor Tidsstyring ligger i Mitt MBN og ikke Sentralbordet når han jobber i Sentralbordet» (D2)
> «Forventet ikke at oppsett skulle være via Mitt MBN» (D3)
> «Finner naturlig nok ikke ut at hun må gå til Mitt MBN for å sette opp tidsstyring» (D4)
> «Spør om han skal sette det opp på mitt mbn eller sentralbord» (D5)

### T2 · Kritisk — Mental modell: Tidsstyring per kø, ikke per tidsperiode
**Frekvens:** 4/5 (D2, D3, D4, D5)

Brukerne tenker: «Når vil jeg svare på *denne* køen?» — ikke: «Hvilke køer er jeg på i denne perioden?» De forventer å trykke på «...» ved enkeltkøer. D4 endte med tidsstyring per kø og satte også visningsnummer per kø (begge feil).

> «Ville aktivert direkte på kø, tenker det er logisk å trykke på mer-knapp for det» (D2)
> «For hva vi snakker om er jo hvilke tidsrom jeg skal svare på køene» (D2)
> «Hun tror at tidsstyringen er per kø. Forsøker også å sette visningsnummer per kø» (D4)
> «Finner ikke knappen 'aktiver'. Ønsker å legge det pr kø» (D5)

### T3 · Høy — Jobbprofil-toggle blir oversett
**Frekvens:** 4/5 (D1, D2, D3, D4)

Toggelen ligger rett over Tidsstyring-toggelen, men brukerne ser den ikke. Mange trodde at å skru av Tidsstyring også logget dem av.

> «Overser jobbprofil knappen.. Ide: Hjelpetekst på 'Jobbprofil'-knappen» (D2)
> «Tror det er ingenting som skjer når han logger av jobbprofilen (men tidsperioden er aktiv)» (D3)
> «Tror man logges av midlertidig ved å skru av 'Tidsstyringsknappen'» (D4)
> «Litt usikker på hva 'Tidsstyrt pålogget' betyr» (D1)

### T4 · Kritisk (bug) — Overlappende perioder tillates
**Frekvens:** 3/5 (D3, D4, D5)

Prototypen validerer ikke at perioder ikke overlapper. D4 satte opp én periode per kø med samme tidsrom — feil mentalmodell ble forsterket. D3 la inn overlappende perioder bevisst og forventet feilmelding.

> «Feil i wizarden tillater overlappende tidsperioder, det skal ikke tillates» (D3)
> «NB: får lagt inn overlappende perioder i prototypen. Får ikke testet logikken som skal ligge bak dette?» (D3)
> «Setter opp tidsstyring per kø, med overlappende tidsperioder» (D4)
> «Blir litt forvirret av at mockup tillater overlappende perioder» (D5)

### T5 · Høy — Påminnelse vs. Automatisk — uklart hva som er hva
**Frekvens:** 3/5 (D1, D3, D4)

Tekstene «Du logges på og av» (Automatisk) og «Logger på og av selv» (Påminnelse) blandes. D3 valgte Påminnelse men trodde fortsatt det skjedde automatisk. Brukere ønsker også påminnelse selv om de bruker automatisk pålogging.

> «Forvirres av tre valg for automatisk, påminnelse og påminnelse om arbeidstid» (D3)
> «Forvirrende med hva som er hva, spesielt 'Logger på og av selv'» (D3)
> «Ønsker å ha påminnelse også ved automatisk pålogging, men skjønner ikke at det går slik prototypen presenterer det i dag» (D3)
> «Velger Påminnelse, ikke automatisk... 'Han logger seg av og på av seg selv ja' → under påminnelse — missforståelse» (D3)

### T6 · Høy — Per-dag / turnus støtte etterspørres
**Frekvens:** 3/5 (D2, D3, D5)

Brukerne tenker «mandag 8-16, tirsdag 16-21» — ikke ett mønster. Wizarden støtter dette teknisk (én periode per dag), men det er ikke synlig i onboarding.

> «Stusser på at det kun er ukekalender. Savner kalender for turnusbruk» (D2)
> «Si at jeg skal jobbe 8-16 på mandag, og 16-21 på tirsdag. Hva gjør jeg da?» (D2)
> «Spør om det er mulig å tilpasse hver enkelt dag i wizard» (D5)
> «Lurer på om han kan sette opp ulike tidsperioder per dag i onboarding (ser ikke infotekst om at dette kan gjøres senere)» (D5)

### T7 · Høy — «Aktiver»-knappen er for diskret
**Frekvens:** 3/5 (D2, D4, D5)

Aktiveringsknappen blir oversett. D4 leste «Aktivert» istedenfor «Aktiver». D5 navigerte rett til Mitt MBN men så ikke knappen.

> «Kanskje aktiver knappen er litt for subtil? Ikon?» (D2)
> «Leser Aktivert, ikke Aktiver» (D4)
> «Finner ikke knappen 'aktiver'» (D5)
> «Ser at det står tidsstyring men ikke Aktiver» (D5)

### T8 · Medium — Begrepet «Tidsstyring» er ukjent
**Frekvens:** 3/5 (D2, D4, D5)

Flere brukere koblet «Tidsstyring» til adminløsningen (TVM/åpningstider). Når konseptet ble forklart så de behovet, men inngangen er bratt.

> «Tenker at 'Tidsstyring' er det vi har i adminløsningen (TVM)» (D2)
> «Tidsstyring = Åpningstider» (D2)
> «Har ingen klar formening om hva tidsstyring er» (D5)
> «Skjønner ikke helt hva begrepet 'tidsstyring' er» (D5)

---

## 5. Sekundære funn

| ID | Tema | Sev | Frekv | Oppsummering |
|---|---|---|---|---|
| S1 | Ad-hoc justering (forlenge dag, hopp over én dag) | Medium | 3/5 (D1, D4, D5) | Ønske om enkel måte å forlenge pågående dag eller skru av midlertidig. D1 foreslår «play»-knapp på «Neste»-raden. |
| S2 | Klokkeslett mangler i påloggingsvarsel | Medium | 2/5 (D3) | Varslingsdialogen bør si «Pålogges 08:00 — logges av 16:00» som hovedtekst, ikke bare i undertekst. |
| S3 | Synk mellom web og app | Medium | 2/5 (D1, D5) | Bekymring for at endringer ikke umiddelbart reflekteres mellom plattformer. Kritisk for tidsstyring. |
| S4 | Wizardvindu for lite ved mange køer | Lav | 2/5 (D1, D4) | Må scrolle i Køer-steget når det er 3+ køer. |
| S5 | Status burde også vises i Sentralbord | Medium | 2/5 (D3, D4) | Når brukeren først er i Sentralbord, vil hen se status uten å bytte til Mitt MBN. |

---

## 6. Severity-oversikt

| ID | Tema | Severity | Frekvens |
|---|---|---|---|
| T1 | Tidsstyring i Sentralbord | Kritisk | 4/5 |
| T2 | Per-kø mental modell | Kritisk | 4/5 |
| T4 | Overlappende perioder tillates (bug) | Kritisk | 3/5 |
| T3 | Jobbprofil-toggle skjult | Høy | 4/5 |
| T5 | Påminnelse vs. Automatisk | Høy | 3/5 |
| T6 | Per-dag/turnus | Høy | 3/5 |
| T7 | Aktiver-knapp diskret | Høy | 3/5 |
| T8 | Begrep ukjent | Medium | 3/5 |
| S5 | Status også i Sentralbord | Medium | 2/5 |
| S1 | Ad-hoc justering | Medium | 3/5 |
| S2 | Klokkeslett i varsel | Medium | 1/5 |
| S3 | Synk web/app | Medium | 2/5 |
| S4 | Wizard for liten | Lav | 2/5 |

---

## 7. Designanbefalinger

Sortert kritisk → lav. Hver anbefaling peker på komponentfila i `tidsstyring-web` der endringen hører hjemme.

| # | Sev | Anbefaling | Filer |
|---|---|---|---|
| 1 | Kritisk | **Eksponer Tidsstyring fra Sentralbord** — legg til Tidsstyring-shortcut i Sentralbord-visningen (lenke under Mine køer eller infopanel over). | `src/components/MineKoerPanel.tsx`, `src/App.tsx` |
| 2 | Kritisk | **Valider overlappende perioder** — sjekk timeFrom/timeTo + dager før `addTimePeriod` / `updateTimePeriod`. Vis inline feilmelding. | `src/components/LeggTilTidsperiodeDialog.tsx`, `EndreTidsperiodeDialog.tsx` |
| 3 | Høy | **Gjør Jobbprofil-toggle mer prominent** — større toggle, tydelig etikett, mikro-tooltip «Jobbprofil styrer av/på, Tidsstyring styrer når». | `src/components/JobbprofilPanel.tsx` |
| 4 | Høy | **Differensier Påminnelse/Automatisk** — ikoner (auto vs. bell), bytt tekst til «Logges på automatisk når perioden starter» og «Du får påminnelse 10 min før og logger på selv». | `src/components/SettingsPage.tsx` |
| 5 | Høy | **Synliggjør per-dag muligheten i wizard** — hint «Trenger du ulike tider per dag? Legg til flere perioder under Innstillinger.» | `src/components/TidsstyringDialog.tsx` (TimePeriodStep) |
| 6 | Høy | **Forsterk Aktiver-knappen visuelt** — fra `bg-brand-50` til `bg-brand-500 text-white` + Plus-ikon. Sjekk at den er synlig uten scroll. | `src/components/JobbprofilPanel.tsx`, `SettingsPage.tsx` |
| 7 | Medium | **Vis klokkeslett i påloggingsvarsel** — «Pålogges 08:00 — logges av 16:00» som hovedtekst i varselet. | `src/components/TidsstyrtPaaloggingDialog.tsx` |
| 8 | Medium | **Forklar konseptet bedre i Info-steget** — bytt åpningssetning til konkret eksempel: «Slik kan du f.eks. bli automatisk pålogget Kundeservice mandag–fredag 08–16». | `src/components/TidsstyringDialog.tsx` (InfoStep) |
| 9 | Medium | **Sync-indikator** — vis liten varsel-pill når web og app er ute av synk (simulert). | `src/store/jobProfileStore.ts` |
| 10 | Lav | **Mer luft i Køer-steget** — øk effektiv max-h, eller la indre scroll vises tydeligere ved 3+ køer. | `src/components/TidsstyringDialog.tsx` (KoerStep) |

### Bonus: Mental-modell-redesign (ikke en quick win)

T2 er den vanskeligste. Et større designgrep å vurdere: la wizarden tilby **to oppsettmoduser** ved start:

- **Felles plan** (dagens design): Én tidsplan, flere køer aktive samtidig.
- **Per-kø-plan**: Brukeren setter opp tidsstyring per kø, fra «...»-menyen i Mine køer.

Det matcher mental-modellen, men øker kompleksiteten. Bør valideres i ny brukertest før implementering.

---

## 8. Hva fungerer bra

Aspekter brukerne fremhevet — **behold disse**:

- **Wizard-flyten oppleves intuitiv når den finnes.** «Det var jo ikke så vanskelig det» (D1). «Når hen først finner funksjon går det helt fint» (D4).
- **Dag-velger (pills) er enkel.** D1: «Superintuitivt, å velge dager er enkelt».
- **Status «Tidsstyrt: Pålogget»** kobles korrekt av power users (D1).
- **Behovet blir tydelig etter forklaring.** Selv om inngangen er bratt, ser flere brukere verdien (D4, D5).

---

## 9. Hypotesevurdering

Mål og hypoteser fra testplanen (FigJam-fila «Sentralbord UXR», seksjonen *Om*), vurdert mot funn fra 316 observasjoner.

### Hovedhypotese (Telenor) — ❌ STERKT MOTBEVIST

> «Tidsstyring for Sentralbord er ikke relevant og ingen synliggjøring av det. Forhandlere ser ikke behovet for tidsstyring av Sentralbord. For Sentralbordbrukere så kan det være at tidsstyring ikke er så interessant.»

**Funn:** Det motsatte er sant for sluttbrukerne i testen.

- **4 av 5 deltakere lette etter Tidsstyring NETTOPP i Sentralbord** (D2, D3, D4, D5).
- D3 i Posttest: «Forventer å finne det med av og pålogging særlig under sentralbord», «Status burde vært under sentralbord», «Spesielt køer er ønskelig under køer i sentralbord».
- D4 (sentralbordoperatør, 90 % Sentralbord-bruk): forventer å finne tidsstyring under «...» på Mine køer i Sentralbord.
- D2: «Forstår ikke hvorfor Tidsstyring ligger i Mitt MBN og ikke Sentralbordet når han jobber i Sentralbordet».

**Implikasjon:** Hypotesen om at Sentralbord-brukere ikke er interessert i tidsstyring stemmer ikke. Forhandler-perspektivet (som hypotesen baserer seg på) er ikke samme som sluttbruker-perspektivet. Tidsstyring bør være tilgjengelig fra Sentralbord — som minimum en lenke/snarvei, ideelt sett også status og toggle.

---

### Primære mål

| ID | Vurdering | Mål | Funn |
|---|---|---|---|
| M1 | ✅ Oppnådd | Forstå brukerens bruk av Sentralbord og Mitt MBN | Klart bilde av variert bruk: power-user (D1, 60-70 % web), kundeservice (D2), 3.linje (D3), kommune-sentralbord (D4, 90 % Sentralbord), prosjektleder (D5, mest app + Mitt MBN). 86 observasjoner i Bli kjent-fasen. |
| M2 | 🟡 Delvis | Validere at desktop-brukerne har behov for tidsstyring | Ikke universelt behov. D1 og D4 ser stor verdi (D4: «Mange er ikke flinke til å logge seg på selv»). D2 mener det burde være admin-jobb. D5 forstod ikke før forklaring. Behovet er **rollebasert**, ikke generelt. |
| M3 | 🟡 Betinget | Vil brukerne bruke tidsstyring? Passer det inn i hverdagen? | Ja for noen (D1, D4), nei for andre (D2 — vil ikke ha det som ende-bruker-oppgave). D5 ser verdien først etter forklaring. **Onboarding er kritisk for adopsjon.** |
| M4 | ✅ Sterkt oppnådd | Identifisere potensielle hindringer i brukeropplevelsen | 8 hovedtemaer + 5 sekundære funn. 4 kritiske (T1, T2, T3, T4). Store mengder kvalitative data. |
| M5 | ✅ Oppnådd | Forstå behov og forventninger til tidsstyring på web | Klare forventninger: per-kø-styring, per-dag/turnus (T6), ad-hoc-justering (S1), klokkeslett i varsel (S2), synk web/app (S3). |
| M6 | ✅ Oppnådd | Logge inn på Sentralbord eller Mitt MBN ved oppgavestart | Brukerne valgte fritt. 4 av 5 valgte Sentralbord som inngang og forventet å finne tidsstyring der. |
| M7 | ✅ Oppnådd | Forstå behov når dagen er over (avlogging) | D1 vil skru av tidsstyring ved overtid, D4 likeså. D5: «Trenger ikke varsel ved avlogging». Hovedutfordring her er Jobbprofil-toggle (T3). |

### Sekundære mål

| ID | Vurdering | Mål | Funn |
|---|---|---|---|
| S1 | ❓ Ikke testet | Opplevelsen av skissene til splashscreen | Ikke dekket i denne runden — krever egen test med splashscreen i prototypen. |
| S2 | ❌ Bekymring identifisert | Oppleves flyten av tidsstyring og synkronisering mot MBN-appen logisk og intuitiv? | D1: «Rom for katastrofe hvis det ikke er synkronisert mellom app og web». D5: «Ikke synkronisert mitt mbn og sentralbord — ønsker at disse er synkronisert». **Brukerne er aktivt bekymret for synk.** |

---

### Hovedinnsikt fra hypotesevurderingen

1. **Den viktigste hypotesen er motbevist.** Tidsstyring må eksponeres fra Sentralbord — uavhengig av om det er primært satt opp via Mitt MBN. Brukerne forventer å se og endre status der de jobber.
2. **Behovet for tidsstyring er rollebasert, ikke universelt.** Sentralbordoperatører og power users ser stor verdi. Admin-/support-roller er skeptiske og foretrekker at det settes opp sentralt. Onboarding må håndtere denne forskjellen — ikke alle skal tvinges gjennom en wizard.
3. **Synk web/app er en uavklart risiko.** Sekundær hypotese om at synkronisering oppleves logisk er ikke bekreftet — tvert imot er det aktive bekymringer. Trenger tydeligere synk-feedback i UI eller en eksplisitt forklaring av modellen.

---

## 10. Neste steg

1. **Prioriter de 4 kritiske funnene** (T1, T2, T4 + plassering i Sentralbord).
2. **Implementer Designanbefaling #1, #2, #3** først — disse løser de mest alvorlige.
3. **Ny moderert brukertest** med 3–5 nye deltakere etter at de kritiske endringene er på plass. Spesielt fokus på:
   - Finner brukerne Tidsstyring fra Sentralbord?
   - Forstår de at perioder grupperer flere køer (ikke at hver kø har egen plan)?
   - Ser de Jobbprofil-toggle og forstår skillet?

---

## Vedlegg A — Rådatatabell

Komplett observasjonsliste lagret som strukturert JSON:
- [`docs/ux-analysis/raw-data.json`](./ux-analysis/raw-data.json) — 316 observasjoner med deltaker, oppgave, kategori, tekst, x/y-koordinat i kildefila.
- [`docs/ux-analysis/themes.json`](./ux-analysis/themes.json) — temainndeling og sitatutvalg som ble brukt i denne rapporten.

## Vedlegg B — FigJam-visualisering

Visuell sammenstilling med klynger, severity-matrise og topp-funn-kort ligger som ny seksjon **«Analyse & funn — UX brukertest mai 2026»** i [Sentralbord UXR](https://www.figma.com/design/eAKNfmihHddLnUNYjCnZdv/) (til venstre for de eksisterende brukertest-seksjonene).
