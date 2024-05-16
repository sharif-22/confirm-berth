# Confirm Berth

## Checkout [Confirm Berth](https://confirm-berth.vercel.app/)

#### Work-Flow of the API Call and Functionality of the Confirm Berth

```mermaid

graph TD;
A[User Enters PNR] --> B{PNR Exists ?};
B -->|Yes| C[No Fetch];
B -->|No| D[Fetch Data from API];
D --> E[Store Data return status = 200 in Local Storage];
E --> F[Check Date Expired?];
F -->|Yes| G[Display PNR card in Past Trips];
F -->|No| H[Display PNR card in Coming Trips];
H --> I[User Clicks on PNR];
I --> L{is availabe in session Storage}
L --> |Yes| K[Display prev Fetched Data from Session storage];
L --> |No| J[Fetch Current clicked PNR Status];
J-->M[Store Fetched Data to session storage]

```

#### Wireframe of Confirm Berth

![wireframe of Confirm Berth](./public/confirm-bearth-wireframe.png)

### Tech Stack and dependencies

- React.js
- TailwindCss
- react-toastify
- day.js
- react-shimmer-effects
- Workbox-Window

### Licence

[MIT](./LICENCE.md)
