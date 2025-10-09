# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.3]

### Added

-ui component `CustomImage`

### Chaged

- UI and styles in TitleText from CustomFlatList
- Text for list in OrdersModule
- buttons in HomeScreen

### Fixed

- The app crashes when the `pedido.co_art` is null, a validation check has been implemented.
- Added validation for discount for product list in Orders Module `hasDiscount = discount !== "0" && discount.length > 0`
- Expanding the second item and image in ProductList causes the first item to render incompletely. Only one item was configured for expansion.

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
