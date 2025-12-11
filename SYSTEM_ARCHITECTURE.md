# Wasillah Platform - Complete System Architecture

**Last Updated:** December 11, 2024  
**Version:** 2.0  
**Platform:** Social Impact & Volunteer Management System

---

## 📋 Table of Contents

1. [Platform Overview](#platform-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Patterns](#architecture-patterns)
4. [Page-by-Page Architecture](#page-by-page-architecture)
5. [Shared Components](#shared-components)
6. [State Management](#state-management)
7. [Authentication & Authorization](#authentication--authorization)
8. [Data Models](#data-models)
9. [API Integration](#api-integration)
10. [Security Implementation](#security-implementation)

---

## 🎯 Platform Overview

### Mission
Wasillah is a comprehensive social impact platform designed to connect students, volunteers, and NGOs across Pakistan for meaningful community engagement and social work initiatives.

### Core Objectives
- **Connect** stakeholders (Students, Volunteers, NGOs)
- **Facilitate** project discovery and volunteer matching
- **Track** social impact and volunteer contributions
- **Enable** transparent donation management
- **Provide** tools for NGO project management

### Target Users
1. **Students** - Seeking volunteer opportunities for academic credit
2. **Volunteers** - Looking for meaningful social impact work
3. **NGOs** - Managing projects and recruiting volunteers
4. **Admins** - Platform management and content moderation

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18.3.1
- **Language**: TypeScript 5.6.3
- **Build Tool**: Vite 5.x
- **Routing**: React Router DOM 7.1.1
- **Styling**: TailwindCSS 3.4.17
- **Rich Text**: TipTap 3.10.8
- **Icons**: Lucide React 0.468.0
- **Maps**: Leaflet 1.9.4
- **Charts**: Recharts 2.15.0

### Backend Services
- **Auth**: Firebase Authentication
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Functions**: Firebase Cloud Functions
- **Email**: Resend API
- **Image Processing**: Cloudinary (via Supabase)
- **Analytics**: Google Analytics 4

### Additional Tools
- **CMS**: Custom TipTap-based editor
- **i18n**: Custom translation system (English/Urdu)
- **PWA**: Vite PWA Plugin
- **State**: React Context API
- **Forms**: Custom validation
- **Date/Time**: date-fns 4.1.0

---

## 🏗️ Architecture Patterns

### Component Architecture
- **Atomic Design**: Components organized by complexity
- **Feature-based**: Pages own their feature components
- **Shared Components**: Reusable UI elements
- **Context Providers**: App-level state management

### Data Flow
1. User Action → Component Event Handler
2. Handler calls Service Layer
3. Service interacts with Firebase/API
4. Context updates global state
5. Components re-render with new data

### Folder Structure
```
src/
├── pages/           # Route-level components
├── components/      # Reusable UI components
│   ├── Admin/      # Admin-specific components
│   ├── Analytics/  # Analytics widgets
│   ├── Chat/       # Chat functionality
│   ├── Dashboard/  # Dashboard widgets
│   ├── Donation/   # Donation components
│   ├── Payment/    # Payment processing
│   ├── SEO/        # SEO components
│   ├── Social/     # Social features
│   ├── Subscription/ # Subscription management
│   └── Tasks/      # Task management
├── contexts/        # React Context providers
├── hooks/           # Custom React hooks
├── services/        # API and business logic
├── types/           # TypeScript interfaces
├── utils/           # Utility functions
└── config/          # Configuration files
```

---

## 📱 Page-by-Page Architecture

### 1. HOME PAGE (`/`)
**Component**: `HomeEditable.tsx`  
**Access**: Public  
**Purpose**: Landing page showcasing platform value and driving user registration

#### 1.1 Hero Section
**Component**: `ThemedHeroSection`
- **Dynamic Background**: Video or image background with overlay
- **Headline**: Editable title with highlighted text
  - Primary title: "Empowering Communities,"
  - Highlighted text: "Building Futures"
- **Subtitle**: Descriptive tagline about platform mission
- **CTA Buttons**: 
  - "Get Started" (primary) → Navigate to registration
  - "Learn More" (secondary) → Scroll to about section
- **Features**:
  - Theme-aware styling (adapts to light/dark mode)
  - Admin edit mode for content modification
  - Animated text reveal on load
  - Responsive video/image handling

#### 1.2 About Section
**Component**: `ThemedSection` with custom content
- **Mission Statement**: Platform's core mission and vision
- **Value Proposition**: Key benefits for each user type
- **Statistics Preview**: Mini version of impact stats
- **Visual Elements**:
  - Icon-based feature highlights
  - Image gallery of past projects
  - Testimonial quotes
- **Admin Features**:
  - Rich text editing for mission text
  - Image upload and management
  - Reorderable content blocks

#### 1.3 Featured Projects Section
- **Title**: "Discover Opportunities"
- **Project Cards**: Grid layout (3-4 projects)
  - Project thumbnail image
  - Project title and organization
  - Category badge
  - Location pin
  - Volunteer count needed
  - Quick bookmark button
- **Filtering**: Quick category pills
- **CTA**: "View All Projects" button → `/projects`
- **Data Source**: Firestore query for featured/recent projects
- **Features**:
  - Lazy loading images
  - Hover animations
  - Real-time availability updates

#### 1.4 Upcoming Events Section
- **Title**: "Join Our Events"
- **Event Cards**: Horizontal scroll/carousel
  - Event banner image
  - Date and time (countdown if near)
  - Event title
  - Location
  - Attendee count
  - "Register" CTA
- **Calendar Integration**: Link to full events calendar
- **Features**:
  - Auto-scroll carousel
  - Date formatting with relative time
  - Capacity indicators

#### 1.5 How It Works Section
- **Three-Step Process**:
  1. **Discover**: Browse projects and events
     - Icon: Search/Compass
     - Description: Filter by interests
  2. **Apply**: Submit your application
     - Icon: Form/Document
     - Description: Quick application process
  3. **Make Impact**: Start volunteering
     - Icon: Heart/Star
     - Description: Track your contributions
- **Visual Flow**: Connected steps with arrows
- **Role-Specific Tabs**:
  - For Students
  - For Volunteers
  - For NGOs
- **Features**:
  - Animated step progression
  - Interactive role switcher

#### 1.6 Impact Statistics Section
**ID**: `impact-stats` (for scroll tracking)
- **Counter Animation**: Numbers animate on scroll into view
- **Four Key Metrics**:
  1. **Active Volunteers**: 5000+
     - Icon: Users
     - Animated counter
  2. **Projects Completed**: 120+
     - Icon: Target
     - Progress indicator
  3. **Communities Served**: 50+
     - Icon: Heart
     - Geographic spread
  4. **Lives Impacted**: 25K+
     - Icon: Award
     - Cumulative impact
- **Visual Style**: 
  - Large numbers with gradient text
  - Icon backgrounds
  - Grid/flex layout
- **Features**:
  - IntersectionObserver for animation trigger
  - Smooth counter increments
  - Admin editable target numbers

#### 1.7 Programs/Services Section
- **Dynamic Content**: Loaded from Firestore `programs` collection
- **Program Cards**:
  - Icon/image
  - Program title
  - Short description
  - "Learn More" link
- **Categories**:
  - Education initiatives
  - Healthcare programs
  - Environmental projects
  - Community development
- **Admin CRUD**:
  - Create new program
  - Edit existing programs
  - Delete programs
  - Reorder programs

#### 1.8 Testimonials Section
- **Layout**: Carousel/grid of testimonial cards
- **Card Content**:
  - Quote text with quotation marks
  - User photo
  - Name and role
  - Star rating
  - Organization (if applicable)
- **Features**:
  - Auto-rotating carousel
  - Swipe gestures on mobile
  - Admin add/edit/delete
- **Data Source**: Firestore `testimonials` collection

#### 1.9 Call-to-Action Section
- **Final Conversion Push**: "Join Us Today"
- **Multiple Entry Points**:
  - Student registration button
  - NGO signup button
  - Volunteer application link
- **Trust Signals**:
  - Partner logos
  - Certification badges
  - Social proof numbers
- **Newsletter Signup**: Email capture form
- **Features**:
  - A/B tested CTA text (admin configurable)
  - Email validation
  - Privacy policy link

**Global Features (Home Page)**:
- ✅ Fully editable by admins when logged in
- ✅ Multi-language support (English/Urdu with RTL)
- ✅ SEO optimized with meta tags
- ✅ PWA install prompt
- ✅ Lazy loading for images
- ✅ Smooth scroll navigation
- ✅ Theme persistence
- ✅ Responsive breakpoints (mobile, tablet, desktop)

---

### 2. ABOUT PAGE (`/about`)
**Component**: `AboutEditable.tsx`  
**Access**: Public  
**Purpose**: Detailed information about the organization

#### 2.1 Organization Header
- **Banner Image**: Full-width hero image
- **Organization Name**: Large typography
- **Tagline**: Mission in one sentence
- **Founded Date**: "Est. 2020" badge
- **Social Links**: Quick access icons

#### 2.2 Mission & Vision Section
- **Mission Statement**:
  - Full paragraph explaining the why
  - Editable rich text
  - Pull quotes highlighted
- **Vision Statement**:
  - Future aspirations
  - Long-term goals
  - Impact targets
- **Visual Elements**:
  - Background patterns
  - Icon illustrations

#### 2.3 Our Story Section
- **Timeline Format**:
  - Year-by-year milestones
  - Key achievements
  - Growth metrics at each stage
- **Founder's Message**:
  - Photo of founder(s)
  - Personal story
  - Motivation for starting
- **Features**:
  - Vertical timeline on desktop
  - Horizontal scroll on mobile
  - Animated timeline markers

#### 2.4 Team Section
- **Leadership Team**:
  - Grid of team member cards
  - Photo, name, role
  - Short bio
  - LinkedIn/social links
- **Board Members** (if applicable)
- **Advisory Board**
- **Features**:
  - Modal for full bio
  - Contact buttons
  - Admin CRUD operations

#### 2.5 Core Values Section
- **Value Cards**: 4-6 key values
  - Icon representation
  - Value name (e.g., "Transparency")
  - Description paragraph
  - Real-world example
- **Visual Style**: Icon-first design
- **Layout**: Grid or carousel

#### 2.6 Impact Stories Section
- **Success Case Studies**:
  - Featured project outcomes
  - Before/after photos
  - Volunteer testimonials
  - Metrics (people helped, hours volunteered)
- **Photo Galleries**:
  - Lightbox viewer
  - Project photos
  - Event photos
- **Video Content** (if available):
  - Embedded videos
  - YouTube/Vimeo links

#### 2.7 Partners & Sponsors
- **Partner Logos**: Grid display
- **Sponsor Tiers**: Gold, Silver, Bronze
- **Collaboration Highlights**
- **"Become a Partner" CTA**

#### 2.8 Contact Information
- **Office Locations**:
  - Karachi office address
  - Lahore office address
  - Islamabad office address
- **Contact Details**:
  - Phone numbers
  - Email addresses
  - Business hours
- **Interactive Map**: Embedded location pins
- **Quick Contact Form**

**Admin Features**:
- ✅ Edit mode toggle in header
- ✅ Inline content editing
- ✅ Image upload with Cloudinary
- ✅ Rich text formatting
- ✅ Section reordering
- ✅ Version history
- ✅ Preview before publish

---

### 3. PROJECTS PAGE (`/projects`)
**Component**: `Projects.tsx` (Component-based, not in pages directory)  
**Access**: Public  
**Purpose**: Browse and discover volunteer projects

#### 3.1 Page Header
- **Title**: "Volunteer Projects"
- **Subtitle**: "Find opportunities that match your skills"
- **View Toggle**: Grid view / List view
- **Create Button** (NGO users only): "+ Create Project"

#### 3.2 Filter Sidebar (Desktop) / Filter Modal (Mobile)
**Component**: `ProjectFilters.tsx`

**Category Filters**:
- Education (checkbox)
- Healthcare (checkbox)
- Environment (checkbox)
- Community Development (checkbox)
- Youth Programs (checkbox)
- Women Empowerment (checkbox)
- Disaster Relief (checkbox)

**Location Filters**:
- Province dropdown (Punjab, Sindh, KPK, Balochistan)
- City autocomplete
- "Near me" option (geolocation)

**Status Filters**:
- Active (recruiting)
- Upcoming
- In Progress
- Completed
- All

**Additional Filters**:
- Date range picker (start/end dates)
- Time commitment (hours/week)
- Skills required (multi-select)
- Remote/On-site toggle
- NGO verification status

**Sort Options**:
- Most Recent
- Most Popular (bookmarks)
- Closing Soon
- Highest Impact Score
- Distance (if location enabled)

#### 3.3 Project Grid/List
**Grid View** (Default):
- 3 columns on desktop
- 2 columns on tablet
- 1 column on mobile
- Card-based layout

**List View**:
- Full-width rows
- More detailed information
- Side-by-side image and text

**Project Card** (`ProjectCard.tsx`):
- **Image**: Project thumbnail (16:9 ratio)
- **Category Badge**: Colored tag (top-left)
- **NGO Logo**: Small overlay (top-right)
- **Bookmark Icon**: Heart icon to save
- **Content Area**:
  - Project title (2 lines max, ellipsis)
  - NGO name with verified badge
  - Location with pin icon
  - Short description (3 lines)
- **Metadata Row**:
  - Date posted (relative time)
  - Volunteers needed: "5/20 joined"
  - Duration: "3 months"
- **Tags**: Skill pills (max 3 visible)
- **CTA Button**: "View Details" or "Apply Now"
- **Hover Effects**:
  - Scale up animation
  - Shadow elevation
  - Quick preview tooltip

#### 3.4 Featured Projects Banner
- **Highlighted Section**: Top of page
- **Carousel**: 3-5 promoted projects
- **Auto-scroll**: Every 5 seconds
- **Premium Placement**: Paid promotion for NGOs

#### 3.5 Pagination/Infinite Scroll
- **Initial Load**: 12 projects
- **Infinite Scroll**: Load 12 more on scroll
- **Loading State**: Skeleton cards
- **End Message**: "You've seen all projects"
- **Scroll to Top**: Floating button

#### 3.6 Empty State
- **No Results Found**:
  - Illustration
  - "Try adjusting your filters"
  - "Reset all filters" button
  - Suggested projects

#### 3.7 Project Actions
- **Bookmark**: Save for later (requires auth)
- **Share**: Social media sharing
- **Report**: Flag inappropriate content

**Data Flow**:
1. Component mounts → Query Firestore `project_submissions`
2. Apply filters → WHERE clauses
3. Real-time listener → onSnapshot for updates
4. Cache results → Local state management
5. Pagination → Query cursors

**Performance Optimizations**:
- ✅ Image lazy loading
- ✅ Virtual scrolling for large lists
- ✅ Debounced filter updates
- ✅ Query result caching
- ✅ Optimistic UI updates

---

### 4. PROJECT DETAIL PAGE (`/projects/:id`)
**Component**: `ProjectDetail.tsx`  
**Access**: Public  
**Purpose**: Full project information and volunteer application

#### 4.1 Project Hero Section
- **Full-Width Banner**: Project cover image
- **Overlay Information**:
  - Project category badge
  - Status indicator (Active/Closed/Full)
  - Share buttons (floating)
  - Bookmark button
- **Breadcrumb Navigation**: Home > Projects > Project Name

#### 4.2 Project Header
- **Title**: Large, prominent project title
- **NGO Information Row**:
  - NGO logo (clickable to profile)
  - NGO name
  - Verified badge (if verified)
  - Follow button
- **Quick Stats Bar**:
  - Start date
  - End date
  - Duration
  - Location
  - Volunteers: "15/30 joined"
- **Primary CTA**: "Apply Now" button (sticky on scroll)

#### 4.3 Tabs Navigation
**Tab Bar**: 
1. Overview (default)
2. Details
3. Requirements
4. Location
5. Reviews
6. Q&A

#### Tab 1: Overview
- **Description**: Rich text content with formatting
- **Key Highlights**: Bullet points of main features
- **Impact Goals**:
  - Expected outcomes
  - Measurable targets
  - Success criteria
- **Project Timeline**:
  - Visual timeline
  - Key milestones
  - Phase breakdown

#### Tab 2: Details
- **About This Project**:
  - Full detailed description
  - Problem statement
  - Proposed solution
  - Expected deliverables
- **Project Coordinator**:
  - Name and photo
  - Contact information
  - Bio
- **Schedule**:
  - Days: Mon-Fri or flexible
  - Time: Morning/Afternoon/Evening
  - Total hours commitment
- **What You'll Do**:
  - Specific tasks
  - Responsibilities
  - Day-to-day activities

#### Tab 3: Requirements
- **Eligibility Criteria**:
  - Age range
  - Education level
  - Background checks
- **Required Skills**:
  - Skill tags with proficiency levels
  - Must-have vs nice-to-have
- **Required Documents**:
  - ID card
  - Resume
  - Reference letters
  - Medical clearance (if needed)
- **Prerequisites**:
  - Training required
  - Previous experience
  - Language requirements

#### Tab 4: Location & Map
- **Interactive Map** (`InteractiveMap.tsx`):
  - Leaflet integration
  - Project location marker
  - Zoom controls
  - Satellite/street view toggle
- **Address Details**:
  - Full street address
  - Nearby landmarks
  - Public transport access
  - Parking information
- **Directions**: Link to Google Maps
- **Accessibility Information**:
  - Wheelchair accessible
  - Facilities available

#### Tab 5: Reviews & Ratings
- **Overall Rating**:
  - Star rating (1-5)
  - Total reviews count
  - Rating breakdown chart (5★: 80%, 4★: 15%, etc.)
- **Review Filters**:
  - Most Recent
  - Highest Rated
  - Lowest Rated
  - Verified Volunteers Only
- **Review Card** (`ReviewCard.tsx`):
  - User avatar
  - User name
  - Star rating
  - Review date
  - Review text
  - Helpful votes
  - Photos (if uploaded)
  - NGO response (if any)
- **Write a Review** (past volunteers only):
  - Star rating selector
  - Text area
  - Photo upload
  - Anonymous option
  - Submit button

#### Tab 6: Q&A / Comments
**Component**: `Comments.tsx`
- **Comment Thread**:
  - Nested replies
  - Like/useful buttons
  - Sort by: Latest, Popular
- **Ask a Question**: Text area + submit
- **Moderation**: Admins can delete inappropriate comments
- **Notifications**: Users get notified of replies

#### 4.4 Application Sidebar (Desktop) / Bottom Sheet (Mobile)
**Application Form**:
- **Personal Information** (pre-filled if logged in):
  - Name
  - Email
  - Phone
  - City
- **Motivation**: "Why do you want to volunteer?"
- **Availability**:
  - Start date picker
  - Days available (checkboxes)
  - Time preference
- **Skills**: Multi-select from required skills
- **Experience**: Text area for relevant experience
- **References**: Name and contact of 2 references
- **Documents Upload**:
  - Resume (PDF)
  - ID Card (image)
  - Other documents
- **Agree to Terms**: Checkbox + link to terms
- **Submit Button**: "Submit Application"

**Application States**:
- **Not Logged In**: Prompt to login/register
- **Already Applied**: Show application status
- **Project Full**: Waitlist option
- **Project Closed**: "Applications closed"

#### 4.5 Similar Projects Section
- **Title**: "You May Also Like"
- **Recommendation Algorithm**:
  - Same category
  - Same location
  - Similar skills required
- **Horizontal Scroll**: 4-5 project cards
- **CTA**: "View All Similar Projects"

#### 4.6 Share & Actions Bar
- **Social Share**:
  - Facebook
  - Twitter
  - LinkedIn
  - WhatsApp
  - Copy link
- **Actions**:
  - Print project details
  - Download PDF
  - Report project
  - Contact NGO

**Data Management**:
- Project data: Firestore `project_submissions` collection
- Applications: Firestore `applications` collection
- Reviews: Firestore `reviews` sub-collection
- Real-time updates: onSnapshot listeners
- Optimistic updates: Local state changes before DB confirmation

**Features**:
- ✅ Dynamic route parameters
- ✅ SEO meta tags per project
- ✅ Open Graph tags for sharing
- ✅ Schema.org structured data
- ✅ Real-time availability updates
- ✅ Application status tracking
- ✅ Email confirmations
- ✅ Calendar integration (add to calendar button)
- ✅ Responsive design
- ✅ Accessibility (ARIA labels, keyboard navigation)

---

### 5. EVENTS PAGE (`/events`)
**Component**: `Events.tsx`  
**Access**: Public  
**Purpose**: Discover and register for community events

#### 5.1 Page Header
- **Title**: "Community Events"
- **Subtitle**: "Join us for workshops, fundraisers, and community gatherings"
- **View Toggle**: Calendar View / List View
- **Create Event Button** (NGO/Admin only)

#### 5.2 Filter Bar
**Quick Filters** (Chips):
- All Events
- This Week
- This Month
- Free Events
- Paid Events
- Virtual Events
- In-Person Events

**Advanced Filters** (Dropdown/Modal):
- **Date Range**: Start date to end date picker
- **Category**:
  - Workshop
  - Fundraiser
  - Training
  - Conference
  - Social Gathering
  - Award Ceremony
- **Location**: City/province selector
- **Price Range**: Free, Under 500 PKR, Under 1000 PKR, All
- **Organizer**: NGO name search

#### 5.3 Calendar View
**Component**: Custom calendar built with date-fns
- **Month Navigation**: Previous/Next arrows, Today button
- **Date Grid**: 7×5 grid showing full month
- **Event Indicators**:
  - Colored dots on dates with events
  - Multiple dots for multiple events
  - Hover shows event count
- **Event Popover**: Click date shows events list
- **Color Coding**: Different colors per category
- **Features**:
  - Highlight today
  - Disable past dates
  - Keyboard navigation

#### 5.4 List View (Default)
**Event Cards** (List format):
- **Left Section**: Date box
  - Month (abbreviated)
  - Day (large number)
  - Year
- **Middle Section**: Event details
  - Event title
  - Organizer name with logo
  - Category badge
  - Time: "10:00 AM - 12:00 PM"
  - Location: Address or "Virtual"
  - Short description (2 lines)
- **Right Section**: CTA and info
  - Attendee count: "45 registered"
  - Price: "Free" or "PKR 500"
  - Registration button
  - Bookmark icon
- **Hover State**: Elevate card, show more details

#### 5.5 Featured Events Banner
- **Highlighted Events**: Top 3 upcoming events
- **Carousel**: Auto-rotating slider
- **Large Images**: Banner-style photos
- **Quick Register**: Direct registration CTA

#### 5.6 Past Events Section
- **Tab Toggle**: "Upcoming" (active) / "Past Events"
- **Past Event Cards**: Grayed out, "View Gallery" CTA
- **Event Archive**: Photos and recap

#### 5.7 Event Registration
**Registration Modal/Drawer**:
- **Event Summary**: Quick recap at top
- **Registration Form**:
  - Name (pre-filled)
  - Email (pre-filled)
  - Phone
  - Number of tickets (if limited)
  - Dietary preferences (if meal included)
  - Emergency contact
  - Special requirements/notes
- **Payment** (for paid events):
  - Show payment gateway integration
  - Payment methods
  - Receipt generation
- **Confirmation**:
  - Success message
  - Email confirmation sent
  - Add to calendar button
  - Ticket/QR code (if applicable)

#### 5.8 Event Reminders
- **Reminder Options**:
  - Email reminder (1 day before)
  - Push notification (1 hour before)
  - SMS reminder (optional)
- **Auto-generated Calendar Event**: .ics file download

#### 5.9 Empty States
- **No Events Found**:
  - Illustration
  - "No events match your filters"
  - "Clear filters" button
  - "Suggest an event" link
- **No Upcoming Events**:
  - "Check back soon for new events"
  - "View past events" button

**Data Source**:
- Firestore `event_submissions` collection
- WHERE status = 'approved'
- ORDER BY startDate ASC
- Real-time updates with onSnapshot

**Features**:
- ✅ iCal export functionality
- ✅ Google Calendar integration
- ✅ Event registration tracking
- ✅ Waitlist management (if full)
- ✅ Email reminders via Resend
- ✅ Push notifications
- ✅ QR code tickets
- ✅ Check-in system (for organizers)
- ✅ Post-event feedback forms
- ✅ Photo gallery after event

---

### 6. EVENT DETAIL PAGE (`/events/:id`)
**Component**: `EventDetail.tsx`  
**Access**: Public  
**Purpose**: Complete event information and registration

#### 6.1 Event Hero
- **Banner Image**: Full-width event photo
- **Overlay Content**:
  - Category badge
  - Registration status: "Open" / "Closed" / "Sold Out"
  - Share buttons
  - Bookmark button

#### 6.2 Event Header
- **Event Title**: Large prominent heading
- **Organizer Info**:
  - NGO logo and name
  - Verified badge
  - Follow button
- **Date & Time Bar**:
  - Date with icon
  - Time duration
  - Countdown timer (if near)
  - Time zone indicator
- **Location**:
  - Venue name
  - Address
  - "Get Directions" link
  - Virtual meeting link (if applicable)
- **Registration CTA**: Sticky button "Register Now" / "Join Event"

#### 6.3 Event Quick Info Card
**Sidebar on Desktop, Top Card on Mobile**:
- **When**: Full date and time
- **Where**: Address with map thumbnail
- **Cost**: Free or price
- **Capacity**: "45/100 spots filled"
- **Registration Deadline**: Date
- **Contact**: Event coordinator details
- **Register Button**: Primary CTA
- **Add to Calendar**: Dropdown with options
  - Google Calendar
  - Apple Calendar
  - Outlook
  - Download .ics

#### 6.4 Event Tabs
**Tabs Navigation**:
1. About
2. Agenda
3. Speakers/Facilitators
4. Location
5. Attendees
6. FAQ

#### Tab 1: About
- **Full Description**: Rich text content
- **Event Highlights**: Key points with icons
- **What You'll Learn/Experience**:
  - Bullet points
  - Learning objectives
  - Takeaways
- **Who Should Attend**:
  - Target audience
  - Prerequisites
  - Recommended background
- **What to Bring**:
  - Items list
  - Dress code
  - Materials provided

#### Tab 2: Agenda/Schedule
- **Timeline View**:
  - Time slots with activities
  - Speaker/facilitator for each segment
  - Break times
  - Duration for each session
- **Visual Timeline**: Vertical progress bar
- **Downloadable PDF**: Agenda document

#### Tab 3: Speakers & Facilitators
- **Speaker Cards**:
  - Professional photo
  - Name and title
  - Organization
  - Bio paragraph
  - Social links
  - Session they're leading
- **Modal**: Click for full bio

#### Tab 4: Location & Venue
- **Interactive Map**:
  - Full-screen map option
  - Zoom controls
  - Venue marked
- **Venue Information**:
  - Venue name
  - Full address
  - Landmarks
  - Parking details
  - Public transport access
  - Accessibility features
- **Directions Link**: Google Maps
- **Virtual Event Details** (if applicable):
  - Platform: Zoom/Google Meet
  - Join link (for registered attendees)
  - Meeting ID and password

#### Tab 5: Attendees
- **Attendee List** (if public):
  - Profile photos grid
  - Names
  - Organizations
  - "Going" count
- **Privacy Options**:
  - Public list (opt-in)
  - Hidden list
  - Show only count
- **Networking**:
  - "Connect" buttons
  - Attendee messages (registered users)

#### Tab 6: FAQ
- **Accordion of Common Questions**:
  - Registration process
  - Cancellation policy
  - Refund policy
  - What's included
  - COVID protocols
  - Recording availability
- **Ask a Question**: Contact form for unlisted queries

#### 6.5 Registration Section
**If Not Registered**:
- **Registration Form** (Modal or Sidebar):
  - Personal details (pre-filled if logged in)
  - Contact information
  - Number of tickets
  - Dietary restrictions
  - Emergency contact
  - Special accommodations
  - Agree to terms
  - Submit button

**If Registered**:
- **Registration Confirmed** card:
  - "You're registered!" message
  - QR code ticket
  - Confirmation number
  - Email confirmation sent
  - Add to calendar button
  - Share event button
- **Cancel Registration**: Link to cancel (if allowed)

#### 6.6 Similar Events
- **Recommendation Section**: "You Might Also Like"
- **Event Cards**: 3-4 related events
- **Filtering**:
  - Same category
  - Same organizer
  - Similar date
  - Same location

#### 6.7 Event Actions
- **Share Event**:
  - Social media platforms
  - Email invite
  - Copy link
- **Report Event**: Flag inappropriate content
- **Contact Organizer**: Direct message
- **Download Materials**: Pre-event resources

**Post-Event Features** (After event date):
- **Event Recap**: Photos and highlights
- **Feedback Form**: Rate the event
- **Certificate Download** (if applicable)
- **Photo Gallery**: Uploaded event photos

**Data Management**:
- Event data: `event_submissions` collection
- Registrations: `event_registrations` sub-collection
- Check-ins: `event_checkins` sub-collection
- Real-time capacity updates
- Automated email confirmations

**Features**:
- ✅ Dynamic event capacity
- ✅ Waitlist functionality
- ✅ QR code generation
- ✅ Email confirmations
- ✅ Calendar integration
- ✅ Virtual event links
- ✅ Attendance tracking
- ✅ Post-event surveys
- ✅ Certificate generation
- ✅ Photo galleries

---

### 7. VOLUNTEER PAGE (`/volunteer`)
**Component**: `Volunteer.tsx`  
**Access**: Public  
**Purpose**: Inform and inspire people to volunteer

#### 7.1 Hero Section
- **Compelling Headline**: "Make a Difference Today"
- **Sub-headline**: Emotional appeal for volunteering
- **Hero Image**: Volunteers in action
- **Primary CTA**: "Start Volunteering"
- **Secondary CTA**: "Learn More" (scroll)

#### 7.2 Why Volunteer Section
- **Benefits Grid** (4-6 cards):
  1. **Build Skills**
     - Icon: Growth chart
     - Description: Develop new competencies
     - Examples: Leadership, communication
  2. **Make Friends**
     - Icon: Users
     - Description: Connect with like-minded people
  3. **Gain Experience**
     - Icon: Briefcase
     - Description: Add to resume
     - Certificate issuance mentioned
  4. **Create Impact**
     - Icon: Heart
     - Description: See tangible results
  5. **Academic Credit**
     - Icon: GraduationCap
     - Description: For students (if applicable)
  6. **Feel Fulfilled**
     - Icon: Smile
     - Description: Personal satisfaction

#### 7.3 Impact Stories Section
- **Title**: "Stories from Our Volunteers"
- **Testimonial Cards**:
  - Volunteer photo
  - Quote
  - Name and age
  - Project they worked on
  - Impact made
- **Video Testimonials** (if available)
- **Carousel**: Swipe through stories

#### 7.4 How It Works Section
- **4-Step Process**:
  1. **Sign Up**: Create your profile
  2. **Browse**: Find opportunities
  3. **Apply**: Submit applications
  4. **Volunteer**: Make an impact
- **Visual Flow**: Icons with connecting lines
- **Time Estimate**: "Get started in 5 minutes"

#### 7.5 Volunteer Opportunities Section
- **Latest Opportunities**: Feed of recent projects
- **Preview Cards**: Mini project cards (4-6)
- **CTA**: "View All Opportunities" → /projects
- **Quick Filters**: By category, location, time commitment

#### 7.6 Volunteer Types Section
- **Different Volunteering Styles**:
  1. **One-Time Events**: Single day commitments
  2. **Long-Term Projects**: Ongoing work
  3. **Virtual Volunteering**: Remote opportunities
  4. **Skill-Based**: Use your expertise
  5. **Group Volunteering**: Bring friends/colleagues
- **Info Cards**: Description of each type

#### 7.7 Requirements Section
- **What You Need**:
  - Age requirements (usually 16+)
  - Time commitment expectations
  - Basic requirements (ID, contact info)
- **What We Provide**:
  - Training
  - Supervision
  - Certificates
  - Insurance (if applicable)
  - Meals/transport (varies)

#### 7.8 Training & Support Section
- **Orientation Program**: What to expect
- **Ongoing Training**: Skill development
- **Mentorship**: Experienced volunteers guide you
- **Support Team**: Always available to help
- **Resources**: Access to guides and materials

#### 7.9 Recognition & Rewards Section
- **Certificates**: Official volunteer certificates
- **Badges**: Digital achievement badges
- **Leaderboard**: Top volunteers of the month
- **Awards**: Annual volunteer awards
- **LinkedIn Recommendations**: From NGOs

#### 7.10 FAQ Section
- **Common Questions**:
  - Do I need experience?
  - How much time do I need to commit?
  - Will I get a certificate?
  - Can I volunteer remotely?
  - How are volunteers selected?
  - What if I need to cancel?
  - Is there an age limit?
  - Do I need to pay anything?
- **Accordion Component**: Expandable answers

#### 7.11 Call-to-Action Section
- **Final Conversion Push**:
  - "Ready to Start?"
  - Two buttons:
    - "Sign Up Now" (primary)
    - "Browse Opportunities" (secondary)
- **Contact Info**: Questions? Email/phone

**Features**:
- ✅ Inspirational content
- ✅ Social proof
- ✅ Clear value proposition
- ✅ Multiple conversion paths
- ✅ SEO optimized
- ✅ Mobile responsive

---

### 8. CONTACT PAGE (`/contact`)
**Component**: `Contact.tsx`  
**Access**: Public  
**Purpose**: Enable users to reach out to the organization

#### 8.1 Page Header
- **Title**: "Get in Touch"
- **Subtitle**: "We'd love to hear from you"
- **Response Time**: "We typically respond within 24 hours"

#### 8.2 Contact Form
**Form Fields**:
- **Name**: Text input (required)
  - Placeholder: "Your full name"
  - Validation: Min 2 characters
- **Email**: Email input (required)
  - Validation: Valid email format
  - Confirmation: "We'll reply to this address"
- **Phone**: Tel input (optional)
  - Format: Pakistan phone numbers
  - Country code prefix
- **Subject**: Dropdown (required)
  - General Inquiry
  - Partnership Opportunity
  - Volunteer Question
  - NGO Registration
  - Technical Support
  - Media Request
  - Other
- **Message**: Textarea (required)
  - Placeholder: "Tell us what's on your mind..."
  - Character count: 10-2000 characters
  - Remaining characters indicator
- **Attachment**: File upload (optional)
  - Accept: PDF, Images
  - Max size: 5MB
  - Preview uploaded files
- **reCAPTCHA**: Bot protection (if configured)
- **Privacy Checkbox**: 
  - "I agree to the privacy policy"
  - Link to privacy policy
- **Submit Button**: "Send Message"

**Form States**:
- **Idle**: Ready to fill
- **Validating**: Real-time field validation
- **Submitting**: Loading spinner, disabled fields
- **Success**: Green checkmark, success message
- **Error**: Red error message, retry option

**Form Submission**:
1. Validate all fields
2. Send via Resend API (email to contact@wasillah.live)
3. Store in Firestore `contact_submissions`
4. Send confirmation email to user
5. Show success message
6. Clear form

#### 8.3 Office Locations
**Location Cards** (Grid layout):

**Karachi Office**:
- **Icon**: Building icon
- **Name**: "Karachi Head Office"
- **Address**: 
  - Street address
  - Postal code
- **Phone**: +92-300-XXXXXXX
- **Email**: karachi@wasillah.pk
- **Hours**: Mon-Fri: 9 AM - 6 PM
- **Map Button**: "Get Directions"

**Lahore Office**:
- Same structure as Karachi
- Lahore-specific details

**Islamabad Office**:
- Same structure as Karachi
- Islamabad-specific details

**Each Card Features**:
- Click to open in Google Maps
- Call button (tel: link)
- Email button (mailto: link)

#### 8.4 Interactive Map Section
**Component**: `InteractiveMap.tsx`
- **Full-Width Map**: Leaflet map
- **Multiple Markers**: All office locations
- **Zoom Controls**: +/- buttons
- **Info Windows**: Click marker for office details
- **Directions Link**: From markers
- **Map Styles**: Toggle street/satellite view

#### 8.5 Contact Methods Grid
**Quick Contact Options**:
- **Email**:
  - Icon: Mail
  - Address: info@wasillah.pk
  - "Send Email" button
- **Phone**:
  - Icon: Phone
  - Number: +92-XXX-XXXXXXX
  - "Call Us" button
- **WhatsApp**:
  - Icon: WhatsApp logo
  - Number: +92-XXX-XXXXXXX
  - "Chat on WhatsApp" button
- **Social Media**:
  - Icons: Facebook, Twitter, Instagram, LinkedIn
  - Links to social profiles
  - Follower counts

#### 8.6 FAQ Section
**Common Questions Before Contacting**:
- Accordion of 8-10 FAQs
- Categories:
  - About volunteering
  - For NGOs
  - Technical issues
  - General information
- Each FAQ:
  - Question text
  - Expandable answer
  - Related links

#### 8.7 Newsletter Signup
- **Section**: "Stay Updated"
- **Form**:
  - Email input
  - Frequency preference (Weekly/Monthly)
  - Subscribe button
- **Benefits**:
  - Latest projects
  - Event announcements
  - Impact reports
- **Privacy**: "We never spam"

#### 8.8 Business Hours
**Information Card**:
- **Office Hours**:
  - Monday - Friday: 9:00 AM - 6:00 PM
  - Saturday: 10:00 AM - 2:00 PM
  - Sunday: Closed
- **Holidays**: "Closed on public holidays"
- **Emergency**: After-hours emergency number

**Features**:
- ✅ Form validation
- ✅ Email integration (Resend)
- ✅ File attachment support
- ✅ Spam protection
- ✅ Auto-reply emails
- ✅ Mobile-friendly maps
- ✅ Click-to-call links
- ✅ Social media integration
- ✅ Accessibility compliant

**Data Management**:
- Submissions stored in `contact_submissions` collection
- Admin dashboard shows all inquiries
- Email notifications to admin team
- Follow-up tracking system

---

