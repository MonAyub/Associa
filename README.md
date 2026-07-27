# Narsingdi District Student Council, MBSTU - Static Website

A clean, modern, fully responsive, and professional static official website for the **Narsingdi District Student Council (NDSC), Mawlana Bhashani Science and Technology University (MBSTU)**.

This website is developed in pure **HTML, CSS, and Vanilla JavaScript**, requiring zero backend setups, node modules, servers, databases, or API integrations. 

---

## 📂 Project Structure

```text
narsingdi-district-student-council/
├── index.html        # Main single-page HTML skeleton with hardcoded database elements
├── style.css         # Custom premium styling sheet (Glassmorphism, Grid layouts, timeline, responsive, dark-mode)
├── script.js         # Interactive behaviors (Search, multi-level dropdown filters, tabs, gallery lightbox, modal alerts, animations)
├── README.md         # This instruction manual
└── assets/
    ├── images/       # Folder for committee members, events cover and gallery images (with README.md guidelines)
    └── icons/        # Folder for custom SVGs and logs (with README.md guidelines)
```

---

## 🚀 How to Run the Website

### Option 1: Double-Click (Offline mode)
Simply double-click the [index.html](file:///E:/Extra%20Kaj/Association/narsingdi-district-student-council/index.html) file to open it in any web browser (Chrome, Firefox, Edge, Safari). Since it is a static website, it will run immediately and all features (searching, filtering, tabs, lightboxes, forms) will work offline.

### Option 2: Live Server (For development)
If you are editing the code using VS Code or any other IDE, you can run a local development server:
1. Open the folder in your editor.
2. Click **Go Live** (if using VS Code Live Server extension) or run `npx serve .` in your terminal.
3. Access the site in your browser (usually `http://localhost:5500` or `http://localhost:3000`).

---

## ⚡ Features & Interactivity

1. **Sticky Navbar & Scrollspy**: The header remains fixed at the top with a glass-blur filter. As you scroll naturally through the page, the active section menu item is highlighted. Clicking any link smoothly scrolls to that section.
2. **Notice Board Banner**: The home page features an amber alert card syncing automatically with the latest notice inside the News section.
3. **Executive Committee Session Selector**: Toggle between the current term (Session 2025-2026) and past terms (Session 2023-2024) instantly.
4. **General Member Search Directory**:
   - Filter general members in real-time by Upazila, Department, and Session.
   - Search by name or department keyword instantly.
   - Contact members directly using Call or WhatsApp click-to-chat icons.
   - Restoring lists or search queries is easy via the "Reset Filters" action button.
5. **Events Tab Switcher**: Split events between upcoming reception schedules and past sports cups or picnics.
6. **Photo Gallery Lightbox**: Click any card in the gallery grid to open a full-screen interactive lightbox. Navigate images using Left/Right Arrow keys or click Next/Prev buttons, and close with the Escape key.
7. **News & Notices details modal**: Search announcements and open notice details in an expanded overlay popup.
8. **Mock Forms & Toast Alerts**:
   - The **Contact Form** simulates a submission flow by showing a loading spinner on the submit button, then presenting a success alert and clearing the form.
   - Contact info cards feature a **Copy button** that copies the text (phone/email) and triggers a floating toast confirmation.
9. **Admin Login Portal Modal**: An simulated admin authentication modal. Enter credentials (Username: `admin`, Password: `admin123`) to experience login spinner, errors, and success flows.

---

## ✍️ How to Edit Content

Since all data is embedded directly in the HTML file for easier editing, you can simply open `index.html` in a text editor (e.g. Notepad, VS Code) and customize or add nodes:

### To Add/Modify General Members:
Find the `<div class="members-grid" id="membersGrid">` section. Copy-paste a card:
```html
<div class="member-card glass-card" data-name="Member Name" data-department="CSE" data-session="2022-2023" data-upazila="Sadar" data-phone="01XXXXXXXXX">
    <div class="member-accent-bar"></div>
    <div class="member-card-body">
        <div class="member-icon-badge"><i data-lucide="user-check" class="icon-sm"></i></div>
        <h3 class="member-name">Member Name</h3>
        <p class="member-dept-session-txt">CSE • Session 2022-2023</p>
    </div>
    <div class="member-card-footer">
        <div class="upazila-info">
            <span class="upazila-label">Upazila</span>
            <span class="upazila-name">Sadar</span>
        </div>
        <div class="member-actions">
            <a href="tel:01XXXXXXXXX" class="action-btn call-btn" title="Call Member"><i data-lucide="phone" class="icon-xs"></i></a>
            <a href="https://wa.me/8801XXXXXXXXX" target="_blank" class="action-btn wa-btn" title="WhatsApp Message"><i data-lucide="message-square" class="icon-xs"></i></a>
        </div>
    </div>
</div>
```
*Note: The JavaScript dynamic populate engine reads these HTML attributes on load, meaning any new member you insert will automatically update the dropdown selectors (Upazila, Department, Session) in the filters panel!*

### To Add Gallery Items or News/Notices:
Copy any card block in the respective `<div id="galleryGrid">` or `<div id="newsGrid">` and update the titles, dates, or paragraph text. 

---

## 🎨 Theme Colors Setup
You can change the color palettes by altering the CSS variables at the top of `style.css`:
```css
:root {
    --color-bg-dark: #070a13;         /* Background color */
    --color-surface: #0f1629;         /* Alternate section surface */
    --color-card: #151e38;            /* Card backgrounds */
    --color-sky: #0ea5e9;             /* Accent color */
}
```
