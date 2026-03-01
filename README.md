RapidTransit Metro Booking API
A robust, high-performance full-stack application for modern metro systems, engineered with a focus on algorithmic efficiency, scalability, and seamless user experience. This system allows users to authenticate via Google, calculate optimal routes, purchase tickets, and receive instant confirmation.

🚀 Key Features
Algorithmic Routing: Uses the Bellman-Ford algorithm to calculate optimal paths and distances across the metro network graph, ensuring reliability even with dynamic edge weighting.

High-Performance Caching: Utilizes Redis (in-memory data structure store) to cache the metro network graph, significantly accelerating pathfinding calculations.

Secure Authentication: Integrated with Google SSO to issue secure JWT (JSON Web Tokens) for session management.

Modern Payments + Webhooks: Seamlessly handles ticket purchases using Polar (a developer-first alternative to Stripe).

Data Integrity: Implements robust Database Transactions to guarantee atomic operations during booking and payment processes.

Event-Driven Architecture: Decouples core business logic from side effects; ticket purchases emit events that asynchronously trigger the Email System.

