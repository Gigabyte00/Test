# Multi-Gateway Connector

This folder contains the base code for a unified adapter that normalizes the APIs of all supported payment gateways.

Each adapter implements a common `charge(amount: number, token: string)` signature so the rest of the app can call them interchangeably.

Use this as a starting point for building a standalone library or repo.

Current adapters implemented in the main app include:

- Stripe
- Square
- FortisPay
- First Data
- Worldpay
- PaySafe
- Authorize.Net
- NMI

These can be swapped out behind a single `charge` interface to keep payment logic consistent.
