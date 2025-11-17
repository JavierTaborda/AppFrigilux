# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2025-MM-DD #UNRELEASED

### Added

- Return Report Module — Initial implementation for generating and viewing return reports from orders.
- `pickImage` helper — Simplified helper to pick and upload images to Supabase Storage (works with Expo Image Picker and handles resizing/formatting before upload).
- safeHaptic utility
    A new `safeHaptic` helper to standardize haptic feedback across the app:
    -Centralized API for triggering haptics from anywhere in the codebase.
    -Full TypeScript support with a defined set of haptic types for autocomplete and safety.
    -Graceful fallback when haptics are unavailable (no-op instead of throwing).
    -Easy to extend: add new types in one place.
    -Consistent UX across iOS and Android (maps to the best available native haptic).

    Available haptic types:
    -`success`
    -`warning`
    -`error`
    -`selection`
    -`light`
    -`medium`
    -`heavy`
    -`rigid`
    -`soft`

    Usage:

    ```ts
    import { safeHaptic } from "@/utils/safeHaptics";

    safeHaptic("success");
    safeHaptic("warning");
    safeHaptic("selection");
    safeHaptic("heavy");
    ```

### Changed

- Styles and UI in `CustomDrawerContent` and `DrawerItem`
- OrderSearScreen: Only show Switch if the order satus is diferent from 2
- `CustomFlatList` with built‑in pagination:
    -Added automatic pagination: items are loaded in batches (pageSize, default 20).
    -Implemented incremental loading via onEndReached, reducing initial render workload.
    -Introduced loading spinner in ListFooterComponent to indicate when more items are being fetched.
    -Optimized scroll‑to‑top button using scrollToOffset for smoother navigation.
    -Tuned FlatList props (initialNumToRender, maxToRenderPerBatch, windowSize) for better virtualization.

### Fixed

- Remove Shadow in tab buttons for android devices

### Removed

- N/A

## [1.0.1](https://github.com/JavierTaborda/AppFrigilux/releases/tag/v1.0.1) - 2025-10-27

### Added

-Endpoint for Goals Module in GoalsService to get Categorys of products.

### Changed

- Component `ChartLineView` scroll to the end to show last day.
- Add filter option in GoalsFilter, by Used and cod of Category, only in memory not in backend
- Add code of category in Goals type.
- Add Catgory type in Goal Module

### Fixed

- N/A

### Removed

- N/A

## [1.0.0](https://github.com/JavierTaborda/AppFrigilux/releases/tag/v1.0.0) - 2025-10-22

### Added

- Goals Module
- Design for Returns Report Module
- Switch to add `**` to the comment of an order.
- install `expo-image-picker`
- install `base64-arraybuffer`
- intall `expo-camera`
- Global Component `BarcodeScanner` to scan qr, barcoders...

### Chaged

- Setting screen and tab, for logout tab
- Add property `showfilterButton` to ScreenSearchLayout to hide filter button if dont need it.

## [0.0.3](https://github.com/JavierTaborda/AppFrigilux/releases/tag/v0.0.3) - 2025-10-10

### Added

-ui component `CustomImage`
-Name in `useAuthStore` from supabase

### Chaged

- UI and styles in TitleText from CustomFlatList
- Text for list in OrdersModule
- buttons in HomeScreen
- function in  `useHomeScreen` for get the current mont and year
- hide the emojis and icon in home screen and drawer

### Fixed

- The app crashes when the `pedido.co_art` is null, a validation check has been implemented.
- Added validation for discount for product list in Orders Module `hasDiscount = discount !== "0" && discount.length > 0`
- Expanding the second item and image in ProductList causes the first item to render incompletely. Only one item was configured for expansion.
- Prevented automatic write on first render: Added a didMount flag to avoid triggering `setBiometricEnabled()` when th  e component first loads im profile.
- The biometric toggle no longer defaults to true on first app launch if the saved value is false.

## [0.0.2](https://github.com/JavierTaborda/AppFrigilux/releases/tag/v0.0.2) - 2025-10-08

### Added

- API route for Images of products with Expo Image for Orders Module.
- `userRefreshController` in @utils with wrapRefresh reusable helper to centralize refresh logic and avoid duplication.

### Changed

- UI/UX in product lits, show price + IVA and discount for Orders Module
- Refactored `handleRefresh` to use centralized logic via `wrapRefresh` for custom FlatList

### Fixed

- `handlerefresh` apply the filters in OrdersSearchScreen
- Prevented automatic refresh when `canRefresh` changes
- Auto-refresh no triggers after cooldown ends on Android and IOS
- Chart in HomeScreen show all days

## [0.0.1](https://github.com/JavierTaborda/AppFrigilux/releases/tag/v0.0.1) - 2025-10-02

### Added

- Expo Router for navigation with Drawer and Tabs
- Modular architecture for each feature
- Authentication with Supabase and state management with Zustand
- Biometric authentication for restoring session
- API requests handled with Axios
- Styling and dark mode with NativeWind
- AnimatedView for modals
- Charts in HomePage with `react-native-charts-kit`
- Orders Module (order search and approval)
- Create Orders Module (order creation)
- Home Module (dashboard and metrics)
- Profile Module (user profile and settings)
- Auth Module (login and session handling)

### Changed

- N/A

### Fixed

- N/A

### Removed

- N/A
