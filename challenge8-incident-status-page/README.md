# [Challenge 8: Build an Incident Status Page](https://github.com/microsoft/25-days-of-serverless/tree/master/week-2/challenge-8)

![The Elves' Incidents](https://res.cloudinary.com/jen-looper/image/upload/v1575132446/images/challenge-8_ryfir2.jpg)

It's December 8th and Santa and his team are hard at work preparing for the big night, including replacing many of the servers and applications that run the reindeer guidance and delivery systems.

If something goes wrong with any part of that critical system, they need a way to report the status of disruptions to everyone involved in a successful Christmas morning.

They need a basic version of what you can find at [status.azure.com](https://status.azure.com).

During these tense disruptions, elves are actively diagnosing and working as quickly as possible to bring important systems back online. While response and remediation efforts are underway, it's important everyone who has a stake in the successful delivery of gifts stay "in the know".

We are tasked with building a method for Santa and his team to communicate the current status of service disruptions to a global audience. A "Status Page" solution.

## Challenge

Your challenge is to create a simple solution that helps inform elves and helpers all over the world when there is a problem with Santa's Reindeer Guidance & Delivery System - a "Status Page" to inform everyone what is known, what is being done, and when to expect additional information.

## Tips

There are many approaches to broadcasting critical information like this.
For simplicity, we might consider keeping the team informed by setting and broadcasting the current "Status" as 1 of 3 states:

- _Open_
- _Closed_
- _Ongoing_ (or update)

The "_Open_" state means **we have a problem** (Service Disruption / Offline).
The "_Closed_" state means **our problem is resolved** (Service Restored / Online).
The "_Ongoing_" state means **we are still investigating** (Standby for more updates).

# Solution

## Technologies

- Azure Functions
- Azure Cosmos DB
- Azure SignalR Service
- Svelte
- Tailwind
