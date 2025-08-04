# SignalWire IVR - Code Test Submission

This project is a basic Interactive Voice Response (IVR) system built with Node.js and the SignalWire Realtime API SDK, as part of a code test.

<div align="center">
  <img src="/images/SignalWire IVR-Task-Test.gif" alt="SignalWire IVR-Task-Test" width="800"/>
</div>

## Features

-   **Handles Inbound Calls:** Actively listens for incoming calls to a designated SignalWire phone number.
-   **Interactive Menu:** Plays a welcome message and prompts the user with three options:
    1.  Connect to Support
    2.  Connect to Sales
    3.  Record a Voicemail
-   **Call Forwarding:** Forwards the call to a pre-configured support or sales number based on user input.
-   **Voicemail Recording:** Allows the user to record a short voicemail, which is then accessible via a URL.
-   **Error Handling:** Gracefully handles invalid user input or timeouts.

## Tech Stack

-   **Runtime:** Node.js
-   **API/SDK:** SignalWire Realtime API SDK (`@signalwire/realtime-api`)
-   **Environment Management:** dotenv

## Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone [Caner-Yesiltas]
    cd signalwire-ivr-task
    ```

2.  **Install dependencies:**
    ```bash
    yarn install
    ```

3.  **Configure Environment Variables:**
    -   Create a `.env` file in the root of the project.
    -   Add your SignalWire credentials and forwarding numbers to this file. See `.env.example` for the required format.

    ```
    SIGNALWIRE_PROJECT_ID=...
    SIGNALWIRE_AUTH_TOKEN=...
    SIGNALWIRE_SPACE_URL=...
    SUPPORT_FORWARDING_NUMBER=+1...
    SALES_FORWARDING_NUMBER=+1...
    ```

## Running the Application

1.  **Start the server:**
    ```bash
    node index.js
    ```
2.  The application will log "Application is running and waiting for calls..." to the console.
3.  Call your designated SignalWire phone number to test the IVR flow.

---

## Account Requirements
- **Voicemail recording** requires SignalWire account with recording capabilities
- **Call forwarding and menu** work on all account types
- For production deployment, ensure recording features are enabled in your SignalWire dashboard