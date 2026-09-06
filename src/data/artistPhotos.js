/*
  Decision: this is a separate, tiny lookup table — NOT a field on songs,
  and NOT something the UI lets a user edit. Reasons:

  1. A song's `coverImage` is the single/album art, which isn't the same
     thing as a canonical photo of the artist — and one artist can appear
     on several songs with different covers, so there's no one place on
     a song object where an "artist photo" would unambiguously belong.
  2. Keeping it in its own file means updating your music library (e.g.
     replacing src/data/musicLibrary.js with a new set of songs) never
     touches this — artist photos you've set stay put.
  3. It's entirely optional: any artist name NOT listed here just keeps
     the existing initials-avatar fallback already used everywhere
     (ArtistCard, ArtistDetail). Nothing breaks by leaving this empty.

  To add a photo for an artist, add a line here with the EXACT artist
  name as it appears in musicLibrary.js's `artists` arrays:

    export const artistPhotos = {
      'Karan Aujla': 'https://example.com/karan-aujla.jpg',
    };
*/

export const artistPhotos = {
  'Guru Randhawa': 'https://mxp-media.ilnmedia.com/media/content/2020/Mar/Guru-Randhawas-Walkman-Watch-Sings-The-Time1200_5e70c95d38478.jpeg',
  'Cheema Y': 'https://i.scdn.co/image/ab676161000051748acd9439506d057719cb4446',
  'Dhanda Nyoliwala': 'https://i.scdn.co/image/ab67616100005174816ad67bfe38d59ad0bc3a88',
  'Gur Sidhu': 'https://i.scdn.co/image/ab6761610000e5ebce6061ee369719403537b902',
  'Gurjit Gill': 'https://i.scdn.co/image/ab6761610000e5eb6e2d61ad9150a2c3a6e73734',
  'Kamal Kahlon': 'https://i.scdn.co/image/ab67616d0000b2736847da03e75963f00ee89eaf',
  'Karan Aujla': 'https://i.scdn.co/image/ab6761610000e5eb8a4c60d0eebe893f72e42979',
  'Miki Malang': 'https://i.scdn.co/image/ab6761610000e5eb431800805743a508c283c2c9',
  'Param Singh': 'https://i.scdn.co/image/ab6761610000e5ebb4132ab0e4cb1d53d254eadb',
  'Ron Likhari': 'https://i.scdn.co/image/ab6761610000e5ebdba9a9996191acbf62ef097a',
  'Shevv': 'https://i.scdn.co/image/ab6761610000e5eb16eb413ba4546408ac88bf89',
  'Sidhu Moose Wala': 'https://i.scdn.co/image/ab6761610000e5eb9973157bdaedef3f77ef8e13',
  'Shreya Ghoshal': 'https://i.scdn.co/image/ab6761610000e5ebe7ce89a9f5d11e0ba26677eb',
  'Romy': 'https://i.scdn.co/image/ab6761610000e5eb1feefe5e8bf8154969b5cdac',
  'Madhur Sharma': 'https://i.scdn.co/image/ab6761610000e5ebfc2face96cf2a3ae93c64e82',
  // 'Artist': 'Link',
};

export function getArtistPhoto(artistName) {
  return artistPhotos[artistName] || null;
}
