/* House for Learning: demo data for the Marketplace desk and the Workplace desk. Practice data only: "Demo" names, no prices. */
window.SITE_DATA = {
  market: {
    intro: 'Learn and grow: course seats, mentoring, study spaces and learning kits for members.',
    providers: [
      { id: 'p1', name: 'Demo Course Team', area: 'Courses and pathways', level: 'Accredited', reply: 'Replies within 30 minutes' },
      { id: 'p2', name: 'Demo Mentors', area: 'Mentoring and careers', level: 'Accredited', reply: 'Replies within 1 hour' },
      { id: 'p3', name: 'Demo Learning Spaces', area: 'Rooms and study spaces', level: 'Trained', reply: 'Replies within 1 hour' },
      { id: 'p4', name: 'Demo Member Helpers', area: 'Help from members', level: 'New', reply: 'Replies within 1 day' }
    ],
    listings: [
      ['Offer', 'Digital', 'Online', 'Seat on a beginner pathway, level 1', 'Six short lessons, practice each week, and a badge at the end.', 'p1'],
      ['Offer', 'Digital', 'Online', 'Career talk, thirty minutes', 'Talk through your next step with a mentor. You get three written points.', 'p2'],
      ['Offer', 'Physical', 'On site', 'Group study room by the half day', 'Room for eight, a whiteboard and a screen.', 'p3'],
      ['Offer', 'Hybrid', 'On site and online', 'Weekend workshop with online practice', 'One day together, then two weeks of guided practice online.', 'p1'],
      ['Need', 'Digital', 'Online', 'Volunteer reader for a recorded lesson', 'A clear voice to read a ten-minute lesson script.', 'p4'],
      ['Offer', 'Physical', 'Delivered', 'Learning kit for young makers', 'Parts and a picture guide, packed for delivery.', 'p3'],
      ['Offer', 'Digital', 'Online', 'Study plan made with you', 'One call to set a four-week plan you can keep.', 'p2'],
      ['Need', 'Hybrid', 'On site and online', 'Helpers for an open learning day', 'One day on site, one online briefing first.', 'p4'],
      ['Offer', 'Digital', 'Online', 'Seat on a level 3 pathway', 'Eight weeks, a project, and feedback from a mentor.', 'p1'],
      ['Offer', 'Physical', 'On site', 'Quiet desk by the day', 'Desk, power, good light and fast internet.', 'p3'],
      ['Need', 'Physical', 'Collected', 'Donated books for the reading corner', 'Clean books for learners of all ages.', 'p4'],
      ['Offer', 'Hybrid', 'On site and online', 'Practice interview day', 'Two practice interviews on site and online feedback after.', 'p2']
    ]
  },
  work: {
    team: ['Demo Learning Lead', 'Demo Course Coordinator', 'Demo Mentor', 'Demo Member Support', 'Demo Quality Checker'],
    tasks: [
      ['Plan the next pathway intake', 'Remote', 'todo', 1, 0],
      ['Set up the study room', 'On site', 'doing', 3, 0],
      ['Check the new lesson script', 'Remote', 'check', 2, 0],
      ['Send the welcome note', 'Mixed', 'done', 3, 0]
    ]
  }
};
