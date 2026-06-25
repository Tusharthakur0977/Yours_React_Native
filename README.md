# 🧘‍♀️ Yours - React Native Journaling & Self-Care App

Yours is a beautifully crafted, high-performance React Native application designed for habit tracking, daily journaling, and goal management. Built with modern architecture in mind, the app leverages cutting-edge state management, robust data caching, and an intricate local notification engine to deliver a seamless, native-like user experience.

## 🚀 Tech Stack

This project is built using modern React Native paradigms, eschewing legacy tools in favor of high-performance, type-safe alternatives:

*   **Framework:** React Native (0.73.6) with TypeScript
*   **State Management:** `@legendapp/state` (Ultra-fast, fine-grained reactive state management)
*   **Data Fetching & Caching:** `React Query` (v3) for asynchronous server state and caching
*   **Local Storage:** `react-native-mmkv` (High-performance, synchronous key-value storage written in C++)
*   **Routing:** React Navigation (v6) implementing complex Nested Stacks & Bottom Tabs
*   **UI & Styling:** `@shopify/restyle` for a strictly typed, theme-based design system
*   **Animations:** `react-native-reanimated` for smooth, 60FPS UI interactions
*   **Notifications:** `@notifee/react-native` combined with Firebase Cloud Messaging
*   **Date & Localization:** `dayjs`, `i18next`, and `react-native-localize` for timezone-aware, multi-language support

## ⭐ Spotlight Feature: Context-Aware Deep Notification Engine

**The Problem:** 
In a journaling app, user retention relies heavily on timely, actionable prompts. However, routing a user from a background OS notification directly into a highly nested screen (e.g., a specific morning journal prompt) while passing complex payload data (dates, localized placeholders, specific question IDs) often leads to race conditions, navigation state errors, or broken user context.

**The Engineering Solution:**
I engineered a custom Notification Press Handler (`notificationPressHandler.tsx`) that acts as a bridge between Notifee's background event listeners and React Navigation's state tree. 

*   **Dynamic Deep Linking:** Instead of simply opening the app, the engine intercepts the `EventType.PRESS` payload and parses custom properties like `JOURNAL_REMINDER`, `Question_prompt_morning`, `WEEKLY_INTENTION`, or `TimerNotification`.
*   **Complex Payload Hydration:** It dynamically calculates dates (using custom utility helpers) and constructs a nested navigation route array. For example, a morning prompt notification explicitly routes the user through `Tabs -> JournalStack -> JournalQuestion` while safely injecting the prompt text, modal dates, and placeholder data as route params.
*   **State Safety:** By using `navigation.replace` within the handler, it prevents the user from accidentally navigating "back" to a broken state, ensuring the navigation stack remains clean and memory leaks are avoided.

## 🛠 Key Features

*   **Reactive, Jitter-Free UI:** By utilizing `@legendapp/state` and MMKV, the app achieves instant UI updates and offline capabilities without the typical Redux boilerplate overhead.
*   **Type-Safe Design System:** Built entirely on `@shopify/restyle`, ensuring that all margins, colors, and typography strictly adhere to the app's predefined design tokens, eliminating inline styling inconsistencies.
*   **Timezone-Aware Architecture:** Automatically detects local OS timezones via `react-native-localize` and synchronizes with the backend to ensure users receive their morning and night prompts at the correct local time, regardless of travel.
*   **Optimized Asset Delivery:** Uses `react-native-fast-image` to aggressively cache UI assets, drastically reducing image load times and memory footprint during long scroll sessions.

## 💡 Why This Project Stands Out

Building **Yours** required solving complex architectural challenges far beyond a typical CRUD application. Moving away from standard Redux in favor of `@legendapp/state` and `React Query` required a deep understanding of reactive programming and rendering optimization to prevent unnecessary component re-renders. Furthermore, implementing a robust, context-aware notification engine that flawlessly interacts with deeply nested navigation stacks demonstrates a high level of competency in mobile lifecycle management and asynchronous event handling. This project proves an ability to make mature architectural decisions that prioritize performance, type safety, and user experience.
