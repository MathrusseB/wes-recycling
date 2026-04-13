# Wes' Recycling — Multi-Page Restructure Plan

## File Structure

```
/
├── index.html              (front page — cinematic brand experience)
├── pricing.html            (full detailed pricing — all categories, both locations)
├── regulations.html        (yard rules, vehicle reqs, tank rules, RV policy, "will not accept")
├── equipment.html          (vehicle & equipment sales — reads from listings.json)
├── steel-sales.html        (full steel inventory details)
├── fence-supplies.html     (full product list, dealer info)
├── rolloff.html            (roll-off/demolition details, container sizes)
├── admin.html              (password-protected admin dashboard)
├── css/
│   └── styles.css          (all shared styles — extracted from current index.html)
├── js/
│   └── main.js             (all shared JS — Lenis, scroll animations, nav, parallax, counters)
├── data/
│   ├── pricing.json        (all pricing data — ferrous, non-ferrous, eScrap)
│   ├── listings.json       (equipment for sale — admin editable)
│   └── regulations.json    (yard rules, vehicle reqs, etc — admin editable)
├── images/
│   ├── IMG_6793.jpeg
│   ├── IMG_6784.jpeg
│   ├── IMG_6787.jpeg
│   ├── IMG_6792.jpeg
│   ├── IMG_6791.jpeg
│   ├── IMG_6795.jpeg
│   └── logo-clear.png
└── Dockerfile
```

## Page Content Breakdown

### index.html (Front Page)
Keep: Hero, About/Stats, What We Buy (category cards — no detail), Happy Hour callout, Services overview cards, CTA section ("READY TO GET PAID?"), Contact section, Footer with marquee.

Remove from front page: Full pricing tables, eScrap table, catalytic converter note, yard regulations, "Know Before You Go" section, driving directions from location cards.

Replace removed content with gateway links section. Four bold blocks between services and CTA:
1. "FULL PRICING" → pricing.html — "Ferrous, non-ferrous, eScrap, catalytic converters. Updated daily."
2. "YARD REGULATIONS" → regulations.html — "Vehicle requirements, tank rules, what we accept and what we don't."
3. "EQUIPMENT FOR SALE" → equipment.html — "Used vehicles, trailers, farm equipment, and more."
4. "STEEL, FENCE & ROLL-OFF" → links to each sub-page — or a single services detail page

Location cards stay on front page but simplified — address, phone, hours only. No driving directions (those go on a dedicated page or in regulations).

### pricing.html
- Same dark styling, shared nav and footer
- Headline: "TODAY'S RATES."
- "Last Updated" badge
- Happy Hour callout
- FERROUS pricing table — with location-specific columns (Centerville | Prescott) for items where prices differ
- NON-FERROUS pricing — full breakdown: Aluminum (all sub-types), Lead, Radiators, Batteries, Brass, Copper (all insulation grades), Stainless Steel, Misc (motors, compressors, alternators, etc)
- eSCRAP pricing table
- Catalytic converter policy
- Note: "All scales tested & certified per local, state, & federal requirements"
- Note: "Credit Cards Accepted"
- Reads from data/pricing.json so admin can update

### regulations.html
- Headline: "KNOW BEFORE YOU GO."
- Yard Rules (12 items)
- Vehicle Requirements (8 items including EV policy)
- RV/Camper Guidelines (net ton price, inspection, debris rejection)
- Tank Rules (propane, helium, fire extinguishers, size-specific hole requirements)
- Steel Preparation Specs (#2 Short Steel dimensions, P&S Prepared Steel specs)
- "We Will NOT Accept" list (12 items)
- Safety Guidelines
- "Must be with parents or 18 years of age or older to sell steel"
- "Refrigerants must be removed — signed verification is required"
- "All scales tested & certified per local, state, & federal requirements"
- Warning banner: "Refusal to follow regulations may result in refusal to do business with you."
- Reads from data/regulations.json so admin can update

### equipment.html
- Headline: "EQUIPMENT FOR SALE."
- Reads from data/listings.json
- Each listing renders as a card: photo, title, description, price, date posted, contact info
- Categories: Boats, Cars, Farm Machinery & Equipment, Storage Containers, Trailers, Trucks, Other
- Category filter buttons at top
- Contact: sherryb@wesrecycling.com for sales inquiries
- If no listings: "No equipment currently listed. Check back soon or call for availability."

### steel-sales.html
- Headline: "STEEL SALES."
- Full product list: Pipe, Channel Iron, Round/Square/Rectangle Tubing, I-Beam, H-Beam, Rebar, Solid Stock
- Note: "Most steel inventory located in Prescott"
- Both phone numbers
- New and used available

### fence-supplies.html
- Headline: "FENCE SUPPLIES."
- Product list: Sheffield T-Post, Red Brand + Stay Tuff Wire, Pipe Caps, Cable Clips, Bolt Latches, Gate Hardware
- "T-Post & Red Brand Barbed Wire now available at Centerville"
- Authorized dealer: Priefert, Tarter, For-Most, Red Brand, Stay-Tuff
- Prescott phone: 913-471-4310

### rolloff.html
- Headline: "ROLL-OFF & DEMOLITION."
- Container sizes: 20-60 yard
- Use cases: property cleanouts, demolition, construction
- "Call 913-756-2387 for pricing and availability"

### admin.html
- Password-protected (simple JS password gate — not production-grade security, but enough for a pitch demo)
- Three tabs: Pricing, Regulations, Equipment Listings
- PRICING tab: Editable table for all pricing data. Edit price, hit save, writes to data/pricing.json
- REGULATIONS tab: Editable list of all rules. Add, edit, delete rules. Writes to data/regulations.json
- EQUIPMENT tab: Add new listing (title, description, price, photo URL, category, contact). Edit/delete existing. Writes to data/listings.json
- All saves write to JSON files that the front-end pages read

## Shared Components (nav + footer on every page)

Every page includes:
- Same nav bar with logo, links (Home, Pricing, Regulations, Equipment, Services, Contact)
- Same footer with marquee, 3-column grid, copyright, "Built by Kleos."
- Same Lenis smooth scroll
- Same scroll animations on section elements

## Data Files

### data/pricing.json
Structure:
```json
{
  "lastUpdated": "April 10, 2026",
  "ferrous": [
    { "material": "Auto Cast", "centerville": "$225", "prescott": "$225", "unit": "per ton" },
    ...
  ],
  "nonFerrous": {
    "aluminum": [ { "material": "Breakage Heavy-30%", "price": "$0.17", "unit": "per lb" }, ... ],
    "lead": [ ... ],
    "radiators": [ ... ],
    "batteries": [ ... ],
    "brass": [ ... ],
    "copper": [ ... ],
    "stainlessSteel": [ ... ],
    "misc": [ ... ]
  },
  "eScrap": [
    { "item": "CD Roms/Floppies/Fingers", "price": "$0.06", "unit": "per lb" },
    ...
  ],
  "happyHour": {
    "days": "Tuesday & Thursday",
    "time": "1pm - 4pm",
    "specials": "Shred $195/NT, Clean Alum Car Wheels $1.00/lb"
  }
}
```

### data/listings.json
Structure:
```json
{
  "listings": [
    {
      "id": "1",
      "title": "Cat 236B",
      "description": "One owner, only 1201 hours, two speed, quick connect couplings, door but no window.",
      "price": "$32,000 OBO",
      "category": "Farm Machinery & Equipment",
      "contact": "913-837-0955",
      "email": "sherryb@wesrecycling.com",
      "datePosted": "2023-12-26",
      "image": ""
    }
  ]
}
```

### data/regulations.json
Structure:
```json
{
  "yardRules": [ "Speed limit: 5 mph at all times", ... ],
  "vehicleRequirements": [ "Title required on all complete vehicles", ... ],
  "rvCamperGuidelines": [ ... ],
  "tankRules": [ ... ],
  "steelPrepSpecs": { ... },
  "willNotAccept": [ "Beer Kegs", "Paint", ... ],
  "safetyGuidelines": [ ... ]
}
```

## Admin Authentication (Pitch Demo)

Simple password gate for the demo — not real authentication:
```javascript
const ADMIN_PASSWORD = 'wes2026';
```
User enters password, if it matches, admin panel loads. For production, this would be replaced with real auth.

## Notes for CC
- Extract ALL CSS from current index.html into css/styles.css
- Extract ALL JS from current index.html into js/main.js
- Every page links to both shared files
- Sub-pages are simple and clean — no hero images needed, just the nav, a headline, content, and footer
- Sub-pages should feel like natural extensions of the front page, not a different site
- The admin page is a functional prototype — it needs to actually read and display the JSON data, allow edits, and save changes
- For the demo: JSON data can be stored in localStorage after admin edits, with the original files as defaults
