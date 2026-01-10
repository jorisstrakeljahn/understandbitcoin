# Therefor Bitcoin - Artikel Style Guide

Dieser Guide beschreibt den Schreibstil für alle Artikel auf Therefor Bitcoin. Ziel ist es, komplexe Bitcoin-Themen verständlich, ansprechend und überzeugend zu präsentieren - ohne dabei an intellektueller Redlichkeit zu verlieren.

## Philosophie

Wir schreiben für Menschen, die neugierig sind, aber skeptisch. Sie haben Bitcoin-Kritik gehört und wollen verstehen, was dran ist. Sie verdienen:

- **Ehrliche Antworten**, nicht Propaganda
- **Nuancierte Erklärungen**, nicht Vereinfachungen
- **Fließende Texte**, nicht fragmentierte Listen
- **Ansprechende Überschriften**, die Lust aufs Lesen machen

## Kernprinzipien

### 1. Mehr Fließtext, weniger Bullet Points

**Schlecht:**
```
Warum Bitcoin wichtig ist:
- Es ist dezentral
- Es hat eine begrenzte Menge
- Es ist zensurresistent
- Es braucht keine Banken
```

**Gut:**
```
Bitcoin ist dezentral - keine einzelne Entität kontrolliert es. Die Menge ist auf
21 Millionen begrenzt, durch Code erzwungen und von jedem überprüfbar. Transaktionen
können nicht zensiert werden, weil kein Gatekeeper existiert. Und das alles funktioniert
ohne Banken, deren Erlaubnis oder Infrastruktur.
```

**Regel:** Bullet Points sind für:
- Technische Spezifikationen
- Kurze Vergleiche in Tabellen
- Schnelle Zusammenfassungen (TL;DR im Frontmatter)

Für Erklärungen und Argumentation immer Fließtext verwenden.

### 2. Überschriften, die Lust aufs Lesen machen

**Schlecht:**
- "How It Works"
- "The Technology"
- "Key Features"
- "Benefits"
- "Common Misconceptions"

**Gut:**
- "Your Wallet Doesn't Hold What You Think It Does"
- "The Password You Can Never Reset"
- "Mining Has Nothing to Do With Pickaxes"
- "7 Transactions Per Second Sounds Terrible - Until You Understand Why"
- "The Bar Tab Model of Instant Payments"
- "The Invisible Heist Hiding in Plain Sight"

**Techniken:**
- Provokative Statements: "Yes, Criminals Use Bitcoin. So What?"
- Überraschungen: "The Short Answer That Isn't Short"
- Fragen aufwerfen: "Can Someone Guess My Seed Phrase?"
- Metaphern einführen: "The Heartbeat of Bitcoin's Security"

### 3. Tabellen für Vergleiche und Daten

Tabellen sind hervorragend für:
- Vergleiche (Bitcoin vs. Gold, Lightning vs. On-Chain)
- Historische Daten (Halving-Timeline, Preisentwicklung)
- Technische Spezifikationen (Wallet-Typen, Node-Anforderungen)

**Beispiel:**
```markdown
| Wallet-Typ | Sicherheit | Komfort | Bester Einsatz |
|------------|-----------|---------|----------------|
| Hardware | Hoch | Mittel | Langzeitspeicherung |
| Mobile | Mittel | Hoch | Alltägliche Zahlungen |
| Web | Niedrig | Sehr hoch | Kleine Beträge |
```

### 4. Direkte, provozierende Einleitungen

Die ersten Sätze entscheiden, ob jemand weiterliest.

**Schlecht:**
```
Bitcoin wallets are software applications that store your private keys and allow
you to interact with the Bitcoin network.
```

**Gut:**
```
Here's a truth that surprises most newcomers: your Bitcoin wallet doesn't actually
contain any bitcoin.
```

**Gut:**
```
Yes, some criminals use Bitcoin. But this isn't the gotcha critics think it is.
```

**Gut:**
```
The phrase has become almost a cliché in Bitcoin circles. But the principle behind
it is deadly serious, and history has proven it repeatedly.
```

### 5. Kritik ehrlich behandeln

Wir nehmen Kritik ernst und behandeln sie fair - direkt im Artikeltext.

**Schlecht:**
```
Critics say Bitcoin wastes energy, but they're just FUDing and don't understand
the technology.
```

**Gut:**
```
Bitcoin does make certain crimes easier: cross-border ransomware payments,
donations to sanctioned entities, pseudonymous value transfer. These are real
issues that deserve attention. Dismissing them entirely is intellectually dishonest.

But: The same properties that enable these crimes also enable donations to
dissidents under authoritarian regimes, financial inclusion for the unbanked,
and protection from currency confiscation.

Whether these trade-offs are worth it is a value judgment. But it's not as
simple as "Bitcoin = crime."
```

### 6. Daten und Kontext statt Behauptungen

**Schlecht:**
```
Bitcoin is much better than traditional finance.
```

**Gut:**
```
According to Chainalysis, illicit cryptocurrency transaction volume in 2023
represented approximately 0.34% of total activity. For comparison, the UN
estimates that 2-5% of global GDP - $800 billion to $2 trillion - is laundered
annually through the traditional banking system.
```

### 7. Zum Nachdenken anregen, nicht belehren

**Schlecht:**
```
Bitcoin is the best form of money ever created and everyone should buy it immediately.
```

**Gut:**
```
Whether these properties are worth the energy cost is ultimately a value judgment.
For people in stable democracies with trustworthy banking systems, it might seem
like overkill. For people in countries with hyperinflation, capital controls, or
authoritarian governments, it might be the only financial system that actually
works for them.
```

## Artikel-Struktur

### Typischer Aufbau

1. **Einleitung** (1-2 Absätze)
   - Hook: Überraschung, Frage, provokantes Statement
   - Kontext: Warum ist das Thema relevant?

2. **Hauptteil** (3-6 Sections)
   - Logischer Aufbau, jede Section mit ansprechender Überschrift
   - Fließtext dominant, Tabellen wo sinnvoll
   - Kritik und Gegenargumente fair behandelt

3. **The Honest Assessment / Bottom Line** (1-2 Absätze)
   - Ehrliche Zusammenfassung der Trade-offs
   - Keine übertriebenen Claims
   - Offene Fragen anerkennen

### Länge

- **Beginner-Artikel**: 800-1.500 Wörter
- **Intermediate-Artikel**: 1.200-2.000 Wörter
- **Kritik-Artikel**: 1.500-2.500 Wörter (brauchen Platz für faire Gegenargumente)

## Tone of Voice

### Do
- Klar und präzise schreiben
- Metaphern und Analogien verwenden
- Nuancen anerkennen ("genuinely uncertain", "reasonable people disagree")
- Daten und Quellen nennen
- Kritik ernst nehmen und fair behandeln

### Don't
- "FUD" oder andere Bitcoin-Community-Slang verwenden
- Absolutistische Claims ("Bitcoin is the only solution")
- Andere Projekte herabsetzen
- Sarkasmus gegenüber Kritikern
- Marketing-Sprache ("revolutionary", "groundbreaking")

## Beispiel-Transformation

### Vorher (listenbasiert):
```markdown
## Benefits of Hardware Wallets

Hardware wallets offer several advantages:

- Keep private keys offline
- Immune to malware
- Physical button confirmation
- Support multiple cryptocurrencies
- Seed phrase backup

## Disadvantages

- Cost money ($50-200)
- Can be lost or damaged
- Less convenient for daily use
```

### Nachher (fließend):
```markdown
## Why a Dedicated Device Changes Everything

Hardware wallets store your private keys on a secure chip that never exposes them
to your internet-connected computer. When you want to sign a transaction, the
wallet does so internally - your key never leaves the device. Even if your computer
is completely infected with malware, an attacker cannot extract your private keys.

The cost - typically $50 to $200 - is trivial compared to what you're protecting.
Consider it insurance. The inconvenience of a dedicated device is real but
manageable; most users keep small amounts on mobile wallets for daily spending
and larger holdings on hardware for security.

The genuine risk is physical: lose the device without a backup, and your bitcoin
is gone. This is why the seed phrase backup is as important as the device itself -
arguably more so, since you can always buy a new device but cannot regenerate
a lost seed phrase.
```

## Checkliste vor Veröffentlichung

- [ ] Beginnt mit einem Hook, nicht mit einer Definition
- [ ] Überschriften sind ansprechend, nicht generisch
- [ ] Bullet Points nur für Specs/Zusammenfassungen, nicht für Erklärungen
- [ ] Kritik und Gegenargumente fair behandelt
- [ ] Daten haben Quellen
- [ ] Endet mit ehrlichem Assessment, nicht mit Marketing
- [ ] Würde Naval Ravikant die Klarheit gutheißen?
- [ ] Würde Ann Handley die Story-Struktur loben?
- [ ] Besteht die Headline den Ogilvy-Test ("Would I click this?")?

---

*Dieser Style Guide orientiert sich an den Prinzipien von Naval Ravikant (Klarheit, First-Principles), Ann Handley (Storytelling, Reader-First) und David Ogilvy (überzeugende Headlines, Research-basiert).*
