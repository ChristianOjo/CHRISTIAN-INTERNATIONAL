/*
  GALLERY DATA
  ============
  This is the only file you need to touch to add new photos to the gallery.

  HOW TO ADD A PHOTO:
  1. Drop the image file into assets/gallery/  (any reasonable size, JPG or PNG)
  2. Add one entry to the GALLERY_PHOTOS array below, e.g.:

     { src: 'assets/gallery/my-new-photo.jpg', caption: 'Short description', project: 'climate-smart-agriculture' },

  3. `project` must be one of the ids listed in GALLERY_PROJECTS below (or 'general'
     if it doesn't belong to a specific project — it'll still show under "All").
  4. Save, git add, commit, push. That's it — no other files need to change.

  The three "demo-*.jpg" entries below are placeholders (reused from the homepage
  team photo, just cropped differently) so you can see the filtering and masonry
  layout working. Delete them whenever you like once you have real photos in.
*/

const GALLERY_PROJECTS = [
  { id: 'all', label: 'All' },
  { id: 'greening-women-enterprises', label: 'Greening Women Enterprises' },
  { id: 'views-from-the-frontline', label: 'Views from the Frontline' },
  { id: 'education-foundational-project', label: 'Education Foundational Project' },
  { id: 'climate-smart-agriculture', label: 'Climate-Smart Agriculture' },
];

const GALLERY_PHOTOS = [
  { src: 'assets/gallery/demo-landscape.jpg', caption: 'Greening Women Enterprises photo', project: 'greening-women-enterprises' },
  { src: 'assets/gallery/demo-portrait.jpg', caption: 'Climate-Smart Agriculture photo', project: 'climate-smart-agriculture' },
  { src: 'assets/gallery/demo-square.jpg', caption: 'Views from the Frontline photo', project: 'views-from-the-frontline' },
];
