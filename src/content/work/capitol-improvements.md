---
order: 1
client: Capitol Improvements
title: A roofing company's CRM, built from scratch
headlineMetric: 2,479 contacts and 2,704 jobs moved from LEAP with 0 errors
subtitle: Roofing and exteriors, Maryland, US. Jul 2023 to Sep 2026
type: Custom CRM
stack: [Flask, React, PostgreSQL, VAPI, Strapi 5, Claude]
summary: >-
  I built Capitol Improvements a CRM from scratch with trade estimating, an in-home sales deck and e-signature. I moved 2,479 contacts and 2,704 jobs across from LEAP with 0 errors, and new records sync every 15 minutes. They kept me for three years.
challenge: >-
  The company ran on LEAP and needed its own system for estimating per trade, selling in the home and signing on the spot, without losing years of contacts and jobs.
architecture: >-
  A custom CRM in Flask, React and PostgreSQL. A sync that brings new LEAP records in every 15 minutes. An AI phone agent on VAPI that checks each rep's live calendar and books into the CRM. A neighbor postcard system with AI "after" images. A website chatbot and an MCP server for AI agents. A delivery pipeline where each change is gated on tests, reviewed by Claude and rolled back automatically if it fails.
outcome: >-
  The migration finished with 0 errors. The postcard system has taken 1,814 orders for 611 houses. The pipeline has shipped more than 300 changes, each gated on 4,100+ automated tests.
metrics:
  - { label: Contacts migrated, value: "2,479" }
  - { label: Jobs migrated, value: "2,704" }
  - { label: Migration errors, value: "0" }
  - { label: Postcard orders, value: "1,814 for 611 houses" }
  - { label: Changes shipped, value: "300+" }
  - { label: Automated tests, value: "4,100+" }
kind: migration
featured: true
links:
  - { label: Call the live phone agent, href: "tel:+12408203353" }
---

## Production details

- 719 content items migrated from Webflow to Strapi 5.
- 18 containers in production.
- Hosting providers moved in an 18-minute cutover.
- New LEAP records sync into the CRM every 15 minutes.
