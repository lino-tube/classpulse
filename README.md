# ClassPulse

**Tagline:** See learning problems before they become results.

## Purpose of the system
ClassPulse is a Future Classroom prototype that helps lecturers see classroom understanding while a lesson is still happening. Students send a quick classroom pulse and lecturers use the aggregated signals to identify confusion, intervene, and re-check understanding before moving on.

## Problem being solved
Lecturers often discover that students did not understand a concept only after a test or assessment. ClassPulse moves that feedback into the live lesson so a lecturer can react while there is still time to help.

## Main Student Features
- Role-based student sign-in
- Current class and session status
- Three selectable understanding states: I Understand, I’m Unsure and I’m Stuck
- Working topic dropdown
- Optional note
- Validation before submission
- Browser localStorage for the latest pulse
- Confirmation screen showing the submitted response
- Ability to update the latest pulse

## Main Lecturer Features
- Role-based lecturer sign-in
- Live dashboard with classroom pulse metrics
- Early-warning panel for concentrated confusion
- Recommended interventions
- Live session view with anonymised recent signals and topic hotspots
- Real 5-minute JavaScript intervention timer
- Re-check simulation showing improvement after intervention
- Session history and working summary views
- Persistent lecturer settings using localStorage
- Responsive, collapsible lecturer navigation

## Technologies Used
- HTML5
- CSS3
- Vanilla JavaScript
- sessionStorage for the active login session
- localStorage for demo pulse data, intervention state and settings

## Demo Credentials
### Student
- Email: `ST12344@rcconnect.edu.za`
- Password: `Student123`
- Role: `Student`

### Lecturer
- Email: `lecturer@rcconnect.edu.za`
- Password: `Lecturer123`
- Role: `Lecturer`

## How to Run the Project
1. Keep the complete `classpulse` folder structure unchanged.
2. Open `index.html` in a modern browser.
3. Choose Student or Lecturer in the role dropdown and use the matching demo credentials.
4. No web server, database, API or package installation is required.

## Folder Structure
```text
classpulse/
├── index.html
├── student-dashboard.html
├── student-checkin.html
├── student-confirmation.html
├── lecturer-dashboard.html
├── live-session.html
├── intervention.html
├── history.html
├── session-summary.html
├── settings.html
├── css/
│   └── styles.css
└── js/
    ├── auth.js
    ├── student.js
    ├── lecturer.js
    └── app.js
```

## Security Limitation
Authentication is simulated using browser-side JavaScript and `sessionStorage` for demonstration purposes. This is appropriate for a local prototype but is not production security. A real deployed ClassPulse system would use a secure backend authentication service, protected server-side routes, secure password handling, and a database.
