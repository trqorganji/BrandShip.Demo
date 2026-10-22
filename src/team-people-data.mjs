// Names and roles follow the supplied organisation slide. Board captions were
// confirmed in the user's screenshots. Portraits are mapped by slide position,
// never inferred from faces. Unapproved messages are deliberately left empty.
const person = (id, name, role, team, source, director = false) => ({ id, name, role, team, source, director, image: `assets/team/${id}.jpg`, quote: null });
export const partners = [
  person('ziyad-organji', 'Ziyad Organji', 'Chairman & Founder', 'Leadership', 'image7.jpeg'),
  person('nawaf-al-rajhi', 'Nawaf Al-Rajhi', 'Partner & Vice Chairman', 'Leadership', 'image6.png'),
  person('omar-basamh', 'Omar Basamh', 'Partner', 'Leadership', 'image5.png'),
  person('omar-al-shabaan', 'Omar Al-Shabaan', 'Board Member', 'Leadership', 'image4.png'),
  person('abdullah-aljeraiwi', 'Abdullah Aljeraiwi', 'Board Member', 'Leadership', 'image3.png')
];
export const people = [
  person('rayan-organji', 'Rayan Organji', 'Acting CEO & Business Development Director', 'Business Development', 'image37.jpeg', true),
  person('salman-alrajhi', 'Salman AlRajhi', 'Sr. BD Specialist', 'Business Development', 'image33.png'),
  person('raafat-attar', 'Raafat Attar', 'Sr. BD Specialist', 'Business Development', 'image34.png'),
  person('mohammad-yassin', 'Mohammad Yassin', 'BD Specialist', 'Business Development', 'image32.png'),
  person('lama-karkanawi', 'Lama Karkanawi', 'BD Specialist', 'Business Development', 'image31.png'),
  person('lana-trabzoni', 'Lana Trabzoni', 'BD Specialist', 'Business Development', 'image23.png'),
  person('amr-dulaimi', 'Amr Dulaimi', 'Project Management Director', 'Project Management', 'image24.jpeg', true),
  person('yasmina-abdulraouf', 'Yasmina Abdulraouf', 'Sr. Project Manager', 'Project Management', 'image29.png'),
  person('sarah-almasri', 'Sarah Almasri', 'Sr. Project Manager', 'Project Management', 'image30.png'),
  person('alanoud-alnafisah', 'Alanoud AlNafisah', 'Sr. Project Manager', 'Project Management', 'image36.png'),
  person('hamza-kamal', 'Hamza Kamal', 'PM Specialist', 'Project Management', 'image28.png'),
  person('juree-organji', 'Juree Organji', 'PM Specialist', 'Project Management', 'image27.png'),
  person('lulwa-duayji', 'Lulwa Duayji', 'Project Manager', 'Project Management', 'image26.png'),
  person('taha-hefni', 'Taha Hefni', 'PM Specialist', 'Project Management', 'image25.png'),
  person('omer-iqbal', 'Omer Iqbal', 'Strategy Director', 'Strategy', 'image22.jpeg', true),
  person('natasha-qurashi', 'Natasha Qurashi', 'Strategy Specialist', 'Strategy', 'image21.png'),
  person('ali-jalal', 'Ali Jalal', 'Strategy Specialist', 'Strategy', 'image20.png'),
  person('albaraa-najjar', 'Albaraa Najjar', 'Strategy Specialist', 'Strategy', 'image19.png'),
  person('amr-naeim', 'Amr Naeim', 'Creative Director', 'Creative', 'image38.jpeg', true),
  person('craig-sayers', 'Craig Sayers', 'Creative Advisor', 'Creative', 'image12.png'),
  person('seham-althagafi', 'Seham Althagafi', 'Art Director', 'Creative', 'image14.png'),
  person('vladimir-ilnitskiy', 'Vladimir Ilnitskiy', 'Art Director', 'Creative', 'image13.png'),
  person('ahmed-zaki', 'Ahmed Zaki', 'Sr. Graphic Designer', 'Creative', 'image15.png'),
  person('maryam-bukhary', 'Maryam Bukhary', 'Multimedia Designer', 'Creative', 'image35.png'),
  person('raghad-sindi', 'Raghad Sindi', 'Graphic Designer', 'Creative', 'image16.png'),
  person('ahmad-gari', 'Ahmad Gari', 'Graphic Designer', 'Creative', 'image17.png'),
  person('laith-sandid', 'Laith Sandid', 'Sr. Graphic Designer', 'Creative', 'image18.png'),
  person('heba-qadi', 'Heba Qadi', 'Marketing and Communications Director', 'Public Relations', 'image11.png', true),
  person('ahmed-lotfy', 'Ahmed Lotfy', 'Finance Manager', 'Finance', 'image10.jpeg'),
  person('rommel-pobar', 'Rommel Pobar', 'Executive Assistant', 'Finance', 'image8.png'),
  person('labeeb-quotah', 'Labeeb Quotah', 'HR Relations Manager', 'HR', 'image9.png')
];
export const directors = people.filter(entry => entry.director);
