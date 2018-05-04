import Movies from './movies';

async function makeMovieObject(imdbId) {
  const movie = await Movies.getByImdbId(imdbId);
  return {
    id: imdbId,
    title: movie.title,
    year: movie.release_date.split('-')[0],
    image: `http://image.tmdb.org/t/p/w300${movie.poster_path}`,
  };
}

async function getExampleEquation() {
  const equations = [
    {
      first: await makeMovieObject('tt2404435'), // The Magnificent Seven
      second: await makeMovieObject('tt0090605'), // Aliens
      third: await makeMovieObject('tt0409847'), // Coybows and Aliens
      operation: 'plus',
    },
    {
      first: await makeMovieObject('tt0060371'), // The Endless Summer
      second: await makeMovieObject('tt0078748'), // Alien
      third: await makeMovieObject('tt0275847'), // Lilo & Stitch
      operation: 'plus',
    },
    {
      first: await makeMovieObject('tt0102685'), // Point Break
      second: await makeMovieObject('tt0317219'), // Cars
      third: await makeMovieObject('tt0232500'), // The Fast and the Furious
      operation: 'plus',
    },
    {
      first: await makeMovieObject('tt0059742'), // Sound of Music
      second: await makeMovieObject('tt0463985'), // The Fast and the Furious: Tokyo Drift
      third: await makeMovieObject('tt0395699'), // The Pacifier
      operation: 'plus',
    },
  ];

  return equations[Math.floor(Math.random() * equations.length)];
}

export default getExampleEquation;
