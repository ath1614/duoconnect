# Design Guidelines: Peer-to-Peer Video Conferencing App

## Design Approach
**System-Based Approach:** Drawing from Google Meet, Discord, and Zoom's functional design patterns. This is a utility-focused application where clarity, efficiency, and immediate usability are paramount. The interface prioritizes video prominence and intuitive controls over decorative elements.

**Core Principle:** "Invisible interface until needed" - video streams are the hero, controls fade until interaction.

## Typography System

**Font Family:** Inter (Google Fonts) - exceptional readability at all sizes, technical precision
- Primary: Inter 400 (body text, labels)
- Emphasis: Inter 600 (buttons, headings)
- Status Text: Inter 500 (connection indicators)

**Type Scale:**
- Room Code Display: text-2xl font-semibold
- Primary Controls: text-base font-medium
- Status Indicators: text-sm font-medium
- Helper Text: text-xs
- User Names: text-lg font-semibold (overlaid on video)

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8
- Component padding: p-4 to p-6
- Control spacing: gap-4 between buttons
- Section margins: mb-6 to mb-8
- Video container padding: p-2

**Application Structure:**

**Pre-Call State (Room Entry):**
- Centered container (max-w-md)
- Vertically centered in viewport
- Room creation/joining form
- Local video preview (small, 320px width)

**Active Call State:**
- Full-viewport video layout (w-screen h-screen)
- Remote video: Primary, fills majority of screen
- Local video: Picture-in-picture, floating bottom-right corner (w-64 aspect-video)
- Controls bar: Fixed bottom, full width, semi-transparent backdrop
- Connection status: Top-right corner, compact

**Dual Video Layout:**
- Side-by-side on desktop (50/50 split with gap-2)
- Stacked on mobile (vertical arrangement)
- Equal prominence when both videos active

## Component Library

**Video Containers:**
- Rounded corners (rounded-lg)
- Aspect ratio locked (aspect-video)
- Object-fit cover for video elements
- Dark background (#000) when no video
- Subtle border (border border-gray-300) on local preview
- Username overlay: bottom-left, p-3, text-white with drop-shadow

**Control Bar:**
- Background: Blurred backdrop (backdrop-blur-md bg-black/40)
- Height: h-20
- Horizontal padding: px-8
- Flex layout, items centered, justify-between
- Icon buttons in groups with gap-3

**Buttons:**
- Primary (Call/Join): Large touch target (h-12 px-8), rounded-full
- Icon Controls: Circular (w-12 h-12), rounded-full
- Destructive (End Call): Red accent, same size as primary
- Toggle States: Visual feedback (opacity change, different icon)
- All buttons: font-medium text

**Status Indicators:**
- Connection Quality: Dot indicator + text (Excellent/Good/Poor)
- Colors communicated via icon states only (signal bars)
- Positioned top-right with p-4
- Compact badge style (rounded-full px-4 py-2)
- Backdrop blur for readability

**Room Code Display:**
- Large, copyable text field
- Monospace appearance for clarity
- Copy button integrated (icon-only)
- Pre-call: Prominent, centered
- In-call: Collapsible info panel (top-left corner)

**Form Inputs (Room Entry):**
- Height: h-12
- Rounded: rounded-lg
- Padding: px-4
- Border: border focus:ring-2 focus:ring-offset-2
- Full width on mobile, fixed width (w-full max-w-sm) on desktop

**Icons:**
Use **Heroicons** via CDN (outline style for inactive, solid for active states):
- Microphone / Microphone Slash
- Video Camera / Video Camera Slash
- Computer Desktop (screen share)
- Phone X Call (end call)
- Clipboard (copy room code)
- Signal (connection strength)

## Screen Sharing UI

**Screen Share Toggle:**
- Integrated into control bar
- When active: Replace camera feed with screen content
- Clear label "Share Screen" / "Stop Sharing"
- Icon indication of current state

**Viewing Shared Screen:**
- Shared screen takes primary video position
- Camera feed moves to PIP if still needed
- Fullscreen toggle available for shared content

## Connection State Management

**Loading States:**
- Connecting: Spinner centered in video container
- Waiting for peer: "Waiting for connection..." text with animated dots
- Reconnecting: Overlay on video with "Reconnecting..." message

**Error States:**
- Permission denied: Clear message with icon in video container
- Connection failed: Retry button prominently displayed
- Network issues: Degraded quality warning in status indicator

## Responsive Behavior

**Desktop (lg and above):**
- Side-by-side videos when both active
- Control bar spans full width
- PIP positioning: bottom-right with m-6

**Tablet (md):**
- Maintain side-by-side if possible
- Slightly smaller PIP (w-48)

**Mobile (base):**
- Stacked vertical layout
- Full-width controls
- Larger touch targets (h-14 for primary controls)
- PIP overlay: bottom-center with m-4, reduced size (w-32)

## Accessibility Patterns

**Keyboard Navigation:**
- Tab order: Room input → Join/Create → Video controls → End call
- Spacebar: Toggle microphone
- Enter: Join room / initiate call
- Escape: End call (with confirmation)

**ARIA Labels:**
- All icon-only buttons have descriptive aria-labels
- Video elements have aria-label indicating whose stream
- Live region for connection status updates
- Role="status" for connection quality indicator

**Focus States:**
- Visible focus rings (ring-2 ring-offset-2)
- High contrast focus indicators
- Never remove focus outlines

## Performance Considerations

**Network Optimization UI:**
- Quality selector: Auto/High/Medium/Low dropdown in settings
- Bandwidth indicator showing current usage
- Option to disable video, audio-only mode
- Visual feedback when quality adjusts automatically

This design creates a clean, distraction-free video conferencing experience optimized for peer-to-peer connections with immediate clarity of controls and connection status.