RapidTransit Metro Booking Application
A robust, high-performance full-stack application for modern metro systems, engineered with a focus on algorithmic efficiency, scalability, and seamless user experience. This system allows users to authenticate via Google, calculate optimal routes, purchase tickets, and receive instant confirmation.

🚀 Key Features
Algorithmic Routing: Uses the <b>Bellman-Ford algorithm</b> to calculate optimal paths and distances across the metro network graph, ensuring reliability even with dynamic edge weighting.

High-Performance Caching: Utilizes Redis (in-memory data structure store) to cache the metro network graph, significantly accelerating pathfinding calculations.

Secure Authentication: Integrated with Google SSO to issue secure JWT (JSON Web Tokens) for session management.

Modern Payments + Webhooks: Seamlessly handles ticket purchases using Polar (a developer-first alternative to Stripe).

![Metro App Vision](https://raw.githubusercontent.com/rudeUltra/MetroBookingSystem/422e455360df1394c714a47c62e762a1815fc42a/metroAppvisiopng.png)

Data Integrity: Implements robust Database Transactions to guarantee atomic operations during booking and payment processes.

Event-Driven Architecture: Decouples core business logic from side effects; ticket purchases emit events that asynchronously trigger the Email System.

<h2>ER Diagram :</h2>

![Metro App ER Diagram](https://raw.githubusercontent.com/rudeUltra/MetroBookingSystem/16dd16acdca77b74bceb89b9656a02e274e042fc/metroAppERDiagram.png)
