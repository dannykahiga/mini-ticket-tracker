# Mini Ticket Tracker

Install node modules:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```
Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Decisions & Tradeoffs
1. I would improve UI/UX. The tickets can be viewed in a board. The board contains columns by status.
2. Various status can be updated by dragging and dropping to columns.
3. The UI can indicate the history for the tickets.
4. Upon updating or assigning tickets notifications can be sent to respective assignees.
5. I chose to use Next.js framework for it's scalability and good SSR support