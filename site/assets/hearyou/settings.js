/* We Hear You settings for houseforlearning.com. The kit reacts only after the site's own status line says a message went through. */
window.HEARYOU = {
  live: true,
  forms: 'form.contact[data-offline], form[data-kind], form[data-hear]',
  reaction: '\u{1F64F}',
  slogan: 'अभयं सर्वभूतेभ्यः । योगः कर्मसु कौशलम्',
  sloganTranslation: 'Safety for every being. Excellence in every act.',
  brand: 'House for Learning',
  replyWithin: 'by email, within one working day',
  presenceText: 'We’re listening',
  presenceHref: '/contact.html',
  presenceHide: '.cookie',
  cardLift: 84,
  copy: {
    contact: {title: 'Message received', reply: 'Thank you{name}. A real person on our team reads every message, and we will write back {within}.'},
    signup:  {title: 'You’re on the list', reply: 'Thank you{name}. We’ll write to you the day sign-up opens. We’re glad you’re here.'},
    portal:  {title: 'Saved and logged', reply: 'Done{name}. It’s saved with a reference and an owner on our team will pick it up.'}
  }
};
