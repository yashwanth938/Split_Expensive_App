# Codebase Analysis Report: Split Wise (Spliit)

This report details the inner workings of group management, invite link generation, join behavior, and expense tracking within the application.

---

## 1. Group Creation Logic
* **File Path**: [src/lib/api.ts](file:///c:/Users/ronga/Downloads/spliit-main/spliit-main/src/lib/api.ts)
* **Key Function**: `createGroup(groupFormValues: GroupFormValues)`
* **Description**:
  When a user creates a group:
  * A unique ID is generated for the group using the `randomId()` helper function, which uses `nanoid` (a tiny, secure, URL-friendly unique string ID generator).
  * Participants are created, each also receiving a unique `nanoid` as their ID.
  * The group details (name, currency, information) are saved in the PostgreSQL database using Prisma via the `Group` and `Participant` models.

---

## 2. Group Link Generation
* **File Path**: [src/app/groups/[groupId]/share-button.tsx](file:///c:/Users/ronga/Downloads/spliit-main/spliit-main/src/app/groups/%5BgroupId%5D/share-button.tsx)
* **Key Component**: `ShareButton`
* **Description**:
  * The share URL is constructed dynamically on the client-side.
  * It obtains the browser's base URL using the custom hook `useBaseUrl` (defined in `src/lib/hooks.ts`).
  * It appends the path to the group's expenses page: `${baseUrl}/groups/${group.id}/expenses?ref=share`.
  * The generated URL relies on the unique group ID (the `nanoid` string) as the path parameter.

---

## 3. Group Joining & Session Management
* **File Paths**:
  * [src/app/groups/[groupId]/layout.client.tsx](file:///c:/Users/ronga/Downloads/spliit-main/spliit-main/src/app/groups/%5BgroupId%5D/layout.client.tsx)
  * [src/app/groups/[groupId]/save-recent-group.tsx](file:///c:/Users/ronga/Downloads/spliit-main/spliit-main/src/app/groups/%5BgroupId%5D/save-recent-group.tsx)
  * [src/app/groups/recent-groups-helpers.ts](file:///c:/Users/ronga/Downloads/spliit-main/spliit-main/src/app/groups/recent-groups-helpers.ts)
  * [src/app/groups/[groupId]/expenses/active-user-modal.tsx](file:///c:/Users/ronga/Downloads/spliit-main/spliit-main/src/app/groups/%5BgroupId%5D/expenses/active-user-modal.tsx)
* **How it works**:
  * **Link Parsing**: When someone accesses the shared link, Next.js routes them to the `/groups/[groupId]/expenses` page. The page structure is wrapped in the group-specific route layout: `GroupLayout` -> `GroupLayoutClient`.
  * **Validation**: `GroupLayoutClient` issues a tRPC query `trpc.groups.get.useQuery({ groupId })` to retrieve the group's name and list of participants from the database. If the group ID does not exist, a destructive toast message is shown indicating the group was not found.
  * **Recent Groups Saving**: Once the group loads successfully, the `SaveGroupLocally` component is mounted. This component executes a `useEffect` hook that triggers `saveRecentGroup({ id: group.id, name: group.name })`. This appends the group to the `recentGroups` array in the browser's `localStorage`.
  * **Identity Selection**: When visiting the expenses page, if the browser does not have an active user ID saved for this group (`localStorage.getItem(`${group.id}-activeUser`)`), the `ActiveUserModal` is automatically displayed. This modal prompts the user to select which participant they are (or select "Nobody"). This preference is saved in `localStorage` under `${group.id}-activeUser` and is used to compute personal balances and highlight the current user's transactions.

---

## 4. Expense Storage and Associations
* **File Paths**:
  * [src/lib/api.ts](file:///c:/Users/ronga/Downloads/spliit-main/spliit-main/src/lib/api.ts) (functions `createExpense` and `updateExpense`)
  * [prisma/schema.prisma](file:///c:/Users/ronga/Downloads/spliit-main/spliit-main/prisma/schema.prisma) (models `Expense`, `Participant`, `ExpensePaidFor`)
* **How it works**:
  * Expenses are stored in the database's `Expense` table.
  * **Group Association**: Each `Expense` row is associated with a group via the `groupId` foreign key.
  * **Paid By**: The participant who paid for the expense is linked using the `paidById` column, referencing a `Participant` ID.
  * **Paid For (Splits)**: Expense splits are stored in the `ExpensePaidFor` join table. Each row connects the `expenseId` with a `participantId` and includes a `shares` column.
    * For an even split (`SplitMode.EVENLY`), each participant included gets 1 share.
    * For custom shares (`SplitMode.BY_SHARES`), custom share quantities are stored.
    * For percentage (`SplitMode.BY_PERCENTAGE`) and amount splits (`SplitMode.BY_AMOUNT`), the ratios/minor unit amounts are serialized into the shares and mode calculations accordingly.
